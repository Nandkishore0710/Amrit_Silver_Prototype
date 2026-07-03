import express from 'express';
import { protect, artisanOrAdmin } from '../middleware/auth.js';
import { upload } from '../services/uploadService.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.post('/image', protect, artisanOrAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const result = await uploadToCloudinary(req.file.path, 'uploads');
    res.status(200).json({ success: true, data: { url: result.url, publicId: result.publicId } });
  } catch (error) {
    logger.error('Upload error:', error);
    next(error);
  }
});

router.post('/images', protect, artisanOrAdmin, upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files?.length) return res.status(400).json({ success: false, message: 'No files uploaded' });
    const results = await Promise.all(req.files.map(f => uploadToCloudinary(f.path, 'uploads')));
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    logger.error('Bulk upload error:', error);
    next(error);
  }
});

export default router;
