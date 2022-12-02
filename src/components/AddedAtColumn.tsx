import { CellContext } from '@tanstack/react-table';
import { formatRelative } from 'date-fns';

export function AddedAtColumn<Data,>(props: CellContext<Data, string>) {
  return formatRelative(new Date(props.getValue()), new Date());
}
