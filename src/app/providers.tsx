"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SnackbarProvider } from "notistack";
import { RecoilRoot } from "recoil";
import { EventBusProvider } from "../components/EventBus";

const queryClient = new QueryClient();

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
