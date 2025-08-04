"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const news_controller_1 = require("../controllers/news.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Public routes
router.get("/", news_controller_1.getAllNews);
router.get("/featured", news_controller_1.getFeaturedNews);
router.get("/breaking", news_controller_1.getBreakingNews);
router.get("/search", news_controller_1.searchNews);
router.get("/category/:category", news_controller_1.getNewsByCategory);
// router.get('/:slug', getNewsBySlug);
router.get("/recent", news_controller_1.getRecentNews);
router.get("/stats", news_controller_1.getNewsStats);
router.get("/:id", news_controller_1.getNewsById);
router.post("/:id/views", news_controller_1.incrementViews); // increment views publicly
// Protected routes
router.post("/", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), news_controller_1.createNews);
router.put("/:id", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), news_controller_1.updateNewsById);
router.delete("/:id", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), news_controller_1.deleteNewsById);
router.patch("/:id/toggle-breaking", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), news_controller_1.toggleBreakingNews);
exports.default = router;
