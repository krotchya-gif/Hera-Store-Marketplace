import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify session & role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role === "customer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all store settings
    const { data: settingsData, error: settingsError } = await supabase
      .from("store_settings")
      .select("*");

    if (settingsError) {
      return NextResponse.json({ error: settingsError.message }, { status: 400 });
    }

    // Fetch all admin profiles
    const { data: adminsData, error: adminsError } = await supabase
      .from("profiles")
      .select("id, name, email, role, created_at")
      .in("role", ["super_admin", "admin", "operator", "finance"]);

    if (adminsError) {
      return NextResponse.json({ error: adminsError.message }, { status: 400 });
    }

    // Format settings into a key-value map
    const settingsMap = (settingsData || []).reduce((acc: any, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    // Ensure default settings are returned if not set in DB
    const finalSettings = {
      store_info: settingsMap.store_info || {
        name: "Hera Store",
        email: "info@trigunasentosa.com",
        phone: "+6281234567890",
        city: "Jakarta Selatan",
        description: "Marketplace produk rumah tangga premium.",
        address: "Alamat Gudang Hera Store",
        operational_hours: { start: "08:00", end: "21:00", days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] },
        social_media: { instagram: "", tiktok: "", facebook: "" }
      },
      shipping: settingsMap.shipping || {
        free_shipping: true,
        free_shipping_min: 100000,
        couriers: ["JNE", "J&T Express", "SiCepat", "Gosend", "Anteraja"],
        origin_city: "Jakarta Selatan"
      },
      payment: settingsMap.payment || {
        methods: ["Transfer Bank (BCA, Mandiri, BRI)", "GoPay", "OVO", "Dana", "ShopeePay", "Virtual Account", "COD (Bayar di Tempat)"],
        payment_timeout_hours: 24,
        bank_account: { bank: "BCA", owner: "PT Hera Store", number: "1234567890" }
      },
      seo: settingsMap.seo || {
        meta_pixel_id: "",
        ga4_measurement_id: "",
        default_title: "",
        default_description: "",
        default_keywords: "",
        robots_txt_content: "",
        sitemap_xml_content: "",
      },
      notifications: settingsMap.notifications || {
        email: {
          "Pesanan baru masuk": true,
          "Pembayaran diterima": true,
          "Stok produk menipis (< 10 item)": true,
          "Ulasan baru masuk": true,
          "Pertanyaan Q&A baru": true
        },
        wa: {
          "Pesanan baru masuk": true,
          "Pembayaran diterima": true,
          "Stok produk menipis (< 10 item)": false,
          "Ulasan baru masuk": false,
          "Pertanyaan Q&A baru": false
        }
      }
    };

    return NextResponse.json({
      settings: finalSettings,
      admins: adminsData || []
    });
  } catch (error) {
    console.error("[API GET Settings]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify session & role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["super_admin", "admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden. Hanya admin yang dapat mengubah pengaturan." }, { status: 403 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "update_admin_role") {
      const { email, role } = body;
      if (!email || !role) {
        return NextResponse.json({ error: "Email dan Role wajib diisi" }, { status: 400 });
      }

      // Check if profile exists
      const { data: targetProfile, error: getProfileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (getProfileError || !targetProfile) {
        return NextResponse.json({ error: "Email tidak terdaftar sebagai customer di Hera Store. Minta mereka untuk mendaftar akun terlebih dahulu." }, { status: 400 });
      }

      // Map role display values to database keys if needed
      let dbRole = role.toLowerCase().replace(" ", "_");
      if (dbRole === "finance_(readonly)") dbRole = "finance";

      const { error } = await supabase
        .from("profiles")
        .update({ role: dbRole })
        .eq("id", targetProfile.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "remove_admin") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "ID admin wajib diisi" }, { status: 400 });
      }

      // Revert role back to 'customer'
      const { error } = await supabase
        .from("profiles")
        .update({ role: "customer" })
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    // Default: update store_settings key
    const { key, value } = body;

    if (!key || !value) {
      return NextResponse.json({ error: "Key and Value are required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("store_settings")
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API PUT Settings]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
