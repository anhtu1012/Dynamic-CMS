"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDatabases,
  useSelectDatabase,
  useDeleteDatabase,
} from "./_hooks/useDatabases";
import { DatabaseSchema } from "@/lib/schemas/databases/databases.schema";
import CreateDatabaseModal from "./_components/CreateDatabaseModal";
import UpdateDatabaseModal from "./_components/UpdateDatabaseModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { permissionLimits } from "@/lib/mock-data/permission";

export default function DatabaseSelectionPage() {
  const router = useRouter();
  const { data: databasesData, isLoading } = useDatabases();
  const { selectDatabase } = useSelectDatabase();
  const deleteMutation = useDeleteDatabase();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDatabaseForEdit, setSelectedDatabaseForEdit] =
    useState<DatabaseSchema | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [databaseToDelete, setDatabaseToDelete] =
    useState<DatabaseSchema | null>(null);

  const handleSelectDatabase = (database: DatabaseSchema) => {
    selectDatabase(database);
    router.push("/admin");
  };

  const handleEdit = (database: DatabaseSchema, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDatabaseForEdit(database);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = async (
    database: DatabaseSchema,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setDatabaseToDelete(database);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!databaseToDelete) return;
    await deleteMutation.mutateAsync(databaseToDelete.id);
    setIsDeleteDialogOpen(false);
    setDatabaseToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDatabaseToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="w-full max-w-6xl px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-64 mx-auto mb-4 dark:bg-slate-800" />
            <Skeleton className="h-6 w-96 mx-auto dark:bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full dark:bg-slate-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const databases = databasesData?.data || [];
  const isLimitReached = databases.length >= permissionLimits.databaseLimits;

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="gap-2 pl-0 hover:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Select a Database
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Choose a database to work with or create a new one
            </p>
          </div>

          {/* Create New Database Button */}
          <div className="flex flex-col items-center justify-center mb-8 gap-2">
            <Button
              size="lg"
              onClick={() => {
                if (isLimitReached) {
                  toast.error(
                    `You have reached the limit of ${permissionLimits.databaseLimits} databases.`
                  );
                  return;
                }
                setIsCreateModalOpen(true);
              }}
              disabled={isLimitReached}
              className="gap-2 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create New Database ({databases.length}/
              {permissionLimits.databaseLimits})
            </Button>
            {isLimitReached && (
              <p className="text-sm text-red-500 dark:text-red-400">
                You have reached the maximum limit of{" "}
                {permissionLimits.databaseLimits} databases.
              </p>
            )}
          </div>

          {/* Database Cards Grid */}
          {databases.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-slate-400 text-lg mb-4">
                No databases found. Create your first database to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {databases.map((database) => (
                <Card
                  key={database.id}
                  className="flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary dark:bg-slate-900 dark:border-slate-700 dark:hover:border-white"
                  onClick={() => handleSelectDatabase(database)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">
                          {database.icon || "💾"}
                        </span>
                        <div>
                          <CardTitle className="text-xl dark:text-white">
                            {database.displayName || database.name}
                          </CardTitle>
                          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                            {database.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="mb-4 min-h-12 whitespace-pre-wrap wrap-break-word dark:text-slate-400">
                      {database.description || "No description"}
                    </CardDescription>

                    {/* Tags */}
                    {database.tags && database.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {database.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="dark:bg-slate-700 dark:text-slate-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-slate-400">
                          Collections
                        </p>
                        <p className="font-semibold text-lg dark:text-white">
                          {database.collectionsCount || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-slate-400">
                          Records
                        </p>
                        <p className="font-semibold text-lg dark:text-white">
                          {database.dataCount || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          database.isActive
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">
                        {database.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleEdit(database, e)}
                        className="dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => handleDelete(database, e)}
                        className="dark:bg-red-600 dark:hover:bg-red-700"
                      >
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        className="dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      >
                        Select
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Database Modal */}
      <CreateDatabaseModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md dark:bg-slate-900 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              Are you sure you want to delete{" "}
              <strong>
                {databaseToDelete?.displayName || databaseToDelete?.name}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDelete}
              className="dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="dark:bg-red-600 dark:hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Database Modal */}
      <UpdateDatabaseModal
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        database={selectedDatabaseForEdit}
      />
    </>
  );
}
