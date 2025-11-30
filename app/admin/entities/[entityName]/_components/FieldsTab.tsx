/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "@/components/custom/DataTable/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ColumnDef } from "@tanstack/react-table";
import { EntityResponse } from "@/lib/schemas/entity/entity.response";

interface FieldsTabProps {
  entity: EntityResponse;
  fieldsColumns: ColumnDef<any>[];
}

export function FieldsTab({ entity, fieldsColumns }: FieldsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entity Fields</CardTitle>
        <CardDescription>All fields defined for this entity</CardDescription>
      </CardHeader>
      <CardContent>
        {!entity.fields || entity.fields.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No fields defined
          </div>
        ) : (
          <DataTable columns={fieldsColumns} data={entity.fields} />
        )}
      </CardContent>
    </Card>
  );
}
