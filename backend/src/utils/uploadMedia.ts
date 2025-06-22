import cloudinary from "../lib/cloudinary";

/**
 * Uploads media (image, video, raw) to Cloudinary.
 * 
 * @param file - base64-encoded file string
 * @param folder - Cloudinary folder name
 * @param resourceType - 'image' | 'video' | 'raw'
 * @returns secure URL of the uploaded media
 */
export const uploadMedia = async (
  file: string,
  folder = "uploads",
  resourceType: "image" | "video" | "raw" = "image"
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: resourceType,
    });

    return result.secure_url;
  } catch (err) {
    console.error("Media upload failed:", err);
    throw new Error("Media upload failed");
  }
};
