import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DynamicDataServices, {
  type DynamicDataPayload,
} from "@/services/dynamic-data/dynamic-data.service";
import { toast } from "sonner";

/**
 * Hook to get dynamic data list
 */
export function useDynamicData(
  collectionName: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
) {
  return useQuery({
    queryKey: ["dynamic-data", collectionName, params],
    queryFn: async () => {
      const urlParams = new URLSearchParams();
      if (params?.page) urlParams.append("page", params.page.toString());
      if (params?.limit) urlParams.append("limit", params.limit.toString());
      if (params?.search) urlParams.append("search", params.search);
      if (params?.sortBy) urlParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) urlParams.append("sortOrder", params.sortOrder);

      return await DynamicDataServices.getDynamicData(
        collectionName,
        urlParams.toString() ? urlParams : undefined
      );
    },
    enabled: !!collectionName,
  });
}

/**
 * Hook to get single dynamic data by ID
 */
export function useDynamicDataById(collectionName: string, id: string) {
  return useQuery({
    queryKey: ["dynamic-data", collectionName, id],
    queryFn: async () => {
      return await DynamicDataServices.getDynamicDataById(collectionName, id);
    },
    enabled: !!collectionName && !!id,
  });
}

/**
 * Hook to create dynamic data
 */
export function useCreateDynamicData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionName,
      data,
    }: {
      collectionName: string;
      data: DynamicDataPayload;
    }) => {
      return await DynamicDataServices.createDynamicData(collectionName, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["dynamic-data", variables.collectionName],
      });
      toast.success("Data created successfully");
    },
    // Don't show toast error here - let parent handle it
  });
}

/**
 * Hook to update dynamic data
 */
export function useUpdateDynamicData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionName,
      id,
      data,
    }: {
      collectionName: string;
      id: string;
      data: DynamicDataPayload;
    }) => {
      return await DynamicDataServices.updateDynamicData(
        collectionName,
        id,
        data
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["dynamic-data", variables.collectionName],
      });
      toast.success("Data updated successfully");
    },
    // Don't show toast error here - let parent handle it
  });
}

/**
 * Hook to delete dynamic data
 */
export function useDeleteDynamicData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionName,
      id,
    }: {
      collectionName: string;
      id: string;
    }) => {
      return await DynamicDataServices.deleteDynamicData(collectionName, id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["dynamic-data", variables.collectionName],
      });
      toast.success("Data deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete data");
    },
  });
}
