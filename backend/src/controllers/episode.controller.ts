import Episode from "../models/Episode";
import Podcast from "../models/Podcast";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

// 🎙️ Create a new episode
export const createEpisode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { podcast, title, audioUrl, description, duration, publishedAt } = req.body;

    const existingPodcast = await Podcast.findById(podcast);
    if (!existingPodcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    const episode = await Episode.create({
      podcast,
      title,
      audioUrl,
      description,
      duration,
      publishedAt,
    });

    res.status(201).json(episode);
  } catch (error) {
    next(error);
  }
};

// 📄 Get all episodes
export const getAllEpisodes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const episodes = await Episode.find().populate("podcast", "title");
    res.status(200).json(episodes);
  } catch (error) {
    next(error);
  }
};

// 🎧 Get episodes by podcast
export const getEpisodesByPodcast = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const podcastId = req.params.podcastId;
    const episodes = await Episode.find({ podcast: podcastId }).populate("podcast", "title");

    res.status(200).json(episodes);
  } catch (error) {
    next(error);
  }
};

// 🔍 Get a single episode
export const getEpisodeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const episode = await Episode.findById(req.params.id).populate("podcast", "title");

    if (!episode) {
      res.status(404).json({ message: "Episode not found" });
      return;
    }

    res.status(200).json(episode);
  } catch (error) {
    next(error);
  }
};

// ✏️ Update an episode
export const updateEpisode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      res.status(404).json({ message: "Episode not found" });
      return;
    }

    Object.assign(episode, req.body);
    await episode.save();

    res.status(200).json(episode);
  } catch (error) {
    next(error);
  }
};

// 🗑️ Delete an episode
export const deleteEpisode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      res.status(404).json({ message: "Episode not found" });
      return;
    }

    await episode.deleteOne();
    res.status(200).json({ message: "Episode deleted successfully" });
  } catch (error) {
    next(error);
  }
};
