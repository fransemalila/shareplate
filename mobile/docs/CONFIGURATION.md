# SharePlate Mobile App Configuration Guide

## Environment Configuration

### 1. Environment Files

The app uses different environment configurations:

```
mobile/
├── .env.development
├── .env.staging
└── .env.production
```

Required variables:
```bash
API_URL=https://api.shareplate.com
SENTRY_DSN=your-sentry-dsn
FIREBASE_CONFIG=your-firebase-config
ANALYTICS_KEY=your-analytics-key
```

### 2. Build Configuration

#### iOS Configuration

Location: `ios/SharePlate.xcodeproj/project.pbxproj`

Key settings:
- Bundle Identifier
- Development Team
- Provisioning Profile
- Capabilities
- Minimum iOS Version
- Device Orientation
- Supported Languages

#### Android Configuration

Location: `android/app/build.gradle`

Key settings:
- Application ID
- Version Code
- Version Name
- Minimum SDK Version
- Target SDK Version
- Signing Configuration
- ProGuard Rules

## Feature Configuration

### 1. App Features

Location: `src/config/features.ts`

```typescript
export const features = {
  socialAuth: true,
  pushNotifications: true,
  locationTracking: true,
  analytics: true,
  crashReporting: true,
  debugging: __DEV__,
};
```

### 2. API Configuration

Location: `src/config/api.ts`

```typescript
export const apiConfig = {
  timeout: 30000,
  retryAttempts: 3,
  cacheTime: 300000,
  endpoints: {
    auth: '/auth',
    users: '/users',
    listings: '/listings',
    orders: '/orders',
  },
};
```

## Security Configuration

### 1. SSL Pinning

Location: `src/config/security.ts`

```typescript
export const securityConfig = {
  sslPinning: {
    enabled: true,
    certs: ['cert1', 'cert2'],
  },
  jailbreakDetection: true,
  debugDetection: true,
};
```

### 2. Encryption

Location: `src/utils/encryption.ts`

```typescript
export const encryptionConfig = {
  algorithm: 'AES-256-GCM',
  keySize: 256,
  ivSize: 16,
};
```

## Analytics Configuration

### 1. Event Tracking

Location: `src/config/analytics.ts`

```typescript
export const analyticsConfig = {
  enabled: true,
  sampleRate: 100,
  events: {
    viewListing: true,
    createOrder: true,
    completeOrder: true,
    userLogin: true,
  },
};
```

### 2. Performance Monitoring

Location: `src/config/performance.ts`

```typescript
export const performanceConfig = {
  enabled: true,
  traces: {
    networkRequests: true,
    appStart: true,
    screenLoad: true,
  },
};
```

## Storage Configuration

### 1. Cache Settings

Location: `src/config/storage.ts`

```typescript
export const storageConfig = {
  cache: {
    maxSize: 50 * 1024 * 1024, // 50MB
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  persistence: {
    enabled: true,
    encryption: true,
  },
};
```

### 2. Image Storage

Location: `src/config/images.ts`

```typescript
export const imageConfig = {
  compression: {
    quality: 0.8,
    maxWidth: 1024,
    maxHeight: 1024,
  },
  cache: {
    enabled: true,
    maxSize: 100 * 1024 * 1024, // 100MB
  },
};
```

## Notification Configuration

### 1. Push Notifications

Location: `src/config/notifications.ts`

```typescript
export const notificationConfig = {
  enabled: true,
  channels: {
    orders: {
      id: 'orders',
      name: 'Orders',
      importance: 'high',
    },
    chat: {
      id: 'chat',
      name: 'Messages',
      importance: 'default',
    },
  },
};
```

### 2. In-App Notifications

Location: `src/config/inAppNotifications.ts`

```typescript
export const inAppNotificationConfig = {
  enabled: true,
  duration: 3000,
  position: 'top',
};
```

## Debugging Configuration

### 1. Development Tools

Location: `src/config/development.ts`

```typescript
export const developmentConfig = {
  debugMenu: __DEV__,
  networkLogging: __DEV__,
  performanceMonitoring: __DEV__,
  componentInspector: __DEV__,
};
```

### 2. Error Reporting

Location: `src/config/errorReporting.ts`

```typescript
export const errorConfig = {
  enabled: true,
  captureUnhandledErrors: true,
  breadcrumbs: true,
  console: true,
};
```

## Updating Configuration

1. Make changes to relevant configuration files
2. Update documentation if needed
3. Test in development environment
4. Deploy to staging for verification
5. Include in release notes if user-facing
6. Deploy to production

## Configuration Best Practices

1. Never commit sensitive values
2. Use environment variables for secrets
3. Document all configuration changes
4. Version control configuration files
5. Backup configuration regularly
6. Test configuration changes thoroughly
7. Monitor impact of configuration changes 