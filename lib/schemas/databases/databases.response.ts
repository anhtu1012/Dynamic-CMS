import { z } from "zod";
import { databaseSchema } from "./databases.schema";
import { paginatedResponseSchema, PaginatedResponse } from "../pagination";

export const databasesListResponseSchema =
  paginatedResponseSchema(databaseSchema);
export type DatabasesListResponse = PaginatedResponse<
  z.infer<typeof databaseSchema>
>;

export const singleDatabaseResponseSchema = z.object({ data: databaseSchema });
export type SingleDatabaseResponse = z.infer<
  typeof singleDatabaseResponseSchema
>;
