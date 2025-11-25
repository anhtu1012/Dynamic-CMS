"use client";
import TableClient from "./components/Table/TableClient";

const data = [
  { id: 1, name: "John", email: "john@mail.com", status: "active" },
  { id: 2, name: "Mike", email: "mike@mail.com", status: "inactive" },
];

export default function Page() {
  return (
    <div className="p-6">
      <TableClient
        data={data}
        pageSize={10}
        totalItems={120}
        usePagination={true}
        onPageChange={(page) => {
          console.log("page requested:", page);
        }}
      />
    </div>
  );
}
