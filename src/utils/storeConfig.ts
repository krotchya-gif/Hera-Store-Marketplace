// Utilitas Konfigurasi Nama dan Info Toko untuk Kustomisasi Mudah
// Menggunakan Environment Variables dengan fallback default "Hera Store"

export const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Hera Store";
export const STORE_EMAIL = process.env.NEXT_PUBLIC_STORE_EMAIL || "info@herastore.com";
export const STORE_PHONE = process.env.NEXT_PUBLIC_STORE_PHONE || "+6281234567890";
export const STORE_DESCRIPTION = 
  process.env.NEXT_PUBLIC_STORE_DESCRIPTION || 
  `${STORE_NAME} adalah toko produk rumah tangga premium dengan berbagai pilihan produk berkualitas tinggi.`;
export const STORE_ADDRESS = 
  process.env.NEXT_PUBLIC_STORE_ADDRESS || 
  "Jl. Industri No. 45, Jakarta Selatan, DKI Jakarta 12345";
export const STORE_CITY = process.env.NEXT_PUBLIC_STORE_CITY || "Jakarta Selatan";

// Untuk domain email dinamis yang menyesuaikan dengan nama toko
export const getStoreDomain = () => {
  const cleanName = STORE_NAME.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${cleanName}.com`;
};

// Format email otomatis jika default triguna masih ada
export const getFormattedEmail = (email?: string) => {
  if (!email || email.includes("trigunasentosa.com")) {
    return `info@${getStoreDomain()}`;
  }
  return email;
};

// Format admin email berdasarkan nama toko
export const getAdminEmail = (username: string) => {
  return `${username}@${getStoreDomain()}`;
};
