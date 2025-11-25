import CustomLayout from "@/components/layouts/Custom";

export default function CustomRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomLayout>{children}</CustomLayout>;
}
