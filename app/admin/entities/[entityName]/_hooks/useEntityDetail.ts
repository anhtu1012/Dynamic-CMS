"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import EntityServices from "@/services/entity/entity.service";
import { UpdateEntityRequestItem } from "@/lib/schemas/entity/entity.request";

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

// Hook to fetch entity by name
export function useEntityByName(entityName: string) {
  const options: UseQueryOptions = {
    queryKey: ["entity", "name", entityName],
    queryFn: async () => {
      const response = await EntityServices.getEntityByName(entityName);

      return response;
    },
    enabled: !!entityName,
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error) || "Failed to fetch entity";
      toast.error(msg);
    },
  } as UseQueryOptions;

  return useQuery(options);
}

// Hook to update entity from detail page
export function useUpdateEntityDetail() {
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
      // Invalidate the specific entity query by name
      queryClient.invalidateQueries({
        queryKey: ["entity", "name", data.name],
      });
      // Also invalidate by ID
      queryClient.invalidateQueries({ queryKey: ["entity", data._id] });
      // Invalidate list queries
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

// Hook to delete entity from detail page
export function useDeleteEntityDetail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; databaseId: string }) => {
      return await EntityServices.deactivateEntityPermanent(id);
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries
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
