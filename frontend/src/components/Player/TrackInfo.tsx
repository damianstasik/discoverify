import { memo } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  name: string | undefined;
  artists: any[] | undefined;
  imageUrl: string | undefined;
}

function ArtistLink({ id, name }) {
  return (
    <Link
      to={`/artist/${id}`}
      className="text-neutral-300 underline decoration-neutral-600"
    >
      {name}
    </Link>
  );
}

export const TrackInfo = memo(({ name, artists, imageUrl }: Props) => {
  return (
    <div className="flex gap-4 items-center text-sm">
      <img src={imageUrl} className="rounded-md w-16 h-16" alt={name} />
      <div className="flex flex-col gap-1">
        <p className="text-white">{name}</p>
        <div className="flex gap-1">
          {artists?.map((artist) => (
            <ArtistLink
              id={artist.uri.replace('spotify:artist:', '')}
              name={artist.name}
              key={artist.uri}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
