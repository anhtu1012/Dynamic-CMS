/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { FieldFormData } from "@/lib/schemas/entity/entity.schema";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DynamicDataFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionName: string;
  fields: FieldFormData[];
  onSubmit: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
  isLoading?: boolean;
  validationErrors?: Array<{ field: string; message: string }> | null;
}

export function DynamicDataFormModal({
  open,
  onOpenChange,
  collectionName,
  fields,
  onSubmit,
  initialData,
  isLoading = false,
  validationErrors = null,
}: DynamicDataFormModalProps) {
  // Initialize form data - use useMemo to avoid cascading renders
  const initialFormData = useMemo(() => {
    if (initialData) {
      // Remove system fields from initial data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, ...cleanData } = initialData;
      return cleanData;
    }

    // Set default values from fields
    const defaultData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultData[field.name] = field.defaultValue;
      } else if (field.type === "boolean" || field.type === "checkbox") {
        defaultData[field.name] = false;
      } else if (field.type === "number") {
        defaultData[field.name] = 0;
      } else if (field.type === "array") {
        defaultData[field.name] = [];
      } else if (field.type === "json") {
        defaultData[field.name] = {};
      } else {
        defaultData[field.name] = "";
      }
    });
    return defaultData;
  }, [initialData, fields]);

  const [formData, setFormData] =
    useState<Record<string, any>>(initialFormData);

  // Update form data when initialFormData changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields on frontend (exclude system fields)
    const missingFields = fields.filter(
      (field) =>
        field.validation?.required &&
        !["_id", "id", "createdAt", "updatedAt"].includes(field.name) &&
        (formData[field.name] === undefined ||
          formData[field.name] === "" ||
          formData[field.name] === null)
    );

    if (missingFields.length > 0) {
      toast.error(
        `Required fields missing: ${missingFields
          .map((f) => f.label || f.name)
          .join(", ")}`
      );
      return;
    }

    // Remove system fields before submitting
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, id, createdAt, updatedAt, ...cleanFormData } = formData;

    // Submit to backend - validation will happen there
    onSubmit(cleanFormData);
  };

  const renderField = (field: FieldFormData) => {
    const value = formData[field.name];

    switch (field.type) {
      case "text":
      case "string":
      case "email":
        return (
          <Input
            type={field.type === "email" ? "email" : "text"}
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.validation?.required}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
          />
        );

      case "password":
        return (
          <Input
            type="password"
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.validation?.required}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.validation?.required}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
            rows={4}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) =>
              handleFieldChange(
                field.name,
                e.target.value ? Number(e.target.value) : null
              )
            }
            placeholder={field.placeholder}
            required={field.validation?.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.validation?.required}
          />
        );

      case "datetime":
        return (
          <Input
            type="datetime-local"
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.validation?.required}
          />
        );

      case "boolean":
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value || false}
              onCheckedChange={(checked) =>
                handleFieldChange(field.name, checked)
              }
            />
            <Label>{value ? "Yes" : "No"}</Label>
          </div>
        );

      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(val) => handleFieldChange(field.name, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor={`${field.name}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case "json":
        return (
          <Textarea
            value={
              typeof value === "string" ? value : JSON.stringify(value, null, 2)
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleFieldChange(field.name, parsed);
              } catch {
                handleFieldChange(field.name, e.target.value);
              }
            }}
            placeholder={field.placeholder || '{"key": "value"}'}
            required={field.validation?.required}
            rows={4}
            className="font-mono text-sm"
          />
        );

      case "array":
        return (
          <Textarea
            value={
              Array.isArray(value)
                ? value.join("\n")
                : typeof value === "string"
                ? value
                : ""
            }
            onChange={(e) => {
              const text = e.target.value;
              if (text === "") {
                handleFieldChange(field.name, []);
              } else {
                const lines = text.split("\n");
                handleFieldChange(field.name, lines);
              }
            }}
            onBlur={(e) => {
              // Clean up on blur: remove empty lines
              const lines = e.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
              handleFieldChange(field.name, lines);
            }}
            placeholder={
              field.placeholder ||
              "Enter items (one per line)\nitem1\nitem2\nitem3"
            }
            required={field.validation?.required}
            rows={4}
            className="font-mono text-sm"
          />
        );

      default:
        return (
          <Input
            value={value || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Data" : "Create New Data"}
          </DialogTitle>
          <DialogDescription>
            Fill in the form fields to {initialData ? "update" : "create"} data
            for {collectionName}
          </DialogDescription>
        </DialogHeader>

        {validationErrors && validationErrors.length > 0 && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-sm text-destructive font-medium">
              Validation Errors:
            </p>
            <ul className="mt-2 space-y-1">
              {validationErrors.map((error, idx) => (
                <li key={idx} className="text-sm text-destructive">
                  • <span className="font-medium">{error.field}:</span>{" "}
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields
            .filter((field) => field.showInForm !== false)
            .filter(
              (field) => !["id", "createdAt", "updatedAt"].includes(field.name)
            )
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label || field.name}
                  {field.validation?.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </Label>
                {renderField(field)}
                {field.helpText && (
                  <p className="text-sm text-muted-foreground">
                    {field.helpText}
                  </p>
                )}
              </div>
            ))}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : initialData ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
