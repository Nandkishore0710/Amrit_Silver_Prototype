import cloudinary from 'cloudinary';
import { logger } from '../utils/logger.js';
import fs from 'fs';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadToCloudinary = async (filePath, folder = 'products') => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: `silverkaari/${folder}`,
      transformation: [
        { quality: 'auto:best', fetch_format: 'auto' },
        { width: 1200, height: 1200, crop: 'limit' }
      ],
      eager: [
        { width: 600, height: 600, crop: 'pad', background: 'white', quality: 'auto' },
        { width: 300, height: 300, crop: 'pad', background: 'white', quality: 'auto' }
      ],
      eager_async: false
    });

    // Clean up temp file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      thumbUrl: result.eager?.[0]?.secure_url,
      thumbSmUrl: result.eager?.[1]?.secure_url,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    };
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    logger.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.v2.uploader.destroy(publicId);
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new Error('Image deletion failed');
  }
};

export const uploadBufferToCloudinary = async (buffer, folder = 'products', mimetype = 'image/jpeg') => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: `silverkaari/${folder}`,
          transformation: [{ quality: 'auto:best', fetch_format: 'auto', width: 1200, height: 1200, crop: 'limit' }]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    logger.error('Cloudinary buffer upload error:', error);
    throw new Error('Image upload failed');
  }
};
