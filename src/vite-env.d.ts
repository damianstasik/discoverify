/// <reference types="vite/client" />

import {
  Palette as OriginalPalette,
  PaletteOptions as OriginalPaletteOptions,
} from '@mui/material/styles';

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MUI_LICENSE_KEY: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color'];
    };
  }

  interface Palette {
    neutral: OriginalPalette['primary'];
  }
  interface PaletteOptions {
    neutral: OriginalPaletteOptions['primary'];
  }
}
