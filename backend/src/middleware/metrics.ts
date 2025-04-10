import promClient from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Create a Registry
const register = new promClient.Registry();

// Add default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotalCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const databaseOperationDuration = new promClient.Histogram({
  name: 'database_operation_duration_seconds',
  help: 'Duration of database operations in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1]
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestsTotalCounter);
register.registerMetric(databaseOperationDuration);
register.registerMetric(activeConnections);

// Middleware to record metrics
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  
  // Increment active connections
  activeConnections.inc();
  
  res.on('finish', () => {
    // Decrement active connections
    activeConnections.dec();
    
    // Calculate duration
    const duration = process.hrtime(start);
    const durationSeconds = duration[0] + duration[1] / 1e9;
    
    // Record metrics
    const route = req.route?.path || req.path;
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode.toString())
      .observe(durationSeconds);
    
    httpRequestsTotalCounter
      .labels(req.method, route, res.statusCode.toString())
      .inc();
  });
  
  next();
};

// Endpoint to expose metrics
export const getMetrics = async (_req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error instanceof Error ? error.message : 'Error collecting metrics');
  }
};

// Export for database operations timing
export const recordDBOperation = (operation: string, collection: string, duration: number) => {
  databaseOperationDuration.labels(operation, collection).observe(duration);
}; 