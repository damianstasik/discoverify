import { Link } from '@mui/material';
import { CellContext } from '@tanstack/react-table';
import { Link as RouterLink } from 'react-router-dom';

export const TrackNameColumn = <Data extends { id: string }>(
  props: CellContext<Data, string>,
) => {
  return (
    <Link
      component={RouterLink}
      to={`/track/${props.row.original.id}`}
      color="#fff"
    >
      {props.getValue()}
    </Link>
  );
};
