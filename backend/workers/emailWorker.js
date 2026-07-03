import Queue from 'bull';
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

let emailQueue = null;

export const initEmailQueue = () => {
  if (!process.env.REDIS_URL) {
    logger.warn('Redis not configured, email queue disabled');
    return null;
  }
  try {
    emailQueue = new Queue('silverkaari:email', process.env.REDIS_URL, {
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 50
      }
    });

    emailQueue.process(10, async (job) => {
      const { to, subject, html, text } = job.data;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        tls: { rejectUnauthorized: false }
      });
      const info = await transporter.sendMail({
        from: `Silverkaari <${process.env.SMTP_USER}>`,
        to, subject, html, text
      });
      logger.info(`Email worker sent to ${to}: ${info.messageId}`);
      return info;
    });

    emailQueue.on('completed', (job) => {
      logger.debug(`Email job ${job.id} completed`);
    });

    emailQueue.on('failed', (job, err) => {
      logger.error(`Email job ${job.id} failed (attempt ${job.attemptsMade}): ${err.message}`);
    });

    emailQueue.on('stalled', (job) => {
      logger.warn(`Email job ${job.id} stalled`);
    });

    logger.info('Email queue initialized');
    return emailQueue;
  } catch (error) {
    logger.error('Failed to initialize email queue:', error.message);
    return null;
  }
};

export const getQueue = () => emailQueue;
