import { startTransition } from 'react';
import Box from '@mui/material/Box';
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
import { trpc } from '../trpc';

export function Layout() {
  const location = useLocation();
  const setUser = useSetRecoilState(userAtom);
  const [token, setToken] = useRecoilState(tokenState);
  const [isQueueOpen, setIsQueueOpen] = useRecoilState(queueVisibilityAtom);

  const { data: queue } = useQuery(
    ['queue', token],
    async ({ signal }) => {
      const queue = await trpc.player.queue.query(undefined, { signal });
      return queue;
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

      <div className="left-80 right-0 bottom-0 fixed">
        <Player />
      </div>

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
