import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EntityResponse } from "@/lib/schemas/entity/entity.response";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";

interface ApiTabProps {
  entity: EntityResponse;
}

interface CopyButtonProps {
  text: string;
  endpoint: string;
  copiedEndpoint: string | null;
  onCopy: (text: string, endpoint: string) => void;
}

function CopyButton({
  text,
  endpoint,
  copiedEndpoint,
  onCopy,
}: CopyButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onCopy(text, endpoint)}
      className="h-8"
    >
      {copiedEndpoint === endpoint ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}

export function ApiTab({ entity }: ApiTabProps) {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const selectedDatabase = useAppSelector(
    (state) => state.database.selectedDatabase
  );
  const databaseId = selectedDatabase?.id || "";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedEndpoint(endpoint);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedEndpoint(null), 2000);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📦 Dynamic Data APIs</CardTitle>
        <CardDescription>
          REST API endpoints for managing {entity.displayName} records
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Authentication Notice */}
        {/* <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900 font-medium mb-2">
            🔐 Required Headers:
          </p>
          <div className="space-y-1 text-xs font-mono">
            <div>
              <code className="bg-amber-100 px-2 py-1 rounded">
                Authorization: Bearer &lt;access_token&gt;
              </code>
            </div>
            <div>
              <code className="bg-amber-100 px-2 py-1 rounded">
                x-database-id: &lt;database_id&gt;
              </code>
            </div>
          </div>
        </div> */}

        <div className="space-y-4">
          {/* POST Create */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  POST
                </Badge>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  /{databaseId}/{entity.name}
                </code>
              </div>
              <CopyButton
                text={`${baseUrl}/${databaseId}/${entity.name}`}
                endpoint="create"
                copiedEndpoint={copiedEndpoint}
                onCopy={copyToClipboard}
              />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Create a new document (record) in the collection
            </p>
            <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
              <div className="text-muted-foreground mb-1">Request Body:</div>
              {JSON.stringify(
                entity.fields.slice(0, 3).reduce((acc, field) => {
                  acc[field.name] = `<${field.type}>`;
                  return acc;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }, {} as Record<string, any>),
                null,
                2
              )}
            </div>
            <div className="mt-2 text-xs">
              <span className="text-muted-foreground">Response:</span>
              <code className="ml-2 text-green-600">201 Created</code>
            </div>
          </div>

          {/* GET All */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  GET
                </Badge>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  /{databaseId}/{entity.name}
                </code>
              </div>
              <CopyButton
                text={`${baseUrl}/${databaseId}/${entity.name}?page=1&limit=10&search=keyword`}
                endpoint="list"
                copiedEndpoint={copiedEndpoint}
                onCopy={copyToClipboard}
              />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Get list of documents with pagination and search
            </p>
            <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
              <div className="text-muted-foreground mb-1">
                Query Parameters:
              </div>
              ?page=1&limit=10&search=keyword
            </div>
            <div className="mt-2 text-xs space-y-1">
              <div>
                <span className="text-muted-foreground">• page:</span> Current
                page number (default: 1)
              </div>
              <div>
                <span className="text-muted-foreground">• limit:</span> Items
                per page (default: 10)
              </div>
              <div>
                <span className="text-muted-foreground">• search:</span> Search
                in searchable fields
              </div>
            </div>
          </div>

          {/* GET by ID */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  GET
                </Badge>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  /{databaseId}/{entity.name}/:id
                </code>
              </div>
              <CopyButton
                text={`${baseUrl}/${databaseId}/${entity.name}/:id`}
                endpoint="getById"
                copiedEndpoint={copiedEndpoint}
                onCopy={copyToClipboard}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Get a single document by ID
            </p>
          </div>

          {/* PATCH Update */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-200"
                >
                  PATCH
                </Badge>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  /{databaseId}/{entity.name}/:id
                </code>
              </div>
              <CopyButton
                text={`${baseUrl}/${databaseId}/${entity.name}/:id`}
                endpoint="patch"
                copiedEndpoint={copiedEndpoint}
                onCopy={copyToClipboard}
              />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Partial update (merge with existing data)
            </p>
            <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
              <div className="text-muted-foreground mb-1">
                Request Body (partial):
              </div>
              {JSON.stringify(
                entity.fields.slice(0, 2).reduce((acc, field) => {
                  acc[field.name] = `<${field.type}>`;
                  return acc;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }, {} as Record<string, any>),
                null,
                2
              )}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              💡 Merges with existing data, validates after merge
            </div>
          </div>

          {/* PUT Replace */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  PUT
                </Badge>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  /{databaseId}/{entity.name}/:id
                </code>
              </div>
              <CopyButton
                text={`${baseUrl}/${databaseId}/${entity.name}/:id`}
                endpoint="put"
                copiedEndpoint={copiedEndpoint}
                onCopy={copyToClipboard}
              />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Full replacement (does not merge with old data)
            </p>
            <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
              <div className="text-muted-foreground mb-1">
                Request Body (complete):
              </div>
              {JSON.stringify(
                entity.fields.slice(0, 3).reduce((acc, field) => {
                  acc[field.name] = `<${field.type}>`;
                  return acc;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }, {} as Record<string, any>),
                null,
                2
              )}
            </div>
            <div className="mt-2 text-xs text-amber-700">
              ⚠️ Replaces entire document, old fields not included will be lost
            </div>
          </div>

          {/* DELETE Soft */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  DELETE
                </Badge>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  /{databaseId}/{entity.name}/:id
                </code>
              </div>
              <CopyButton
                text={`${baseUrl}/${databaseId}/${entity.name}/:id`}
                endpoint="delete"
                copiedEndpoint={copiedEndpoint}
                onCopy={copyToClipboard}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Soft delete (mark as deleted, can be restored)
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              💡 Sets deletedAt timestamp, document remains in database
            </div>
          </div>

          {/* DELETE Hard */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  DELETE
                </Badge>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  /{databaseId}/{entity.name}/:id/hard
                </code>
              </div>
              <CopyButton
                text={`${baseUrl}/${databaseId}/${entity.name}/:id/hard`}
                endpoint="deleteHard"
                copiedEndpoint={copiedEndpoint}
                onCopy={copyToClipboard}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Permanent delete (cannot be recovered)
            </p>
            <div className="mt-2 text-xs text-red-700 font-medium">
              ⚠️ WARNING: This action cannot be undone!
            </div>
          </div>

          {/* POST Restore */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  POST
                </Badge>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  /{databaseId}/{entity.name}/:id/restore
                </code>
              </div>
              <CopyButton
                text={`${baseUrl}/${databaseId}/${entity.name}/:id/restore`}
                endpoint="restore"
                copiedEndpoint={copiedEndpoint}
                onCopy={copyToClipboard}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Restore soft-deleted document
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              💡 Sets deletedAt to null
            </div>
          </div>

          {/* POST Query */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  POST
                </Badge>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  /{databaseId}/{entity.name}/query
                </code>
              </div>
              <CopyButton
                text={`${baseUrl}/${databaseId}/${entity.name}/query`}
                endpoint="query"
                copiedEndpoint={copiedEndpoint}
                onCopy={copyToClipboard}
              />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Advanced search with filters, sorting, and pagination
            </p>
            <div className="mt-2 text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
              <div className="text-muted-foreground mb-1">Request Body:</div>
              {JSON.stringify(
                {
                  filter: {
                    [entity.fields[0]?.name || "field"]: "value",
                    price: { $gte: 100, $lte: 1000 },
                  },
                  sort: { createdAt: -1 },
                  limit: 20,
                  skip: 0,
                },
                null,
                2
              )}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              💡 Supports MongoDB query operators ($gte, $lte, $in, etc.)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
