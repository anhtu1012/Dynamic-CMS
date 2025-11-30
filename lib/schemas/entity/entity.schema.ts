import { z } from "zod";

// Field validation schema
export const fieldValidationSchema = z.object({
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  enum: z.array(z.string()).optional(),
});

// Reference config schema
export const referenceConfigSchema = z.object({
  collection: z.string(),
  displayField: z.string(),
  multiple: z.boolean().optional(),
});

// Option schema for select/radio fields
export const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

// Field schema
export const fieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  label: z.string().optional(),
  type: z.enum([
    "text",
    "textarea",
    "string",
    "number",
    "email",
    "password",
    "date",
    "datetime",
    "boolean",
    "select",
    "radio",
    "checkbox",
    "file",
    "image",
    "reference",
    "array",
    "json",
  ]),
  description: z.string().optional(),
  defaultValue: z.any().optional(),
  validation: fieldValidationSchema.optional(),
  options: z.array(optionSchema).optional(),
  referenceConfig: referenceConfigSchema.optional(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  showInList: z.boolean().default(false),
  showInForm: z.boolean().default(true),
  sortable: z.boolean().default(false),
  searchable: z.boolean().default(false),
  order: z.number().default(0),
});

// Permissions schema
export const permissionsSchema = z.object({
  create: z.array(z.string()).optional(),
  read: z.array(z.string()).optional(),
  update: z.array(z.string()).optional(),
  delete: z.array(z.string()).optional(),
});

// Main entity schema
export const entitySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[a-z_][a-z0-9_]*$/, "Must be lowercase with underscores only"),
  displayName: z.string().min(1, "Display name is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  fields: z.array(fieldSchema).min(1, "At least one field is required"),
  timestamps: z.boolean().default(true),
  softDelete: z.boolean().default(false),
  enableApi: z.boolean().default(true),
  apiPath: z.string().optional(),
  permissions: permissionsSchema.optional(),
});

export type EntityFormData = z.infer<typeof entitySchema>;
export type FieldFormData = z.infer<typeof fieldSchema>;
export type FieldValidation = z.infer<typeof fieldValidationSchema>;
export type OptionData = z.infer<typeof optionSchema>;
