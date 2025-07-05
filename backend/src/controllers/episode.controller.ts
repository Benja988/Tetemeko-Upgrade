import Episode, { IEpisode } from "../models/Episode";
import Podcast, { IPodcast } from "../models/Podcast";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import mongoose, { Types } from "mongoose";
import { uploadMedia, CloudinaryUploadResult } from "../utils/uploadMedia";
import { z } from "zod";
import logger from "../utils/logger";

// Extend AuthenticatedRequest to include multer file
interface AuthenticatedRequestWithFile extends AuthenticatedRequest {
  file?: Express.Multer.File;
}

// Episode creation/update schemas
const createEpisodeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  duration: z.number().min(1, "Duration must be positive"),
  episodeNumber: z.number().min(1, "Episode number must be positive").optional(),
  tags: z.array(z.string()).optional(),
  audioUrl: z.string().optional(),
});

const updateEpisodeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  duration: z.number().min(1).optional(),
  episodeNumber: z.number().min(1).optional(),
  tags: z.array(z.string()).optional(),
  audioUrl: z.string().optional(),
});

// 🎧 Add an episode to a podcast
export const addEpisode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user } = req;
    if (!user?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!mongoose.isValidObjectId(req.params.podcastId)) {
      res.status(400).json({ error: "Invalid podcast ID" });
      return;
    }

    const podcast = await Podcast.findById(req.params.podcastId) as IPodcast | null;
    if (!podcast) {
      res.status(404).json({ error: "Podcast not found" });
      return;
    }

    if (podcast.createdBy.toString() !== user.id) {
      res.status(403).json({ error: "Unauthorized to add episodes to this podcast" });
      return;
    }

    const validatedData = createEpisodeSchema.parse(req.body);

    let uploadedAudioUrl: string | undefined = validatedData.audioUrl;
    if (req.file) {
      const uploaded = (await uploadMedia(req.file, "podcasts/episodes", "raw")) as CloudinaryUploadResult;
      uploadedAudioUrl = uploaded.secure_url;
    } else if (validatedData.audioUrl?.startsWith("data:")) {
      const uploaded = (await uploadMedia(validatedData.audioUrl, "podcasts/episodes", "raw")) as CloudinaryUploadResult;
      uploadedAudioUrl = uploaded.secure_url;
    }

    if (!uploadedAudioUrl) {
      res.status(400).json({ error: "Audio file is required" });
      return;
    }

    const episode = await Episode.create({
      ...validatedData,
      audioUrl: uploadedAudioUrl,
      podcast: podcast._id,
      createdBy: new Types.ObjectId(user.id),
    });

    podcast.episodes.push(episode._id as Types.ObjectId);
    await podcast.save();

    res.status(201).json({
      episode,
    });
  } catch (error) {
    console.error("Error adding episode:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✏️ Update an episode
export const updateEpisode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    if (!user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!mongoose.isValidObjectId(req.params.podcastId)) {
      res.status(400).json({ message: "Invalid podcast ID" });
      return;
    }

    if (!mongoose.isValidObjectId(req.params.episodeId)) {
      res.status(400).json({ message: "Invalid episode ID" });
      return;
    }

    const podcast = await Podcast.findById(req.params.podcastId) as IPodcast | null;
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    const episode = await Episode.findById(req.params.episodeId) as IEpisode | null;
    if (!episode) {
      res.status(404).json({ message: "Episode not found" });
      return;
    }

    if (episode.createdBy.toString() !== user.id && user.role !== "admin") {
      res.status(403).json({ message: "Unauthorized to update this episode" });
      return;
    }

    const validatedData = updateEpisodeSchema.parse(req.body);

    let uploadedAudioUrl: string | undefined = validatedData.audioUrl;
    if (req.file) {
      const uploaded = (await uploadMedia(req.file, "podcasts/episodes", "raw")) as CloudinaryUploadResult;
      uploadedAudioUrl = uploaded.secure_url;
    } else if (validatedData.audioUrl?.startsWith("data:")) {
      const uploaded = (await uploadMedia(validatedData.audioUrl, "podcasts/episodes", "raw")) as CloudinaryUploadResult;
      uploadedAudioUrl = uploaded.secure_url;
    }

    Object.assign(episode, { ...validatedData, audioUrl: uploadedAudioUrl || episode.audioUrl });
    await episode.save();

    logger.info({
      message: "Episode updated",
      episodeId: episode._id,
      podcastId: podcast._id,
      userId: user.id,
      title: validatedData.title || episode.title,
    });
    res.status(200).json(episode);
  } catch (error) {
    logger.error({
      message: `Error updating episode ${req.params.episodeId} in podcast ${req.params.podcastId}`,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    // next(error instanceof z.ZodError ? new Error("Invalid input data") : error);
  }
};

// 🗑️ Delete an episode
export const deleteEpisode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    if (!user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!mongoose.isValidObjectId(req.params.podcastId)) {
      res.status(400).json({ message: "Invalid podcast ID" });
      return;
    }

    if (!mongoose.isValidObjectId(req.params.episodeId)) {
      res.status(400).json({ message: "Invalid episode ID" });
      return;
    }

    const podcast = await Podcast.findById(req.params.podcastId) as IPodcast | null;
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    const episode = await Episode.findById(req.params.episodeId) as IEpisode | null;
    if (!episode) {
      res.status(404).json({ message: "Episode not found" });
      return;
    }

    if (episode.createdBy.toString() !== user.id && user.role !== "admin") {
      res.status(403).json({ message: "Unauthorized to delete this episode" });
      return;
    }

    await episode.deleteOne();
    podcast.episodes = podcast.episodes.filter((id: Types.ObjectId) => id.toString() !== req.params.episodeId);
    await podcast.save();

    logger.info({
      message: "Episode deleted",
      episodeId: req.params.episodeId,
      podcastId: req.params.podcastId,
      userId: user.id,
    });
    res.status(200).json({ message: "Episode deleted successfully" });
  } catch (error) {
    logger.error({
      message: `Error deleting episode ${req.params.episodeId} from podcast ${req.params.podcastId}`,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    // next(error);
  }
};

// 📄 Get all episodes for a podcast
export const getAllEpisodes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!mongoose.isValidObjectId(req.params.podcastId)) {
      res.status(400).json({ message: "Invalid podcast ID" });
      return;
    }

    const { page = "1", limit = "10", search } = req.query;
    const query: any = { podcast: new Types.ObjectId(req.params.podcastId) };

    if (search) {
      query.title = { $regex: search as string, $options: "i" };
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const episodes = await Episode.find(query)
      .select("title description audioUrl duration publishedDate isActive episodeNumber tags")
      .populate("createdBy", "name")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const total = await Episode.countDocuments(query);

    res.status(200).json({
      episodes,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    logger.error({
      message: `Error fetching episodes for podcast ${req.params.podcastId}`,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    next(error);
  }
};

// 🔍 Get an episode by ID
export const getEpisodeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!mongoose.isValidObjectId(req.params.podcastId)) {
      res.status(400).json({ message: "Invalid podcast ID" });
      return;
    }

    if (!mongoose.isValidObjectId(req.params.episodeId)) {
      res.status(400).json({ message: "Invalid episode ID" });
      return;
    }

    const episode = await Episode.findOne({
      _id: req.params.episodeId,
      podcast: req.params.podcastId,
    })
      .select("title description audioUrl duration publishedDate isActive episodeNumber tags")
      .populate("createdBy", "name")
      .lean();

    if (!episode) {
      res.status(404).json({ message: "Episode not found" });
      return;
    }

    res.status(200).json(episode);
  } catch (error) {
    logger.error({
      message: `Error fetching episode ${req.params.episodeId} for podcast ${req.params.podcastId}`,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    next(error);
  }
};