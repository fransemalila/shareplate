/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_ENVIRONMENT: 'development' | 'production';
  readonly VITE_MAPBOX_ACCESS_TOKEN: string;
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 