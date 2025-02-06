/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: string;
  readonly VITE_ENV: string;
  readonly VITE_GENERATE_SOURCEMAP: string;
  readonly VITE_VERSION_NUMBER: string;
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
