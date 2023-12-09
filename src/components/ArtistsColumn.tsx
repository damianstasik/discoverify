import { CellContext } from "@tanstack/react-table";
import Link from "next/link";

interface Artist {
  id: string;
  name: string;
}

export const ArtistsColumn = <Data extends { artists: Artist[] }>(
  props: CellContext<Data, Artist[]>,
) => {
  const artists = props.getValue();
  return (
    <div className="flex gap-2 flex-wrap">
      {artists.map((artist, index) => (
        <div key={artist.id}>
          <Link
            href={`/artist/${artist.id}`}
            className="text-white underline decoration-yellow-900 underline-offset-4 hover:decoration-yellow-500 hover:text-yellow-500"
          >
            {artist.name}
          </Link>
          {index < artists.length - 1 && <span>,</span>}
        </div>
      ))}
    </div>
  );
};
