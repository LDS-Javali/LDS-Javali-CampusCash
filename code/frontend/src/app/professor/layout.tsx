import { DashboardLayout } from "@/components/layouts";

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
