// ─── Admin Auth Helper ──────────────────────────────────────────
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export type AdminRole = "super_admin" | "admin" | "operator" | "finance";

const ADMIN_ROLES: AdminRole[] = ["super_admin", "admin", "operator", "finance"];

/**
 * Verifies that the current user has an admin role.
 * Throws a structured response object if unauthorized.
 * Returns the user profile role on success.
 */
export async function verifyAdminRole(): Promise<{ role: AdminRole; userId: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw { status: 401, message: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !ADMIN_ROLES.includes(profile.role as AdminRole)) {
    throw { status: 403, message: "Forbidden" };
  }

  return { role: profile.role as AdminRole, userId: user.id };
}

export function handleAdminError(error: unknown) {
  if (error && typeof error === "object" && "status" in error) {
    const err = error as { status: number; message: string };
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("Admin API Error:", error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
