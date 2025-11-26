"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { FieldFormData } from "@/lib/schemas/entity/entity.schema";

interface FieldConfigProps {
  field: FieldFormData;
  onUpdate: (field: FieldFormData) => void;
  onRemove: () => void;
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "password", label: "Password" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "Date Time" },
  { value: "boolean", label: "Boolean" },
  { value: "select", label: "Select" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
  { value: "file", label: "File" },
  { value: "image", label: "Image" },
  { value: "reference", label: "Reference" },
  { value: "array", label: "Array" },
  { value: "json", label: "JSON" },
];

export function FieldConfig({ field, onUpdate, onRemove }: FieldConfigProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const updateField = (updates: Partial<FieldFormData>) => {
    onUpdate({ ...field, ...updates });
  };

  const addOption = () => {
    const options = field.options || [];
    onUpdate({
      ...field,
      options: [...options, { label: "", value: "" }],
    });
  };

  const updateOption = (
    index: number,
    updates: { label?: string; value?: string }
  ) => {
    const options = [...(field.options || [])];
    options[index] = { ...options[index], ...updates };
    updateField({ options });
  };

  const removeOption = (index: number) => {
    const options = field.options?.filter((_, i) => i !== index) || [];
    updateField({ options });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{field.type}</Badge>
          <span className="text-sm text-muted-foreground">
            {field.label || field.name}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((s) => !s)}
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>

          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!collapsed && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`field-name-${field.name}`}>Field Name *</Label>
              <Input
                id={`field-name-${field.name}`}
                value={field.name}
                onChange={(e) => updateField({ name: e.target.value })}
                placeholder="field_name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`field-label-${field.name}`}>Label *</Label>
              <Input
                id={`field-label-${field.name}`}
                value={field.label}
                onChange={(e) => updateField({ label: e.target.value })}
                placeholder="Field Label"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`field-type-${field.name}`}>Field Type *</Label>
              <Select
                value={field.type}
                onValueChange={(value) =>
                  updateField({ type: value as FieldFormData["type"] })
                }
              >
                <SelectTrigger
                  id={`field-type-${field.name}`}
                  className="w-full"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`field-placeholder-${field.name}`}>
                Placeholder
              </Label>
              <Input
                id={`field-placeholder-${field.name}`}
                value={field.placeholder || ""}
                onChange={(e) => updateField({ placeholder: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`field-description-${field.name}`}>
              Description
            </Label>
            <Textarea
              id={`field-description-${field.name}`}
              value={field.description || ""}
              onChange={(e) => updateField({ description: e.target.value })}
              rows={2}
            />
          </div>

          {/* Options for select/radio fields */}
          {(field.type === "select" || field.type === "radio") && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      value={option.label}
                      onChange={(e) =>
                        updateOption(index, { label: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={option.value}
                      onChange={(e) =>
                        updateOption(index, { value: e.target.value })
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reference config for reference type */}
          {field.type === "reference" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reference Collection</Label>
                  <Input
                    value={field.referenceConfig?.collection || ""}
                    onChange={(e) =>
                      updateField({
                        referenceConfig: {
                          ...field.referenceConfig,
                          collection: e.target.value,
                          displayField:
                            field.referenceConfig?.displayField || "",
                        },
                      })
                    }
                    placeholder="users"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Display Field</Label>
                  <Input
                    value={field.referenceConfig?.displayField || ""}
                    onChange={(e) =>
                      updateField({
                        referenceConfig: {
                          ...field.referenceConfig,
                          collection: field.referenceConfig?.collection || "",
                          displayField: e.target.value,
                        },
                      })
                    }
                    placeholder="name"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={field.referenceConfig?.multiple || false}
                  onCheckedChange={(checked) =>
                    updateField({
                      referenceConfig: {
                        ...field.referenceConfig,
                        collection: field.referenceConfig?.collection || "",
                        displayField: field.referenceConfig?.displayField || "",
                        multiple: checked,
                      },
                    })
                  }
                />
                <Label>Allow Multiple</Label>
              </div>
            </div>
          )}

          {/* Display settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={field.showInList}
                onCheckedChange={(checked) =>
                  updateField({ showInList: checked })
                }
              />
              <Label>Show in List</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={field.showInForm}
                onCheckedChange={(checked) =>
                  updateField({ showInForm: checked })
                }
              />
              <Label>Show in Form</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={field.sortable}
                onCheckedChange={(checked) =>
                  updateField({ sortable: checked })
                }
              />
              <Label>Sortable</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={field.searchable}
                onCheckedChange={(checked) =>
                  updateField({ searchable: checked })
                }
              />
              <Label>Searchable</Label>
            </div>
          </div>

          {/* Validation rules */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"} Validation Rules
            </Button>

            {showAdvanced && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                {(field.type === "text" || field.type === "textarea") && (
                  <>
                    <div className="space-y-2">
                      <Label>Min Length</Label>
                      <Input
                        type="number"
                        value={field.validation?.minLength || ""}
                        onChange={(e) =>
                          updateField({
                            validation: {
                              ...field.validation,
                              minLength: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Length</Label>
                      <Input
                        type="number"
                        value={field.validation?.maxLength || ""}
                        onChange={(e) =>
                          updateField({
                            validation: {
                              ...field.validation,
                              maxLength: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {field.type === "number" && (
                  <>
                    <div className="space-y-2">
                      <Label>Min Value</Label>
                      <Input
                        type="number"
                        value={field.validation?.min || ""}
                        onChange={(e) =>
                          updateField({
                            validation: {
                              ...field.validation,
                              min: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Value</Label>
                      <Input
                        type="number"
                        value={field.validation?.max || ""}
                        onChange={(e) =>
                          updateField({
                            validation: {
                              ...field.validation,
                              max: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={field.validation?.required || false}
                    onCheckedChange={(checked) =>
                      updateField({
                        validation: { ...field.validation, required: checked },
                      })
                    }
                  />
                  <Label>Required</Label>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
