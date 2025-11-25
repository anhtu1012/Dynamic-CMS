import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("status") as string;
      return (
        <span
          className={
            value === "active"
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {value}
        </span>
      );
    },
  },
];
