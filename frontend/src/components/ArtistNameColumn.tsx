import { CellContext } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

export const ArtistNameColumn = <Data extends { id: string }>(
  props: CellContext<Data, string>,
) => {
  return (
    <Link
      to={`/artist/${props.row.original.id}`}
      className="text-white underline decoration-neutral-600"
    >
      {props.getValue()}
    </Link>
  );
};
