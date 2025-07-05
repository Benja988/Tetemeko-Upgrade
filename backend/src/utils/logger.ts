import { createLogger, format, transports } from "winston";

// Configure Winston logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info", // Default to 'info' level
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }), // Include stack traces for errors
    format.json() // Log in JSON format for structured logging
  ),
  transports: [
    // Log to console
    new transports.Console(),
    // Log to file for errors
    new transports.File({ filename: "logs/error.log", level: "error" }),
    // Log all levels to combined log file
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// If in development, add more detailed console output
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;