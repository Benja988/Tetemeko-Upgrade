import Podcast from "../models/Podcast";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import mongoose from "mongoose";

// 🎙️ Create a new podcast
export const createPodcast = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      description,
      coverImage,
      categories,
      station,
    } = req.body;

    const { user } = req as AuthenticatedRequest;

    const podcast = await Podcast.create({
      title,
      description,
      coverImage,
      categories,
      station,
      createdBy: user?.id,
    });

    res.status(201).json(podcast);
  } catch (error) {
    next(error);
  }
};

// 📄 Get all podcasts
export const getAllPodcasts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const podcasts = await Podcast.find()
      .populate("createdBy", "name")
      .populate("station", "name");
    res.status(200).json(podcasts);
  } catch (error) {
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
    const podcast = await Podcast.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("station", "name");

    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    res.status(200).json(podcast);
  } catch (error) {
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
    const { user } = req as AuthenticatedRequest;

    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    if (
      podcast.createdBy.toString() !== user?.id &&
      user?.role !== "admin"
    ) {
      res
        .status(403)
        .json({ message: "Unauthorized to update this podcast" });
      return;
    }

    Object.assign(podcast, req.body);
    await podcast.save();

    res.status(200).json(podcast);
  } catch (error) {
    next(error);
  }
};

// 🗑️ Delete a podcast
export const deletePodcast = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user } = req as AuthenticatedRequest;

    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    if (
      podcast.createdBy.toString() !== user?.id &&
      user?.role !== "admin"
    ) {
      res
        .status(403)
        .json({ message: "Unauthorized to delete this podcast" });
      return;
    }

    await podcast.deleteOne();
    res.status(200).json({ message: "Podcast deleted successfully" });
  } catch (error) {
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
    const { user } = req as AuthenticatedRequest;

    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    if (user?.role !== "admin") {
      res
        .status(403)
        .json({ message: "Only admins can toggle podcast status" });
      return;
    }

    podcast.isActive = !podcast.isActive;
    await podcast.save();

    res.status(200).json({
      message: `Podcast is now ${podcast.isActive ? "active" : "inactive"}`,
    });
  } catch (error) {
    next(error);
  }
};
