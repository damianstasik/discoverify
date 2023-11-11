import { Suspense } from "react";
import { AlbumInfo } from "./AlbumInfo";
import { AlbumInfoSkeleton } from "./AlbumInfoSkeleton";
import { Table } from "./Table";

export default function Album({ params }) {
  return (
    <>
      <Suspense fallback={<AlbumInfoSkeleton />}>
        <AlbumInfo id={params.id} />
      </Suspense>

      <Table id={params.id} />
    </>
  );
}
