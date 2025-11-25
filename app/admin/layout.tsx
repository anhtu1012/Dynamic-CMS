import { AdminLayout } from "@/components/layouts/Admin";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
