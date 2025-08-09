import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';
import { config } from 'dotenv';
import sanitize from 'sanitize-html';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
config();

// Configuration with defaults
const UPLOAD_CONFIG = {
  maxFileSize: Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  maxRetries: Number(process.env.UPLOAD_MAX_RETRIES) || 3,
  retryDelay: Number(process.env.UPLOAD_RETRY_DELAY) || 1000, // ms
  defaultFolder: process.env.UPLOAD_DEFAULT_FOLDER || 'Uploads',
  allowedFormats: {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    video: ['mp4', 'mov', 'avi', 'mkv'],
    raw: ['pdf', 'doc', 'docx', 'txt', 'mp3', 'wav']
  }
};

// Custom error classes
class UploadValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UploadValidationError';
  }
}

class UploadError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UploadError';
  }
}

/**
 * Validate file input and parameters
 * @param {Object|string} file - Multer file object or base64 string
 * @param {string} folder - Cloudinary folder name
 * @param {string} resourceType - 'image' | 'video' | 'raw'
 * @param {Object} [options] - Additional upload options
 */
const validateUpload = (file, folder, resourceType, options) => {
  // Validate resource type
  if (!['image', 'video', 'raw'].includes(resourceType)) {
    throw new UploadValidationError('Invalid resource type');
  }

  // Validate folder
  const sanitizedFolder = sanitize(folder, { allowedTags: [] });
  if (!sanitizedFolder || sanitizedFolder.length > 100) {
    throw new UploadValidationError('Invalid or too long folder name');
  }

  // Validate file
  if (!file) {
    throw new UploadValidationError('File is required');
  }

  // Validate file type and size for Multer file
  if (typeof file !== 'string') {
    if (!file.buffer || file.size > UPLOAD_CONFIG.maxFileSize) {
      throw new UploadValidationError(`File size exceeds ${UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB limit`);
    }

    const extension = file.originalname?.split('.').pop()?.toLowerCase();
    if (!extension || !UPLOAD_CONFIG.allowedFormats[resourceType].includes(extension)) {
      throw new UploadValidationError(`Invalid file format for ${resourceType}. Allowed: ${UPLOAD_CONFIG.allowedFormats[resourceType].join(', ')}`);
    }
  }

  // Validate base64 string
  if (typeof file === 'string' && !file.startsWith('data:')) {
    throw new UploadValidationError('Invalid base64 string');
  }

  return { sanitizedFolder, validatedOptions: options || {} };
};

/**
 * Upload media to Cloudinary with retry logic
 * @param {Object|string} file - Multer file object or base64 string
 * @param {string} [folder='Uploads'] - Cloudinary folder name
 * @param {string} [resourceType='image'] - Resource type ('image', 'video', 'raw')
 * @param {Object} [options] - Additional Cloudinary options
 * @param {string[]} [options.tags] - Tags for the uploaded media
 * @param {Object} [options.transformations] - Cloudinary transformation options
 * @param {string} [options.correlationId] - Correlation ID for tracking
 * @returns {Promise<{ secure_url: string, public_id: string }>} Upload result
 */
export const uploadMedia = async (file, folder = UPLOAD_CONFIG.defaultFolder, resourceType = 'image', options = {}) => {
  const { tags, transformations, correlationId = uuidv4() } = options;
  let retryCount = 0;

  // Validate inputs
  const { sanitizedFolder, validatedOptions } = validateUpload(file, folder, resourceType, options);

  // Configure upload options
  const uploadOptions = {
    folder: sanitizedFolder,
    resource_type: resourceType,
    tags,
    transformation: transformations,
    context: { correlationId }
  };

  // Log upload attempt
  logger.info('Starting media upload', {
    folder: sanitizedFolder,
    resourceType,
    correlationId,
    tags
  });

  while (retryCount <= UPLOAD_CONFIG.maxRetries) {
    try {
      let result;

      if (typeof file === 'string' && file.startsWith('data:')) {
        // Handle base64 string
        result = await cloudinary.uploader.upload(file, uploadOptions);
      } else {
        // Handle Multer file
        result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { ...uploadOptions },
            (error, result) => {
              if (error || !result) {
                reject(error || new Error('Upload failed'));
              } else {
                resolve(result);
              }
            }
          );
          stream.end(file.buffer);
        });
      }

      logger.info('Media uploaded successfully', {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        folder: sanitizedFolder,
        resourceType,
        correlationId
      });

      return {
        secure_url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      retryCount++;
      if (retryCount > UPLOAD_CONFIG.maxRetries) {
        logger.error('Media upload failed after retries', {
          error: error.message,
          stack: error.stack,
          folder: sanitizedFolder,
          resourceType,
          correlationId,
          retryCount
        });
        throw new UploadError('Media upload failed after maximum retries');
      }

      logger.warn('Retrying media upload', {
        error: error.message,
        folder: sanitizedFolder,
        resourceType,
        correlationId,
        retryCount
      });

      await new Promise(resolve => setTimeout(resolve, UPLOAD_CONFIG.retryDelay));
    }
  }
};

// Initialize Cloudinary configuration
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  logger.info('Cloudinary service initialized', {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME
  });
} catch (error) {
  logger.error('Failed to initialize Cloudinary', {
    error: error.message,
    stack: error.stack
  });
  throw new Error('Cloudinary configuration failed');
}