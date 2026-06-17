import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { STORE_NAME } from "@/utils/storeConfig";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch role from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role === "customer") {
    redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}
