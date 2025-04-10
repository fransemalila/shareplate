export const productionConfig = {
  api: {
    baseUrl: 'https://api.shareplate.com/api',
    timeout: 15000,
  },
  analytics: {
    enabled: true,
    sampleRate: 0.1,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    enabled: true,
    tracesSampleRate: 0.2,
  },
  cache: {
    enabled: true,
    ttl: 3600, // 1 hour
  },
  performance: {
    monitoring: true,
    networkLogging: true,
    errorReporting: true,
  },
  security: {
    certificatePinning: true,
    jailbreakDetection: true,
    sslPinning: {
      enabled: true,
      certs: ['shareplate'] // Certificates to pin
    },
  },
  updates: {
    checkAutomatically: true,
    forceUpdate: {
      enabled: true,
      minVersion: '1.0.0',
    },
  },
  features: {
    offlineMode: true,
    pushNotifications: true,
    locationTracking: true,
    analytics: true,
  }
}; 