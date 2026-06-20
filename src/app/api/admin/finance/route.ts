import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function getWeekOfMonth(date: Date): number {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = startOfMonth.getDay(); // 0=Sun, 1=Mon, ...
  const adjustedDate = date.getDate() + dayOfWeek - 1; // Adjust so Monday is start
  return Math.floor(adjustedDate / 7);
}

export async function GET() {
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

    // Fetch all orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !orders) {
      console.error("[Finance API] Query error:", error?.message || "Unknown error");
      return NextResponse.json({ error: error?.message || "Gagal memuat data pesanan" }, { status: 400 });
    }

    // Calculate total stats
    const paidOrders = orders.filter(o => o.payment_status === "lunas");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = paidOrders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const totalDiscount = orders.reduce((sum, o) => sum + (Number(o.discount) || 0), 0);

    // Calculate daily data (last 7 days)
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const dailyData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateString = d.toISOString().split("T")[0];
      const dayName = days[d.getDay()];

      const dayOrders = paidOrders.filter(o => o.created_at.startsWith(dateString));
      const revenue = dayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      
      return {
        day: dayName,
        pendapatan: revenue,
        pesanan: dayOrders.length,
      };
    });

    // Monthly comparison (current month weeks vs previous month weeks)
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const monthCompare = Array.from({ length: 4 }).map((_, i) => {
      const weekNum = i + 1;

      const thisMonthOrders = paidOrders.filter(o => {
        const od = new Date(o.created_at);
        return od.getFullYear() === thisYear && od.getMonth() === thisMonth && getWeekOfMonth(od) === i;
      });
      const lastMonthOrders = paidOrders.filter(o => {
        const od = new Date(o.created_at);
        return od.getFullYear() === lastMonthYear && od.getMonth() === lastMonth && getWeekOfMonth(od) === i;
      });

      return {
        week: `Mg ${weekNum}`,
        bulanIni: thisMonthOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
        bulanLalu: lastMonthOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
      };
    });

    // Payment method distribution
    const payMap: Record<string, number> = {};
    orders.forEach(o => {
      if (o.payment_method) {
        payMap[o.payment_method] = (payMap[o.payment_method] || 0) + 1;
      }
    });
    const totalWithPayment = Object.values(payMap).reduce((s, v) => s + v, 0);
    const colors = ["#16A34A", "#22D3EE", "#FBBF24", "#A78BFA", "#F43F5E"];
    const paymentData = Object.entries(payMap).map(([name, count], i) => {
      const percentage = totalWithPayment > 0 ? Math.round((count / totalWithPayment) * 100) : 0;
      const amount = orders
        .filter(o => o.payment_method === name && o.payment_status === "lunas")
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      return {
        name,
        value: percentage,
        color: colors[i % colors.length],
        amount: `Rp ${amount.toLocaleString("id-ID")}`,
      };
    });

    // Transactions list
    const transactions = orders.slice(0, 10).map(o => {
      const shippingAddr = o.shipping_address as { name?: string } | null;
      return {
        id: o.order_number,
        date: new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        customer: shippingAddr?.name || "Pelanggan",
        subtotal: Number(o.subtotal) || 0,
        shipping: Number(o.shipping_cost) || 0,
        discount: Number(o.discount) || 0,
        total: Number(o.total) || 0,
        payStatus: o.payment_status,
      };
    });

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalDiscount,
      dailyData,
      monthCompare,
      paymentData,
      transactions,
    });
  } catch (error) {
    console.error("[API GET Finance]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
