import { Request, Response, NextFunction } from "express";
import Schedule from "../models/Schedule";
import mongoose from "mongoose";

// Create a new schedule
export const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { station, title, host, startTime, endTime, recurring, daysOfWeek } = req.body;

    const schedule = await Schedule.create({
      station,
      title,
      host,
      startTime,
      endTime,
      recurring,
      daysOfWeek,
    });

    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
};

// Get all schedules
export const getAllSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const schedules = await Schedule.find()
      .populate("station", "name")
      .populate("host", "name email");
    res.status(200).json(schedules);
  } catch (error) {
    next(error);
  }
};

// Get schedule by ID
export const getScheduleById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("station", "name")
      .populate("host", "name email");

    if (!schedule) {
      res.status(404).json({ message: "Schedule not found" });
      return;
    }

    res.status(200).json(schedule);
  } catch (error) {
    next(error);
  }
};

// Update a schedule
export const updateSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      res.status(404).json({ message: "Schedule not found" });
      return;
    }

    Object.assign(schedule, req.body);
    await schedule.save();

    res.status(200).json(schedule);
  } catch (error) {
    next(error);
  }
};

// Delete a schedule
export const deleteSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      res.status(404).json({ message: "Schedule not found" });
      return;
    }

    await schedule.deleteOne();

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    next(error);
  }
};
