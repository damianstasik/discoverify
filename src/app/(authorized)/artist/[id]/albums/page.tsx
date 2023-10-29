import { Table } from "./Table";
import { getAlbum } from "./api";

export default async function ArtistAlbums({ params }) {
  const albums = await getAlbum(params.id, "album");

  return (
    <>
      <Table data={albums} />
    </>
  );
}
