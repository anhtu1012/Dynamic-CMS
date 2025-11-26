/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldConfig } from "@/app/admin/entities/[entityName]/_components/FieldConfig";
import {
  type EntityFormData,
  type FieldFormData,
} from "@/lib/schemas/entity/entity.schema";
import { toast } from "sonner";

interface EntityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity?: EntityFormData & { _id?: string };
  onSuccess?: () => void;
}

export function EntityFormModal({
  open,
  onOpenChange,
  entity,
  onSuccess,
}: EntityFormModalProps) {
  const [fields, setFields] = useState<FieldFormData[]>([]);
  const isEdit = !!entity;

  const form = useForm({
    defaultValues: {
      name: entity?.name || "",
      displayName: entity?.displayName || "",
      description: entity?.description || "",
      icon: entity?.icon || "",
      fields: [],
      timestamps: entity?.timestamps ?? true,
      softDelete: entity?.softDelete ?? false,
      enableApi: entity?.enableApi ?? true,
      apiPath: entity?.apiPath || "",
      permissions: entity?.permissions || {
        create: ["admin"],
        read: ["admin", "user"],
        update: ["admin"],
        delete: ["admin"],
      },
    } satisfies Partial<EntityFormData>,
    onSubmit: async ({ value }) => {
      try {
        const formData = { ...value, fields };

        const url = isEdit
          ? `/api/collection-schemas/${entity._id}`
          : "/api/collection-schemas";

        const response = await fetch(url, {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to save entity");

        toast.success(
          isEdit
            ? "Entity updated successfully!"
            : "Entity created successfully!"
        );
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        console.error("Error saving entity:", error);
        toast.error("Failed to save entity");
      }
    },
  });

  // Load entity fields when editing
  useEffect(() => {
    if (entity?.fields) {
      setFields(entity.fields);
    } else {
      setFields([]);
    }
  }, [entity]);

  const addField = () => {
    const newField: FieldFormData = {
      name: `field_${fields.length + 1}`,
      label: `Field ${fields.length + 1}`,
      type: "text",
      showInList: true,
      showInForm: true,
      sortable: false,
      searchable: false,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl min-w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
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
        >
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="fields">Fields</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="name">Entity Name *</Label>
                    <Input
                      id="name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
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
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Entity Fields</CardTitle>
                      <CardDescription>
                        Define the fields for your entity
                      </CardDescription>
                    </div>
                    <Button type="button" onClick={addField} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No fields added yet</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={addField}
                        size="sm"
                      >
                        Add Your First Field
                      </Button>
                    </div>
                  ) : (
                    fields.map((field, index) => (
                      <FieldConfig
                        key={index}
                        field={field}
                        onUpdate={(updatedField) =>
                          updateField(index, updatedField)
                        }
                        onRemove={() => removeField(index)}
                      />
                    ))
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
          </Tabs>

          <DialogFooter className="mt-6">
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
    </Dialog>
  );
}
