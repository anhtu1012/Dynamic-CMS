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
import { BulkImportResponse } from "@/lib/schemas/entity/entity.response";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [importResult, setImportResult] = useState<BulkImportResponse | null>(
    null
  );
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
      setImportResult(null);
    }
  }, [open, initialData]);

  const handleSave = async () => {
    try {
      const parsedData = JSON.parse(jsonContent);
      if (!Array.isArray(parsedData)) {
        toast.error("JSON must be an array of objects");
        return;
      }

      const result = await importMutation.mutateAsync({
        data: parsedData,
        collectionName,
      });
      setImportResult(result);
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
          {!importResult ? (
            <Textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              className="flex-1 font-mono text-sm resize-none"
              placeholder="[\n  {\n    'field': 'value'\n  }\n]"
            />
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <AlertTitle className="text-green-800">Created</AlertTitle>
                  <AlertDescription className="text-green-700 text-2xl font-bold">
                    {importResult.created}
                  </AlertDescription>
                </Alert>
                <Alert variant="default" className="bg-red-50 border-red-200">
                  <AlertTitle className="text-red-800">Deleted</AlertTitle>
                  <AlertDescription className="text-red-700 text-2xl font-bold">
                    {importResult.deleted}
                  </AlertDescription>
                </Alert>
                <Alert
                  variant="default"
                  className="bg-orange-50 border-orange-200"
                >
                  <AlertTitle className="text-orange-800">Failed</AlertTitle>
                  <AlertDescription className="text-orange-700 text-2xl font-bold">
                    {importResult.failed}
                  </AlertDescription>
                </Alert>
              </div>

              {importResult.results && importResult.results.length > 0 && (
                <div className="border rounded-md">
                  <div className="bg-gray-50 px-4 py-2 border-b font-medium">
                    Detailed Results
                  </div>
                  <div className="divide-y max-h-[300px] overflow-y-auto">
                    {importResult.results.map((res, idx) => (
                      <div
                        key={idx}
                        className={`px-4 py-3 flex items-start gap-3 ${
                          res.success ? "bg-white" : "bg-red-50"
                        }`}
                      >
                        {res.success ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        )}
                        <div className="flex-1 text-sm">
                          <div className="font-medium">
                            Index {res.index}: {res.success ? "Success" : "Failed"}
                          </div>
                          {res.error && (
                            <div className="text-red-600 mt-1">{res.error}</div>
                          )}
                          {res.data && (
                            <pre className="mt-1 text-xs text-gray-500 overflow-x-auto">
                              {JSON.stringify(res.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {!importResult ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={importMutation.isPending}>
                {importMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
