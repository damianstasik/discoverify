import Link from "next/link";
import { Fragment } from "react";
import { TrackChipRemoveButton } from "./TrackChipRemoveButton";

interface Props {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  imageUrl: string;
}

export const TrackChip = ({ id, name, artists, imageUrl }: Props) => {
  return (
    <div className="shadow-inner h-12 pl-2 pr-1 bg-slate-500 rounded-md flex-shrink-0 flex items-center gap-2 relative overflow-hidden">
      <img
        className="absolute left-0 top-0 w-full h-full object-cover object-center blur opacity-25"
        src={imageUrl}
        alt={name}
      />
      <div className="relative">
        <img className="rounded s-8" src={imageUrl} alt={name} />
      </div>
      <div className="relative flex justify-center flex-col gap-1">
        <Link href={`/track/${id}`} className="text-white text-sm">
          {name}
        </Link>

        <div className="text-xs">
          {artists.map((artist, index) => (
            <Fragment key={artist.id}>
              <Link href={`/artist/${artist.id}`} className="text-slate-300">
                {artist.name}
              </Link>
              {index < artists.length - 1 && (
                <span className="text-slate-500 px-1">/</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="relative">
        <TrackChipRemoveButton id={id} />
      </div>
    </div>
  );
};