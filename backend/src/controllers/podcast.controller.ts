import Podcast, {IPodcast} from "../models/Podcast";
import Episode from "../models/Episode";
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

// Podcast creation/update schemas
const createPodcastSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  category: z.string().refine((val) => mongoose.isValidObjectId(val), {
    message: "Invalid category ID",
  }),
  station: z
    .string()
    .refine((val) => !val || mongoose.isValidObjectId(val), {
      message: "Invalid station ID",
    })
    .optional(),
  coverImage: z.string().optional(),
});

const updatePodcastSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  category: z
    .string()
    .refine((val) => !val || mongoose.isValidObjectId(val), {
      message: "Invalid category ID",
    })
    .optional(),
  station: z
    .string()
    .refine((val) => !val || mongoose.isValidObjectId(val), {
      message: "Invalid station ID",
    })
    .optional(),
  coverImage: z.string().optional(),
});

// 🎙️ Create a new podcast
export const createPodcast = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user } = req;
    if (!user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const validatedData = createPodcastSchema.parse(req.body);

    let uploadedCoverImage: string | undefined = validatedData.coverImage;
    if (req.file) {
      const uploaded = (await uploadMedia(req.file, "podcasts/covers")) as CloudinaryUploadResult;
      uploadedCoverImage = uploaded.secure_url;
    } else if (validatedData.coverImage?.startsWith("data:")) {
      const uploaded = (await uploadMedia(validatedData.coverImage, "podcasts/covers")) as CloudinaryUploadResult;
      uploadedCoverImage = uploaded.secure_url;
    }

    const podcast = await Podcast.create({
      ...validatedData,
      coverImage: uploadedCoverImage,
      createdBy: new Types.ObjectId(user.id),
    });

    logger.info({
      message: "Podcast created",
      podcastId: podcast._id,
      userId: user.id,
      title: validatedData.title,
    });
    res.status(201).json(podcast);
  } catch (error) {
    logger.error({
      message: "Error creating podcast",
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    next(error instanceof z.ZodError ? new Error("Invalid input data") : error);
  }
};

// 📄 Get all podcasts
export const getAllPodcasts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, page = "1", limit = "10", search } = req.query;
    const query: any = {};

    if (category && mongoose.isValidObjectId(category)) {
      query.category = new Types.ObjectId(category as string);
    }
    if (search) {
      query.title = { $regex: search as string, $options: "i" };
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const podcasts = await Podcast.find(query)
      .select("title description coverImage station category createdBy isActive")
      .populate("createdBy", "name")
      .populate("station", "name")
      .populate("category", "name")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const total = await Podcast.countDocuments(query);

    res.status(200).json({
      podcasts,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    logger.error({
      message: "Error fetching podcasts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    next(error);
  }
};

// 🔍 Get a podcast by ID
export const getPodcastById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid podcast ID" });
      return;
    }

    const podcast = await Podcast.findById(req.params.id)
      .select("title description coverImage station category createdBy episodes isActive")
      .populate("createdBy", "name")
      .populate("station", "name")
      .populate("category", "name")
      .populate({
        path: "episodes",
        select: "title description audioUrl duration publishedDate isActive episodeNumber tags",
      })
      .lean();

    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    res.status(200).json(podcast);
  } catch (error) {
    logger.error({
      message: `Error fetching podcast ${req.params.id}`,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    next(error);
  }
};

// ✏️ Update a podcast
export const updatePodcast = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user } = req;
    if (!user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid podcast ID" });
      return;
    }

    const podcast = await Podcast.findById(req.params.id) as IPodcast | null;
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    if (podcast.createdBy.toString() !== user.id && user.role !== "admin") {
      res.status(403).json({ message: "Unauthorized to update this podcast" });
      return;
    }

    const validatedData = updatePodcastSchema.parse(req.body);

    let uploadedCoverImage: string | undefined = validatedData.coverImage;
    if (req.file) {
      const uploaded = (await uploadMedia(req.file, "podcasts/covers")) as CloudinaryUploadResult;
      uploadedCoverImage = uploaded.secure_url;
    } else if (validatedData.coverImage?.startsWith("data:")) {
      const uploaded = (await uploadMedia(validatedData.coverImage, "podcasts/covers")) as CloudinaryUploadResult;
      uploadedCoverImage = uploaded.secure_url;
    }

    Object.assign(podcast, { ...validatedData, coverImage: uploadedCoverImage });
    await podcast.save();

    logger.info({
      message: "Podcast updated",
      podcastId: podcast._id,
      userId: user.id,
      title: validatedData.title || podcast.title,
    });
    res.status(200).json(podcast);
  } catch (error) {
    logger.error({
      message: `Error updating podcast ${req.params.id}`,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    next(error instanceof z.ZodError ? new Error("Invalid input data") : error);
  }
};

// 🗑️ Delete a podcast
export const deletePodcast = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user } = req;
    if (!user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid podcast ID" });
      return;
    }

    const podcast = await Podcast.findById(req.params.id) as IPodcast | null;
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    if (podcast.createdBy.toString() !== user.id && user.role !== "admin") {
      res.status(403).json({ message: "Unauthorized to delete this podcast" });
      return;
    }

    // Delete associated episodes
    await Episode.deleteMany({ podcast: podcast._id });

    await podcast.deleteOne();
    logger.info({
      message: "Podcast deleted",
      podcastId: req.params.id,
      userId: user.id,
    });
    res.status(200).json({ message: "Podcast and associated episodes deleted successfully" });
  } catch (error) {
    logger.error({
      message: `Error deleting podcast ${req.params.id}`,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    next(error);
  }
};

// 🔄 Toggle podcast status (active/inactive)
export const togglePodcastStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user } = req;
    if (!user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({ message: "Only admins can toggle podcast status" });
      return;
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid podcast ID" });
      return;
    }

    const podcast = await Podcast.findById(req.params.id) as IPodcast | null;
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    podcast.isActive = !podcast.isActive;
    await podcast.save();

    logger.info({
      message: `Podcast status toggled to ${podcast.isActive}`,
      podcastId: podcast._id,
      userId: user.id,
    });
    res.status(200).json({
      message: `Podcast is now ${podcast.isActive ? "active" : "inactive"}`,
    });
  } catch (error) {
    logger.error({
      message: `Error toggling podcast ${req.params.id} status`,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    next(error);
  }
};

// 📬 Subscribe to a podcast
export const subscribeToPodcast = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    if (!user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid podcast ID" });
      return;
    }

    const podcast = await Podcast.findById(req.params.id) as IPodcast | null;
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    const userDoc = await mongoose.model("User").findById(user.id);
    if (!userDoc) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (userDoc.subscriptions?.includes(podcast._id)) {
      res.status(400).json({ message: "Already subscribed to this podcast" });
      return;
    }

    userDoc.subscriptions = userDoc.subscriptions || [];
    userDoc.subscriptions.push(podcast._id);
    await userDoc.save();

    logger.info({
      message: "Subscribed to podcast",
      podcastId: podcast._id,
      userId: user.id,
    });
    res.status(200).json({ message: "Subscribed successfully" });
  } catch (error) {
    logger.error({
      message: `Error subscribing to podcast ${req.params.id}`,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    // next(error);
  }
};

// 📬 Unsubscribe from a podcast
export const unsubscribeFromPodcast = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user } = req;
    if (!user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid podcast ID" });
      return;
    }

    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    const userDoc = await mongoose.model("User").findById(user.id);
    if (!userDoc) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!userDoc.subscriptions?.includes(podcast._id)) {
      res.status(400).json({ message: "Not subscribed to this podcast" });
      return;
    }

    userDoc.subscriptions = userDoc.subscriptions.filter(
      (id: Types.ObjectId) => id.toString() !== (podcast._id as Types.ObjectId).toString()
    );
    await userDoc.save();

    logger.info({
      message: "Unsubscribed from podcast",
      podcastId: podcast._id,
      userId: user.id,
    });
    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    logger.error({
      message: `Error unsubscribing from podcast ${req.params.id}`,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    next(error);
  }
};