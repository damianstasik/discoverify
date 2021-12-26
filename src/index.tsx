import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useAtom } from 'jotai';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LayoutSkeleton } from './components/LayoutSkeleton';
import { App } from './App';
import { tokenIdState } from './store';
// import { SnackbarProvider } from 'notistack';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    // mode: 'dark',
  },
});

function SuspensedApp() {
  const tokenId = useAtom(tokenIdState);

  return (
    <React.Suspense
      fallback={
        tokenId ? (
          <LayoutSkeleton>
            <p className="bp3-skeleton w-64">test</p>
            <p className="bp3-skeleton w-48 my-2">test</p>
            <p className="bp3-skeleton w-72">test</p>
          </LayoutSkeleton>
        ) : (
          <div>without token</div>
        )
      }
    >
      <App />
    </React.Suspense>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={darkTheme}>
      {/* <SnackbarProvider maxSnack={3}> */}
      <QueryClientProvider client={queryClient}>
        <Provider>
          <Router>
            <SuspensedApp />
          </Router>
        </Provider>
      </QueryClientProvider>
      {/* </SnackbarProvider> */}
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
