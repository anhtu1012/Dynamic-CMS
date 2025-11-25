"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockEntities } from "@/lib/mock-data/entities";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import type { EntityFormData } from "@/lib/schemas/entity.schema";
import type { ColumnDef } from "@tanstack/react-table";

interface Entity extends EntityFormData {
  _id: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export default function EntityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const entityName = params.entityName as string;

  const [entity, setEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchEntity = async () => {
    try {
      setLoading(true);
      // Use mock data for testing
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay
      const found = mockEntities.find((e: any) => e.name === entityName);

      if (!found) {
        toast.error("Entity not found");
        router.push("/admin/entities");
        return;
      }

      setEntity(found as any);

      // Real API call (uncomment when ready):
      // const response = await fetch('/api/collection-schemas');
      // if (!response.ok) throw new Error('Failed to fetch entities');
      // const data = await response.json();
      // const found = data.find((e: Entity) => e.name === entityName);
      // if (!found) {
      //   toast.error('Entity not found');
      //   router.push('/admin/entities');
      //   return;
      // }
      // setEntity(found);
    } catch (error) {
      console.error("Error fetching entity:", error);
      toast.error("Failed to load entity");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityName]);

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!entity || !confirm("Are you sure you want to delete this entity?"))
      return;

    try {
      const response = await fetch(`/api/collection-schemas/${entity._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete entity");
      toast.success("Entity deleted successfully");
      router.push("/admin/entities");
    } catch (error) {
      console.error("Error deleting entity:", error);
      toast.error("Failed to delete entity");
    }
  };

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

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="text-center py-12 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (!entity) {
    return null;
  }

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/entities")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Entities
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{entity.displayName}</h1>
            <p className="text-muted-foreground mt-1">
              {entity.description || "No description"}
            </p>
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary" className="font-mono">
                {entity.name}
              </Badge>
              <Badge variant="outline">v{entity.version}</Badge>
              {entity.icon && (
                <Badge variant="outline">Icon: {entity.icon}</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="fields" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fields">
            Fields ({entity.fields?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Fields Tab */}
        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <CardTitle>Entity Fields</CardTitle>
              <CardDescription>
                All fields defined for this entity
              </CardDescription>
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
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Entity Settings</CardTitle>
              <CardDescription>Configuration and feature flags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Timestamps</p>
                    <p className="text-sm text-muted-foreground">
                      Auto createdAt/updatedAt
                    </p>
                  </div>
                  <Badge variant={entity.timestamps ? "default" : "secondary"}>
                    {entity.timestamps ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Soft Delete</p>
                    <p className="text-sm text-muted-foreground">
                      Mark as deleted
                    </p>
                  </div>
                  <Badge variant={entity.softDelete ? "default" : "secondary"}>
                    {entity.softDelete ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Enable API</p>
                    <p className="text-sm text-muted-foreground">
                      REST endpoints
                    </p>
                  </div>
                  <Badge variant={entity.enableApi ? "default" : "secondary"}>
                    {entity.enableApi ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">API Path</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {entity.apiPath || "/api/" + entity.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="font-medium mb-2">Metadata</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created:</span>{" "}
                    {new Date(entity.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Updated:</span>{" "}
                    {new Date(entity.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Access Permissions</CardTitle>
              <CardDescription>
                Role-based access control settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entity.permissions ? (
                  <>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Create Permission</p>
                        <p className="text-sm text-muted-foreground">
                          Who can create new records
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {entity.permissions.create?.map((role, idx) => (
                          <Badge key={idx} variant="outline">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Read Permission</p>
                        <p className="text-sm text-muted-foreground">
                          Who can view records
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {entity.permissions.read?.map((role, idx) => (
                          <Badge key={idx} variant="outline">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Update Permission</p>
                        <p className="text-sm text-muted-foreground">
                          Who can modify records
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {entity.permissions.update?.map((role, idx) => (
                          <Badge key={idx} variant="outline">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Delete Permission</p>
                        <p className="text-sm text-muted-foreground">
                          Who can delete records
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {entity.permissions.delete?.map((role, idx) => (
                          <Badge key={idx} variant="outline">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No permissions configured
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EntityFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        entity={entity}
        onSuccess={fetchEntity}
      />
    </div>
  );
}
