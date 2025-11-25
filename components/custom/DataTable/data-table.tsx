import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import React, { useMemo, useState } from "react";
import { DataTableProps } from "./props";
import PaginationControl from "@/components/ui/pagination-control";

export function DataTable<TData>({
  columns,
  data,
  sortable = true,
  onPageChange,
  pageSize,
  totalItems,
  usePagination,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Add default index column (STT) and apply sortable toggle to all columns
  const processedColumns = useMemo((): ColumnDef<TData>[] => {
    const indexCol: ColumnDef<TData> = {
      id: "stt",
      header: "STT",
      cell: ({ row }) => {
        // If external pagination is used, compute global index
        if (usePagination && typeof pageSize === "number") {
          const offset = (currentPage - 1) * pageSize;
          return String(offset + row.index + 1);
        }
        return String(row.index + 1);
      },
      enableSorting: false,
    } as ColumnDef<TData>;

    const mapped = columns.map((c) => ({
      ...(c as ColumnDef<TData>),
      enableSorting: typeof c === "object" ? sortable ?? true : sortable,
    })) as ColumnDef<TData>[];

    return [indexCol, ...mapped];
  }, [columns, sortable, currentPage, pageSize, usePagination]);

  const table = useReactTable({
    data,
    columns: processedColumns,
    state: { sorting },
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize ?? 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* TABLE */}
      <div className="rounded-xl border p-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center space-x-2">
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                        {header.column.getCanSort() ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="text-sm text-muted-foreground"
                            aria-label="Toggle Sort"
                          >
                            {header.column.getIsSorted() === "asc"
                              ? "↑"
                              : header.column.getIsSorted() === "desc"
                              ? "↓"
                              : "↕"}
                          </button>
                        ) : null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-end">
        {(() => {
          // Compute total pages from totalItems and pageSize
          const effectiveTotalPages =
            typeof totalItems === "number" &&
            typeof pageSize === "number" &&
            pageSize > 0
              ? Math.max(1, Math.ceil(totalItems / pageSize))
              : undefined;

          if (typeof effectiveTotalPages !== "undefined") {
            // DataTable manages currentPage internally; call onPageChange when changed
            const handlePageChange = (p: number) => {
              setCurrentPage(p);
              if (onPageChange) onPageChange(p);
            };

            return (
              <PaginationControl
                totalPages={effectiveTotalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            );
          }

          // Fallback to internal table pagination controls
          return (
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>

              <span className="text-sm">
                Page {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount()}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
