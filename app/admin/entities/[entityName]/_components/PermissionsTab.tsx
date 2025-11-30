import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EntityResponse } from "@/lib/schemas/entity/entity.response";

interface PermissionsTabProps {
  entity: EntityResponse;
}

export function PermissionsTab({ entity }: PermissionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Permissions</CardTitle>
        <CardDescription>Role-based access control settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entity.permissions ? (
            <>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Create Permission</p>
                  <p className="text-sm text-muted-foreground">
                    Who can create new records
                  </p>
                </div>
                <div className="flex gap-1">
                  {entity.permissions.create?.map((role, idx) => (
                    <Badge key={idx} variant="outline">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Read Permission</p>
                  <p className="text-sm text-muted-foreground">
                    Who can view records
                  </p>
                </div>
                <div className="flex gap-1">
                  {entity.permissions.read?.map((role, idx) => (
                    <Badge key={idx} variant="outline">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Update Permission</p>
                  <p className="text-sm text-muted-foreground">
                    Who can modify records
                  </p>
                </div>
                <div className="flex gap-1">
                  {entity.permissions.update?.map((role, idx) => (
                    <Badge key={idx} variant="outline">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Delete Permission</p>
                  <p className="text-sm text-muted-foreground">
                    Who can delete records
                  </p>
                </div>
                <div className="flex gap-1">
                  {entity.permissions.delete?.map((role, idx) => (
                    <Badge key={idx} variant="outline">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No permissions configured
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
