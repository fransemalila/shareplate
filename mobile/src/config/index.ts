export const config = {
  api: {
    baseUrl: __DEV__ 
      ? 'http://localhost:8000/api'
      : 'https://api.shareplate.com/api',
    timeout: 15000,
  },
  app: {
    name: 'SharePlate',
    version: '1.0.0',
  },
  storage: {
    authKey: '@SharePlate:auth',
    settingsKey: '@SharePlate:settings',
  },
  defaultTheme: 'light',
  imagePickerOptions: {
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1280,
    maxHeight: 1280,
  },
  locationConfig: {
    defaultLatitudeDelta: 0.0922,
    defaultLongitudeDelta: 0.0421,
  }
}; 