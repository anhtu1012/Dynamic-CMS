"use client";

import DatabasesServices from "@/services/databases/databases.service";
import { useQuery } from "@tanstack/react-query";

// Hook to fetch databases list
export function useSidebarHandle() {
  return useQuery({
    queryKey: ["databases"],
    queryFn: async () => {
      const response = await DatabasesServices.getDatabases();
      return response;
    },
  });
}
