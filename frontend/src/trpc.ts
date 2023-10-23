import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "backend";

const wsClient = createWSClient({
  url: import.meta.env.VITE_WS_URL,
});

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: import.meta.env.VITE_API_URL,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
      }),
    }),
  ],
});

export type RouterOutput = inferRouterOutputs<AppRouter>;
