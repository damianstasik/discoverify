import {
  Cell,
  Column,
  ColumnDef,
  Row,
  Table,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import { forwardRef, memo, useRef } from "react";
import { useInfiniteLoading } from "../hooks/useInfiniteLoading";
import { useScrollbarWidth } from "../hooks/useScrollbarWidth";
import { TrackSelectionToolbar } from "./TrackSelectionToolbar";

interface TableHeaderProps {
  table: Table<any>;
}

const TableHeader = ({ table }: TableHeaderProps) => {
  return (
    <div className="backdrop-blur-lg border-b border-white/5">
      {table.getHeaderGroups().map((headerGroup) => (
        <div key={headerGroup.id} className="flex bg-black/40 pr-[--scrollbar]">
          {headerGroup.headers.map((header) => {
            return (
              <div
                key={header.id}
                style={getWidthStyles(header.column)}
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

function getWidthStyles(column: Column<unknown, unknown>) {
  const width = column.columnDef?.size;
  return {
    minWidth: column.columnDef.minSize,
    width: width
      ? width <= 1
        ? `calc((100% - var(--total)) * ${width})`
        : width
      : undefined,
  };
}

const TableCell = ({ cell }: TableCellProps) => {
  return (
    <div
      className="flex items-center flex-shrink-0 px-3 py-2"
      style={getWidthStyles(cell.column)}
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
        className={
          "absolute top-0 left-0 w-full flex hover:bg-slate-700/50 hover:backdrop-blur"
        }
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

const VirtualTableRaw = <Data extends { spotifyId: string }>({
  columns,
  data,
  isLoading,
  hasNextPage = false,
  fetchNextPage = () => {},
}: Props<Data>) => {
  const table = useReactTable<Data>({
    data,
    columns,
    defaultColumn: {
      minSize: 0,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const contRef = useRef<HTMLDivElement>(null);

  const handleInfiniteLoadingScroll = useInfiniteLoading({
    fetchNextPage,
    isFetching: isLoading,
    hasNextPage,
  });

  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => contRef.current,
    count: data.length,
    estimateSize: () => 50,
    overscan: 4,
  });

  const scrollbarSize = useScrollbarWidth();

  const { flatRows } = table.getSelectedRowModel();
  const { rows } = table.getRowModel();

  const staticWidth = table.getAllColumns().reduce((acc, column) => {
    const width = column.columnDef.size;
    return acc + (width ? (width <= 1 ? 0 : width) : 0);
  }, 0);

  return (
    <div
      className="text-sm text-slate-400 flex flex-col w-full overflow-hidden"
      style={{
        "--scrollbar": `${scrollbarSize}px`,
        "--total": `${staticWidth}px`,
      }}
    >
      <TrackSelectionToolbar rows={flatRows} />
      <TableHeader table={table} />
      <div
        className="overflow-y-auto"
        ref={contRef}
        onScroll={handleInfiniteLoadingScroll}
      >
        <div
          className="relative overflow-hidden"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
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

export const VirtualTable = memo(VirtualTableRaw);
