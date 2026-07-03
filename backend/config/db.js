import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      logger.info(`MongoDB connected: ${conn.connection.host} / ${conn.connection.name}`);
      return conn;
    } catch (error) {
      logger.error(`MongoDB connection attempt ${i + 1} failed: ${error.message}`);
      if (i < retries - 1) await new Promise(res => setTimeout(res, 5000));
    }
  }
  throw new Error('Failed to connect to MongoDB after multiple attempts');
};
