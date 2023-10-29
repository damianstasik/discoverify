import Link from "next/link";
import { findImageUrlByMinWidth } from "../../../utils";

export function Artist({ artist }) {
  return (
    <Link
      href={`/artist/${artist.id}`}
      className="flex gap-2 items-center underline decoration-yellow-900 underline-offset-4 hover:decoration-yellow-500"
      key={artist.id}
    >
      <img
        alt={artist.name}
        src={findImageUrlByMinWidth(artist.images, 40)}
        className="w-10 h-10 rounded-md"
      />

      <span>{artist.name}</span>
    </Link>
  );
}
