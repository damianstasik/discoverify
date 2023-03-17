/// <reference types="vite/client" />

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
