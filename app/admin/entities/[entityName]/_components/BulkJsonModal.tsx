import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useImportJson } from "../../_hooks/useEntities";
import { toast } from "sonner";

interface BulkJsonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: any[];
  collectionName: string;
}

export default function BulkJsonModal({
  open,
  onOpenChange,
  initialData,
  collectionName,
}: BulkJsonModalProps) {
  const [jsonContent, setJsonContent] = useState("");
  const importMutation = useImportJson();

  useEffect(() => {
    if (open) {
      // Filter out system fields
      const excludedFields = [
        "_id",
        "userId",
        "databaseId",
        "_collection",
        "deletedAt",
        "createdBy",
        "updatedBy",
        "createdAt",
        "updatedAt",
        "__v",
      ];

      const formattedData = initialData.map((item) => {
        const newItem = { ...item };
        excludedFields.forEach((field) => delete newItem[field]);
        return newItem;
      });

      // Format initial data as pretty JSON
      setJsonContent(JSON.stringify(formattedData, null, 2));
    }
  }, [open, initialData]);

  const handleSave = async () => {
    try {
      const parsedData = JSON.parse(jsonContent);
      if (!Array.isArray(parsedData)) {
        toast.error("JSON must be an array of objects");
        return;
      }

      await importMutation.mutateAsync({
        data: parsedData,
        collectionName,
      });

      // Close modal after successful import
      onOpenChange(false);
    } catch (e) {
      toast.error("Invalid JSON format");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import/Edit Data via JSON</DialogTitle>
          <DialogDescription>
            Edit the JSON below to modify, add, or remove data.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-[400px] flex flex-col gap-4 overflow-hidden">
          <Textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            className="flex-1 font-mono text-sm resize-none"
            placeholder="[\n  {\n    'field': 'value'\n  }\n]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={importMutation.isPending}>
            {importMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
