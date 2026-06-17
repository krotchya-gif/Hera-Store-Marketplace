// ─── Centralized Mock Data for Hera Store Marketplace ────────────────────────

export const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = [
  {
    slug: "perawatan-tubuh",
    name: "Perawatan Tubuh",
    icon: "🧴",
    count: 48,
    description: "Sabun mandi, shampoo, kondisioner, losion, dan produk kebersihan tubuh lainnya.",
    subCategories: ["Sabun Mandi", "Shampoo", "Kondisioner", "Losion", "Parfum", "Deodoran"],
  },
  {
    slug: "perawatan-rumah",
    name: "Perawatan Rumah",
    icon: "🧹",
    count: 65,
    description: "Semua kebutuhan kebersihan rumah tangga dari lantai hingga dapur.",
    subCategories: ["Pembersih Lantai", "Pembersih Dapur", "Pembersih Kaca", "Pewangi", "Deterjen", "Pel & Sapu"],
  },
  {
    slug: "kesehatan",
    name: "Kesehatan",
    icon: "💊",
    count: 32,
    description: "Suplemen vitamin, obat-obatan ringan, dan produk kesehatan keluarga.",
    subCategories: ["Vitamin", "Suplemen", "P3K", "Masker", "Hand Sanitizer", "Termometer"],
  },
  {
    slug: "kecantikan",
    name: "Kecantikan",
    icon: "💄",
    count: 27,
    description: "Skincare, makeup, dan produk perawatan wajah premium.",
    subCategories: ["Skincare", "Sunscreen", "Serum", "Pelembap", "Masker Wajah", "Pembersih Wajah"],
  },
  {
    slug: "elektronik",
    name: "Elektronik",
    icon: "🔌",
    count: 15,
    description: "Aksesoris elektronik dan perangkat rumah tangga.",
    subCategories: ["Charger", "Kabel", "Power Bank", "Speaker", "Lampu", "Baterai"],
  },
  {
    slug: "lainnya",
    name: "Lainnya",
    icon: "📦",
    count: 8,
    description: "Produk lain-lain yang belum masuk kategori utama.",
    subCategories: ["Alat Tulis", "Perlengkapan Bayi", "Hewan Peliharaan", "Olahraga"],
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  sold: string;
  emoji: string;
  category: string;
  categorySlug: string;
  stock: number;
  description: string;
  specifications: { label: string; value: string }[];
  variants?: { type: string; options: string[] };
  isFlashSale?: boolean;
  badge?: string;
  weight: number; // gram
  location: string;
}

export const allProducts: Product[] = [
  {
    id: 1,
    slug: "sabun-cair-hera-store",
    name: "Sabun Cair Hera Store Premium",
    price: 25000,
    originalPrice: 31000,
    discount: 20,
    rating: 4.8,
    reviewCount: 1247,
    sold: "1.2K",
    emoji: "🧴",
    category: "Perawatan Tubuh",
    categorySlug: "perawatan-tubuh",
    stock: 150,
    description: "Sabun cair premium dengan formula lembut yang menjaga kelembapan kulit. Mengandung aloe vera dan vitamin E untuk kulit sehat dan lembut sepanjang hari. Cocok untuk semua jenis kulit, termasuk kulit sensitif.",
    specifications: [
      { label: "Berat Bersih", value: "500ml" },
      { label: "Varian", value: "Fresh, Lemon, Rose" },
      { label: "Jenis Kulit", value: "Semua Jenis Kulit" },
      { label: "Kandungan", value: "Aloe Vera, Vitamin E" },
      { label: "BPOM", value: "NA18231234567" },
    ],
    variants: { type: "Varian", options: ["Fresh", "Lemon", "Rose"] },
    isFlashSale: true,
    badge: "Best Seller",
    weight: 520,
    location: "Jakarta Selatan",
  },
  {
    id: 2,
    slug: "pembersih-lantai-harum",
    name: "Pembersih Lantai Super Harum",
    price: 28000,
    originalPrice: 35000,
    discount: 15,
    rating: 4.7,
    reviewCount: 890,
    sold: "980",
    emoji: "🧹",
    category: "Perawatan Rumah",
    categorySlug: "perawatan-rumah",
    stock: 200,
    description: "Pembersih lantai dengan formula anti bakteri yang ampuh membersihkan noda membandel. Mengharumkan ruangan dengan aroma segar tahan lama.",
    specifications: [
      { label: "Volume", value: "1 Liter" },
      { label: "Wangi", value: "Lavender, Citrus, Pine" },
      { label: "Fungsi", value: "Anti Bakteri, Anti Jamur" },
      { label: "Aman untuk", value: "Semua Jenis Lantai" },
    ],
    variants: { type: "Wangi", options: ["Lavender", "Citrus", "Pine"] },
    isFlashSale: true,
    weight: 1050,
    location: "Jakarta Selatan",
  },
  {
    id: 3,
    slug: "hand-sanitizer-500ml",
    name: "Hand Sanitizer Antibacterial 500ml",
    price: 18000,
    originalPrice: 25000,
    discount: 28,
    rating: 4.9,
    reviewCount: 2341,
    sold: "2.1K",
    emoji: "🧼",
    category: "Kesehatan",
    categorySlug: "kesehatan",
    stock: 300,
    description: "Hand sanitizer dengan kandungan alkohol 70% yang efektif membunuh 99.9% kuman dan bakteri. Formula gel tidak lengket dan cepat kering.",
    specifications: [
      { label: "Volume", value: "500ml" },
      { label: "Kandungan Alkohol", value: "70%" },
      { label: "Tekstur", value: "Gel" },
      { label: "Wangi", value: "Fresh & Mild" },
    ],
    isFlashSale: true,
    badge: "Top Rated",
    weight: 520,
    location: "Jakarta Selatan",
  },
  {
    id: 4,
    slug: "sabun-cuci-piring",
    name: "Sabun Cuci Piring Anti Lemak 800ml",
    price: 16000,
    originalPrice: 20000,
    discount: 20,
    rating: 4.6,
    reviewCount: 743,
    sold: "1.1K",
    emoji: "🍽️",
    category: "Perawatan Rumah",
    categorySlug: "perawatan-rumah",
    stock: 180,
    description: "Sabun cuci piring dengan formula super konsentrat yang ampuh membersihkan lemak dan sisa makanan dengan mudah. Lembut di tangan.",
    specifications: [
      { label: "Volume", value: "800ml" },
      { label: "Formula", value: "Super Konsentrat" },
      { label: "Wangi", value: "Jeruk, Apel" },
    ],
    isFlashSale: true,
    weight: 820,
    location: "Bekasi",
  },
  {
    id: 5,
    slug: "pewangi-ruangan-premium",
    name: "Pewangi Ruangan Premium Aroma Spa",
    price: 22000,
    originalPrice: 28000,
    discount: 21,
    rating: 4.8,
    reviewCount: 562,
    sold: "870",
    emoji: "🌸",
    category: "Perawatan Rumah",
    categorySlug: "perawatan-rumah",
    stock: 120,
    description: "Pewangi ruangan premium dengan aroma spa yang menenangkan. Tahan lama hingga 30 hari dengan teknologi slow release.",
    specifications: [
      { label: "Volume", value: "150ml" },
      { label: "Ketahanan", value: "±30 Hari" },
      { label: "Aroma", value: "Lavender, Jasmine, Ocean" },
    ],
    variants: { type: "Aroma", options: ["Lavender", "Jasmine", "Ocean"] },
    isFlashSale: true,
    weight: 200,
    location: "Tangerang",
  },
  {
    id: 6,
    slug: "kondisioner-rambut",
    name: "Kondisioner Rambut Silk Smooth 350ml",
    price: 35000,
    rating: 4.7,
    reviewCount: 670,
    sold: "670",
    emoji: "💆",
    category: "Perawatan Tubuh",
    categorySlug: "perawatan-tubuh",
    stock: 95,
    description: "Kondisioner rambut dengan protein sutra yang membuat rambut lembut, berkilau, dan mudah diatur. Cocok untuk rambut kering dan rusak.",
    specifications: [
      { label: "Volume", value: "350ml" },
      { label: "Kandungan", value: "Silk Protein, Argan Oil" },
      { label: "Untuk Rambut", value: "Kering & Rusak" },
    ],
    badge: "New",
    weight: 380,
    location: "Jakarta Selatan",
  },
  {
    id: 7,
    slug: "pembersih-kaca",
    name: "Pembersih Kaca & Cermin Anti Streak",
    price: 19000,
    rating: 4.5,
    reviewCount: 432,
    sold: "540",
    emoji: "🪟",
    category: "Perawatan Rumah",
    categorySlug: "perawatan-rumah",
    stock: 210,
    description: "Pembersih kaca formula anti bekas (streak-free) yang membuat kaca dan cermin kinclong tanpa meninggalkan bekas sapuan.",
    specifications: [
      { label: "Volume", value: "500ml" },
      { label: "Jenis", value: "Spray" },
      { label: "Untuk", value: "Kaca, Cermin, Kaca Mobil" },
    ],
    weight: 520,
    location: "Depok",
  },
  {
    id: 8,
    slug: "losion-tubuh-aloe",
    name: "Losion Tubuh Aloe Vera & Vitamin E",
    price: 32000,
    rating: 4.8,
    reviewCount: 1423,
    sold: "1.4K",
    emoji: "🧴",
    category: "Perawatan Tubuh",
    categorySlug: "perawatan-tubuh",
    stock: 130,
    description: "Losion tubuh dengan kandungan aloe vera segar dan vitamin E yang melembapkan dan melembutkan kulit. Formula cepat meresap, tidak lengket.",
    specifications: [
      { label: "Volume", value: "250ml" },
      { label: "Kandungan", value: "Aloe Vera, Vitamin E, Shea Butter" },
      { label: "SPF", value: "SPF 15" },
    ],
    badge: "Best Seller",
    weight: 270,
    location: "Jakarta Selatan",
  },
  {
    id: 9,
    slug: "vitamin-c-500mg",
    name: "Vitamin C 500mg Effervescent 20 Tablet",
    price: 45000,
    rating: 4.9,
    reviewCount: 2876,
    sold: "2.3K",
    emoji: "💊",
    category: "Kesehatan",
    categorySlug: "kesehatan",
    stock: 450,
    description: "Suplemen Vitamin C 500mg dalam bentuk effervescent yang mudah dikonsumsi. Mendukung daya tahan tubuh dan kesehatan kulit.",
    specifications: [
      { label: "Isi", value: "20 Tablet" },
      { label: "Dosis", value: "500mg per tablet" },
      { label: "Rasa", value: "Jeruk, Lemon, Stroberi" },
      { label: "Registrasi BPOM", value: "SD181234000123" },
    ],
    variants: { type: "Rasa", options: ["Jeruk", "Lemon", "Stroberi"] },
    badge: "Top Rated",
    weight: 100,
    location: "Jakarta Selatan",
  },
  {
    id: 10,
    slug: "deterjen-pakaian",
    name: "Deterjen Pakaian Bubuk 1kg Anti Kusam",
    price: 38000,
    rating: 4.6,
    reviewCount: 987,
    sold: "890",
    emoji: "👕",
    category: "Perawatan Rumah",
    categorySlug: "perawatan-rumah",
    stock: 280,
    description: "Deterjen pakaian bubuk dengan formula enzim aktif yang ampuh mengangkat noda membandel tanpa merusak serat kain.",
    specifications: [
      { label: "Berat Bersih", value: "1 kg" },
      { label: "Wangi", value: "Floral Fresh" },
      { label: "Cocok untuk", value: "Mesin Cuci & Tangan" },
    ],
    weight: 1050,
    location: "Bekasi",
  },
  {
    id: 11,
    slug: "sunscreen-spf50",
    name: "Sunscreen SPF 50+ PA++++ Daily Protection",
    price: 55000,
    rating: 4.9,
    reviewCount: 1843,
    sold: "1.7K",
    emoji: "🧴",
    category: "Kecantikan",
    categorySlug: "kecantikan",
    stock: 85,
    description: "Sunscreen ringan SPF 50+ PA++++ dengan formula water-resistant yang melindungi dari sinar UVA dan UVB. Tidak meninggalkan white cast.",
    specifications: [
      { label: "Volume", value: "50ml" },
      { label: "SPF", value: "SPF 50+ PA++++" },
      { label: "Tekstur", value: "Gel-Cream" },
      { label: "Water Resistant", value: "80 Menit" },
    ],
    badge: "Best Seller",
    weight: 80,
    location: "Jakarta Selatan",
  },
  {
    id: 12,
    slug: "minyak-kayu-putih",
    name: "Minyak Kayu Putih Murni 60ml",
    price: 28000,
    rating: 4.7,
    reviewCount: 1156,
    sold: "1.1K",
    emoji: "🌿",
    category: "Kesehatan",
    categorySlug: "kesehatan",
    stock: 320,
    description: "Minyak kayu putih murni 100% alami tanpa campuran bahan kimia. Membantu meredakan masuk angin, mual, dan pegal-pegal.",
    specifications: [
      { label: "Volume", value: "60ml" },
      { label: "Kemurnian", value: "100% Murni" },
      { label: "Asal", value: "Maluku, Indonesia" },
    ],
    weight: 80,
    location: "Jakarta Timur",
  },
];

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const mockReviews = [
  {
    id: 1,
    user: "Rina S.",
    avatar: "👩",
    rating: 5,
    date: "12 Jun 2025",
    comment: "Produknya bagus banget! Wanginya tahan lama dan kulitku terasa lembut setelah pakai. Recommended banget!",
    helpful: 24,
    images: ["🧴", "✨"],
  },
  {
    id: 2,
    user: "Budi P.",
    avatar: "👨",
    rating: 4,
    date: "8 Jun 2025",
    comment: "Kualitas sesuai harga, pengiriman cepat sampai 2 hari. Packagingnya aman tidak bocor.",
    helpful: 15,
    images: [],
  },
  {
    id: 3,
    user: "Dewi A.",
    avatar: "👩‍💼",
    rating: 5,
    date: "3 Jun 2025",
    comment: "Sudah order ke-3 kali di sini, selalu puas! Produknya original dan harga lebih murah dari marketplace lain.",
    helpful: 31,
    images: ["🛍️"],
  },
  {
    id: 4,
    user: "Arif M.",
    avatar: "🧑",
    rating: 4,
    date: "28 Mei 2025",
    comment: "Produk sesuai deskripsi. Oke lah untuk harga segini. Akan order lagi.",
    helpful: 8,
    images: [],
  },
];

// ─── Cart (initial state) ─────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  originalPrice?: number;
  emoji: string;
  quantity: number;
  variant?: string;
  stock: number;
}

