import Episode, { IEpisode } from "../models/Episode";
import Podcast, { IPodcast } from "../models/Podcast";
import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { uploadMedia, CloudinaryUploadResult } from "../utils/uploadMedia";
import { z } from "zod";
import logger from "../utils/logger";

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

export const addEpisode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { podcastId } = req.params;
    const validatedData = createEpisodeSchema.parse(req.body);

    if (!mongoose.isValidObjectId(podcastId)) {
      res.status(400).json({ error: "Invalid podcast ID" });
      return;
    }

    const podcast = await Podcast.findById(podcastId) as IPodcast | null;
    if (!podcast) {
      res.status(404).json({ error: "Podcast not found" });
      return;
    }

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
    });

    podcast.episodes.push(episode._id as Types.ObjectId);
    await podcast.save();

    res.status(201).json({ message: "Episode created successfully", episode });
  } catch (error) {
    console.error("Error adding episode:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateEpisode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { podcastId, episodeId } = req.params;
    const validatedData = updateEpisodeSchema.parse(req.body);

    if (!mongoose.isValidObjectId(podcastId)) {
      res.status(400).json({ error: "Invalid podcast ID" });
      return;
    }

    if (!mongoose.isValidObjectId(episodeId)) {
      res.status(400).json({ error: "Invalid episode ID" });
      return;
    }

    const podcast = await Podcast.findById(podcastId) as IPodcast | null;
    if (!podcast) {
      res.status(404).json({ error: "Podcast not found" });
      return;
    }

    const episode = await Episode.findById(episodeId) as IEpisode | null;
    if (!episode) {
      res.status(404).json({ error: "Episode not found" });
      return;
    }

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
      title: validatedData.title || episode.title,
    });
    res.status(200).json({ message: "Episode updated successfully", episode });
  } catch (error) {
    console.error("Error updating episode:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteEpisode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { podcastId, episodeId } = req.params;

    if (!mongoose.isValidObjectId(podcastId)) {
      res.status(400).json({ error: "Invalid podcast ID" });
      return;
    }

    if (!mongoose.isValidObjectId(episodeId)) {
      res.status(400).json({ error: "Invalid episode ID" });
      return;
    }

    const podcast = await Podcast.findById(podcastId) as IPodcast | null;
    if (!podcast) {
      res.status(404).json({ error: "Podcast not found" });
      return;
    }

    const episode = await Episode.findById(episodeId) as IEpisode | null;
    if (!episode) {
      res.status(404).json({ error: "Episode not found" });
      return;
    }

    await episode.deleteOne();
    podcast.episodes = podcast.episodes.filter((id: Types.ObjectId) => id.toString() !== episodeId);
    await podcast.save();

    logger.info({
      message: "Episode deleted",
      episodeId,
      podcastId,
    });
    res.status(200).json({ message: "Episode deleted successfully" });
  } catch (error) {
    console.error("Error deleting episode:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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