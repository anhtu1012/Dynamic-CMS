"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { EntityFormModal } from "@/app/admin/entities/_components/EntityFormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EntityResponse } from "@/lib/schemas/entity/entity.response";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  useEntityByName,
  useUpdateEntityDetail,
  useDeleteEntityDetail,
} from "./_hooks/useEntityDetail";
import { ConfirmDialog } from "@/components/custom/ConfirmDialog";
import { DynamicDataFormModal } from "./_components/DynamicDataFormModal";
import {
  useDynamicData,
  useCreateDynamicData,
  useUpdateDynamicData,
  useDeleteDynamicData,
} from "./_hooks/useDynamicData";
import { DataTab } from "./_components/DataTab";
import { FieldsTab } from "./_components/FieldsTab";
import { ApiTab } from "./_components/ApiTab";
import { SettingsTab } from "./_components/SettingsTab";
import { PermissionsTab } from "./_components/PermissionsTab";
import { useEntityColumns } from "./_hooks/useEntityColumns";
import { permissionLimits } from "@/lib/mock-data/permission";
import { toast } from "sonner";

export default function EntityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const entityName = params.entityName as string;

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [dataConfirmOpen, setDataConfirmOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Array<{
    field: string;
    message: string;
  }> | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Use react-query hooks
  const { data, isLoading: loading } = useEntityByName(entityName);
  const updateEntity = useUpdateEntityDetail();
  const deleteEntity = useDeleteEntityDetail();

  // Dynamic data hooks with pagination
  const { data: dynamicDataResult, isLoading: dynamicDataLoading } =
    useDynamicData(entityName, { page, limit });
  const createData = useCreateDynamicData();
  const updateData = useUpdateDynamicData();
  const deleteData = useDeleteDynamicData();

  // Type cast the entity data
  const entity = data as EntityResponse | undefined;

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!entity) return;

    deleteEntity.mutate(
      {
        id: (entity as any)._id,
        databaseId: (entity as any).databaseId,
      },
      {
        onSuccess: () => {
          router.push("/admin/entities");
        },
      }
    );
  };

  const handleCreateData = () => {
    // Check if data limit is reached
    const currentDataCount = dynamicDataResult?.total || 0;
    if (currentDataCount >= permissionLimits.dataLimits) {
      toast.error(
        `You have reached the limit of ${permissionLimits.dataLimits} data records per entity.`
      );
      return;
    }

    setSelectedData(null);
    setValidationErrors(null);
    setDataModalOpen(true);
  };

  const handleEditData = (data: any) => {
    setSelectedData(data);
    setValidationErrors(null);
    setDataModalOpen(true);
  };

  const handleDeleteData = (data: any) => {
    setSelectedData(data);
    setDataConfirmOpen(true);
  };

  const handleConfirmDeleteData = () => {
    if (!selectedData) return;

    deleteData.mutate(
      {
        collectionName: entityName,
        id: selectedData._id,
      },
      {
        onSuccess: () => {
          setDataConfirmOpen(false);
          setSelectedData(null);
        },
      }
    );
  };

  const handleSubmitData = (formData: Record<string, any>) => {
    if (selectedData) {
      // Update existing data
      updateData.mutate(
        {
          collectionName: entityName,
          id: selectedData._id,
          data: formData,
        },
        {
          onSuccess: () => {
            setDataModalOpen(false);
            setSelectedData(null);
            setValidationErrors(null);
          },
          onError: (error: any) => {
            // Extract validation errors from backend response
            const backendErrors = error?.response?.data?.errors;
            if (backendErrors && Array.isArray(backendErrors)) {
              setValidationErrors(backendErrors);
            } else {
              setValidationErrors([{ field: "error", message: error.message }]);
            }
          },
        }
      );
    } else {
      // Create new data
      createData.mutate(
        {
          collectionName: entityName,
          data: formData,
        },
        {
          onSuccess: () => {
            setDataModalOpen(false);
            setValidationErrors(null);
          },
          onError: (error: any) => {
            // Extract validation errors from backend response
            const backendErrors = error?.response?.data?.errors;
            if (backendErrors && Array.isArray(backendErrors)) {
              setValidationErrors(backendErrors);
            } else {
              setValidationErrors([{ field: "error", message: error.message }]);
            }
          },
        }
      );
    }
  };

  // Use custom hook for columns
  const { fieldsColumns, dynamicDataColumns } = useEntityColumns(
    entity,
    handleEditData,
    handleDeleteData
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

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data">
            Data ({dynamicDataResult?.total || 0})
          </TabsTrigger>
          <TabsTrigger value="fields">
            Fields ({entity.fields?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="api">API Endpoints</TabsTrigger>
          {/* <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger> */}
        </TabsList>

        {/* Data Tab */}
        <TabsContent value="data">
          <DataTab
            dynamicDataLoading={dynamicDataLoading}
            dynamicDataResult={dynamicDataResult}
            dynamicDataColumns={dynamicDataColumns}
            collectionName={entityName}
            limit={limit}
            onPageChange={setPage}
            onCreateData={handleCreateData}
          />
        </TabsContent>

        {/* Fields Tab */}
        <TabsContent value="fields">
          <FieldsTab entity={entity} fieldsColumns={fieldsColumns} />
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api">
          <ApiTab entity={entity} />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <SettingsTab entity={entity} />
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <PermissionsTab entity={entity} />
        </TabsContent>
      </Tabs>

      <EntityFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        entity={entity || undefined}
        databaseId={entity?.databaseId}
        updateMutation={updateEntity}
      />

      <DynamicDataFormModal
        open={dataModalOpen}
        onOpenChange={setDataModalOpen}
        collectionName={entityName}
        fields={entity?.fields || []}
        onSubmit={handleSubmitData}
        initialData={selectedData}
        isLoading={createData.isPending || updateData.isPending}
        validationErrors={validationErrors}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Entity"
        description={
          entity
            ? `Are you sure you want to delete "${entity.displayName}"? This action cannot be undone.`
            : "Are you sure you want to delete this entity?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      <ConfirmDialog
        open={dataConfirmOpen}
        onOpenChange={setDataConfirmOpen}
        onConfirm={handleConfirmDeleteData}
        title="Delete Data"
        description="Are you sure you want to delete this data record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