export const initialCartItems: CartItem[] = [
  {
    id: 1,
    productId: 1,
    name: "Sabun Cair Hera Store Premium",
    price: 25000,
    originalPrice: 31000,
    emoji: "🧴",
    quantity: 2,
    variant: "Fresh",
    stock: 150,
  },
  {
    id: 2,
    productId: 9,
    name: "Vitamin C 500mg Effervescent 20 Tablet",
    price: 45000,
    emoji: "💊",
    quantity: 1,
    variant: "Jeruk",
    stock: 450,
  },
  {
    id: 3,
    productId: 11,
    name: "Sunscreen SPF 50+ PA++++ Daily Protection",
    price: 55000,
    emoji: "🧴",
    quantity: 1,
    stock: 85,
  },
];

// ─── Saved Addresses ─────────────────────────────────────────────────────────
export const savedAddresses = [
  {
    id: 1,
    label: "Rumah",
    name: "Budi Santoso",
    phone: "081234567890",
    address: "Jl. Merpati No. 12, RT 05/RW 03",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postalCode: "12345",
    isDefault: true,
  },
  {
    id: 2,
    label: "Kantor",
    name: "Budi Santoso",
    phone: "081234567890",
    address: "Jl. Sudirman Kav. 52-53, Gedung Menara Lt. 8",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postalCode: "10220",
    isDefault: false,
  },
];

