import ProfilClient from "@/components/ProfilClient";
import { getOrdersByUser } from "@/lib/orders";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0;

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let orders: any[] = [];

  if (user) {
    // Load profile
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = prof;

    // Load orders
    orders = await getOrdersByUser(user.id);
  }

  const initialUser = user
    ? {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || undefined,
      }
    : null;

  return (
    <ProfilClient
      initialUser={initialUser}
      initialProfile={profile}
      orders={orders}
    />
  );
}
