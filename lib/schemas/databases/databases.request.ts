import { z } from "zod";

// Create request schema — aligns with NestJS CreateDatabaseDto
export const CreateDatabaseRequest = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Name must be lowercase, alphanumeric with hyphens only",
    }),

  displayName: z.string().min(1, { message: "Display name is required" }),

  description: z.string().optional(),

  icon: z.string().optional(),

  settings: z
    .object({
      defaultLanguage: z.string().optional(),
      timezone: z.string().optional(),
      dateFormat: z.string().optional(),
    })
    .optional(),

  tags: z.array(z.string()).optional(),
});

export type CreateDatabaseRequestItem = z.infer<typeof CreateDatabaseRequest>;

// Update request: partial of create plus optional isActive
export const UpdateDatabaseRequest = CreateDatabaseRequest.partial().extend({
  isActive: z.boolean().optional(),
});

export type UpdateDatabaseRequestItem = z.infer<typeof UpdateDatabaseRequest>;
