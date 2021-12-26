/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MUI_LICENSE_KEY: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
