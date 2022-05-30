import { StrictMode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'jotai';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { LicenseInfo } from '@mui/x-data-grid-premium';
import { Router } from './Router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

const muiLicenseKey = import.meta.env.VITE_MUI_LICENSE_KEY;

if (muiLicenseKey) {
  LicenseInfo.setLicenseKey(muiLicenseKey);
}

const theme = createTheme({
  palette: {
    // mode: 'dark',
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

function SuspensedApp() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <Router />
    </Suspense>
  );
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <QueryClientProvider client={queryClient}>
          <Provider>
            <BrowserRouter>
              <SuspensedApp />
            </BrowserRouter>
          </Provider>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>,
);
