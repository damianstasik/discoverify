import { Suspense } from "react";

import { PlaylistInfoSkeleton } from "./PlaylistInfoSkeleton";
import { PlaylistInfo } from "./PlaylistInfo";
import { Table } from "./Table";

export default function Playlist({ params }) {
  return (
    <>
      <Suspense fallback={<PlaylistInfoSkeleton />}>
        <PlaylistInfo id={params.id} />
      </Suspense>

      <Table id={params.id} />
    </>
  );
}
