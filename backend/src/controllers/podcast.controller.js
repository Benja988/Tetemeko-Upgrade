"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.togglePodcastStatus = exports.deletePodcast = exports.updatePodcast = exports.getPodcastById = exports.getAllPodcasts = exports.createPodcast = void 0;
const Podcast_1 = __importDefault(require("../models/Podcast"));
const Episode_1 = __importDefault(require("../models/Episode"));
const mongoose_1 = __importStar(require("mongoose"));
const uploadMedia_1 = require("../utils/uploadMedia");
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../utils/logger"));
const Category_1 = require("../models/Category");
// import "../types/express";
const createPodcastSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200),
    description: zod_1.z.string().min(1, 'Description is required'),
    category: zod_1.z.string().refine((val) => mongoose_1.default.isValidObjectId(val), {
        message: 'Invalid category ID',
    }),
    station: zod_1.z
        .string()
        .refine((val) => !val || mongoose_1.default.isValidObjectId(val), {
        message: 'Invalid station ID',
    })
        .optional(),
    coverImage: zod_1.z.string().optional(),
});
const updatePodcastSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    description: zod_1.z.string().min(1).optional(),
    category: zod_1.z
        .string()
        .refine((val) => !val || mongoose_1.default.isValidObjectId(val), {
        message: 'Invalid category ID',
    })
        .optional(),
    station: zod_1.z
        .string()
        .refine((val) => !val || mongoose_1.default.isValidObjectId(val), {
        message: 'Invalid station ID',
    })
        .optional(),
    coverImage: zod_1.z.string().optional(),
});
const createPodcast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const validatedData = createPodcastSchema.parse(req.body);
        const category = yield Category_1.Category.findById(validatedData.category);
        if (!category || category.categoryType !== 'podcast') {
            res
                .status(400)
                .json({ error: 'Invalid or non-podcast category selected' });
            return;
        }
        let uploadedCoverImage = validatedData.coverImage;
        if (req.file) {
            const uploaded = (yield (0, uploadMedia_1.uploadMedia)(req.file, 'podcasts/covers'));
            uploadedCoverImage = uploaded.secure_url;
        }
        else if ((_a = validatedData.coverImage) === null || _a === void 0 ? void 0 : _a.startsWith('data:')) {
            const uploaded = (yield (0, uploadMedia_1.uploadMedia)(validatedData.coverImage, 'podcasts/covers'));
            uploadedCoverImage = uploaded.secure_url;
        }
        if (!validatedData.station ||
            !mongoose_1.default.Types.ObjectId.isValid(validatedData.station)) {
            res.status(400).json({ error: 'Invalid or missing station ID' });
            return;
        }
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const podcast = yield Podcast_1.default.create(Object.assign(Object.assign({}, validatedData), { coverImage: uploadedCoverImage || '' }));
        logger_1.default.info({
            message: 'Podcast created',
            podcastId: podcast._id,
            title: validatedData.title,
        });
        res.status(201).json({ message: 'Podcast created successfully', podcast });
    }
    catch (error) {
        console.error('Error creating podcast:', error);
        res.status(500).json({ error: 'Failed to create podcast' });
    }
});
exports.createPodcast = createPodcast;
const getAllPodcasts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, page = '1', limit = '10', search } = req.query;
        const query = {};
        if (category && mongoose_1.default.isValidObjectId(category)) {
            query.category = new mongoose_1.Types.ObjectId(category);
        }
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const podcasts = yield Podcast_1.default.find(query)
            .select('title description coverImage station category createdBy isActive')
            .populate('createdBy', 'name')
            .populate('station', 'name')
            .populate('category', 'name')
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();
        const total = yield Podcast_1.default.countDocuments(query);
        res.status(200).json({
            podcasts,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    }
    catch (error) {
        console.error('Error fetching podcasts:', error);
        res.status(500).json({ error: 'Failed to fetch podcasts' });
    }
});
exports.getAllPodcasts = getAllPodcasts;
const getPodcastById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ error: 'Invalid podcast ID' });
            return;
        }
        const podcast = yield Podcast_1.default.findById(id)
            .select('title description coverImage station category createdBy episodes isActive')
            .populate('createdBy', 'name')
            .populate('station', 'name')
            .populate('category', 'name')
            .populate({
            path: 'episodes',
            select: 'title description audioUrl duration publishedDate isActive episodeNumber tags',
        })
            .lean();
        if (!podcast) {
            res.status(404).json({ error: 'Podcast not found' });
            return;
        }
        res.status(200).json(podcast);
    }
    catch (error) {
        console.error('Error fetching podcast:', error);
        res.status(500).json({ error: 'Failed to fetch podcast' });
    }
});
exports.getPodcastById = getPodcastById;
const updatePodcast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const validatedData = updatePodcastSchema.parse(req.body);
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ error: 'Invalid podcast ID' });
            return;
        }
        const podcast = (yield Podcast_1.default.findById(id));
        if (!podcast) {
            res.status(404).json({ error: 'Podcast not found' });
            return;
        }
        let uploadedCoverImage = validatedData.coverImage;
        if (req.file) {
            const uploaded = (yield (0, uploadMedia_1.uploadMedia)(req.file, 'podcasts/covers'));
            uploadedCoverImage = uploaded.secure_url;
        }
        else if ((_a = validatedData.coverImage) === null || _a === void 0 ? void 0 : _a.startsWith('data:')) {
            const uploaded = (yield (0, uploadMedia_1.uploadMedia)(validatedData.coverImage, 'podcasts/covers'));
            uploadedCoverImage = uploaded.secure_url;
        }
        const updatedPodcast = yield Podcast_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, validatedData), { coverImage: uploadedCoverImage || podcast.coverImage }), { new: true, runValidators: true });
        if (!updatedPodcast) {
            res.status(404).json({ error: 'Podcast not found' });
            return;
        }
        logger_1.default.info({
            message: 'Podcast updated',
            podcastId: updatedPodcast._id,
            title: validatedData.title || updatedPodcast.title,
        });
        res
            .status(200)
            .json({
            message: 'Podcast updated successfully',
            podcast: updatedPodcast,
        });
    }
    catch (error) {
        console.error('Error updating podcast:', error);
        res.status(500).json({ error: 'Failed to update podcast' });
    }
});
exports.updatePodcast = updatePodcast;
const deletePodcast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ error: 'Invalid podcast ID' });
            return;
        }
        const podcast = (yield Podcast_1.default.findById(id));
        if (!podcast) {
            res.status(404).json({ error: 'Podcast not found' });
            return;
        }
        yield Episode_1.default.deleteMany({ podcast: podcast._id });
        yield Podcast_1.default.findByIdAndDelete(id);
        logger_1.default.info({
            message: 'Podcast deleted',
            podcastId: id,
        });
        res
            .status(200)
            .json({ message: 'Podcast and associated episodes deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting podcast:', error);
        res.status(500).json({ error: 'Failed to delete podcast' });
    }
});
exports.deletePodcast = deletePodcast;
const togglePodcastStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ error: 'Invalid podcast ID' });
            return;
        }
        const podcast = (yield Podcast_1.default.findById(id));
        if (!podcast) {
            res.status(404).json({ error: 'Podcast not found' });
            return;
        }
        podcast.isActive = !podcast.isActive;
        const updatedPodcast = yield podcast.save();
        logger_1.default.info({
            message: `Podcast status toggled to ${podcast.isActive}`,
            podcastId: podcast._id,
        });
        res.status(200).json({
            message: `Podcast is now ${updatedPodcast.isActive ? 'active' : 'inactive'}`,
            podcast: updatedPodcast,
        });
    }
    catch (error) {
        console.error('Error toggling podcast status:', error);
        res.status(500).json({ error: 'Failed to toggle podcast status' });
    }
});
exports.togglePodcastStatus = togglePodcastStatus;
