import type { Metadata } from "next";
import CategoryClient from "@/components/CategoryClient";
import { getCategoryBySlug, getProducts } from "@/lib/products";
import { getSeoSettings } from "@/lib/seo";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const seo = await getSeoSettings();

  // Handle "semua" slug for search
  if (slug === "semua") {
    return {
      title: `Cari Produk — ${seo.default_title || "Hera Store"}`,
      description: seo.default_description || undefined,
    };
  }

  const category = await getCategoryBySlug(slug);
  if (!category) {
    return { title: "Kategori Tidak Ditemukan" };
  }

  return {
    title: `${category.name} — ${seo.default_title || "Hera Store"}`,
    description: `Belanja produk ${category.name} terbaik di Hera Store. ${seo.default_description || ""}`,
    keywords: seo.default_keywords || undefined,
  };
}

export default async function KategoriPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { search } = await searchParams;

  // Handle "semua" slug for search results (from navbar search)
  if (slug === "semua") {
    const searchTerm = search || "";
    const virtualCategory = {
      id: "all",
      name: searchTerm ? `Hasil Pencarian: "${searchTerm}"` : "Semua Produk",
      slug: "semua",
      icon: "🔍",
      parent_id: null,
      sort_order: 0,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const initialResult = await getProducts({
      search: searchTerm || undefined,
      page: 1,
      pageSize: 20,
    });

    return (
      <CategoryClient
        category={virtualCategory}
        initialResult={initialResult}
        slug="semua"
        searchQuery={searchTerm}
      />
    );
  }

  const [category, initialResult] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({ categorySlug: slug, page: 1, pageSize: 8 }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <CategoryClient
      category={category}
      initialResult={initialResult}
      slug={slug}
    />
  );
}
