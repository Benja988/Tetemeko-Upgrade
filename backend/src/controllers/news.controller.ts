import { Request, Response, NextFunction } from "express";
import News from "../models/news.model";

// 📌 Get all news articles
export const getAllNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await News.find().sort({ publishedAt: -1 }).populate("author", "name email");
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

// 📌 Get single news article
export const getNewsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await News.findById(req.params.id).populate("author", "name email");
    if (!news) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

// 📌 Publish a new article (Admin/Content Manager)
export const createNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;
    const author = req.user?.id;

    const news = new News({ title, content, author });
    await news.save();

    res.status(201).json({ message: "Article published successfully", news });
  } catch (error) {
    next(error);
  }
};

// 📌 Edit an article (Admin/Content Manager)
export const updateNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNews) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article updated", updatedNews });
  } catch (error) {
    next(error);
  }
};

// 📌 Delete an article (Admin only)
export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted" });
  } catch (error) {
    next(error);
  }
};

// 📌 Add a comment to an article
export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "Article not found" });
    }

    news.comments.push({ user: req.user?.id, text, createdAt: new Date() });
    await news.save();

    res.status(201).json({ message: "Comment added successfully", comments: news.comments });
  } catch (error) {
    next(error);
  }
};

// 📌 Delete a comment (Admin only)
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "Article not found" });
    }

    news.comments = news.comments.filter(comment => comment._id?.toString() !== req.params.commentId);
    await news.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
