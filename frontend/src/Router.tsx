import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
// import { useRecoilValue } from 'recoil';
import { Login } from './routes/Login';
import { Authorize } from './routes/Authorize';
// import { Artists } from './routes/Artists';
import { Artist } from './routes/Artist';
// import { FollowedArtistsTopTracks } from './routes/FollowedArtistsTopTracks';
// import { FollowedArtistsGenres } from './routes/FollowedArtistsGenres';
// import { userState } from './store';
import { Liked } from './routes/Liked';
import { Recommendations } from './routes/Recommendations';
import { RelatedArtistsTopTracks } from './routes/RelatedArtistsTopTracks';
import { TopTracks } from './routes/TopTracks';
import { Playlists } from './routes/Playlists';
// import { RecentlyPlayed } from './routes/RecentlyPlayed';
import { Playlist } from './routes/Playlist';
import { Layout } from './components/Layout';
import { CircularProgress } from './components/CircularProgress';
import { ArtistTopTracks } from './routes/ArtistTopTracks';
import { ArtistAlbums } from './routes/ArtistAlbums';

import Dashboard from './routes/Dashboard';
import { TopArtists } from './routes/TopArtists';
// import { Test } from './routes/Test';
// import { Track } from './routes/Track';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/recommendations" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'liked',
        element: <Liked />,
      },
      {
        path: 'recommendations',
        element: <Recommendations />,
      },
      {
        path: 'playlists',
        element: <Playlists />,
      },
      {
        path: 'playlist/:id',
        element: <Playlist />,
      },
      // {
      //   path: 'artists',
      //   element: <Artists />,
      // },
      {
        path: 'top-tracks',
        element: <TopTracks />,
      },
      {
        path: 'top-artists',
        element: <TopArtists />,
      },
      // {
      //   path: 'recently-played',
      //   element: <RecentlyPlayed />,
      // },
      // {
      //   path: 'followed-artists/top-tracks',
      //   element: <FollowedArtistsTopTracks />,
      // },
      // {
      //   path: 'related-artists/top-tracks',
      //   element: <RelatedArtistsTopTracks />,
      // },
      // {
      //   path: 'followed-artists/genres',
      //   element: <FollowedArtistsGenres />,
      // },
      // {
      //   path: 'track/:id',
      //   element: <Track />,
      // },
      {
        path: 'artist/:id',
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Artist />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <ArtistTopTracks />,
          },
          {
            path: 'albums',
            element: <ArtistAlbums />,
          },
          {
            path: 'related-artists-top-tracks',
            element: <RelatedArtistsTopTracks />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/authorize',
    element: <Authorize />,
  },
];

export function Router() {
  const element = useRoutes(routes);

  return element;
}
