import { CellContext } from '@tanstack/react-table';
import { formatRelative } from 'date-fns';

export function AddedAtColumn(props: CellContext<any, any>) {
  return formatRelative(new Date(props.getValue()), new Date());
}
