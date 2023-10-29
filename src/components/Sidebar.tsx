import mdiAccountStar from "@slimr/mdi-paths/AccountStar";
import mdiHeart from "@slimr/mdi-paths/Heart";
import mdiHistory from "@slimr/mdi-paths/History";
import mdiMusicNotePlus from "@slimr/mdi-paths/MusicNotePlus";
import mdiPlaylistMusic from "@slimr/mdi-paths/PlaylistMusic";
import mdiViewDashboard from "@slimr/mdi-paths/ViewDashboard";
import { Suspense } from "react";
import { recommendIconPath } from "../icons/recommend";
import { SidebarHeading } from "./SidebarHeading";
import { SidebarLink } from "./SidebarLink";
import { SidebarLinkSkeleton } from "./SidebarLinkSkeleton";
import { SidebarPlaylists } from "./SidebarPlaylists";

export function Sidebar() {
  return (
    <div className="p-3 h-full overflow-y-auto">
      <h5 className="text-white inline-flex text-lg/none font-black">
        Discoverify
      </h5>

      <nav className="space-y-1 mt-3">
        <SidebarLink
          label="Recommendations"
          to="/recommendations"
          icon={recommendIconPath}
        />
        <SidebarLink
          label="Dashboard"
          to="/dashboard"
          icon={mdiViewDashboard}
        />
      </nav>

      <SidebarHeading
        className="mt-6 mb-3"
        separatorClassName="from-yellow-900"
      >
        Artists
      </SidebarHeading>

      <nav className="space-y-1">
        <SidebarLink
          label="My top artists"
          to="/top-artists"
          icon={mdiAccountStar}
          // iconTintColor="text-green-700"
          // textTintColor="text-green-400"
        />
        {/*
        <SidebarLink
          label="From liked tracks"
          to="/artists"
          icon={<Icon path={mdiAccountHeart} size={1} />}
        />

        <SidebarLink
          label="Similar artists"
          to="/similar"
          icon={<Icon path={mdiAccountMultipleOutline} size={1} />}
        />
  */}
      </nav>

      <SidebarHeading className="mt-6 mb-3" separatorClassName="from-green-900">
        Tracks
      </SidebarHeading>

      <nav className="space-y-1">
        <SidebarLink label="Liked tracks" to="/liked" icon={mdiHeart} />

        <SidebarLink
          label="My top tracks"
          to="/top-tracks"
          icon={mdiMusicNotePlus}
        />

        <SidebarLink
          label="Recently played"
          to="/recently-played"
          icon={mdiHistory}
        />
        {/* 
        <SidebarLink
          label="Top from followed artists"
          to="/followed-artists/top-tracks"
          icon={<Icon path={mdiAccountMusic} size={1} />}
        />

        <SidebarLink
          label="Top from related artists"
          to="/related-artists/top-tracks"
          icon={<Icon path={mdiAccountMusicOutline} size={1} />}
        />
        */}
      </nav>
      {/* 
      <Heading className="mt-3 mb-2">Genres</Heading>

      <nav className="space-y-1">
        <SidebarLink
          label="From followed artists"
          to="/followed-artists/genres"
          icon={<Icon path={mdiTagText} size={1} />}
        />
      </nav>
*/}
      <SidebarHeading className="mt-6 mb-3" separatorClassName="from-blue-900">
        Playlists
      </SidebarHeading>

      <nav className="space-y-1">
        <Suspense
          fallback={
            <>
              <SidebarLinkSkeleton />
              <SidebarLinkSkeleton />
              <SidebarLinkSkeleton />
              <SidebarLinkSkeleton />
              <SidebarLinkSkeleton />
              <SidebarLinkSkeleton />
              <SidebarLinkSkeleton />
              <SidebarLinkSkeleton />
              <SidebarLinkSkeleton />
              <SidebarLinkSkeleton />
            </>
          }
        >
          <SidebarPlaylists />
        </Suspense>
        <SidebarLink
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
}
