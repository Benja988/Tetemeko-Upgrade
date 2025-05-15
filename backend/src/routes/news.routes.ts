import express from "express";
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  addComment,
  deleteComment,
} from "../controllers/news.controller";
import { authenticateJWT, authorize } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.post("/", authenticateJWT, authorize(["admin", "content-manager"]), createNews);
router.put("/:id", authenticateJWT, authorize(["admin", "content-manager"]), updateNews);
router.delete("/:id", authenticateJWT, authorize(["admin"]), deleteNews);
router.post("/:id/comment", authenticateJWT, addComment);
router.delete("/:id/comment/:commentId", authenticateJWT, authorize(["admin"]), deleteComment);

export default router;
