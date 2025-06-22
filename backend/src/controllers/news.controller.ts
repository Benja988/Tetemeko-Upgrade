import { Request, Response } from "express";
import { News } from "../models/News";  // Adjust the path as needed
import mongoose from "mongoose";
import { uploadMedia } from "../utils/uploadMedia";

/**
 * Create a news post
 */
export const createNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      content,
      summary,
      author,
      category,
      tags,
      publishedAt,
      isPublished,
      thumbnail,
      featuredImage,
      videoUrl,
      seoTitle,
      seoDescription,
      readingTime,
      isFeatured,
      isBreaking,
    } = req.body;

    let uploadedThumbnail = thumbnail;
    let uploadedFeaturedImage = featuredImage;
    let uploadedVideoUrl = videoUrl;

    // Upload images to Cloudinary if base64 string is provided
    if (thumbnail?.startsWith("data:")) {
      uploadedThumbnail = await uploadMedia(thumbnail, "news/thumbnails");
    }

    if (featuredImage?.startsWith("data:")) {
      uploadedFeaturedImage = await uploadMedia(featuredImage, "news/featured");
    }

    if (videoUrl?.startsWith("data")) {
      uploadedVideoUrl = await uploadMedia(videoUrl, "news/vidoes", "video");
    }

    const news = new News({
      title,
      content,
      summary,
      author,
      category,
      tags,
      publishedAt,
      isPublished,
      thumbnail: uploadedThumbnail,
      featuredImage: uploadedFeaturedImage,
      videoUrl: uploadedVideoUrl,
      seoTitle,
      seoDescription,
      readingTime,
      isFeatured,
      isBreaking,
    });

    await news.save();

    res.status(201).json({ message: "News created successfully", news });
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
/**
 * Get all news with optional filters & pagination
 */
export const getAllNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, tag, author, isPublished } = req.query;

    const filters: any = {};
    if (category) filters.category = category;
    if (author) filters.author = author;
    if (isPublished !== undefined) filters.isPublished = isPublished === "true";
    if (tag) filters.tags = { $in: [tag] };

    const newsList = await News.find(filters)
      .populate("author", "name email") // populate author name & email
      .populate("category", "name slug")
      .sort({ publishedAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await News.countDocuments(filters);

    res.status(200).json({
      total,
      page: +page,
      limit: +limit,
      news: newsList,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get single news by ID
 */
export const getNewsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid news ID" });
      return;
    }

    const news = await News.findById(id).populate("author", "name email");

    if (!news) {
      res.status(404).json({ error: "News not found" });
      return;
    }

    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update news by ID
 */
export const updateNewsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid news ID" });
      return;
    }

    const updatedNews = await News.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedNews) {
      res.status(404).json({ error: "News not found" });
      return;
    }

    res.status(200).json({ message: "News updated successfully", news: updatedNews });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Delete news by ID
 */
export const deleteNewsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid news ID" });
      return;
    }

    const deleted = await News.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ error: "News not found" });
      return;
    }

    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Increment views count for a news article
 */
export const incrementViews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid news ID" });
      return;
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!updatedNews) {
      res.status(404).json({ error: "News not found" });
      return;
    }

    res.status(200).json({ message: "View count incremented", viewsCount: updatedNews.viewsCount });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFeaturedNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const featuredNews = await News.find({ isFeatured: true, isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(5)
      .populate("author", "name");

    res.status(200).json(featuredNews);
  } catch (error) {
    console.error("Error fetching featured news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBreakingNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const breakingNews = await News.find({ isBreaking: true, isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(5)
      .populate("author", "name");

    res.status(200).json(breakingNews);
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const searchNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    const searchRegex = new RegExp(query, "i");

    const filters = {
      isPublished: true,
      $or: [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ],
    };

    const newsList = await News.find(filters)
      .populate("author", "name")
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ publishedAt: -1 });

    const total = await News.countDocuments(filters);

    res.status(200).json({
      total,
      page: +page,
      limit: +limit,
      news: newsList,
    });
  } catch (error) {
    console.error("Error searching news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getNewsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const filters = {
      category,
      isPublished: true,
    };

    const newsList = await News.find(filters)
      .populate("author", "name")
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ publishedAt: -1 });

    const total = await News.countDocuments(filters);

    res.status(200).json({
      total,
      page: +page,
      limit: +limit,
      news: newsList,
    });
  } catch (error) {
    console.error("Error fetching news by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getRecentNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10 } = req.query;

    const recentNews = await News.find({ isPublished: true })
      .populate("author", "name")
      .sort({ publishedAt: -1 })
      .limit(+limit);

    res.status(200).json(recentNews);
  } catch (error) {
    console.error("Error fetching recent news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getNewsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalNews = await News.countDocuments();
    const publishedNews = await News.countDocuments({ isPublished: true });
    const unpublishedNews = totalNews - publishedNews;

    res.status(200).json({
      totalNews,
      publishedNews,
      unpublishedNews,
    });
  } catch (error) {
    console.error("Error fetching news statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const toggleBreakingNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);
    if (!news) {
      res.status(404).json({ error: "News not found" });
      return;
    }

    news.isBreaking = !news.isBreaking;
    await news.save();

    res.status(200).json({
      message: `News has been ${news.isBreaking ? "marked" : "unmarked"} as breaking`,
      news,
    });
  } catch (error) {
    console.error("Error toggling breaking status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

