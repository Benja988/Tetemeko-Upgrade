"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBreakingNews = exports.getNewsStats = exports.getRecentNews = exports.getNewsByCategory = exports.searchNews = exports.getBreakingNews = exports.getFeaturedNews = exports.incrementViews = exports.deleteNewsById = exports.updateNewsById = exports.getNewsBySlug = exports.getNewsById = exports.getAllNews = exports.createNews = void 0;
const News_1 = require("../models/News"); // Adjust the path as needed
const mongoose_1 = __importDefault(require("mongoose"));
const uploadMedia_1 = require("../utils/uploadMedia");
const Category_1 = require("../models/Category");
/**
 * Create a news post
 */
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, summary, author, category, tags, publishedAt, isPublished, thumbnail, featuredImage, videoUrl, seoTitle, seoDescription, readingTime, isFeatured, isBreaking, } = req.body;
        let uploadedThumbnail = thumbnail;
        let uploadedFeaturedImage = featuredImage;
        let uploadedVideoUrl = videoUrl;
        // Upload images to Cloudinary if base64 string is provided
        if (thumbnail === null || thumbnail === void 0 ? void 0 : thumbnail.startsWith("data:")) {
            uploadedThumbnail = yield (0, uploadMedia_1.uploadMedia)(thumbnail, "news/thumbnails");
        }
        if (featuredImage === null || featuredImage === void 0 ? void 0 : featuredImage.startsWith("data:")) {
            uploadedFeaturedImage = yield (0, uploadMedia_1.uploadMedia)(featuredImage, "news/featured");
        }
        if (videoUrl === null || videoUrl === void 0 ? void 0 : videoUrl.startsWith("data")) {
            uploadedVideoUrl = yield (0, uploadMedia_1.uploadMedia)(videoUrl, "news/vidoes", "video");
        }
        const news = new News_1.News({
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
        yield news.save();
        res.status(201).json({ message: "News created successfully", news });
    }
    catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createNews = createNews;
/**
 * Get all news with optional filters & pagination
 */
const getAllNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, category, tag, author, isPublished } = req.query;
        const filters = {};
        if (category)
            filters.category = category;
        if (author)
            filters.author = author;
        if (isPublished !== undefined)
            filters.isPublished = isPublished === "true";
        if (tag)
            filters.tags = { $in: [tag] };
        const newsList = yield News_1.News.find(filters)
            .populate("author", "name email") // populate author name & email
            .populate("category", "name slug")
            .sort({ publishedAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);
        const total = yield News_1.News.countDocuments(filters);
        res.status(200).json({
            total,
            page: +page,
            limit: +limit,
            news: newsList,
        });
    }
    catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAllNews = getAllNews;
/**
 * Get a single news article by MongoDB ObjectId
 */
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid news ID format." });
        return;
    }
    try {
        const newsItem = yield News_1.News.findById(id)
            .populate("author", "name") // Ensure the Author model exists
            .populate("category", "name"); // Ensure the Category model exists
        // .populate("comments");           // Ensure the Comment model exists
        if (!newsItem) {
            res.status(404).json({ message: "News article not found." });
            return;
        }
        res.status(200).json(newsItem);
    }
    catch (error) {
        console.error("Error in getNewsById:", error); // Add this line
        res.status(500).json({ error: "Internal Server Error", details: error instanceof Error ? error.message : error });
    }
});
exports.getNewsById = getNewsById;
/**
 * Get single news article by slug
 */
const getNewsBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        if (!slug) {
            res.status(400).json({ error: 'Slug is required.' });
            return;
        }
        const news = yield News_1.News.findOne({ slug, isPublished: true })
            .populate('author', 'name email')
            .populate('category', 'name slug');
        if (!news) {
            res.status(404).json({ error: 'News not found.' });
            return;
        }
        res.status(200).json(news);
    }
    catch (error) {
        console.error('Error fetching news by slug:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getNewsBySlug = getNewsBySlug;
/**
 * Update news by ID
 */
const updateNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid news ID" });
            return;
        }
        const updatedNews = yield News_1.News.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!updatedNews) {
            res.status(404).json({ error: "News not found" });
            return;
        }
        res.status(200).json({ message: "News updated successfully", news: updatedNews });
    }
    catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateNewsById = updateNewsById;
