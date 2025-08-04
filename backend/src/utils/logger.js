"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
// Configure Winston logger
const logger = (0, winston_1.createLogger)({
    level: process.env.LOG_LEVEL || "info", // Default to 'info' level
    format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.errors({ stack: true }), // Include stack traces for errors
    winston_1.format.json() // Log in JSON format for structured logging
    ),
    transports: [
        // Log to console
        new winston_1.transports.Console(),
        // Log to file for errors
        new winston_1.transports.File({ filename: "logs/error.log", level: "error" }),
        // Log all levels to combined log file
        new winston_1.transports.File({ filename: "logs/combined.log" }),
    ],
});
// If in development, add more detailed console output
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
    }));
}
exports.default = logger;
