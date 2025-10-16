import { DashboardLayout } from "@/components/layouts";

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