// ─── Shipping Options ─────────────────────────────────────────────────────────
export const shippingOptions = [
  {
    courier: "JNE",
    logo: "📦",
    services: [
      { code: "REG", name: "Reguler", etd: "3-5 hari", price: 12000 },
      { code: "YES", name: "Yes (1 Day)", etd: "1 hari", price: 25000 },
      { code: "OKE", name: "OKE Economy", etd: "5-7 hari", price: 9000 },
    ],
  },
  {
    courier: "J&T Express",
    logo: "🚚",
    services: [
      { code: "EZ", name: "J&T EZ", etd: "2-4 hari", price: 13000 },
      { code: "SAMEDAY", name: "Same Day", etd: "Hari ini", price: 35000 },
    ],
  },
  {
    courier: "SiCepat",
    logo: "⚡",
    services: [
      { code: "BEST", name: "BEST", etd: "2-3 hari", price: 11000 },
      { code: "HALU", name: "HALU", etd: "1 hari", price: 22000 },
    ],
  },
];

// ─── Payment Methods ──────────────────────────────────────────────────────────
export const paymentMethods = [
  {
    group: "Transfer Bank",
    icon: "🏦",
    options: [
      { code: "bca", name: "BCA Virtual Account", logo: "🔵" },
      { code: "bni", name: "BNI Virtual Account", logo: "🟠" },
      { code: "mandiri", name: "Mandiri Virtual Account", logo: "🟡" },
      { code: "bri", name: "BRI Virtual Account", logo: "🔴" },
    ],
  },
  {
    group: "E-Wallet",
    icon: "📱",
    options: [
      { code: "gopay", name: "GoPay", logo: "💚" },
      { code: "ovo", name: "OVO", logo: "💜" },
      { code: "dana", name: "DANA", logo: "💙" },
      { code: "shopee", name: "ShopeePay", logo: "🧡" },
    ],
  },
  {
    group: "Kartu Kredit/Debit",
    icon: "💳",
    options: [
      { code: "visa", name: "Visa/Mastercard", logo: "💳" },
    ],
  },
  {
    group: "Bayar di Tempat",
    icon: "💵",
    options: [
      { code: "cod", name: "COD (Cash on Delivery)", logo: "💵" },
    ],
  },
];

