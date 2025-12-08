"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import EntityServices from "@/services/entity/entity.service";
import {
  CreateEntityRequestItem,
  UpdateEntityRequestItem,
} from "@/lib/schemas/entity/entity.request";
import DynamicServices from "@/services/dynamic/dynamic.service";
import DynamicDataServices from "@/services/dynamic-data/dynamic-data.service";

// Helper to extract error messages from server responses
function extractErrorMessage(error: unknown): string | undefined {
  try {
    if (error && typeof error === "object") {
      const errObj = error as Record<string, unknown>;
      const response = errObj["response"];
      const respData =
        response && typeof response === "object"
          ? (response as Record<string, unknown>)["data"]
          : undefined;

      if (respData && typeof respData === "object") {
        const respRec = respData as Record<string, unknown>;
        const message = respRec["message"];
        if (Array.isArray(message)) return message.join(", ");
        if (typeof message === "string") return message;
        const err = respRec["error"];
        if (typeof err === "string") return err;
      }

      const msg = errObj["message"];
      if (typeof msg === "string") return msg;
    }
  } catch {
    // ignore parsing errors
  }
  return undefined;
}

// Hook to fetch entities list with pagination
export function useEntities(
  databaseId?: string,
  page: number = 1,
  limit: number = 10
) {
  const options: UseQueryOptions = {
    queryKey: ["entities", databaseId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      // Remove databaseId from params - it will be sent via header
      params.append("page", String(page));
      params.append("limit", String(limit));
      return await EntityServices.getEntities(params);
    },
    enabled: !!databaseId,
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error) || "Failed to fetch entities";
      toast.error(msg);
    },
  } as UseQueryOptions;

  return useQuery(options);
}

// Hook to fetch single entity by id
export function useEntityById(id: string) {
  const singleOptions: UseQueryOptions = {
    queryKey: ["entity", id],
    queryFn: async () => {
      return await EntityServices.getEntityById(id);
    },
    enabled: !!id,
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error) || "Failed to fetch entity";
      toast.error(msg);
    },
  } as UseQueryOptions;

  return useQuery(singleOptions);
}

// Hook to create a new entity
export function useCreateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CreateEntityRequestItem) => {
      return await EntityServices.createEntity(formData);
    },
    onSuccess: (data) => {
      // Invalidate all entities queries for the specific database
      queryClient.invalidateQueries({
        queryKey: ["entities", data.databaseId],
      });
      toast.success("Entity created successfully!");
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error) || "Failed to create entity";
      toast.error(msg);
    },
  });
}

// Hook to update an entity
export function useUpdateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: UpdateEntityRequestItem;
    }) => {
      return await EntityServices.updateEntity(id, formData);
    },
    onSuccess: (data) => {
      // Invalidate both the entity detail and all list queries
      queryClient.invalidateQueries({ queryKey: ["entity", data._id] });
      queryClient.invalidateQueries({
        queryKey: ["entities", data.databaseId],
      });
      toast.success("Entity updated successfully!");
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error) || "Failed to update entity";
      toast.error(msg);
    },
  });
}

// Hook to delete an entity (permanent)
export function useDeleteEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; databaseId: string }) => {
      return await EntityServices.deactivateEntityPermanent(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["entities", variables.databaseId],
      });
      toast.success("Entity deleted successfully!");
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error) || "Failed to delete entity";
      toast.error(msg);
    },
  });
}

// Hook to soft delete/deactivate an entity
export function useDeactivateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; databaseId: string }) => {
      return await EntityServices.deactivateEntity(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["entities", variables.databaseId],
      });
      toast.success("Entity deactivated successfully!");
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error) || "Failed to deactivate entity";
      toast.error(msg);
    },
  });
}

// Hook to import JSON data
export function useImportJson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      collectionName,
    }: {
      data: any[];
      collectionName: string;
    }) => {
      return await DynamicDataServices.importJson(data, collectionName);
    },
    onSuccess: (_, variables) => {
      // Invalidate both entities and dynamic-data queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["entities", variables.collectionName],
      });
      queryClient.invalidateQueries({
        queryKey: ["dynamic-data", variables.collectionName],
      });
      toast.success("Data imported successfully!");
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error) || "Failed to import data";
      toast.error(msg);
    },
  });
}
