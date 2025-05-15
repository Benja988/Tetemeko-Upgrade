import { Request, Response, NextFunction } from "express";
import Station from "../models/Station";
import ChatMessage from "../models/LiveStream";

// @desc Fetch live streaming data for a station
export const getLiveStream = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const station = await Station.findById(req.params.stationId);
    if (!station) {
      res.status(404).json({ message: "Station not found" });
      return;
    }

    res.status(200).json({ streamUrl: station.streamUrl, status: "Live" });
  } catch (error) {
    next(error);
  }
};

// @desc Get live chat messages for a station
export const getLiveChatMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await ChatMessage.find({ stationId: req.params.stationId }).sort({ timestamp: -1 });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc Send a chat message
export const sendChatMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, username, message } = req.body;
    if (!userId || !username || !message) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const chatMessage = new ChatMessage({
      stationId: req.params.stationId,
      userId,
      username,
      message,
    });

    await chatMessage.save();
    res.status(201).json({ message: "Message sent", chatMessage });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a chat message (Admin only)
export const deleteChatMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedMessage = await ChatMessage.findByIdAndDelete(req.params.messageId);
    if (!deletedMessage) {
      res.status(404).json({ message: "Message not found" });
      return;
    }

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    next(error);
  }
};