// ─── Mock Orders ──────────────────────────────────────────────────────────────
export type OrderStatus = "menunggu" | "diproses" | "dikirim" | "selesai" | "dibatalkan";

export const mockOrders = [
  {
    id: "HS-20250612-001",
    date: "12 Jun 2025",
    status: "dikirim" as OrderStatus,
    total: 125000,
    items: [
      { name: "Sabun Cair Hera Store Premium", emoji: "🧴", qty: 2, price: 25000 },
      { name: "Vitamin C 500mg Effervescent", emoji: "💊", qty: 1, price: 45000 },
      { name: "Sunscreen SPF 50+", emoji: "🧴", qty: 1, price: 55000 },
    ],
    courier: "JNE REG",
    trackingNumber: "JNE1234567890",
    estimatedArrival: "14-16 Jun 2025",
    address: "Jl. Merpati No. 12, Jakarta Selatan",
  },
  {
    id: "HS-20250605-002",
    date: "5 Jun 2025",
    status: "selesai" as OrderStatus,
    total: 67000,
    items: [
      { name: "Pembersih Lantai Super Harum", emoji: "🧹", qty: 1, price: 28000 },
      { name: "Sabun Cuci Piring Anti Lemak", emoji: "🍽️", qty: 2, price: 16000 },
    ],
    courier: "SiCepat BEST",
    trackingNumber: "SCP9876543210",
    estimatedArrival: "7 Jun 2025",
    address: "Jl. Merpati No. 12, Jakarta Selatan",
  },
  {
    id: "HS-20250528-003",
    date: "28 Mei 2025",
    status: "selesai" as OrderStatus,
    total: 55000,
    items: [
      { name: "Losion Tubuh Aloe Vera & Vitamin E", emoji: "🧴", qty: 1, price: 32000 },
      { name: "Hand Sanitizer Antibacterial", emoji: "🧼", qty: 1, price: 18000 },
    ],
    courier: "J&T EZ",
    trackingNumber: "JT5432198760",
    estimatedArrival: "31 Mei 2025",
    address: "Jl. Merpati No. 12, Jakarta Selatan",
  },
  {
    id: "HS-20250617-004",
    date: "17 Jun 2025",
    status: "menunggu" as OrderStatus,
    total: 38000,
    items: [
      { name: "Deterjen Pakaian Bubuk 1kg", emoji: "👕", qty: 1, price: 38000 },
    ],
    courier: "Belum dipilih",
    trackingNumber: "",
    estimatedArrival: "-",
    address: "Jl. Merpati No. 12, Jakarta Selatan",
  },
];
