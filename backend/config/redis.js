import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

let redisClient = null;

export const connectRedis = async () => {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
      lazyConnect: false
    });
    await new Promise((resolve, reject) => {
      redisClient.once('ready', resolve);
      redisClient.once('error', reject);
      setTimeout(reject, 5000);
    });
    redisClient.on('error', (err) => logger.warn('Redis error:', err.message));
    redisClient.on('reconnecting', () => logger.info('Redis reconnecting...'));
    return redisClient;
  } catch (error) {
    logger.error('Redis initialization failed:', error.message);
    redisClient = null;
    return null;
  }
};

export const getRedis = () => redisClient;

export const cacheGet = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key, value, ttl = 3600) => {
  if (!redisClient) return;
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  } catch {
    // silent
  }
};

export const cacheDel = async (...keys) => {
  if (!redisClient) return;
  try {
    await redisClient.del(...keys);
  } catch {
    // silent
  }
};
