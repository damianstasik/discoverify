import { CellContext } from "@tanstack/react-table";
import Link from "next/link";

export const ArtistNameColumn = <Data extends { id: string }>(
  props: CellContext<Data, string>,
) => {
  return (
    <Link
      href={`/artist/${props.row.original.id}`}
      className="text-white underline decoration-yellow-900 underline-offset-4 hover:decoration-yellow-500 hover:text-yellow-500"
    >
      {props.getValue()}
    </Link>
  );
};
