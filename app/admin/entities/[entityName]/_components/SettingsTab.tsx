import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EntityResponse } from "@/lib/schemas/entity/entity.response";

interface SettingsTabProps {
  entity: EntityResponse;
}

export function SettingsTab({ entity }: SettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entity Settings</CardTitle>
        <CardDescription>Configuration and feature flags</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Timestamps</p>
              <p className="text-sm text-muted-foreground">
                Auto createdAt/updatedAt
              </p>
            </div>
            <Badge variant={entity.timestamps ? "default" : "secondary"}>
              {entity.timestamps ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Soft Delete</p>
              <p className="text-sm text-muted-foreground">Mark as deleted</p>
            </div>
            <Badge variant={entity.softDelete ? "default" : "secondary"}>
              {entity.softDelete ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Enable API</p>
              <p className="text-sm text-muted-foreground">REST endpoints</p>
            </div>
            <Badge variant={entity.enableApi ? "default" : "secondary"}>
              {entity.enableApi ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">API Path</p>
              <p className="text-sm text-muted-foreground font-mono">
                {entity.apiPath || "/api/" + entity.name}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <p className="font-medium mb-2">Metadata</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>{" "}
              {new Date(entity.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="text-muted-foreground">Updated:</span>{" "}
              {new Date(entity.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
