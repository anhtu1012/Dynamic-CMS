import { z } from "zod";

// Settings object for a database
export const databaseSettingsSchema = z.object({
  defaultLanguage: z.string().optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
});

// Main database schema (response shape)
export const databaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  displayName: z.string().optional(),
  description: z.string().optional(),
  userId: z.string().optional(),
  isActive: z.boolean().default(true),
  icon: z.string().optional(),
  settings: databaseSettingsSchema.optional().default({}),
  tags: z.array(z.string()).default([]),
  collectionsCount: z.number().int().default(0),
  dataCount: z.number().int().default(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type DatabaseSchema = z.infer<typeof databaseSchema>;

// Schema used when creating a database (POST request)
export const createDatabaseSchema = z
  .object({
    name: z.string().min(1),
    displayName: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    settings: databaseSettingsSchema.optional(),
    tags: z.array(z.string()).optional(),
  })
  .strict();

export const updateDatabaseSchema = createDatabaseSchema.partial();

export type CreateDatabaseSchema = z.infer<typeof createDatabaseSchema>;
export type UpdateDatabaseSchema = z.infer<typeof updateDatabaseSchema>;
