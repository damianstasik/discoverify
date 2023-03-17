import 'react-h5-audio-player/lib/styles.css';
import { startTransition } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  useRecoilState_TRANSITION_SUPPORT_UNSTABLE as useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Sidebar } from './Sidebar';
import { Player } from './Player';
import { queueVisibilityAtom, tokenState, userAtom } from '../store';
import { getCurrentUser, refreshAccessToken } from '../api';
import { Drawer, List, ListItem } from '@mui/material';

const drawerWidth = 300;

export function Layout() {
  const location = useLocation();
  const setUser = useSetRecoilState(userAtom);
  const [token, setToken] = useRecoilState(tokenState);
  const [isQueueOpen, setIsQueueOpen] = useRecoilState(queueVisibilityAtom);

  const { data: queue } = useQuery(
    ['queue', token],
    async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/player/queue`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const body = await res.json();
      return body;
    },
    {
      enabled: !!token && isQueueOpen,
    },
  );

  const { mutate } = useMutation(refreshAccessToken, {
    onSuccess(freshToken) {
      startTransition(() => {
        setToken(freshToken);
      });
    },
  });

  const { data: user } = useQuery({
    queryFn: getCurrentUser,
    queryKey: ['user'],
    suspense: true,
    enabled: !!token,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    refetchInterval: 60 * 60 * 1000,
    useErrorBoundary: false,
    onSuccess(data) {
      setUser(data);
    },
    onError() {
      // check error type, if token is expired run the mutation and update token that will rerun this query
      // need to do this with startTransition to avoid triggering suspense
      mutate(token);
    },
  });

  console.log('user', user);

  if (!user) {
    return <Navigate to="/login" state={location} replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          py: 2,
          position: 'relative',
          backgroundColor: '#161616',
          // backgroundImage: 'linear-gradient(160deg, #2b2b2b 0%, #161616 30%)',
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
      <Drawer
        anchor="bottom"
        open={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        sx={{ p: 8 }}
      >
        <List>
          {(queue || []).map((track, index) => (
            <ListItem key={track.id}>
              {index + 1}. {track.name}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
