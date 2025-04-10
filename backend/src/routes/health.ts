import { Router } from 'express';
import mongoose from 'mongoose';
import { Redis } from 'ioredis';
import os from 'os';

const router = Router();
const redis = new Redis();

interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: {
    status: 'ok' | 'error';
    responseTime?: number;
  };
  cache: {
    status: 'ok' | 'error';
    responseTime?: number;
  };
  system: {
    memory: {
      total: number;
      free: number;
      used: number;
      usage: number;
    };
    cpu: {
      loadAvg: number[];
      cores: number;
    };
  };
}

router.get('/health', async (req, res) => {
  const startTime = Date.now();
  const health: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: 'ok'
    },
    cache: {
      status: 'ok'
    },
    system: {
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        usage: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100
      },
      cpu: {
        loadAvg: os.loadavg(),
        cores: os.cpus().length
      }
    }
  };

  // Check MongoDB connection
  try {
    const dbStartTime = Date.now();
    await mongoose.connection.db.admin().ping();
    health.database.responseTime = Date.now() - dbStartTime;
  } catch (error) {
    health.status = 'error';
    health.database.status = 'error';
  }

  // Check Redis connection
  try {
    const cacheStartTime = Date.now();
    await redis.ping();
    health.cache.responseTime = Date.now() - cacheStartTime;
  } catch (error) {
    health.status = 'error';
    health.cache.status = 'error';
  }

  const responseTime = Date.now() - startTime;
  res.set('X-Response-Time', `${responseTime}ms`);
  
  if (health.status === 'ok') {
    res.json(health);
  } else {
    res.status(503).json(health);
  }
});

// Detailed health check for internal monitoring
router.get('/health/details', async (req, res) => {
  const details = {
    ...await getHealthStatus(),
    versions: {
      node: process.version,
      dependencies: process.versions
    },
    env: process.env.NODE_ENV,
    pid: process.pid,
    memory: process.memoryUsage(),
    resourceUsage: process.resourceUsage(),
    mongoConnections: mongoose.connection.states,
    redisInfo: await redis.info()
  };

  res.json(details);
});

async function getHealthStatus() {
  const status = {
    status: 'ok' as const,
    services: {
      database: await checkDatabase(),
      cache: await checkCache(),
      disk: checkDiskSpace(),
      memory: checkMemory()
    }
  };

  if (Object.values(status.services).some(service => service.status === 'error')) {
    status.status = 'error' as const;
  }

  return status;
}

async function checkDatabase() {
  try {
    const startTime = Date.now();
    await mongoose.connection.db.admin().ping();
    return {
      status: 'ok' as const,
      responseTime: Date.now() - startTime,
      connections: mongoose.connection.states
    };
  } catch (error) {
    return {
      status: 'error' as const,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkCache() {
  try {
    const startTime = Date.now();
    await redis.ping();
    return {
      status: 'ok' as const,
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      status: 'error' as const,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function checkDiskSpace() {
  const disk = os.freemem();
  const total = os.totalmem();
  const used = total - disk;
  const usagePercent = (used / total) * 100;

  return {
    status: usagePercent > 90 ? 'error' as const : 'ok' as const,
    free: disk,
    total,
    used,
    usagePercent
  };
}

function checkMemory() {
  const used = process.memoryUsage();
  return {
    status: used.heapUsed / used.heapTotal > 0.9 ? 'error' as const : 'ok' as const,
    ...used
  };
}

export default router; 