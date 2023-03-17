import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from './IconButton';
import { mdiClose } from '@mdi/js';

export const TrackChip = ({ id, name, artists, imageUrl }) => {
  return (
    <div className="h-14 px-2 bg-neutral-750 rounded-md flex-shrink-0 flex items-center gap-2">
      <div>
        <img className="rounded s-8" src={imageUrl} alt={name} />
      </div>
      <div className="flex justify-center flex-col gap-1">
        <Link to={`/track/${id}`} className="text-white text-sm">
          {name}
        </Link>

        <div className="text-xs">
          {artists.map((artist, index) => (
            <Fragment key={artist.id}>
              <Link to={`/artist/${artist.id}`} className="text-neutral-300">
                {artist.name}
              </Link>
              {index < artists.length - 1 && (
                <span className="text-neutral-500 px-1">/</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div>
        <IconButton
          icon={mdiClose}
          label="Remove"
          className="text-neutral-400"
        />
      </div>
    </div>
  );
};
