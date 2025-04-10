import { Platform, NativeModules } from 'react-native';
import JailMonkey from 'jail-monkey';
import SSLPinning from 'react-native-ssl-pinning';
import { productionConfig } from '../config/production';

class Security {
  private static instance: Security;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): Security {
    if (!Security.instance) {
      Security.instance = new Security();
    }
    return Security.instance;
  }

  public initialize(): void {
    if (this.initialized) return;
    this.initialized = true;
  }

  public isDeviceSecure(): boolean {
    if (!productionConfig.security.jailbreakDetection) return true;
    return !JailMonkey.isJailBroken();
  }

  public isDebuggerAttached(): boolean {
    return __DEV__ || JailMonkey.isDebuggedMode();
  }

  public isOnEmulator(): boolean {
    if (Platform.OS === 'android') {
      return Boolean(NativeModules.DetectEmulator?.isEmulator) || false;
    }
    // iOS emulator detection
    return Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV && Platform.constants?.uiMode === 'simulator';
  }

  public async validateSSLPinning(url: string): Promise<boolean> {
    if (!productionConfig.security.sslPinning.enabled) return true;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // @ts-ignore - SSL pinning options are added by the native module
        sslPinning: {
          certs: productionConfig.security.sslPinning.certs
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  public getSecurityStatus(): {
    isSecure: boolean;
    isEmulator: boolean;
    isDebugger: boolean;
    sslPinningEnabled: boolean;
  } {
    return {
      isSecure: this.isDeviceSecure(),
      isEmulator: this.isOnEmulator(),
      isDebugger: this.isDebuggerAttached(),
      sslPinningEnabled: productionConfig.security.sslPinning.enabled,
    };
  }

  public shouldBlockExecution(): boolean {
    // Block execution in production if device is not secure
    if (!__DEV__) {
      if (!this.isDeviceSecure()) return true;
      if (this.isDebuggerAttached()) return true;
      if (Platform.OS === 'ios' && this.isOnEmulator()) return true;
    }
    return false;
  }
}

export const securityService = Security.getInstance(); 