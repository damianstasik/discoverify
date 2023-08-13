import { getTopTracks } from "../../../../../api/artist";
import { Table } from "./Table";

export default async function ArtistTopTracks({ params }) {
  const topTracks = await getTopTracks(params.id);

  return (
    <>
      <Table data={topTracks} />
    </>
  );
}
