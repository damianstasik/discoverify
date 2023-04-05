import { StrictMode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Router } from './Router';
import { EventBusProvider } from './components/EventBus';
import { CircularProgress } from './components/CircularProgress';
import './index.css';
import './posthog';

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

function Loader() {
  return (
    <div className="w-screen flex items-center justify-center">
      <CircularProgress />
    </div>
  );
}

function SuspensedApp() {
  return (
    <Suspense fallback={<Loader />}>
      <Router />
    </Suspense>
  );
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <EventBusProvider>
      <SnackbarProvider maxSnack={3}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <RecoilRoot>
            <BrowserRouter>
              <SuspensedApp />
            </BrowserRouter>
          </RecoilRoot>
        </QueryClientProvider>
      </SnackbarProvider>
    </EventBusProvider>
  </StrictMode>,
);
