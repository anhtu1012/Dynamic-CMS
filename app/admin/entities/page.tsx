"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EntityFormModal } from "@/components/custom/EntityFormModal";
import { DataTable } from "@/components/custom/DataTable/data-table";
import type {
  EntitiesListResponse,
  EntityResponse,
} from "@/lib/schemas/entity/entity.response";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useEntities,
  useCreateEntity,
  useUpdateEntity,
  useDeleteEntity,
} from "./_hooks/useEntities";
import type { RootState } from "@/redux/store";

export default function EntitiesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<
    EntityResponse | undefined
  >();

  // Get selected database from Redux store
  const selectedDatabase = useSelector(
    (state: RootState) => state.database.selectedDatabase
  );

  // Use react-query hooks
  const { data: entitiesResponse, isLoading } = useEntities(
    selectedDatabase?.id
  );
  const createEntity = useCreateEntity();
  const updateEntity = useUpdateEntity();
  const deleteEntity = useDeleteEntity();

  const entities = (entitiesResponse as EntitiesListResponse)?.data || [];

  const handleCreate = () => {
    setSelectedEntity(undefined);
    setModalOpen(true);
  };

  const handleEdit = useCallback((entity: EntityResponse) => {
    setSelectedEntity(entity);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string, databaseId: string) => {
      if (!confirm("Are you sure you want to delete this entity?")) return;
      deleteEntity.mutate({ id, databaseId });
    },
    [deleteEntity]
  );

  const columns = useMemo<ColumnDef<EntityResponse>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-mono font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "displayName",
        header: "Display Name",
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="max-w-xs truncate block">
            {row.original.description || "-"}
          </span>
        ),
      },
      {
        id: "fields",
        header: "Fields",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.original.fields?.length || 0} fields
          </Badge>
        ),
      },
      {
        id: "features",
        header: "Features",
        cell: ({ row }) => (
          <div className="flex gap-1">
            {row.original.timestamps && (
              <Badge variant="outline" className="text-xs">
                Timestamps
              </Badge>
            )}
            {row.original.softDelete && (
              <Badge variant="outline" className="text-xs">
                Soft Delete
              </Badge>
            )}
            {row.original.enableApi && (
              <Badge variant="outline" className="text-xs">
                API
              </Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: "version",
        header: "Version",
        cell: ({ row }) => `v${row.original.version}`,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/entities/${row.original.name}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(row.original)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                handleDelete(row.original._id, row.original.databaseId)
              }
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  return (
    <div className="w-full p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Entities</h1>
          <p className="text-muted-foreground">
            Manage your data entities and their configurations
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Entity
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entity List</CardTitle>
          <CardDescription>
            All registered entities in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading...
            </div>
          ) : entities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">No entities found</p>
              <Button variant="outline" onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Entity
              </Button>
            </div>
          ) : (
            <DataTable<EntityResponse> columns={columns} data={entities} />
          )}
        </CardContent>
      </Card>

      <EntityFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        entity={selectedEntity}
        databaseId={selectedDatabase?.id}
        createMutation={createEntity}
        updateMutation={updateEntity}
      />
    </div>
  );
}
