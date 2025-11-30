/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { EntityResponse } from "@/lib/schemas/entity/entity.response";

export function useEntityColumns(
  entity: EntityResponse | undefined,
  handleEditData: (data: any) => void,
  handleDeleteData: (data: any) => void
) {
  const fieldsColumns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-mono font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "label",
        header: "Label",
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.type}</Badge>
        ),
      },
      {
        id: "validation",
        header: "Validation",
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            {row.original.validation?.required && (
              <Badge variant="outline" className="text-xs w-fit">
                Required
              </Badge>
            )}
            {row.original.validation?.minLength && (
              <Badge variant="outline" className="text-xs w-fit">
                Min: {row.original.validation.minLength}
              </Badge>
            )}
            {row.original.validation?.maxLength && (
              <Badge variant="outline" className="text-xs w-fit">
                Max: {row.original.validation.maxLength}
              </Badge>
            )}
            {row.original.validation?.min !== undefined && (
              <Badge variant="outline" className="text-xs w-fit">
                Min: {row.original.validation.min}
              </Badge>
            )}
            {row.original.validation?.max !== undefined && (
              <Badge variant="outline" className="text-xs w-fit">
                Max: {row.original.validation.max}
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: "options",
        header: "Options",
        cell: ({ row }) =>
          row.original.options && row.original.options.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row.original.options.map((opt: any, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {opt.label}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
      },
      {
        id: "display",
        header: "Display",
        cell: ({ row }) => (
          <div className="flex gap-1">
            {row.original.showInList && (
              <Badge variant="outline" className="text-xs">
                List
              </Badge>
            )}
            {row.original.showInForm && (
              <Badge variant="outline" className="text-xs">
                Form
              </Badge>
            )}
            {row.original.sortable && (
              <Badge variant="outline" className="text-xs">
                Sortable
              </Badge>
            )}
            {row.original.searchable && (
              <Badge variant="outline" className="text-xs">
                Searchable
              </Badge>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const dynamicDataColumns = useMemo<ColumnDef<any>[]>(() => {
    if (!entity?.fields) return [];

    // Check if system fields already exist in entity fields
    const hasIdField = entity.fields.some((f) => f.name === "_id");
    const hasCreatedAtField = entity.fields.some((f) => f.name === "createdAt");
    const hasUpdatedAtField = entity.fields.some((f) => f.name === "updatedAt");

    const columns: ColumnDef<any>[] = [];

    // Add default system columns if not already in fields
    if (!hasIdField) {
      columns.push({
        accessorKey: "_id",
        header: "ID",
        cell: ({ row }: any) => (
          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
            {row.original._id}
          </code>
        ),
      });
    }

    // Add user-defined fields
    entity.fields
      .filter((field) => field.showInList)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .forEach((field) => {
        columns.push({
          accessorKey: field.name,
          header: field.label || field.name,
          cell: ({ row }: any) => {
            const value = row.original[field.name];

            if (field.type === "boolean" || field.type === "checkbox") {
              return (
                <Badge variant={value ? "default" : "secondary"}>
                  {value ? "Yes" : "No"}
                </Badge>
              );
            }

            if (field.type === "date") {
              return value ? new Date(value).toLocaleDateString() : "-";
            }

            if (field.type === "datetime") {
              return value ? new Date(value).toLocaleString() : "-";
            }

            if (field.type === "select" || field.type === "radio") {
              const option = field.options?.find((opt) => opt.value === value);
              return option ? option.label : value || "-";
            }

            if (field.type === "array") {
              if (!value || !Array.isArray(value) || value.length === 0) {
                return <span className="text-muted-foreground">-</span>;
              }
              return (
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {value.slice(0, 3).map((item: any, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {typeof item === "object" ? JSON.stringify(item) : item}
                    </Badge>
                  ))}
                  {value.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{value.length - 3} more
                    </Badge>
                  )}
                </div>
              );
            }

            if (field.type === "json") {
              return (
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {JSON.stringify(value)}
                </code>
              );
            }

            return value?.toString() || "-";
          },
        });
      });

    // Add default timestamp columns if not already in fields
    if (!hasCreatedAtField) {
      columns.push({
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }: any) => {
          const value = row.original.createdAt;
          return value ? new Date(value).toLocaleString() : "-";
        },
      });
    }

    if (!hasUpdatedAtField) {
      columns.push({
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }: any) => {
          const value = row.original.updatedAt;
          return value ? new Date(value).toLocaleString() : "-";
        },
      });
    }

    // Add actions column
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditData(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteData(row.original)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    });

    return columns;
  }, [entity, handleEditData, handleDeleteData]);

  return { fieldsColumns, dynamicDataColumns };
}
