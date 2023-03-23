import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from 'backend';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_TRPC_URL,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});

export type RouterOutput = inferRouterOutputs<AppRouter>;
