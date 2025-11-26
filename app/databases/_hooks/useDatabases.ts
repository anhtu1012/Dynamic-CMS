"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import DatabasesServices from "@/services/databases/databases.service";
import {
  setDatabases,
  addDatabase,
  setSelectedDatabase,
} from "@/redux/store/slices/databaseSlice";
import {
  CreateDatabaseRequestItem,
  UpdateDatabaseRequestItem,
} from "@/lib/schemas/databases/databases.request";
import { DatabaseSchema } from "@/lib/schemas/databases/databases.schema";

// Hook to fetch databases list
export function useDatabases() {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["databases"],
    queryFn: async () => {
      const response = await DatabasesServices.getDatabases();
      dispatch(setDatabases(response.data));
      return response;
    },
  });
}

// Hook to create a new database
export function useCreateDatabase() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CreateDatabaseRequestItem) => {
      return await DatabasesServices.createDatabase(formData);
    },
    onSuccess: (data) => {
      dispatch(addDatabase(data.data));
      queryClient.invalidateQueries({ queryKey: ["databases"] });
      toast.success("Database created successfully!");
    },
    onError: (error: unknown) => {
      // Handle ServiceResponse validation errors
      if (error && typeof error === "object" && "message" in error) {
        const serviceError = error as { message?: string | string[] };
        const errorMessage = Array.isArray(serviceError.message)
          ? serviceError.message.join(", ")
          : serviceError.message;
        toast.error(errorMessage || "Failed to create database");
        return;
      }

      // Handle API response errors
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Failed to create database");
    },
  });
}

// Hook to select a database
export function useSelectDatabase() {
  const dispatch = useDispatch();

  return {
    selectDatabase: (database: DatabaseSchema) => {
      dispatch(setSelectedDatabase(database));
      localStorage.setItem("selectedDatabase", JSON.stringify(database));
      toast.success(
        `Selected database: ${database.displayName || database.name}`
      );
    },
  };
}

// Hook to update a database
export function useUpdateDatabase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: UpdateDatabaseRequestItem;
    }) => {
      return await DatabasesServices.updateDatabase(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["databases"] });
      toast.success("Database updated successfully!");
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object" && "message" in error) {
        const serviceError = error as { message?: string | string[] };
        const errorMessage = Array.isArray(serviceError.message)
          ? serviceError.message.join(", ")
          : serviceError.message;
        toast.error(errorMessage || "Failed to update database");
        return;
      }

      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Failed to update database");
    },
  });
}

// Hook to delete a database
export function useDeleteDatabase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await DatabasesServices.deactivateDatabasePermanent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["databases"] });
      toast.success("Database deleted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Failed to delete database");
    },
  });
}
