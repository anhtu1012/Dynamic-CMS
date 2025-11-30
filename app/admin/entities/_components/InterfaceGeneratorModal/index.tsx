"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { FieldFormData } from "@/lib/schemas/entity/entity.schema";
import { parseInterfaceToFields } from "@/utils/client/interfaceParser";

interface InterfaceGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (fields: FieldFormData[]) => void;
}

const exampleInterface = `interface User {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  bio?: string;
  createdAt: Date;
}`;

export function InterfaceGeneratorModal({
  open,
  onOpenChange,
  onGenerate,
}: InterfaceGeneratorModalProps) {
  const [interfaceCode, setInterfaceCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!interfaceCode.trim()) {
      toast.error("Please enter an interface");
      return;
    }

    try {
      setLoading(true);
      const fields = parseInterfaceToFields(interfaceCode);

      if (fields.length === 0) {
        toast.error("No fields found in interface");
        return;
      }

      onGenerate(fields);
      toast.success(`Generated ${fields.length} field(s) successfully`);
      setInterfaceCode("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error parsing interface:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to parse interface"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUseExample = () => {
    setInterfaceCode(exampleInterface);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Fields from Interface</DialogTitle>
          <DialogDescription>
            Paste your TypeScript interface below and we will automatically
            generate fields for you
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="interface-code">TypeScript Interface</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUseExample}
              >
                Use Example
              </Button>
            </div>
            <Textarea
              id="interface-code"
              value={interfaceCode}
              onChange={(e) => setInterfaceCode(e.target.value)}
              placeholder="interface YourInterface {&#10;  fieldName: type;&#10;  ...&#10;}"
              rows={15}
              className="font-mono text-sm"
            />
          </div>

          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-semibold mb-2">Supported Types:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <code>string</code> → Text field
              </li>
              <li>
                <code>number</code> → Number field
              </li>
              <li>
                <code>boolean</code> → Boolean switch
              </li>
              <li>
                <code>Date</code> → Date field
              </li>
              <li>
                <code>Array&lt;T&gt;</code> or <code>T[]</code> → Array field
              </li>
              <li>
                <code>?</code> (optional) → Not required
              </li>
              <li>Comments above fields → Field descriptions</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Fields"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
