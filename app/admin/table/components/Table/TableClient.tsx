"use client";

import React from "react";
import { DataTable } from "@/components/custom/DataTable/data-table";
import { columns } from "./columns";
import { User } from "@/types/user";

export default function TableClient({
  data,
  pageSize,
  totalItems,
  usePagination,
  onPageChange,
}: {
  data: User[];
  pageSize?: number;
  totalItems?: number;
  usePagination?: boolean;
  onPageChange?: (page: number) => void;
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      pageSize={pageSize}
      totalItems={totalItems}
      usePagination={usePagination}
      onPageChange={onPageChange}
    />
  );
}
