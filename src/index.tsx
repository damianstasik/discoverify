import { StrictMode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { LicenseInfo } from '@mui/x-data-grid-premium';
import { Router } from './Router';
import './dark.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const muiLicenseKey = import.meta.env.VITE_MUI_LICENSE_KEY;

if (muiLicenseKey) {
  LicenseInfo.setLicenseKey(muiLicenseKey);
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    neutral: {
      main: '#d7ba1e',
      contrastText: '#fff',
    },
    background: {
      default: '#000000',
      paper: '#181818',
    },
    text: {
      primary: '#b3b3b3',
    },
    divider: 'rgba(255, 255, 255, 0.25)',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  shape: {
    borderRadius: 6,
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <BrowserRouter>
              <SuspensedApp />
            </BrowserRouter>
          </RecoilRoot>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>,
);
