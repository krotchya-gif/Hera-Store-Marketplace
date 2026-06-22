"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import { STORE_NAME } from "@/utils/storeConfig";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  RefreshCw,
  Check,
  AlertCircle,
} from "lucide-react";
import type { Product, Category } from "@/types/database";

const STATUS_FILTERS = ["Semua", "Aktif", "Nonaktif"];

// ─── Product Form Modal ───────────────────────────────────────────────────────

function ProductFormModal({
  onClose,
  onSuccess,
  categories,
  editProduct,
}: {
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
  editProduct?: Product | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: editProduct?.name ?? "",
    sku: editProduct?.sku ?? "",
    brand: editProduct?.brand ?? "",
    description: editProduct?.description ?? "",
    category_id: editProduct?.category_id ?? "",
    price: editProduct?.price?.toString() ?? "",
    discount_price: editProduct?.discount_price?.toString() ?? "",
    stock: editProduct?.stock?.toString() ?? "",
    unit: editProduct?.unit ?? "pcs",
    weight_gram: editProduct?.weight_gram?.toString() ?? "",
    slug: editProduct?.slug ?? "",
    is_active: editProduct?.is_active ?? true,
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>(editProduct?.product_images?.map((img) => img.url) ?? []);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (files: File[], productId: string) => {
    setIsUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", productId);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          setUploadedImages((prev) => [...prev, data.url]);
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
    setIsUploading(false);
  };

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    if (editProduct?.id) {
      // Editing existing product — upload immediately
      await uploadFiles(fileArray, editProduct.id);
    } else {
      // Creating new product — queue files for later upload
      setPendingFiles((prev) => [...prev, ...fileArray]);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    startTransition(async () => {
      try {
        const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const payload = {
          name: form.name,
          sku: form.sku || null,
          brand: form.brand || null,
          description: form.description || null,
          category_id: form.category_id || null,
          price: parseFloat(form.price) || 0,
          discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
          stock: parseInt(form.stock) || 0,
          unit: form.unit,
          weight_gram: form.weight_gram ? parseInt(form.weight_gram) : null,
          slug,
          is_active: isDraft ? false : form.is_active,
          images: editProduct ? undefined : uploadedImages,
        };

        const url = editProduct ? `/api/admin/products/${editProduct.id}` : `/api/admin/products`;
        const method = editProduct ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Gagal menyimpan produk");

        // Upload pending files for new products
        if (!editProduct && pendingFiles.length > 0) {
          const savedProduct = await res.clone().json();
          if (savedProduct?.id) {
            await uploadFiles(pendingFiles, savedProduct.id);
            setPendingFiles([]);
          }
        }

        setMessage({ type: "success", text: isDraft ? "Draft tersimpan!" : "Produk berhasil dipublish!" });
        setTimeout(() => { onSuccess(); onClose(); }, 1200);
      } catch {
        setMessage({ type: "error", text: "Gagal menyimpan. Coba lagi." });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white h-full w-full max-w-2xl shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {editProduct ? "Edit Produk" : "Tambah Produk Baru"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-xl flex items-center gap-2 text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Informasi Dasar</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Produk *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  type="text"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  placeholder="Masukkan nama produk"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">SKU</label>
                  <input
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    type="text"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    placeholder="SCT-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Merek</label>
                  <input
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    type="text"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    placeholder={STORE_NAME}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Kategori *</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Deskripsi *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none"
                  placeholder="Minimal 50 karakter..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug URL</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  type="text"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  placeholder="auto-generate dari nama produk"
                />
              </div>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Harga & Stok</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Harga Normal *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                  <input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    type="number"
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    placeholder="25000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Harga Diskon</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                  <input
                    value={form.discount_price}
                    onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                    type="number"
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    placeholder="20000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Stok *</label>
                <input
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  type="number"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Satuan</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white"
                >
                  <option>pcs</option>
                  <option>botol</option>
                  <option>pak</option>
                  <option>lusin</option>
                  <option>box</option>
                  <option>tube</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Pengiriman</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Berat (gram)</label>
                <input
                  value={form.weight_gram}
                  onChange={(e) => setForm({ ...form, weight_gram: e.target.value })}
                  type="number"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  placeholder="500"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Foto Produk</h3>
            {uploadedImages.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {uploadedImages.map((url, i) => (
                  <div key={i} className="w-16 h-16 bg-green-50 rounded-xl border border-gray-200 overflow-hidden relative">
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-green-300 hover:bg-green-50/30 cursor-pointer transition-colors block">
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                {isUploading ? "Mengupload..." : pendingFiles.length > 0 ? `${pendingFiles.length} file menunggu upload...` : "Drag & drop foto di sini"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Maks. 5 foto, maks. 2MB per foto (JPG, PNG, WebP)</p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                disabled={isUploading}
                onChange={(e) => handleUploadFiles(e.target.files)}
              />
              <div className="mt-3 inline-block bg-white border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded-lg hover:border-green-400 hover:text-green-600 cursor-pointer">
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading...
                  </span>
                ) : pendingFiles.length > 0 ? `${pendingFiles.length} file tertunda` : "Pilih File"}
              </div>
            </label>
            {pendingFiles.length > 0 && (
              <p className="text-[10px] text-green-600 mt-2">✓ File akan otomatis diupload setelah produk berhasil dipublish.</p>
            )}
            {pendingFiles.length === 0 && (
              <p className="text-[10px] text-gray-400 mt-2">
                ⚠️ Untuk produk baru, file akan diupload otomatis setelah produk berhasil dibuat.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">
            Batal
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={isPending}
            className="px-5 border border-green-600 text-green-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-green-50 disabled:opacity-50"
          >
            Simpan Draft
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isPending || !form.name || !form.price}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? <><RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Publish Produk"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>({});
  const [, startTransition] = useTransition();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: Math.min(20, 100).toString(),
        ...(search && { search }),
        ...(selectedCategory !== "Semua" && { categoryId: categories.find(c => c.name === selectedCategory)?.id || selectedCategory }),
        ...(selectedStatus !== "Semua" && { status: selectedStatus.toLowerCase() }),
      });
      const res = await fetch(`/api/admin/products?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data.data ?? []);
      setTotalCount(data.count ?? 0);
      setActiveToggles(Object.fromEntries((data.data ?? []).map((p: Product) => [p.id, p.is_active])));
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, selectedCategory, selectedStatus]);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data ?? []);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      fetchProducts();
    });
  }, [fetchProducts]);

  useEffect(() => {
    startTransition(() => {
      fetchCategories();
    });
  }, [fetchCategories]);

  const toggleStatus = async (id: string, currentActive: boolean) => {
    setActiveToggles((prev) => ({ ...prev, [id]: !currentActive }));
    startTransition(async () => {
      await fetch(`/api/admin/products/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentActive }),
      });
      fetchProducts();
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini? Tindakan tidak bisa dibatalkan.")) return;
    startTransition(async () => {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      fetchProducts();
    });
  };

  const handleDuplicate = async (prod: Product) => {
    if (!confirm(`Duplikat produk "${prod.name}"?`)) return;
    startTransition(async () => {
      try {
        const payload = {
          name: `${prod.name} (Copy)`,
          sku: prod.sku ? `${prod.sku}-copy` : null,
          brand: prod.brand,
          description: prod.description,
          category_id: prod.category_id,
          price: prod.price,
          discount_price: prod.discount_price,
          stock: prod.stock,
          unit: prod.unit,
          weight_gram: prod.weight_gram,
          slug: `${prod.slug}-copy-${Date.now()}`,
          is_active: false,
          images: prod.product_images?.map((img) => img.url) || [],
        };
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchProducts();
        } else {
          alert("Gagal menduplikat produk");
        }
      } catch (err) {
        console.error(err);
        alert("Gagal menduplikat produk");
      }
    });
  };

  const handleBulkStatus = async (isActive: boolean) => {
    if (!confirm(`Ubah status ${selected.length} produk menjadi ${isActive ? "Aktif" : "Nonaktif"}?`)) return;
    const done: string[] = [];
    try {
      for (const id of selected) {
        const res = await fetch(`/api/admin/products/${id}/toggle`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: isActive }),
        });
        if (!res.ok) throw new Error(`Gagal mengubah status produk ${id}`);
        done.push(id);
      }
      setSelected([]);
      fetchProducts();
    } catch (err) {
      console.error("Bulk status gagal di tengah, rollback perubahan yang sudah berhasil", err);
      // Rollback: balikkan status produk yang sudah berhasil
      for (const id of done) {
        try {
          await fetch(`/api/admin/products/${id}/toggle`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_active: !isActive }),
          });
        } catch (rollbackErr) {
          console.error("Rollback gagal untuk", id, rollbackErr);
        }
      }
      alert("Operasi gagal. Perubahan yang sudah berhasil dikembalikan.");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Hapus ${selected.length} produk? Tindakan ini tidak bisa dibatalkan.`)) return;
    const done: string[] = [];
    try {
      for (const id of selected) {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`Gagal menghapus produk ${id}`);
        done.push(id);
      }
      setSelected([]);
      fetchProducts();
    } catch (err) {
      console.error("Bulk delete gagal di tengah", err);
      alert("Operasi gagal. Tidak ada perubahan yang disimpan (proses dihentikan).");
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelected(selected.length === products.length && products.length > 0 ? [] : products.map((p) => p.id));
  };

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manajemen Produk</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            <span className="font-semibold text-green-600">{totalCount} Produk</span> terdaftar di database
          </p>
        </div>
        <button
          id="btn-add-product"
          onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1">
            <div className="relative flex-1 min-w-48">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Cari produk atau SKU..."
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-sm focus:outline-none focus:border-green-400 bg-white appearance-none cursor-pointer"
              >
                <option value="Semua">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => { setSelectedStatus(s); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedStatus === s ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-sm text-green-700 font-medium">{selected.length} produk dipilih</span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleBulkStatus(false)}
              className="text-xs border border-gray-200 bg-white px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-50"
            >
              Nonaktifkan
            </button>
            <button
              onClick={() => handleBulkStatus(true)}
              className="text-xs border border-green-200 bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-700"
            >
              Aktifkan
            </button>
            <button
              onClick={handleBulkDelete}
              className="text-xs bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg font-medium text-red-600 hover:bg-red-100"
            >
              Hapus
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={selected.length === products.length && products.length > 0} onChange={toggleAll} className="w-4 h-4 text-green-600 rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Produk</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Harga</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Stok</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5"><div className="h-4 bg-gray-100 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="font-medium">Belum ada produk</p>
                    <p className="text-xs mt-1">Tambahkan produk pertama Anda</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggleSelect(product.id)} className="w-4 h-4 text-green-600 rounded border-gray-300" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                          {product.categories?.icon ?? "📦"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-xs">{product.name}</p>
                          <p className="text-gray-400 text-xs font-mono">{product.sku ?? "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                        {product.categories?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-semibold text-gray-900 text-xs">
                          Rp {(product.discount_price ?? product.price).toLocaleString("id-ID")}
                        </p>
                        {product.discount_price && (
                          <p className="text-gray-400 text-xs line-through">Rp {product.price.toLocaleString("id-ID")}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className={`font-semibold text-xs ${product.stock < 10 ? "text-red-600" : "text-gray-900"}`}>
                        {product.stock}
                      </p>
                      {product.stock < 10 && product.stock > 0 && <p className="text-red-400 text-xs">Stok menipis!</p>}
                      {product.stock === 0 && <p className="text-red-500 text-xs">Habis</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          onClick={() => toggleStatus(product.id, activeToggles[product.id])}
                          className={`w-9 h-5 rounded-full cursor-pointer relative transition-colors ${activeToggles[product.id] ? "bg-green-500" : "bg-gray-200"}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${activeToggles[product.id] ? "translate-x-4" : "translate-x-0.5"}`} />
                        </div>
                        <StatusBadge status={activeToggles[product.id] ? "published" : "draft"} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          id={`btn-edit-product-${product.id}`}
                          onClick={() => { setEditProduct(product); setShowModal(true); }}
                          className="w-7 h-7 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-gray-400 flex items-center justify-center"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-duplicate-product-${product.id}`}
                          onClick={() => handleDuplicate(product)}
                          className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 flex items-center justify-center"
                          title="Duplikat"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-product-${product.id}`}
                          onClick={() => handleDelete(product.id)}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 flex items-center justify-center"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Menampilkan <span className="font-medium text-gray-700">{products.length}</span> dari {totalCount} produk
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              const start = Math.max(0, Math.min(currentPage - 3, totalPages - 5));
              const pageNum = start + i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold ${currentPage === pageNum ? "bg-green-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ProductFormModal
          onClose={() => { setShowModal(false); setEditProduct(null); }}
          onSuccess={fetchProducts}
          categories={categories}
          editProduct={editProduct}
        />
      )}
    </div>
  );
}
