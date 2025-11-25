/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";

export interface DataTableProps<TData = Record<string, any>> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
  usePagination?: boolean;
  onPageChange?: (page: number) => void;
  totalItems?: number;
}
