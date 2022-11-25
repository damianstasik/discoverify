import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from 'backend';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_TRPC_URL,
      headers() {
        try {
          const token = JSON.parse(localStorage.getItem('token') ?? 'null');

          if (!token) {
            throw new Error();
          }
          return {
            // TODO: properly pass auth headers, currently limited by TRPC
            Authorization: `Bearer ${token}`,
          };
        } catch {
          return {};
        }
      },
    }),
  ],
});

export type RouterOutput = inferRouterOutputs<AppRouter>;
