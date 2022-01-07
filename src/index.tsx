import { StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'jotai';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { App } from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

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
      <App />
    </Suspense>
  );
}

ReactDOM.render(
  <StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <QueryClientProvider client={queryClient}>
          <Provider>
            <Router>
              <SuspensedApp />
            </Router>
          </Provider>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root'),
);
