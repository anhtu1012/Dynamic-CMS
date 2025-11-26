import z from "zod";
import { PaginatedResponse, paginatedResponseSchema } from "../pagination";
import { entitySchema } from "./entity.schema";

// Entity response schema with additional fields from backend
export const entityResponseSchema = entitySchema.extend({
  _id: z.string(),
  databaseId: z.string(),
  version: z.number().default(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type EntityResponse = z.infer<typeof entityResponseSchema>;

export const entitiesListResponseSchema =
  paginatedResponseSchema(entityResponseSchema);
export type EntitiesListResponse = PaginatedResponse<EntityResponse>;

export const singleEntitiesResponseSchema = z.object({
  data: entityResponseSchema,
});
export type SingleEntitiesResponse = z.infer<
  typeof singleEntitiesResponseSchema
>;
