import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from 'backend';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_TRPC_URL,
      headers() {
        return {
          // TODO: properly pass auth headers, currently limited by TRPC
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem('token') ?? '',
          )}`,
        };
      },
    }),
  ],
});

export type RouterOutput = inferRouterOutputs<AppRouter>;
