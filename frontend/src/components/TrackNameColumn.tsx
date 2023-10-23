import { CellContext } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export const TrackNameColumn = <Data extends { id: string }>(
  props: CellContext<Data, string>,
) => {
  return (
    <Link
      to={`/track/${props.row.original.id}`}
      className="text-white underline decoration-green-900 underline-offset-4 hover:decoration-green-500 hover:text-green-500"
    >
      {props.getValue()}
    </Link>
  );
};
