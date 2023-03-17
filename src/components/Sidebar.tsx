import { useMatch, Link as RouterLink } from 'react-router-dom';
import { memo } from 'react';
import {
  mdiAccountHeart,
  mdiAccountMultipleOutline,
  mdiTagText,
  mdiAccountMusic,
  mdiAccountMusicOutline,
  mdiAccountStar,
  mdiMusicNotePlus,
  mdiPlaylistMusic,
  mdiHeart,
  mdiHistory,
} from '@mdi/js';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { tokenState } from '../store';
import { Navbar } from './Navbar';
import { trpc } from '../trpc';
import { recommendIconPath } from '../icons/recommend';
import { Icon } from './Icon';
import { twMerge } from 'tailwind-merge';

function Heading({ children, className }: any) {
  return (
    <div className={twMerge('flex items-center px-2', className)}>
      <span className="flex-shrink pr-3 font-semibold text-sm text-white">
        {children}
      </span>
      <div className="flex-grow border-t border-gray-700" aria-hidden="true" />
    </div>
  );
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function ListItemSkeleton() {
  const width = getRandomArbitrary(20, 90);

  return (
    <p
      className="animate-pulse h-8 rounded-md bg-gray-700"
      role="status"
      style={{ width: `${width}%` }}
    />
  );
}

function RouterListItem({ to, label, icon }: any) {
  const match = useMatch(to);
  const isActive = match !== null;

  return (
    <RouterLink
      to={to}
      className={twMerge(
        isActive
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        'group flex items-center h-8 px-2 text-sm font-medium rounded-md',
      )}
    >
      {icon && (
        <Icon
          path={icon}
          className={twMerge(
            isActive
              ? 'text-gray-300'
              : 'text-gray-400 group-hover:text-gray-300',
            'mr-2 flex-shrink-0 h-5 w-5',
          )}
          aria-hidden="true"
        />
      )}
      {label}
    </RouterLink>
  );
}

export const Sidebar = memo(() => {
  const token = useRecoilValue(tokenState);

  const { data, isLoading } = useQuery(
    ['playlists'],
    async function playlistsQuery() {
      const playlists = await trpc.user.playlists.query();

      return playlists;
    },
  );

  return (
    <div className="w-80 p-3 bg-black flex-shrink-0">
      <Navbar />

      <nav className="space-y-1 mt-3">
        {/* <RouterListItem
          label="Dashboard"
          to="/dashboard"
          icon={<DashboardTwoTone />}
        /> */}

        <RouterListItem
          label="Recommendations"
          to="/recommendations"
          icon={recommendIconPath}
        />
      </nav>

      {/* <Heading sx={{ mt: 3, mb: 2 }}>Artists</Heading>

      <nav className="space-y-1">
        <RouterListItem
          label="My top artists"
          to="/top-artists"
          icon={<Icon path={mdiAccountStar} size={1} />}
        />

        <RouterListItem
          label="From liked tracks"
          to="/artists"
          icon={<Icon path={mdiAccountHeart} size={1} />}
        />

        <RouterListItem
          label="Similar artists"
          to="/similar"
          icon={<Icon path={mdiAccountMultipleOutline} size={1} />}
        />
      </nav> */}

      <Heading className="mt-3 mb-1">Tracks</Heading>

      <nav className="space-y-1">
        <RouterListItem label="Liked tracks" to="/liked" icon={mdiHeart} />
        {/* 
        <RouterListItem
          label="My top tracks"
          to="/top-tracks"
          icon={<Icon path={mdiMusicNotePlus} size={1} />}
        />

        <RouterListItem
          label="Top from followed artists"
          to="/followed-artists/top-tracks"
          icon={<Icon path={mdiAccountMusic} size={1} />}
        />

        <RouterListItem
          label="Top from related artists"
          to="/related-artists/top-tracks"
          icon={<Icon path={mdiAccountMusicOutline} size={1} />}
        />

        <RouterListItem
          label="Recently played"
          to="/recently-played"
          icon={<Icon path={mdiHistory} size={1} />}
        /> */}
      </nav>
      {/* 
      <Heading className="mt-3 mb-1">Genres</Heading>

      <nav className="space-y-1">
        <RouterListItem
          label="From followed artists"
          to="/followed-artists/genres"
          icon={<Icon path={mdiTagText} size={1} />}
        />
      </nav>
*/}
      <Heading className="mt-3 mb-1">Playlists</Heading>

      <nav className="space-y-1">
        {isLoading && (
          <>
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
          </>
        )}
        {(data?.playlists || []).map((playlist) => (
          <RouterListItem
            key={playlist.id}
            label={playlist.name}
            to={`/playlist/${playlist.id}`}
          />
        ))}

        <RouterListItem
          label="All playlists"
          to="/playlists"
          icon={mdiPlaylistMusic}
        />
      </nav>

      {/*

      <nav className="space-y-1 mt-auto">
        <ListItem button>
          <ListItemAvatar>
            <Avatar src={user.photoUrl!} style={{ marginRight: '8px' }} />
          </ListItemAvatar>

          <ListItemText primary={user.displayName} secondary="My account" />
        </ListItem>
      </nav> */}
    </div>
  );
});
