import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { STORE_NAME, STORE_EMAIL } from "@/utils/storeConfig";

export const metadata = {
  title: `Pengembalian Barang — ${STORE_NAME}`,
  description: `Syarat dan ketentuan pengembalian barang di ${STORE_NAME}.`,
};

export default function PengembalianBarangPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengembalian Barang</h1>
          <p className="text-sm text-gray-500 mt-1">Syarat dan ketentuan pengembalian barang</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Kebijakan Retur</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Pengembalian barang dapat dilakukan dalam waktu 7 hari setelah barang diterima</li>
            <li>Barang harus dalam kondisi baik, belum digunakan, dan masih memiliki label/segel</li>
            <li>Kelengkapan produk termasuk kemasan asli harus disertakan</li>
            <li>Biaya pengiriman retur ditanggung oleh pembeli kecuali ada kesalahan dari pihak kami</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Syarat Pengembalian</h2>
          <div className="space-y-3">
            {[
              { title: "Produk Rusak/Cacat", desc: "Barang yang diterima dalam kondisi rusak atau cacat produksi. Sertakan foto/video sebagai bukti." },
              { title: "Produk Tidak Sesuai", desc: "Barang yang diterima tidak sesuai dengan pesanan (warna, varian, ukuran berbeda)." },
              { title: "Produk Salah", desc: "Kami mengirimkan produk yang berbeda dari yang dipesan." },
            ].map((item) => (
              <div key={item.title} className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Prosedur Pengembalian</h2>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
            <li>Hubungi customer service melalui email <a href={`mailto:${STORE_EMAIL}`} className="text-green-600 hover:underline">{STORE_EMAIL}</a></li>
            <li>Sertakan nomor pesanan dan alasan pengembalian</li>
            <li>Tim kami akan memproses dan memberikan instruksi lebih lanjut</li>
            <li>Kirim barang kembali dengan menyertakan nomor resi</li>
            <li>Dana akan dikembalikan maksimal 3x24 jam setelah barang diterima</li>
          </ol>
        </div>
      </div>
      <Footer />
    </div>
  );
}
