import 'react-h5-audio-player/lib/styles.css';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Sidebar } from './Sidebar';
import { Player } from './Player';
import { tokenState, userAtom } from '../store';
import { refreshAccessToken } from '../api';

const drawerWidth = 300;

export function Layout() {
  const location = useLocation();
  const token = useRecoilValue(tokenState);
  const setUser = useSetRecoilState(userAtom);
  const setToken = useSetRecoilState(tokenState);

  const { mutate } = useMutation(refreshAccessToken, {
    onSuccess(freshToken) {
      setToken(freshToken);
    },
  });

  const { data: user } = useQuery(
    ['user', token],
    async () => {
      const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!req.ok) {
        throw new Error();
      }

      return req.json();
    },
    {
      suspense: true,
      enabled: !!token,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      refetchIntervalInBackground: true,
      refetchInterval: 60 * 60 * 1000,
      onSuccess(data) {
        setUser(data);
      },
      onError() {
        // check error type, if token is expired run the mutation and update token that will rerun this query
        // need to do this with keepExistingData to avoid triggering suspense
        mutate();
      },
    },
  );

  if (!user) {
    return <Navigate to="/login" state={location} replace />;
  }

  console.log('u', user);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          position: 'relative',
          backgroundColor: '#161616',
          backgroundImage: 'linear-gradient(160deg, #2b2b2b 0%, #161616 30%)',
        }}
      >
        <Outlet />
      </Box>

      <AppBar
        position="fixed"
        style={{
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          top: 'auto',
          bottom: 0,
        }}
      >
        <Player />
      </AppBar>
    </div>
  );
}
