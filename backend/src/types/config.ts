export interface Config {
  env: 'development' | 'production' | 'test';
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  frontendUrl: string;

  redis: {
    host: string;
    port: number;
    password?: string;
  };

  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };

  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    s3Bucket: string;
  };

  stripe: {
    secretKey: string;
    webhookSecret: string;
  };

  cache: {
    ttl: number;
    checkPeriod: number;
  };

  rateLimit: {
    windowMs: number;
    max: number;
  };

  cors: {
    origin: string[];
    credentials: boolean;
    methods: string[];
  };

  security: {
    bcryptRounds: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordResetExpires: number;
    twoFactorExpires: number;
  };

  upload: {
    maxSize: number;
    allowedMimeTypes: string[];
  };

  monitoring: {
    sentry: {
      dsn: string;
      environment: string;
      tracesSampleRate: number;
    };
    newRelic: {
      licenseKey: string;
      appName: string;
    };
  };

  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    maxFiles: string;
    maxSize: string;
    dirname: string;
  };

  maintenance: {
    enabled: boolean;
    message: string;
    allowedIPs: string[];
  };
} 