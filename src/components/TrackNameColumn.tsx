import { CellContext } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

export const TrackNameColumn = <Data extends { id: string }>(
  props: CellContext<Data, string>,
) => {
  return (
    <Link
      to={`/track/${props.row.original.id}`}
      className="text-white underline decoration-white/30"
    >
      {props.getValue()}
    </Link>
  );
};
