/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { Save, X, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldConfig } from "@/app/admin/entities/[entityName]/_components/FieldConfig";
import { InterfaceGeneratorModal } from "@/app/admin/entities/_components/InterfaceGeneratorModal";
import {
  type EntityFormData,
  type FieldFormData,
} from "@/lib/schemas/entity/entity.schema";
import type { EntityResponse } from "@/lib/schemas/entity/entity.response";
import type {
  CreateEntityRequestItem,
  UpdateEntityRequestItem,
} from "@/lib/schemas/entity/entity.request";
import type { UseMutationResult } from "@tanstack/react-query";

interface EntityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity?: EntityResponse;
  databaseId?: string;
  createMutation?: UseMutationResult<
    any,
    unknown,
    CreateEntityRequestItem,
    unknown
  >;
  updateMutation?: UseMutationResult<
    any,
    unknown,
    { id: string; formData: UpdateEntityRequestItem },
    unknown
  >;
}

export function EntityFormModal({
  open,
  onOpenChange,
  entity,
  databaseId,
  createMutation,
  updateMutation,
}: EntityFormModalProps) {
  // Initialize fields from entity prop, only when component mounts or entity changes
  const [fields, setFields] = useState<FieldFormData[]>(
    () => entity?.fields || []
  );
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const isEdit = !!entity?._id;

  const form = useForm({
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      icon: "",
      fields: [],
      timestamps: true,
      softDelete: false,
      enableApi: true,
      apiPath: "",
      permissions: {
        create: ["admin"],
        read: ["admin", "user"],
        update: ["admin"],
        delete: ["admin"],
      },
    } satisfies Partial<EntityFormData>,
    onSubmit: async ({ value }) => {
      if (!databaseId && !isEdit) {
        console.error("Database ID is required for creating entity");
        toast.error("Database ID is required");
        return;
      }

      // Validate fields
      if (fields.length === 0) {
        toast.error("At least one field is required");
        return;
      }

      // Validate field names
      const fieldNames = fields.map((f) => f.name);
      const duplicates = fieldNames.filter(
        (name, index) => fieldNames.indexOf(name) !== index
      );
      if (duplicates.length > 0) {
        toast.error(`Duplicate field names: ${duplicates.join(", ")}`);
        return;
      }

      // Validate required field properties
      const invalidFields = fields.filter((f) => !f.name || !f.label);
      if (invalidFields.length > 0) {
        toast.error("All fields must have name and label");
        return;
      }

      const formData = { ...value, fields };

      if (isEdit && entity?._id && updateMutation) {
        // Update existing entity
        updateMutation.mutate(
          {
            id: entity._id,
            formData: formData as UpdateEntityRequestItem,
          },
          {
            onSuccess: () => {
              onOpenChange(false);
            },
          }
        );
      } else if (!isEdit && databaseId && createMutation) {
        // Create new entity
        createMutation.mutate(
          {
            ...formData,
            databaseId,
          } as CreateEntityRequestItem,
          {
            onSuccess: () => {
              onOpenChange(false);
            },
          }
        );
      }
    },
  });

  // Reset form and fields when entity changes or when opening modal for create
  useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => {
        if (entity?._id) {
          // Edit mode: populate form with entity data
          form.setFieldValue("name", entity.name || "");
          form.setFieldValue("displayName", entity.displayName || "");
          form.setFieldValue("description", entity.description || "");
          form.setFieldValue("icon", entity.icon || "");
          form.setFieldValue("timestamps", (entity.timestamps ?? true) as any);
          form.setFieldValue("softDelete", (entity.softDelete ?? false) as any);
          form.setFieldValue("enableApi", (entity.enableApi ?? true) as any);
          form.setFieldValue("apiPath", entity.apiPath || "");
          form.setFieldValue(
            "permissions",
            (entity.permissions || {
              create: ["admin"],
              read: ["admin", "user"],
              update: ["admin"],
              delete: ["admin"],
            }) as any
          );
          setFields(entity.fields || []);
        } else {
          // Create mode: reset form to default values
          form.reset();
          setFields([]);
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [open, entity?._id, entity, form]);

  const addField = () => {
    const newField: FieldFormData = {
      name: `field_${fields.length + 1}`,
      label: `Field ${fields.length + 1}`,
      type: "text",
      showInList: true,
      showInForm: true,
      sortable: true,
      searchable: true,
      order: fields.length,
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, field: FieldFormData) => {
    const newFields = [...fields];
    newFields[index] = field;
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleGenerateFields = (generatedFields: FieldFormData[]) => {
    // Merge generated fields with existing ones, avoiding duplicates by name
    const existingFieldNames = new Set(fields.map((f) => f.name));
    const newFields = generatedFields.filter(
      (f) => !existingFieldNames.has(f.name)
    );

    if (newFields.length > 0) {
      setFields([...fields, ...newFields]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl min-w-[50vw] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {isEdit ? "Edit Entity" : "Create New Entity"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the entity configuration"
              : "Define your entity structure and fields"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <Tabs
            defaultValue="basic"
            className="w-full flex flex-col flex-1 overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-2 mx-6 mt-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="fields">Fields</TabsTrigger>
              {/* <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger> */}
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 pb-4">
              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <form.Field name="name">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="name">Entity Name *</Label>
                      <Input
                        id="name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value.toLocaleLowerCase().trim())}
                        onBlur={field.handleBlur}
                        placeholder="products"
                        disabled={isEdit}
                      />
                      {field.state.meta.errors && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Lowercase with underscores only (e.g., products,
                        user_profiles)
                      </p>
                    </div>
                  )}
                </form.Field>

                <form.Field name="displayName">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name *</Label>
                      <Input
                        id="displayName"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Products"
                      />
                      {field.state.meta.errors && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="description">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Manage product catalogs"
                        rows={3}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="icon">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon</Label>
                      <Input
                        id="icon"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="shopping-cart"
                      />
                      <p className="text-xs text-muted-foreground">
                        Lucide icon name (e.g., shopping-cart, users, file-text)
                      </p>
                    </div>
                  )}
                </form.Field>
              </TabsContent>

              {/* Fields Tab */}
              <TabsContent value="fields">
                <Card>
                  <CardContent className="space-y-4">
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setGeneratorOpen(true)}
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate from Interface
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addField}
                      >
                        Add Field Manually
                      </Button>
                    </div>

                    {fields.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No fields added yet</p>
                        <p className="text-sm mt-2">
                          Generate fields from a TypeScript interface or add
                          them manually
                        </p>
                      </div>
                    ) : (
                      <>
                        {fields.map((field, index) => (
                          <FieldConfig
                            key={index}
                            field={field}
                            onUpdate={(updatedField) =>
                              updateField(index, updatedField)
                            }
                            onRemove={() => removeField(index)}
                          />
                        ))}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <form.Field name="timestamps">
                  {(field) => (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Timestamps</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically add createdAt and updatedAt fields
                        </p>
                      </div>
                      <Switch
                        checked={field.state.value as boolean}
                        onCheckedChange={(checked) =>
                          field.setValue(checked as any)
                        }
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="softDelete">
                  {(field) => (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Soft Delete</Label>
                        <p className="text-sm text-muted-foreground">
                          Mark records as deleted instead of removing them
                        </p>
                      </div>
                      <Switch
                        checked={field.state.value as boolean}
                        onCheckedChange={(checked) =>
                          field.setValue(checked as any)
                        }
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="enableApi">
                  {(field) => (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable API</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically generate REST API endpoints
                        </p>
                      </div>
                      <Switch
                        checked={field.state.value as boolean}
                        onCheckedChange={(checked) =>
                          field.setValue(checked as any)
                        }
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="apiPath">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="apiPath">API Path</Label>
                      <Input
                        id="apiPath"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="/api/v1/products"
                      />
                      <p className="text-xs text-muted-foreground">
                        Custom API endpoint path (leave empty for default)
                      </p>
                    </div>
                  )}
                </form.Field>
              </TabsContent>

              {/* Permissions Tab */}
              <TabsContent value="permissions" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-perm">Create Permission</Label>
                  <Input
                    id="create-perm"
                    defaultValue="admin"
                    placeholder="admin, user"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated roles
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="read-perm">Read Permission</Label>
                  <Input
                    id="read-perm"
                    defaultValue="admin, user"
                    placeholder="admin, user"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="update-perm">Update Permission</Label>
                  <Input
                    id="update-perm"
                    defaultValue="admin"
                    placeholder="admin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delete-perm">Delete Permission</Label>
                  <Input
                    id="delete-perm"
                    defaultValue="admin"
                    placeholder="admin"
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="border-t bg-background px-6 py-4 mt-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update" : "Create"} Entity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Interface Generator Modal */}
      <InterfaceGeneratorModal
        open={generatorOpen}
        onOpenChange={setGeneratorOpen}
        onGenerate={handleGenerateFields}
      />
    </Dialog>
  );
}
