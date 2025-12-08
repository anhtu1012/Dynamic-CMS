import { AdminLayout } from "@/components/layouts/Admin";
import { DarkModeToggle } from "@/components/custom/DarkModeToggle";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayout>
      {children}
      <DarkModeToggle />
    </AdminLayout>
  );
}
