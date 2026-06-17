// ─── Addresses API — List & Create ─────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("[API GET Addresses]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { label, name, phone, address, city, province, postal_code, is_default } = body;

    if (!name || !phone || !address || !city || !province || !postal_code) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    // If setting as default, unset others first
    if (is_default) {
      await supabase
        .from("shipping_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { data, error } = await supabase
      .from("shipping_addresses")
      .insert({
        user_id: user.id,
        label: label || "Rumah",
        name,
        phone,
        address,
        city,
        province,
        postal_code,
        is_default: is_default ?? false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API POST Address]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
