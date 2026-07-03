import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import passport from 'passport';

// Config
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import './config/passport.js';
import { logger } from './utils/logger.js';
import { seedDatabase } from './utils/seeder.js';
import { initEmailQueue } from './workers/emailWorker.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const httpServer = createServer(app);

// ─── Socket.io ───────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true
  }
});
app.set('io', io);

io.on('connection', (socket) => {
  logger.info(`[SilverIne] Socket connected: ${socket.id}`);
  socket.on('join-admin', () => socket.join('admin-room'));
  socket.on('disconnect', () => logger.debug(`[SilverIne] Socket disconnected: ${socket.id}`));
});

// ─── Stripe webhook (raw body first) ────────────────────────────────
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// ─── Middleware ──────────────────────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(passport.initialize());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: (msg) => logger.http(msg.trim()) } }));
}

// ─── Health check ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    brand: 'SilverIne',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ─── Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

// ─── Bootstrap ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
const start = async () => {
  await connectDB();
  await connectRedis();
  initEmailQueue();
  if (process.env.NODE_ENV !== 'production') await seedDatabase();

  httpServer.listen(PORT, () => {
    logger.info(`🪙 SilverIne Backend running on port ${PORT}`);
  });
};

if (process.env.NODE_ENV !== 'test') start().catch(logger.error);
export default app;
