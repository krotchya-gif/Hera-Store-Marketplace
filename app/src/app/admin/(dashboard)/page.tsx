import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { getDashboardStats } from "@/lib/admin";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return <AdminDashboardClient stats={stats} />;
}
