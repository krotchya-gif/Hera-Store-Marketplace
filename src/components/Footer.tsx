import Link from "next/link";
import { Leaf } from "lucide-react";
import { STORE_NAME } from "@/utils/storeConfig";

export default function Footer() {
  const columns = [
    {
      title: "Layanan",
      links: [
        { label: "Tentang Kami", href: "/tentang-kami" },
        { label: "Karir", href: "/karir" },
        { label: "Blog", href: "/blog" },
        { label: "Hubungi Kami", href: "/hubungi-kami" },
      ],
    },
    {
      title: "Bantuan",
      links: [
        { label: "FAQ", href: "/faq" },
        { label: "Cara Belanja", href: "/cara-belanja" },
        { label: "Pengembalian Barang", href: "/pengembalian-barang" },
        { label: "Lacak Pesanan", href: "/profil?tab=pesanan" },
      ],
    },
    {
      title: "Kategori",
      links: [
        { label: "Perawatan Tubuh", href: "/kategori/perawatan-tubuh" },
        { label: "Perawatan Rumah", href: "/kategori/perawatan-rumah" },
        { label: "Kesehatan", href: "/kategori/kesehatan" },
        { label: "Kecantikan", href: "/kategori/kecantikan" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">{STORE_NAME}</span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed">
              Marketplace produk rumah tangga premium. Kualitas terjamin, harga
              terjangkau.
            </p>
            <div className="flex gap-3 mt-4">
              {["📸", "🎵", "👤"].map((sm, i) => (
                <button
                  key={i}
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-sm hover:bg-green-600 transition-colors"
                >
                  {sm}
                </button>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-semibold text-sm mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-xs hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} {STORE_NAME}. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">Metode Pembayaran:</span>
            {["💳", "🏦", "📱", "💵"].map((p, i) => (
              <div key={i} className="bg-gray-800 px-2 py-1 rounded text-xs">
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
