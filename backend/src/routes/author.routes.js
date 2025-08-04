"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const author_controller_1 = require("../controllers/author.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Public routes
router.get("/", author_controller_1.getAllAuthors);
router.get("/:id", author_controller_1.getAuthorById);
// Admin-only actions
router.post("/", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), author_controller_1.createAuthor);
router.patch("/:id", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), author_controller_1.updateAuthor);
router.delete("/:id", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), author_controller_1.deleteAuthor);
router.patch("/:id/verify", auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), author_controller_1.verifyAuthor);
router.get("/search", author_controller_1.searchAuthors);
exports.default = router;
