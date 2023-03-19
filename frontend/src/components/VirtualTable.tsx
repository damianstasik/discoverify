import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  Table,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { forwardRef, memo, useRef } from 'react';
import { useInfiniteLoading } from '../hooks/useInfiniteLoading';
import { TrackSelectionToolbar } from './TrackSelectionToolbar';

interface TableHeaderProps {
  table: Table<any>;
}

const TableHeader = ({ table }: TableHeaderProps) => {
  return (
    <div className="bg-black/50 backdrop-blur-lg">
      {table.getHeaderGroups().map((headerGroup) => (
        <div key={headerGroup.id} className="flex border-b border-white/20">
          {headerGroup.headers.map((header) => {
            return (
              <div
                key={header.id}
                style={{ width: header.getSize() }}
                className="flex-shrink-0 px-3 py-2 items-center flex font-semibold text-white"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

interface TableCellProps {
  cell: Cell<unknown, unknown>;
}

const TableCell = ({ cell }: TableCellProps) => {
  return (
    <div
      className="flex items-center flex-shrink-0 px-3 py-1"
      style={{
        width: cell.column.getSize(),
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
};

interface TableVirtualRowProps {
  row: Row<unknown>;
  virtualItem: VirtualItem;
}

const TableVirtualRow = forwardRef<HTMLDivElement, TableVirtualRowProps>(
  ({ row, virtualItem }, ref) => {
    return (
      <div
        data-index={virtualItem.index}
        ref={ref}
        className={'absolute top-0 left-0 w-full flex'}
        style={{
          transform: `translate3d(0, ${virtualItem.start}px, 0)`,
        }}
      >
        {row.getVisibleCells().map((cell) => {
          return <TableCell key={cell.id} cell={cell} />;
        })}
      </div>
    );
  },
);

interface Props<Data extends { spotifyId: string }> {
  columns: ColumnDef<Data, any>[];
  data: Data[];
  isLoading: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const VirtualTable = <Data extends { spotifyId: string }>({
  columns,
  data,
  isLoading,
  hasNextPage = false,
  fetchNextPage = () => {},
}: Props<Data>) => {
  const table = useReactTable<Data>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const contRef = useRef<HTMLDivElement>(null);

  const handleInfiniteLoadingScroll = useInfiniteLoading({
    ref: contRef,
    fetchNextPage,
    isFetching: isLoading,
    hasNextPage,
  });

  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => contRef.current,
    count: data.length,
    estimateSize: () => 45,
    overscan: 10,
  });
  const { flatRows } = table.getSelectedRowModel();
  const { rows } = table.getRowModel();
  return (
    <div className="text-sm text-neutral-300">
      <TrackSelectionToolbar rows={flatRows} />
      <TableHeader table={table} />
      <div
        className="overflow-y-auto h-[800px]"
        ref={contRef}
        onScroll={handleInfiniteLoadingScroll}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const row = rows[virtualItem.index];
            return (
              <TableVirtualRow
                ref={rowVirtualizer.measureElement}
                row={row}
                key={row.id}
                virtualItem={virtualItem}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
