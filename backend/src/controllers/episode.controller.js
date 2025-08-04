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
exports.getEpisodeById = exports.getAllEpisodes = exports.deleteEpisode = exports.updateEpisode = exports.addEpisode = void 0;
const Episode_1 = __importDefault(require("../models/Episode"));
const Podcast_1 = __importDefault(require("../models/Podcast"));
const mongoose_1 = __importStar(require("mongoose"));
const uploadMedia_1 = require("../utils/uploadMedia");
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../utils/logger"));
// Episode creation/update schemas
const createEpisodeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(200),
    description: zod_1.z.string().min(1, "Description is required"),
    duration: zod_1.z.number().min(1, "Duration must be positive"),
    episodeNumber: zod_1.z.number().min(1, "Episode number must be positive").optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    audioUrl: zod_1.z.string().optional(),
});
const updateEpisodeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    description: zod_1.z.string().min(1).optional(),
    duration: zod_1.z.number().min(1).optional(),
    episodeNumber: zod_1.z.number().min(1).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    audioUrl: zod_1.z.string().optional(),
});
const addEpisode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { podcastId } = req.params;
        const validatedData = createEpisodeSchema.parse(req.body);
        if (!mongoose_1.default.isValidObjectId(podcastId)) {
            res.status(400).json({ error: "Invalid podcast ID" });
            return;
        }
        const podcast = yield Podcast_1.default.findById(podcastId);
        if (!podcast) {
            res.status(404).json({ error: "Podcast not found" });
            return;
        }
        let uploadedAudioUrl = validatedData.audioUrl;
        if (req.file) {
            const uploaded = (yield (0, uploadMedia_1.uploadMedia)(req.file, "podcasts/episodes", "raw"));
            uploadedAudioUrl = uploaded.secure_url;
        }
        else if ((_a = validatedData.audioUrl) === null || _a === void 0 ? void 0 : _a.startsWith("data:")) {
            const uploaded = (yield (0, uploadMedia_1.uploadMedia)(validatedData.audioUrl, "podcasts/episodes", "raw"));
            uploadedAudioUrl = uploaded.secure_url;
        }
        if (!uploadedAudioUrl) {
            res.status(400).json({ error: "Audio file is required" });
            return;
        }
        const episode = yield Episode_1.default.create(Object.assign(Object.assign({}, validatedData), { audioUrl: uploadedAudioUrl, podcast: podcast._id }));
        podcast.episodes.push(episode._id);
        yield podcast.save();
        res.status(201).json({ message: "Episode created successfully", episode });
    }
    catch (error) {
        console.error("Error adding episode:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.addEpisode = addEpisode;
const updateEpisode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { podcastId, episodeId } = req.params;
        const validatedData = updateEpisodeSchema.parse(req.body);
        if (!mongoose_1.default.isValidObjectId(podcastId)) {
            res.status(400).json({ error: "Invalid podcast ID" });
            return;
        }
        if (!mongoose_1.default.isValidObjectId(episodeId)) {
            res.status(400).json({ error: "Invalid episode ID" });
            return;
        }
        const podcast = yield Podcast_1.default.findById(podcastId);
        if (!podcast) {
            res.status(404).json({ error: "Podcast not found" });
            return;
        }
        const episode = yield Episode_1.default.findById(episodeId);
        if (!episode) {
            res.status(404).json({ error: "Episode not found" });
            return;
        }
        let uploadedAudioUrl = validatedData.audioUrl;
        if (req.file) {
            const uploaded = (yield (0, uploadMedia_1.uploadMedia)(req.file, "podcasts/episodes", "raw"));
            uploadedAudioUrl = uploaded.secure_url;
        }
        else if ((_a = validatedData.audioUrl) === null || _a === void 0 ? void 0 : _a.startsWith("data:")) {
            const uploaded = (yield (0, uploadMedia_1.uploadMedia)(validatedData.audioUrl, "podcasts/episodes", "raw"));
            uploadedAudioUrl = uploaded.secure_url;
        }
        Object.assign(episode, Object.assign(Object.assign({}, validatedData), { audioUrl: uploadedAudioUrl || episode.audioUrl }));
        yield episode.save();
        logger_1.default.info({
            message: "Episode updated",
            episodeId: episode._id,
            podcastId: podcast._id,
            title: validatedData.title || episode.title,
        });
        res.status(200).json({ message: "Episode updated successfully", episode });
    }
    catch (error) {
        console.error("Error updating episode:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateEpisode = updateEpisode;
const deleteEpisode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { podcastId, episodeId } = req.params;
        if (!mongoose_1.default.isValidObjectId(podcastId)) {
            res.status(400).json({ error: "Invalid podcast ID" });
            return;
        }
        if (!mongoose_1.default.isValidObjectId(episodeId)) {
            res.status(400).json({ error: "Invalid episode ID" });
            return;
        }
        const podcast = yield Podcast_1.default.findById(podcastId);
        if (!podcast) {
            res.status(404).json({ error: "Podcast not found" });
            return;
        }
        const episode = yield Episode_1.default.findById(episodeId);
        if (!episode) {
            res.status(404).json({ error: "Episode not found" });
            return;
        }
        yield episode.deleteOne();
        podcast.episodes = podcast.episodes.filter((id) => id.toString() !== episodeId);
        yield podcast.save();
        logger_1.default.info({
            message: "Episode deleted",
            episodeId,
            podcastId,
        });
        res.status(200).json({ message: "Episode deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting episode:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteEpisode = deleteEpisode;
const getAllEpisodes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.isValidObjectId(req.params.podcastId)) {
            res.status(400).json({ message: "Invalid podcast ID" });
            return;
        }
        const { page = "1", limit = "10", search } = req.query;
        const query = { podcast: new mongoose_1.Types.ObjectId(req.params.podcastId) };
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const episodes = yield Episode_1.default.find(query)
            .select("title description audioUrl duration publishedDate isActive episodeNumber tags")
            .populate("createdBy", "name")
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();
        const total = yield Episode_1.default.countDocuments(query);
        res.status(200).json({
            episodes,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    }
    catch (error) {
        logger_1.default.error({
            message: `Error fetching episodes for podcast ${req.params.podcastId}`,
            error: error instanceof Error ? error.message : "Unknown error",
        });
        next(error);
    }
});
exports.getAllEpisodes = getAllEpisodes;
const getEpisodeById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.isValidObjectId(req.params.podcastId)) {
            res.status(400).json({ message: "Invalid podcast ID" });
            return;
        }
        if (!mongoose_1.default.isValidObjectId(req.params.episodeId)) {
            res.status(400).json({ message: "Invalid episode ID" });
            return;
        }
        const episode = yield Episode_1.default.findOne({
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
    }
    catch (error) {
        logger_1.default.error({
            message: `Error fetching episode ${req.params.episodeId} for podcast ${req.params.podcastId}`,
            error: error instanceof Error ? error.message : "Unknown error",
        });
        next(error);
    }
});
exports.getEpisodeById = getEpisodeById;
