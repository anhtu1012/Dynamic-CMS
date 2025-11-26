import { z } from "zod";
import { entitySchema } from "./entity.schema";

// Create request schema — aligns with the project's `CreateXRequest` pattern
export const CreateEntityRequest = z
  .object({
    databaseId: z.string().min(1, "databaseId is required"),
  })
  .merge(entitySchema);

export type CreateEntityRequestItem = z.infer<typeof CreateEntityRequest>;

// Update request: partial of create (useful for PATCH operations)
export const UpdateEntityRequest = CreateEntityRequest.partial();

export type UpdateEntityRequestItem = z.infer<typeof UpdateEntityRequest>;

export default CreateEntityRequest;
