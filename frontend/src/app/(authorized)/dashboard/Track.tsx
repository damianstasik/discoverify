import mdiPlayCircle from "@slimr/mdi-paths/PlayCircle";
import Link from "next/link";
import { IconButton } from "../../../components/IconButton";

export function Track({ track }) {
  return (
    <div className="flex gap-2 items-center">
      <div>
        <IconButton label="Play" icon={mdiPlayCircle} className="text-white" />
      </div>
      <div className="flex gap-1 w-full flex-col">
        <Link
          href={`/track/${track.id}`}
          className="underline decoration-green-900 underline-offset-4 hover:decoration-green-500"
        >
          {track.name}
        </Link>
        <div>
          {track.artists.map((artist) => (
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
