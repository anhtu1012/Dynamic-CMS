/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { DataTable } from "@/components/custom/DataTable/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FileJson } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import BulkJsonModal from "./BulkJsonModal";
import { useParams } from "next/navigation";

interface DataTabProps {
  dynamicDataLoading: boolean;
  dynamicDataResult: any;
  dynamicDataColumns: ColumnDef<any>[];
  collectionName: string;
  limit: number;
  onPageChange: (page: number) => void;
  onCreateData: () => void;
}

export function DataTab({
  dynamicDataLoading,
  dynamicDataResult,
  dynamicDataColumns,
  collectionName,
  limit,
  onPageChange,
  onCreateData,
}: DataTabProps) {
  const [isBulkJsonOpen, setIsBulkJsonOpen] = useState(false);
  const params = useParams();
  // Assuming databaseId is not directly available here, we might need to pass it or get it from context/url
  // For now, let's assume we can get it or it's passed.
  // Actually, looking at page.tsx, databaseId is passed to useEntities.
  // Let's try to get it from the data result or props if possible, or just pass a placeholder if not critical for now,
  // but the hook needs it.
  // Wait, the useImportJson hook needs databaseId for invalidation.
  // In page.tsx, `entity` object has `databaseId`.
  // We should probably pass `databaseId` to DataTab.
  // Let's check page.tsx again.
  // It seems we don't have databaseId in props.
  // However, dynamicDataResult.data items usually have databaseId.
  // Or we can pass it from parent.
  // Let's look at page.tsx to see where DataTab is used.

  const databaseId =
    dynamicDataResult?.data?.[0]?.databaseId ||
    (params.entityName as string) ||
    ""; // Fallback, might need fix

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Entity Data</CardTitle>
              <CardDescription>Manage records for this entity</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsBulkJsonOpen(true)}
                disabled={dynamicDataLoading}
              >
                <FileJson className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button onClick={onCreateData}>
                <Plus className="h-4 w-4 mr-2" />
                Add Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {dynamicDataLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading data...
            </div>
          ) : !dynamicDataResult?.data ||
            dynamicDataResult.data.length === 0 ? (
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

      <BulkJsonModal
        open={isBulkJsonOpen}
        onOpenChange={setIsBulkJsonOpen}
        initialData={dynamicDataResult?.data || []}
        collectionName={collectionName}
      />
    </>
  );
}
