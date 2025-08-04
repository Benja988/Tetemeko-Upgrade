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
exports.deleteSchedule = exports.updateSchedule = exports.getScheduleById = exports.getAllSchedules = exports.createSchedule = void 0;
const Schedule_1 = __importDefault(require("../models/Schedule"));
// Create a new schedule
const createSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { station, title, host, startTime, endTime, recurring, daysOfWeek } = req.body;
        const schedule = yield Schedule_1.default.create({
            station,
            title,
            host,
            startTime,
            endTime,
            recurring,
            daysOfWeek,
        });
        res.status(201).json(schedule);
    }
    catch (error) {
        next(error);
    }
});
exports.createSchedule = createSchedule;
// Get all schedules
const getAllSchedules = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedules = yield Schedule_1.default.find()
            .populate("station", "name")
            .populate("host", "name email");
        res.status(200).json(schedules);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSchedules = getAllSchedules;
// Get schedule by ID
const getScheduleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedule = yield Schedule_1.default.findById(req.params.id)
            .populate("station", "name")
            .populate("host", "name email");
        if (!schedule) {
            res.status(404).json({ message: "Schedule not found" });
            return;
        }
        res.status(200).json(schedule);
    }
    catch (error) {
        next(error);
    }
});
exports.getScheduleById = getScheduleById;
// Update a schedule
const updateSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedule = yield Schedule_1.default.findById(req.params.id);
        if (!schedule) {
            res.status(404).json({ message: "Schedule not found" });
            return;
        }
        Object.assign(schedule, req.body);
        yield schedule.save();
        res.status(200).json(schedule);
    }
    catch (error) {
        next(error);
    }
});
exports.updateSchedule = updateSchedule;
// Delete a schedule
const deleteSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedule = yield Schedule_1.default.findById(req.params.id);
        if (!schedule) {
            res.status(404).json({ message: "Schedule not found" });
            return;
        }
        yield schedule.deleteOne();
        res.status(200).json({ message: "Schedule deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteSchedule = deleteSchedule;
