"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { mockEntities } from "@/lib/mock-data/entities";
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
import { toast } from "sonner";
import type { EntityFormData } from "@/lib/schemas/entity/entity.schema";
import type { ColumnDef } from "@tanstack/react-table";

interface Entity extends EntityFormData {
  _id: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>();

  const fetchEntities = async () => {
    try {
      setLoading(true);
      // Use mock data for testing
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      setEntities(mockEntities as any);

      // Real API call (uncomment when ready):
      // const response = await fetch('/api/collection-schemas');
      // if (!response.ok) throw new Error('Failed to fetch entities');
      // const data = await response.json();
      // setEntities(data);
    } catch (error) {
      console.error("Error fetching entities:", error);
      toast.error("Failed to load entities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const handleCreate = () => {
    setSelectedEntity(undefined);
    setModalOpen(true);
  };

  const handleEdit = useCallback((entity: Entity) => {
    setSelectedEntity(entity);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this entity?")) return;

    try {
      const response = await fetch(`/api/collection-schemas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete entity");
      toast.success("Entity deleted successfully");
      fetchEntities();
    } catch (error) {
      console.error("Error deleting entity:", error);
      toast.error("Failed to delete entity");
    }
  }, []);

  const columns = useMemo<ColumnDef<Entity>[]>(
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
              onClick={() => handleDelete(row.original._id)}
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
          {loading ? (
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
            <DataTable columns={columns} data={entities} />
          )}
        </CardContent>
      </Card>

      <EntityFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        entity={selectedEntity}
        onSuccess={fetchEntities}
      />
    </div>
  );
}
