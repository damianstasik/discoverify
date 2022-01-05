import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAtomValue } from 'jotai/utils';
import CircularProgress from '@mui/material/CircularProgress';
import { Login } from './routes/Login';
import { Authorize } from './routes/Authorize';
import { Artists } from './routes/Artists';
import { Artist } from './routes/Artist';
import { FollowedArtistsTopTracks } from './routes/FollowedArtistsTopTracks';
import { FollowedArtistsGenres } from './routes/FollowedArtistsGenres';
import { userAtom } from './store';
import { Liked } from './routes/Liked';
import { Recommendations } from './routes/Recommendations';
import { RelatedArtistsTopTracks } from './routes/RelatedArtistsTopTracks';
import { TopTracks } from './routes/TopTracks';
import { Playlists } from './routes/Playlists';
import { RecentlyPlayed } from './routes/RecentlyPlayed';

const Dashboard = lazy(() => import('./routes/Dashboard'));

export function Router() {
  const user = useAtomValue(userAtom);

  let routes: RouteObject[] = [];

  if (user) {
    routes = [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/liked',
        element: <Liked />,
      },
      {
        path: '/recommendations',
        element: <Recommendations />,
      },
      {
        path: '/playlists',
        element: <Playlists />,
      },
      {
        path: '/artists',
        element: <Artists />,
      },
      {
        path: '/top-tracks',
        element: <TopTracks />,
      },
      {
        path: '/recently-played',
        element: <RecentlyPlayed />,
      },
      {
        path: '/followed-artists/top-tracks',
        element: <FollowedArtistsTopTracks />,
      },
      {
        path: '/related-artists/top-tracks/:id',
        element: <RelatedArtistsTopTracks />,
      },
      {
        path: '/related-artists/top-tracks',
        element: <RelatedArtistsTopTracks />,
      },
      {
        path: '/followed-artists/genres',
        element: <FollowedArtistsGenres />,
      },
      {
        path: '/artist/:id',
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Artist />
          </Suspense>
        ),
      },
      {
        path: '/login',
        element: <Navigate to="/" replace />,
      },
      {
        path: '/login',
        element: <Navigate to="/" replace />,
      },
    ];
  } else {
    routes = [
      {
        path: '/',
        element: <Navigate to="/login" replace />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/authorize',
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Authorize />
          </Suspense>
        ),
      },
    ];
  }

  const element = useRoutes(routes);

  return element;
}
