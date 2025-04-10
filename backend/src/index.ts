import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import foodListingsRouter from './routes/foodListings';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import { requestLogger } from './utils/logger';
import { monitorMiddleware } from './middleware/apiMonitor';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(monitorMiddleware);

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Enhanced MongoDB connection with retry logic
const connectDB = async (retries = 5) => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shareplate';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('📦 MongoDB Connected');
  } catch (err) {
    if (retries > 0) {
      console.log(`MongoDB connection failed. Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    }
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Dynamic port selection with retry logic
const findAvailablePort = async (startPort: number, maxAttempts = 10): Promise<number> => {
  for (let port = startPort; port < startPort + maxAttempts; port++) {
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
          server.close();
          resolve(port);
        }).once('error', reject);
      });
      return port;
    } catch (err) {
      console.log(`Port ${port} is busy, trying ${port + 1}`);
    }
  }
  throw new Error('No available ports found');
};

// Initialize server
const startServer = async () => {
  try {
    await connectDB();
    const port = await findAvailablePort(Number(process.env.PORT) || 8000);
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// API routes
app.get('/', (_req, res) => {
  res.json({ message: 'SharePlate API is running!' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/food-listings', foodListingsRouter);

// Monitoring endpoint (protected, admin only)
app.get('/api/monitor', (req, res) => {
  // TODO: Add admin authentication middleware
  const { getMonitoringData } = require('./middleware/apiMonitor');
  getMonitoringData(req, res);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

startServer(); 