/**
 * Delete news by ID
 */
const deleteNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid news ID" });
            return;
        }
        const deleted = yield News_1.News.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ error: "News not found" });
            return;
        }
        res.status(200).json({ message: "News deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteNewsById = deleteNewsById;
/**
 * Increment views count for a news article
 */
const incrementViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid news ID" });
            return;
        }
        const updatedNews = yield News_1.News.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } }, { new: true });
        if (!updatedNews) {
            res.status(404).json({ error: "News not found" });
            return;
        }
        res.status(200).json({ message: "View count incremented", viewsCount: updatedNews.viewsCount });
    }
    catch (error) {
        console.error("Error incrementing views:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.incrementViews = incrementViews;
const getFeaturedNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const featuredNews = yield News_1.News.find({ isFeatured: true, isPublished: true })
            .sort({ publishedAt: -1 })
            .limit(5)
            .populate("author", "name");
        res.status(200).json(featuredNews);
    }
    catch (error) {
        console.error("Error fetching featured news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getFeaturedNews = getFeaturedNews;
const getBreakingNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const breakingNews = yield News_1.News.find({ isBreaking: true, isPublished: true })
            .sort({ publishedAt: -1 })
            .limit(5)
            .populate("author", "name");
        res.status(200).json(breakingNews);
    }
    catch (error) {
        console.error("Error fetching breaking news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getBreakingNews = getBreakingNews;
const searchNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newsList = yield News_1.News.find(filters)
            .populate("author", "name")
            .skip((+page - 1) * +limit)
            .limit(+limit)
            .sort({ publishedAt: -1 });
        const total = yield News_1.News.countDocuments(filters);
        res.status(200).json({
            total,
            page: +page,
            limit: +limit,
            news: newsList,
        });
    }
    catch (error) {
        console.error("Error searching news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.searchNews = searchNews;
const getNewsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10 } = req.query;
        if (!category) {
            res.status(400).json({ error: 'Category slug or ID is required.' });
            return;
        }
        // ✅ Check if it's a valid ObjectId
        const isObjectId = mongoose_1.default.Types.ObjectId.isValid(category);
        const categoryDoc = yield Category_1.Category.findOne(isObjectId
            ? { _id: category }
            : { slug: category });
        if (!categoryDoc) {
            res.status(404).json({ error: 'Category not found.' });
            return;
        }
        const filters = {
            category: categoryDoc._id,
            isPublished: true,
        };
        const skip = (Number(page) - 1) * Number(limit);
        const newsList = yield News_1.News.find(filters)
            .populate('author', 'name')
            .populate('category', 'name slug')
            .select('-comments')
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = yield News_1.News.countDocuments(filters);
        res.status(200).json({
            success: true,
            category: categoryDoc.name,
            total,
            page: Number(page),
            limit: Number(limit),
            news: newsList,
        });
    }
    catch (error) {
        console.error('Error fetching news by category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getNewsByCategory = getNewsByCategory;
const getRecentNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 10 } = req.query;
        const recentNews = yield News_1.News.find({ isPublished: true })
            .populate("author", "name")
            .sort({ publishedAt: -1 })
            .limit(+limit);
        res.status(200).json(recentNews);
    }
    catch (error) {
        console.error("Error fetching recent news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getRecentNews = getRecentNews;
const getNewsStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalNews = yield News_1.News.countDocuments();
        const publishedNews = yield News_1.News.countDocuments({ isPublished: true });
        const unpublishedNews = totalNews - publishedNews;
        res.status(200).json({
            totalNews,
            publishedNews,
            unpublishedNews,
        });
    }
    catch (error) {
        console.error("Error fetching news statistics:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getNewsStats = getNewsStats;
const toggleBreakingNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const news = yield News_1.News.findById(id);
        if (!news) {
            res.status(404).json({ error: "News not found" });
            return;
        }
        news.isBreaking = !news.isBreaking;
        yield news.save();
        res.status(200).json({
            message: `News has been ${news.isBreaking ? "marked" : "unmarked"} as breaking`,
            news,
        });
    }
    catch (error) {
        console.error("Error toggling breaking status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.toggleBreakingNews = toggleBreakingNews;
