import { DashboardLayout } from "@/components/layouts";

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}


