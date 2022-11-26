/// <reference types="vite/client" />

import {
  Palette as OriginalPalette,
  PaletteOptions as OriginalPaletteOptions,
} from '@mui/material/styles';
import {
  MutationFunction,
  QueryFunction,
  QueryKey,
} from '@tanstack/react-query';
import { RouterOutput } from './trpc';

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MUI_LICENSE_KEY: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@mui/material/styles' {
  interface Palette {
    neutral: OriginalPalette['primary'];
    link: OriginalPalette['primary'];
  }
  interface PaletteOptions {
    neutral: OriginalPaletteOptions['primary'];
    link: OriginalPaletteOptions['primary'];
  }
}

declare global {
  type Output<Path extends string> =
    Path extends `${infer Router}.${infer Procedure}`
      ? Router extends keyof RouterOutput
        ? Procedure extends keyof RouterOutput[Router]
          ? RouterOutput[Router][Procedure]
          : never
        : never
      : never;

  type Query<
    Path extends string,
    Key extends QueryKey = QueryKey,
  > = QueryFunction<Output<Path>, Key>;

  type Mutation<Path extends string, Variables = unknown> = MutationFunction<
    Output<Path>,
    Variables
  >;
}
