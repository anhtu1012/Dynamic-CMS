import { AxiosService } from "@/apis/axios.base";
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";
import type { ZodSchema } from "zod";
import {
  CreateDatabaseRequest,
  CreateDatabaseRequestItem,
  UpdateDatabaseRequest,
  UpdateDatabaseRequestItem,
} from "@/lib/schemas/databases/databases.request";
import {
  DatabasesListResponse,
  SingleDatabaseResponse,
} from "@/lib/schemas/databases/databases.response";

class DatabasesServicesBase extends AxiosService {
  protected readonly basePath = "/databases";

  // Create a new database
  async createDatabase(
    formData: CreateDatabaseRequestItem
  ): Promise<SingleDatabaseResponse> {
    ValidateBaseClass.validate(
      formData,
      CreateDatabaseRequest as unknown as ZodSchema
    );
    return this.post<SingleDatabaseResponse, CreateDatabaseRequestItem>(
      `${this.basePath}`,
      formData
    );
  }

  // Get list of databases (paginated). Pass URLSearchParams with page/limit or filters
  async getDatabases(params?: URLSearchParams): Promise<DatabasesListResponse> {
    if (params) {
      return this.getWithParams<DatabasesListResponse>(
        `${this.basePath}`,
        params
      );
    }
    return this.get<DatabasesListResponse>(`${this.basePath}`);
  }

  // Get single database by id
  async getDatabaseById(id: string): Promise<SingleDatabaseResponse> {
    return this.get<SingleDatabaseResponse>(`${this.basePath}/${id}`);
  }

  // Update database by id
  async updateDatabase(
    id: string,
    formData: UpdateDatabaseRequestItem
  ): Promise<SingleDatabaseResponse> {
    ValidateBaseClass.validate(
      formData,
      UpdateDatabaseRequest as unknown as ZodSchema
    );
    return this.put<SingleDatabaseResponse, UpdateDatabaseRequestItem>(
      `${this.basePath}/${id}`,
      formData
    );
  }

  // Soft delete / deactivate database
  async deactivateDatabase(id: string): Promise<void> {
    await this.delete<void>(`${this.basePath}/${id}`);
  }
  async deactivateDatabasePermanent(id: string): Promise<void> {
    await this.delete<void>(`${this.basePath}/${id}/permanent`);
  }
  // Permanent delete
  async permanentDeleteDatabase(id: string): Promise<void> {
    await this.delete<void>(`${this.basePath}/${id}/permanent`);
  }
}

const DatabasesServices = new DatabasesServicesBase();
export default DatabasesServices;
