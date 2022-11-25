import { Link } from '@mui/material';
import { CellContext } from '@tanstack/react-table';
import { Link as RouterLink } from 'react-router-dom';

export const TrackNameColumn = (props: CellContext<any, string>) => {
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
