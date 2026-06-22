import { STATUS_CONFIG } from "@/utils/order-status";

interface StatusBadgeProps {
  status: string;
  customLabel?: string;
}

export default function StatusBadge({ status, customLabel }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
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
