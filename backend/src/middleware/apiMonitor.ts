import { Request, Response, NextFunction } from 'express';
import { logInfo, logError } from '../utils/logger';

interface RequestMetrics {
  path: string;
  method: string;
  statusCode: number;
  duration: number;
  timestamp: Date;
}

class APIMonitor {
  private static instance: APIMonitor;
  private metrics: RequestMetrics[] = [];
  private readonly maxMetricsLength = 1000;

  private constructor() {}

  public static getInstance(): APIMonitor {
    if (!APIMonitor.instance) {
      APIMonitor.instance = new APIMonitor();
    }
    return APIMonitor.instance;
  }

  public addMetric(metric: RequestMetrics): void {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetricsLength) {
      this.metrics.shift();
    }
  }

  public getMetrics(): RequestMetrics[] {
    return this.metrics;
  }

  public getAverageResponseTime(path?: string): number {
    const relevantMetrics = path
      ? this.metrics.filter(m => m.path === path)
      : this.metrics;

    if (relevantMetrics.length === 0) return 0;

    const total = relevantMetrics.reduce((sum, metric) => sum + metric.duration, 0);
    return total / relevantMetrics.length;
  }

  public getErrorRate(path?: string): number {
    const relevantMetrics = path
      ? this.metrics.filter(m => m.path === path)
      : this.metrics;

    if (relevantMetrics.length === 0) return 0;

    const errorCount = relevantMetrics.filter(m => m.statusCode >= 400).length;
    return (errorCount / relevantMetrics.length) * 100;
  }
}

export const apiMonitor = APIMonitor.getInstance();

export const monitorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  const method = req.method;

  // Add response hook
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Add metric
    apiMonitor.addMetric({
      path,
      method,
      statusCode,
      duration,
      timestamp: new Date()
    });

    // Log request details
    const message = `${method} ${path} ${statusCode} ${duration}ms`;
    if (statusCode >= 400) {
      logError(message);
    } else {
      logInfo(message);
    }
  });

  next();
};

// Endpoint to get monitoring data
export const getMonitoringData = (req: Request, res: Response) => {
  const path = req.query.path as string | undefined;

  const data = {
    averageResponseTime: apiMonitor.getAverageResponseTime(path),
    errorRate: apiMonitor.getErrorRate(path),
    recentRequests: apiMonitor.getMetrics().slice(-100)
  };

  res.json(data);
}; 