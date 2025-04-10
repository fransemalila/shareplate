import { Config } from './types';
import { validateConfig } from '../utils/validation';

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
] as const;

// Validate required environment variables
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const productionConfig: Config = {
  env: 'production' as const,
  port: validateConfig('PORT', parseInt(process.env.PORT || '8005', 10)),
  mongoUri: validateConfig('MONGODB_URI', process.env.MONGODB_URI),
  jwtSecret: validateConfig('JWT_SECRET', process.env.JWT_SECRET),
  jwtExpiresIn: '7d',
  frontendUrl: validateConfig('FRONTEND_URL', process.env.FRONTEND_URL || 'https://shareplate.com'),
  
  redis: {
    host: validateConfig('REDIS_HOST', process.env.REDIS_HOST || 'localhost'),
    port: validateConfig('REDIS_PORT', parseInt(process.env.REDIS_PORT || '6379', 10)),
    password: process.env.REDIS_PASSWORD,
  },
  
  email: {
    host: validateConfig('EMAIL_HOST', process.env.EMAIL_HOST),
    port: validateConfig('EMAIL_PORT', parseInt(process.env.EMAIL_PORT || '587', 10)),
    user: validateConfig('EMAIL_USER', process.env.EMAIL_USER),
    password: validateConfig('EMAIL_PASSWORD', process.env.EMAIL_PASSWORD),
    from: validateConfig('EMAIL_FROM', process.env.EMAIL_FROM || 'noreply@shareplate.com'),
  },
  
  aws: {
    accessKeyId: validateConfig('AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: validateConfig('AWS_SECRET_ACCESS_KEY', process.env.AWS_SECRET_ACCESS_KEY),
    region: validateConfig('AWS_REGION', process.env.AWS_REGION || 'us-east-1'),
    s3Bucket: validateConfig('AWS_S3_BUCKET', process.env.AWS_S3_BUCKET),
  },
  
  stripe: {
    secretKey: validateConfig('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY),
    webhookSecret: validateConfig('STRIPE_WEBHOOK_SECRET', process.env.STRIPE_WEBHOOK_SECRET),
  },
  
  cache: {
    ttl: 3600, // 1 hour
    checkPeriod: 600, // 10 minutes
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: validateConfig('RATE_LIMIT_MAX', parseInt(process.env.RATE_LIMIT_MAX || '100', 10)),
  },
  
  cors: {
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['https://shareplate.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  },
  
  security: {
    bcryptRounds: validateConfig('BCRYPT_ROUNDS', parseInt(process.env.BCRYPT_ROUNDS || '12', 10)),
    maxLoginAttempts: validateConfig('MAX_LOGIN_ATTEMPTS', parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10)),
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordResetExpires: 60 * 60 * 1000, // 1 hour
    twoFactorExpires: 10 * 60 * 1000, // 10 minutes
  },
  
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ],
  },
  
  monitoring: {
    sentry: {
      dsn: validateConfig('SENTRY_DSN', process.env.SENTRY_DSN),
      environment: 'production',
      tracesSampleRate: 0.1,
    },
    newRelic: {
      licenseKey: validateConfig('NEW_RELIC_LICENSE_KEY', process.env.NEW_RELIC_LICENSE_KEY),
      appName: 'SharePlate API',
    },
  },
  
  logging: {
    level: 'info' as const,
    maxFiles: '14d',
    maxSize: '20m',
    dirname: 'logs',
  },
  
  maintenance: {
    enabled: process.env.MAINTENANCE_MODE === 'true',
    message: process.env.MAINTENANCE_MESSAGE || 'System is under maintenance. Please try again later.',
    allowedIPs: process.env.MAINTENANCE_ALLOWED_IPS?.split(',') || [],
  },
} as const;

// Validate the entire config object
validateConfig('productionConfig', productionConfig);

export default productionConfig; 