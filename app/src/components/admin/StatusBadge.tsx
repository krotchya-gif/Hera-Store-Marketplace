const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  // Order statuses
  menunggu: {
    label: "Menunggu Bayar",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  diproses: {
    label: "Diproses",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  dikirim: {
    label: "Dikirim",
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-400",
  },
  selesai: {
    label: "Selesai",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  dibatalkan: {
    label: "Dibatalkan",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-400",
  },
  // Customer statuses
  aktif: {
    label: "Aktif",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  nonaktif: {
    label: "Nonaktif",
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
  diblokir: {
    label: "Diblokir",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
  },
  // Product statuses
  published: {
    label: "Aktif",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  draft: {
    label: "Draft",
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
  habis: {
    label: "Habis",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-400",
  },
  // Voucher statuses
  aktif_voucher: {
    label: "Aktif",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  kadaluarsa: {
    label: "Kadaluarsa",
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
  // Flash sale statuses
  berlangsung: {
    label: "Berlangsung",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  akan_datang: {
    label: "Akan Datang",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  // Payment statuses
  lunas: {
    label: "Lunas",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  belum_bayar: {
    label: "Belum Bayar",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
};

interface StatusBadgeProps {
  status: string;
  customLabel?: string;
}

export default function StatusBadge({ status, customLabel }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: customLabel ?? status,
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {customLabel ?? config.label}
    </span>
  );
}
