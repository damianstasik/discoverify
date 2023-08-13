"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";
import { RecoilRoot } from "recoil";
import { EventBusProvider } from "../components/EventBus";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 30 * 60 * 1000,
    },
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <EventBusProvider>
        <SnackbarProvider maxSnack={3}>
          <RecoilRoot>{children}</RecoilRoot>
        </SnackbarProvider>
      </EventBusProvider>
    </QueryClientProvider>
  );
}
