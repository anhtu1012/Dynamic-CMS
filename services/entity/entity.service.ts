import { AxiosService } from "@/apis/axios.base";
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";
import type { ZodSchema } from "zod";

import {
  EntitiesListResponse,
  SingleEntitiesResponse,
} from "@/lib/schemas/entity/entity.response";
import CreateEntityRequest, {
  CreateEntityRequestItem,
  UpdateEntityRequest,
  UpdateEntityRequestItem,
} from "@/lib/schemas/entity/entity.request";

class EntityServicesBase extends AxiosService {
  protected readonly basePath = "/collection-schemas";

  // Create a new entity
  async createEntity(
    formData: CreateEntityRequestItem
  ): Promise<SingleEntitiesResponse> {
    ValidateBaseClass.validate(
      formData,
      CreateEntityRequest as unknown as ZodSchema
    );
    return this.post<SingleEntitiesResponse, CreateEntityRequestItem>(
      `${this.basePath}`,
      formData
    );
  }

  // Get list of entities (paginated). Pass URLSearchParams with page/limit or filters
  async getEntities(params?: URLSearchParams): Promise<EntitiesListResponse> {
    if (params) {
      return this.getWithParams<EntitiesListResponse>(
        `${this.basePath}/all`,
        params
      );
    }
    return this.get<EntitiesListResponse>(`${this.basePath}`);
  }

  // Get single entity by id
  async getEntityById(id: string): Promise<SingleEntitiesResponse> {
    return this.get<SingleEntitiesResponse>(`${this.basePath}/${id}`);
  }
  async getEntityByName(name: string): Promise<SingleEntitiesResponse> {
    return this.get<SingleEntitiesResponse>(`${this.basePath}/by-name/${name}`);
  }

  // Update entity by id
  async updateEntity(
    id: string,
    formData: UpdateEntityRequestItem
  ): Promise<SingleEntitiesResponse> {
    ValidateBaseClass.validate(
      formData,
      UpdateEntityRequest as unknown as ZodSchema
    );
    return this.patch<SingleEntitiesResponse, UpdateEntityRequestItem>(
      `${this.basePath}/${id}`,
      formData
    );
  }

  // Soft delete / deactivate entity
  async deactivateEntity(id: string): Promise<void> {
    await this.delete<void>(`${this.basePath}/${id}`);
  }

  // Permanent delete entity
  async deactivateEntityPermanent(id: string): Promise<void> {
    await this.delete<void>(`${this.basePath}/${id}`);
  }

 
}

const EntityServices = new EntityServicesBase();
export default EntityServices;
