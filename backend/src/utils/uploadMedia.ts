import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary";
import { Express } from "express"; // Import Express for Multer types
import logger from "./logger";

// Define interface for Cloudinary upload result (consistent with podcast.controller.ts)
export interface CloudinaryUploadResult {
  secure_url: string;
}

/**
 * Uploads media (image, video, raw) to Cloudinary.
 *
 * @param file - Multer file object or base64-encoded string
 * @param folder - Cloudinary folder name
 * @param resourceType - 'image' | 'video' | 'raw'
 * @returns Object with secure_url of the uploaded media
 */
export const uploadMedia = async (
  file: Express.Multer.File | string,
  folder = "uploads",
  resourceType: "image" | "video" | "raw" = "image"
): Promise<CloudinaryUploadResult> => {
  try {
    let result: UploadApiResponse;

    if (typeof file === "string" && file.startsWith("data:")) {
      // Handle base64 string
      result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: resourceType,
      });
    } else if (typeof file !== "string") {
      // Handle Multer file (in-memory buffer)
      result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: resourceType },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Upload failed"));
            } else {
              resolve(result);
            }
          }
        );
        stream.end(file.buffer);
      });
    } else {
      throw new Error("Invalid file input: must be a base64 string or file object");
    }

    logger.info({
      message: "Media uploaded to Cloudinary",
      publicId: result.public_id,
      folder,
      resourceType,
    });

    return { secure_url: result.secure_url };
  } catch (err) {
    logger.error({
      message: "Media upload failed",
      error: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw new Error("Media upload failed");
  }
};