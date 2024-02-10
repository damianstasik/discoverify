import {
  mdiAccountStar,
  mdiHeart,
  mdiHistory,
  mdiMusicNotePlus,
  mdiPlaylistMusic,
  mdiViewDashboard,
} from "@mdi/js";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { Link as RouterLink, useMatch } from "react-router-dom";
import { recommendIconPath } from "../icons/recommend";
import { trpc } from "../trpc";
import { tw } from "../tw";
import { Icon } from "./Icon";

function Heading({ children, className, separatorClassName }: any) {
  return (
    <div className={tw("flex items-center px-2", className)}>
      <span className="flex-shrink pr-3 font-semibold text-sm text-white">
        {children}
      </span>
      <div
        className={tw(
          "flex-grow h-px bg-gradient-to-r to-transparent",
          separatorClassName,
        )}
        aria-hidden="true"
      />
    </div>
  );
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const ListItemSkeleton = memo(() => {
  const width = getRandomArbitrary(20, 90);

  return (
    <p
      className="animate-pulse h-8 rounded-md bg-slate-800"
      role="status"
      style={{ width: `${width}%` }}
    />
  );
});

function RouterListItem({
  to,
  label,
  icon,
  className,
  iconTintColor,
  textTintColor,
  state,
}: any) {
  const match = useMatch(to);
  const isActive = match !== null;

  return (
    <RouterLink
      to={to}
      className={tw(
        isActive
          ? "bg-slate-800 text-white"
          : "text-slate-400 hover:bg-slate-700 hover:text-white",
        "group flex items-center h-8 px-2 text-sm rounded-md ",
        className,
        textTintColor,
      )}
      title={label}
      state={state}
    >
      {icon && (
        <Icon
          path={icon}
          className={tw(
            isActive
              ? "text-slate-300"
              : "text-slate-500 group-hover:text-slate-300",
            "mr-2 flex-shrink-0 h-5 w-5",
            iconTintColor,
          )}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{label}</span>
    </RouterLink>
  );
}

export const Sidebar = memo(({ className }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["sidebarPlaylists"],
    queryFn: async function playlistsQuery() {
      const playlists = await trpc.user.playlists.query();

      return playlists;
    },
  });

  return (
    <div className="p-3 h-full overflow-y-auto">
      <h5 className="text-white inline-flex text-lg/none font-black">
        Discoverify
      </h5>

      <nav className="space-y-1 mt-3">
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

      <Heading className="mt-6 mb-3" separatorClassName="from-yellow-900">
        Artists
      </Heading>

      <nav className="space-y-1">
        <RouterListItem
          label="My top artists"
          to="/top-artists"
          icon={mdiAccountStar}
          // iconTintColor="text-green-700"
          // textTintColor="text-green-400"
        />
        {/*
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
        */}
      </nav>

      <Heading className="mt-6 mb-3" separatorClassName="from-green-900">
        Tracks
      </Heading>

      <nav className="space-y-1">
        <RouterListItem label="Liked tracks" to="/liked" icon={mdiHeart} />

        <RouterListItem
          label="My top tracks"
          to="/top-tracks"
          icon={mdiMusicNotePlus}
        />

        <RouterListItem
          label="Recently played"
          to="/recently-played"
          icon={mdiHistory}
        />
        {/* 
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
        */}
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
      <Heading className="mt-6 mb-3" separatorClassName="from-blue-900">
        Playlists
      </Heading>

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
            state={playlist}
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
