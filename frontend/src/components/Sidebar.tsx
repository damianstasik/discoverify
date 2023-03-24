import { useMatch, Link as RouterLink } from 'react-router-dom';
import { memo } from 'react';
import { mdiPlaylistMusic, mdiHeart, mdiViewDashboard } from '@mdi/js';
import { useQuery } from '@tanstack/react-query';
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
      <div className="flex-grow border-t border-slate-600" aria-hidden="true" />
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
      className="animate-pulse h-8 rounded-md bg-neutral-900"
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
          ? 'bg-slate-800 text-white'
          : 'text-slate-450 hover:bg-slate-700 hover:text-white',
        'group flex items-center h-8 px-2 text-sm rounded-md ',
      )}
      title={label}
    >
      {icon && (
        <Icon
          path={icon}
          className={twMerge(
            isActive
              ? 'text-slate-300'
              : 'text-slate-400 group-hover:text-slate-300',
            'mr-2 flex-shrink-0 h-5 w-5',
          )}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{label}</span>
    </RouterLink>
  );
}

export const Sidebar = memo(() => {
  const { data, isLoading } = useQuery(
    ['sidebarPlaylists'],
    async function playlistsQuery() {
      const playlists = await trpc.user.playlists.query();

      return playlists;
    },
  );

  return (
    <div className="w-80 p-3  flex-shrink-0">
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
        <RouterListItem
          label="Dashboard"
          to="/dashboard"
          icon={mdiViewDashboard}
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

      <Heading className="mt-3 mb-2">Tracks</Heading>

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
      <Heading className="mt-3 mb-2">Genres</Heading>

      <nav className="space-y-1">
        <RouterListItem
          label="From followed artists"
          to="/followed-artists/genres"
          icon={<Icon path={mdiTagText} size={1} />}
        />
      </nav>
*/}
      <Heading className="mt-3 mb-2">Playlists</Heading>

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
