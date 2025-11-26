"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import EntityServices from "@/services/entity/entity.service";
import {
  CreateEntityRequestItem,
  UpdateEntityRequestItem,
} from "@/lib/schemas/entity/entity.request";

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

// Hook to fetch entities list
export function useEntities(databaseId?: string) {
  const options: UseQueryOptions = {
    queryKey: ["entities", databaseId],
    queryFn: async () => {
      const params = databaseId
        ? new URLSearchParams({ databaseId })
        : undefined;
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
      // Invalidate entities list for the specific database
      queryClient.invalidateQueries({
        queryKey: ["entities", data.data.databaseId],
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
      // Invalidate both the entity detail and list
      queryClient.invalidateQueries({ queryKey: ["entity", data.data._id] });
      queryClient.invalidateQueries({
        queryKey: ["entities", data.data.databaseId],
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
