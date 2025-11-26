import { z } from "zod";

// Generic paginated response factory
export function paginatedResponseSchema<T extends z.ZodTypeAny>(
  itemSchema: T,
  defaults?: Partial<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>
) {
  const def = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    ...(defaults ?? {}),
  };

  return z.object({
    data: z.array(itemSchema).default([]),
    total: z.number().int().default(def.total),
    page: z.number().int().default(def.page),
    limit: z.number().int().default(def.limit),
    totalPages: z.number().int().default(def.totalPages),
  });
}

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
