import type { Metadata } from "next";
import { STORE_NAME } from "@/utils/storeConfig";

export const metadata: Metadata = {
  title: `Login Admin — ${STORE_NAME}`,
  description: `Masuk ke panel admin marketplace ${STORE_NAME}`,
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
