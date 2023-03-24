import { startTransition, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  useRecoilState_TRANSITION_SUPPORT_UNSTABLE as useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Sidebar } from './Sidebar';
import { Player } from './Player';
import { savedTracksAtom, userAtom } from '../store';
import { getCurrentUser, refreshAccessToken } from '../api';
import { trpc } from '../trpc';
import { useSaveTrackHook } from '../hooks/useSaveTrackHook';

export function Layout() {
  const location = useLocation();
  const setUser = useSetRecoilState(userAtom);
  const setSavedTracks = useSetRecoilState(savedTracksAtom);

  useSaveTrackHook();

  useEffect(() => {
    const sub = trpc.user.onTrackSave.subscribe(undefined, {
      onData: (track) => {
        setSavedTracks((ids) => {
          if (ids.includes(track.id)) {
            return ids.filter((id) => id !== track.id);
          }

          return ids.concat(track.id);
        });
      },
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const { mutate } = useMutation(refreshAccessToken, {
    // onSuccess(freshToken) {
    //   startTransition(() => {
    //     setToken(freshToken);
    //   });
    // },
  });

  const { data: user } = useQuery({
    queryFn: getCurrentUser,
    queryKey: ['user'],
    suspense: true,
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
      mutate();
    },
  });

  if (!user) {
    return <Navigate to="/login" state={location} replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="grow relative bg-slate-900">
        <Outlet />
      </main>

      <div className="left-80 right-0 bottom-0 fixed">
        <Player />
      </div>
    </div>
  );
}
