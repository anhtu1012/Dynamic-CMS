/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";

export interface DynamicDataPayload {
  [key: string]: any;
}

export interface DynamicDataResponse {
  _id: string;
  [key: string]: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValidationResponse {
  isValid: boolean;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface DynamicDataListResponse {
  data: DynamicDataResponse[];
  total: number;
}

class DynamicDataServicesBase extends AxiosService {
  // Getter method to dynamically construct basePath with database_id
  private getBasePath(): string {
    try {
      const store = (window as any).__REDUX_STORE__;
      if (store) {
        const databaseId = store.getState()?.database?.selectedDatabase?.id;
        if (databaseId) {
          return `/${databaseId}`;
        }
      }
    } catch (error) {
      console.warn("Could not get database_id from Redux store:", error);
    }
    return "/dynamic-data"; // Fallback
  }

  /**
   * Create dynamic data for a collection
   */
  async createDynamicData(
    collectionName: string,
    data: DynamicDataPayload
  ): Promise<DynamicDataResponse> {
    return this.post<DynamicDataResponse, DynamicDataPayload>(
      `${this.getBasePath()}/${collectionName}`,
      data
    );
  }

  /**
   * Get all dynamic data for a collection
   */
  async getDynamicData(
    collectionName: string,
    params?: URLSearchParams
  ): Promise<DynamicDataListResponse> {
    if (params) {
      return this.getWithParams<DynamicDataListResponse>(
        `${this.getBasePath()}/${collectionName}`,
        params
      );
    }
    return this.get<DynamicDataListResponse>(
      `${this.getBasePath()}/${collectionName}`
    );
  }

  /**
   * Get single dynamic data by ID
   */
  async getDynamicDataById(
    collectionName: string,
    id: string
  ): Promise<DynamicDataResponse> {
    return this.get<DynamicDataResponse>(
      `${this.getBasePath()}/${collectionName}/${id}`
    );
  }

  /**
   * Update dynamic data
   */
  async updateDynamicData(
    collectionName: string,
    id: string,
    data: DynamicDataPayload
  ): Promise<DynamicDataResponse> {
    return this.put<DynamicDataResponse, DynamicDataPayload>(
      `${this.getBasePath()}/${collectionName}/${id}`,
      data
    );
  }

  /**
   * Delete dynamic data
   */
  async deleteDynamicData(collectionName: string, id: string): Promise<void> {
    return this.delete<void>(`${this.getBasePath()}/${collectionName}/${id}`);
  }
   // Import JSON data
  async importJson(data: any[], collectionName: string): Promise<any> {
    return this.put<any, any[]>(`${this.getBasePath()}/${collectionName}/replace-all`, data);
  }
}

const DynamicDataServices = new DynamicDataServicesBase();
export default DynamicDataServices;
