import Link from "next/link";
import { memo } from "react";

interface Props {
  name: string | undefined;
  artists: any[] | undefined;
  imageUrl: string | undefined;
}

function ArtistLink({ id, name }) {
  return (
    <Link
      href={`/artist/${id}`}
      className="text-slate-300 underline decoration-yellow-900 underline-offset-4 hover:decoration-yellow-500"
    >
      {name}
    </Link>
  );
}

export const TrackInfo = memo(({ name, artists, imageUrl }: Props) => {
  return (
    <div className="flex gap-4 items-center text-sm">
      {imageUrl && (
        <img src={imageUrl} className="rounded-md w-16 h-16" alt={name} />
      )}
      <div className="flex flex-col gap-1">
        <p className="text-white">{name}</p>
        <div className="flex gap-1 flex-wrap">
          {artists?.map((artist, index) => (
            <div key={artist.uri}>
              <ArtistLink
                id={artist.uri.replace("spotify:artist:", "")}
                name={artist.name}
                key={artist.uri}
              />
              {index < artists.length - 1 && <span>,</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
