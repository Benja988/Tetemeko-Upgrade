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
exports.uploadMedia = void 0;
const cloudinary_1 = require("cloudinary");
const logger_1 = __importDefault(require("./logger"));
/**
 * Uploads media (image, video, raw) to Cloudinary.
 *
 * @param file - Multer file object or base64-encoded string
 * @param folder - Cloudinary folder name
 * @param resourceType - 'image' | 'video' | 'raw'
 * @returns Object with secure_url of the uploaded media
 */
const uploadMedia = (file_1, ...args_1) => __awaiter(void 0, [file_1, ...args_1], void 0, function* (file, folder = "uploads", resourceType = "image") {
    try {
        let result;
        if (typeof file === "string" && file.startsWith("data:")) {
            // Handle base64 string
            result = yield cloudinary_1.v2.uploader.upload(file, {
                folder,
                resource_type: resourceType,
            });
        }
        else if (typeof file !== "string") {
            // Handle Multer file (in-memory buffer)
            result = yield new Promise((resolve, reject) => {
                const stream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: resourceType }, (error, result) => {
                    if (error || !result) {
                        reject(error || new Error("Upload failed"));
                    }
                    else {
                        resolve(result);
                    }
                });
                stream.end(file.buffer);
            });
        }
        else {
            throw new Error("Invalid file input: must be a base64 string or file object");
        }
        logger_1.default.info({
            message: "Media uploaded to Cloudinary",
            publicId: result.public_id,
            folder,
            resourceType,
        });
        return { secure_url: result.secure_url };
    }
    catch (err) {
        logger_1.default.error({
            message: "Media upload failed",
            error: err instanceof Error ? err.message : "Unknown error",
            stack: err instanceof Error ? err.stack : undefined,
        });
        throw new Error("Media upload failed");
    }
});
exports.uploadMedia = uploadMedia;
