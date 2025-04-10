import * as Sentry from '@sentry/react-native';
import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';
import { productionConfig } from '../config/production';

class Analytics {
  private static instance: Analytics;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  public initialize(): void {
    if (this.initialized) return;

    // Initialize Sentry
    if (productionConfig.sentry.enabled) {
      Sentry.init({
        dsn: productionConfig.sentry.dsn,
        debug: __DEV__,
        enableAutoSessionTracking: true,
        sessionTrackingIntervalMillis: 30000,
        tracesSampleRate: productionConfig.sentry.tracesSampleRate,
        enabled: !__DEV__,
        attachStacktrace: true,
        environment: __DEV__ ? 'development' : 'production',
      });
    }

    this.initialized = true;
  }

  public logEvent(eventName: string, params?: Record<string, any>): void {
    if (!productionConfig.analytics.enabled) return;

    analytics().logEvent(eventName, params);
  }

  public setUserProperties(properties: Record<string, any>): void {
    if (!productionConfig.analytics.enabled) return;

    Object.entries(properties).forEach(([key, value]) => {
      analytics().setUserProperty(key, value);
    });
  }

  public logError(error: Error, context?: Record<string, any>): void {
    if (!productionConfig.sentry.enabled) return;

    Sentry.captureException(error, {
      extra: context,
    });
  }

  public startPerformanceTracking(name: string): string {
    if (!productionConfig.performance.monitoring) return '';

    const transaction = Sentry.startTransaction({
      name,
      op: 'navigation',
    });

    return transaction.traceId;
  }

  public stopPerformanceTracking(traceId: string): void {
    if (!productionConfig.performance.monitoring) return;

    const transaction = Sentry.getCurrentHub()
      .getScope()
      ?.getTransaction();

    if (transaction?.traceId === traceId) {
      transaction.finish();
    }
  }

  public setUser(user: { id: string; email?: string; username?: string }): void {
    if (productionConfig.analytics.enabled) {
      analytics().setUserId(user.id);
    }

    if (productionConfig.sentry.enabled) {
      Sentry.setUser(user);
    }
  }

  public clearUser(): void {
    if (productionConfig.analytics.enabled) {
      analytics().setUserId(null);
    }

    if (productionConfig.sentry.enabled) {
      Sentry.setUser(null);
    }
  }

  public logScreen(screenName: string, screenClass?: string): void {
    if (!productionConfig.analytics.enabled) return;

    analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });
  }

  public logNetworkRequest(details: {
    url: string;
    method: string;
    status: number;
    duration: number;
  }): void {
    if (!productionConfig.performance.networkLogging) return;

    Sentry.addBreadcrumb({
      category: 'network',
      type: 'http',
      level: details.status >= 400 ? 'error' : 'info',
      data: {
        url: details.url,
        method: details.method,
        status_code: details.status,
        duration_ms: details.duration,
      },
    });
  }
}

export const analyticsService = Analytics.getInstance(); 