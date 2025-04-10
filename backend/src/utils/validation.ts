import { Config } from '../types/config';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateConfig<T>(key: string, value: T | undefined | null): T {
  if (value === undefined || value === null) {
    throw new ValidationError(`Missing required configuration value: ${key}`);
  }
  return value;
}

export function validateConfigObject(config: Config): void {
  // Validate required string fields
  const requiredStringFields: (keyof Config)[] = [
    'mongoUri',
    'jwtSecret',
    'frontendUrl',
  ];

  requiredStringFields.forEach((field) => {
    if (!config[field]) {
      throw new ValidationError(`Missing required configuration field: ${field}`);
    }
  });

  // Validate required number fields
  if (typeof config.port !== 'number' || config.port <= 0) {
    throw new ValidationError('Invalid port number');
  }

  // Validate email configuration
  if (!config.email.host || !config.email.user || !config.email.password) {
    throw new ValidationError('Invalid email configuration');
  }

  // Validate AWS configuration
  if (!config.aws.accessKeyId || !config.aws.secretAccessKey || !config.aws.s3Bucket) {
    throw new ValidationError('Invalid AWS configuration');
  }

  // Validate Stripe configuration
  if (!config.stripe.secretKey || !config.stripe.webhookSecret) {
    throw new ValidationError('Invalid Stripe configuration');
  }

  // Validate security configuration
  if (config.security.bcryptRounds < 10) {
    throw new ValidationError('bcryptRounds must be at least 10');
  }

  // Validate rate limiting
  if (config.rateLimit.max <= 0) {
    throw new ValidationError('Rate limit max must be greater than 0');
  }

  // Validate monitoring configuration
  if (config.env === 'production') {
    if (!config.monitoring.sentry.dsn) {
      throw new ValidationError('Sentry DSN is required in production');
    }
    if (!config.monitoring.newRelic.licenseKey) {
      throw new ValidationError('New Relic license key is required in production');
    }
  }
} 