import { Box } from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { forwardRef, memo, useRef } from 'react';
import { useInfiniteLoading } from '../hooks/useInfiniteLoading';
import { TrackSelectionToolbar } from './TrackSelectionToolbar';

interface TableHeaderProps {
  table: Table<any>;
}

const TableHeader = memo(({ table }: TableHeaderProps) => {
  return (
    <Box>
      {table.getHeaderGroups().map((headerGroup) => (
        <Box
          key={headerGroup.id}
          display="flex"
          borderBottom="1px solid rgba(255,255,255,.1)"
        >
          {headerGroup.headers.map((header) => {
            return (
              <Box
                key={header.id}
                style={{ width: header.getSize() }}
                display="flex"
                alignItems="center"
                flexShrink={0}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
});

const TableCell = ({ cell }) => {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center' }}
      flexShrink={0}
      style={{
        width: cell.column.getSize(),
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </Box>
  );
};

const TableVirtualRow = forwardRef(({ row, virtualItem }, ref) => {
  return (
    <div
      data-index={virtualItem.index}
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',

        transform: `translate3d(0, ${virtualItem.start}px, 0)`,
        display: 'flex',
        background: row.original.isIgnored ? 'red' : '',
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return <TableCell key={cell.id} cell={cell} />;
      })}
    </div>
  );
});

export const VirtualTable = memo(
  ({ columns, data, isLoading, hasNextPage, fetchNextPage }) => {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      state: {
        columnVisibility: {
          id: false,
        },
      },
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
      <Box
        sx={{
          fontSize: '14px',
        }}
      >
        <TrackSelectionToolbar rows={flatRows} />
        <TableHeader table={table} />
        <div
          className="container"
          ref={contRef}
          style={{
            height: `800px`,
            overflow: 'auto',
          }}
          onScroll={handleInfiniteLoadingScroll}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
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
      </Box>
    );
  },
);
