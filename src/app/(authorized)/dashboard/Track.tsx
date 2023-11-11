import Link from "next/link";
import { PlayPauseButton } from "../../../components/PlayPauseButton";

interface Props {
  name: string;
  id: string;
  artists: Array<{
    name: string;
    id: string;
  }>;
}

export function Track({ id, name, artists }: Props) {
  return (
    <div className="flex gap-2 items-center">
      <div>
        <PlayPauseButton trackId={id} />
      </div>
      <div className="flex gap-1 w-full flex-col">
        <Link
          href={`/track/${id}`}
          className="underline decoration-green-900 underline-offset-4 hover:decoration-green-500"
        >
          {name}
        </Link>
        <div>
          {artists.map((artist) => (
            <Link
              href={`/artist/${artist.id}`}
              key={artist.id}
              className="underline decoration-yellow-900 underline-offset-4 hover:decoration-yellow-500"
            >
              {artist.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
