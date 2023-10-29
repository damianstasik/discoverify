import mdiAccountMusic from "@slimr/mdi-paths/AccountMusic";
import mdiFolderPlay from "@slimr/mdi-paths/FolderPlay";
import mdiMusicBox from "@slimr/mdi-paths/MusicBox";
import mdiMusicBoxMultiple from "@slimr/mdi-paths/MusicBoxMultiple";
import mdiPlayBoxMultipleOutline from "@slimr/mdi-paths/PlayBoxMultipleOutline";
import mdiTrendingUp from "@slimr/mdi-paths/TrendingUp";
import { Suspense } from "react";
import { getArtist } from "../../../../api/artist";
import { BgImg } from "../../../../components/BgImg";
import { Artist } from "./Artist";
import { TabLink } from "./TabLink";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const tabs = [
    {
      to: `/artist/${params.id}`,
      label: "Popular tracks",
      icon: mdiTrendingUp,
    },
    {
      to: `/artist/${params.id}/albums`,
      label: "Albums",
      icon: mdiMusicBoxMultiple,
    },
    {
      to: "singles",
      label: "Singles and EPs",
      icon: mdiMusicBox,
    },
    {
      to: "appears-on",
      label: "Appears on",
      icon: mdiPlayBoxMultipleOutline,
    },
    {
      to: "compilations",
      label: "Compilations",
      icon: mdiFolderPlay,
    },
    {
      to: `/artist/${params.id}/related-artists-top-tracks`,
      label: "Related artists' top tracks",
      icon: mdiAccountMusic,
    },
  ];
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Artist id={params.id} />
      </Suspense>
      <nav className="-mb-px flex gap-4 mx-3 relative" aria-label="Tabs">
        {tabs.map((tab) => (
          <TabLink key={tab.label} tab={tab} />
        ))}
      </nav>
      {children}
    </div>
  );
}
