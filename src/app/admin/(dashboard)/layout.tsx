import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { STORE_NAME } from "@/utils/storeConfig";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: `Dashboard Admin — ${STORE_NAME}`,
  description: `Panel administrasi marketplace ${STORE_NAME}`,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Basic guard — middleware handles most cases, but this catches any edge cases
  if (!user) {
    redirect("/admin/login");
  }

  return <AdminShell><ErrorBoundary>{children}</ErrorBoundary></AdminShell>;
}
