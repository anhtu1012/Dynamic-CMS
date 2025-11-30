/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "@/components/custom/DataTable/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

interface DataTabProps {
  dynamicDataLoading: boolean;
  dynamicDataResult: any;
  dynamicDataColumns: ColumnDef<any>[];
  limit: number;
  onPageChange: (page: number) => void;
  onCreateData: () => void;
}

export function DataTab({
  dynamicDataLoading,
  dynamicDataResult,
  dynamicDataColumns,
  limit,
  onPageChange,
  onCreateData,
}: DataTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Entity Data</CardTitle>
            <CardDescription>Manage records for this entity</CardDescription>
          </div>
          <Button onClick={onCreateData}>
            <Plus className="h-4 w-4 mr-2" />
            Add Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {dynamicDataLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading data...
          </div>
        ) : !dynamicDataResult?.data || dynamicDataResult.data.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No data records found. Click Add Data to create the first record.
          </div>
        ) : (
          <DataTable
            columns={dynamicDataColumns}
            data={dynamicDataResult.data}
            usePagination={true}
            pageSize={limit}
            totalItems={dynamicDataResult.total}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
}
