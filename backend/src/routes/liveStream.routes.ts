import express from "express";
import {
  getLiveStream,
  getLiveChatMessages,
  sendChatMessage,
  deleteChatMessage,
} from "../controllers/liveStream.controller";
import { authenticateJWT } from "../middlewares/auth.middleware"; // Authenticate all requests
import { authorize } from "../middlewares/auth.middleware"; // Role-based access control

const router = express.Router();

router.get("/:stationId", getLiveStream); // Public route

router.get("/:stationId/chat", authenticateJWT, getLiveChatMessages);
router.post("/:stationId/chat", authenticateJWT, sendChatMessage);
router.delete("/:stationId/chat/:messageId", authenticateJWT, authorize(["superadmin"]), deleteChatMessage);

export default router;
