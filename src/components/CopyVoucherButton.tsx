'use client';

export default function CopyVoucherButton({ code }: { code: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(code)}
      className="text-xs font-semibold text-green-600 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-50"
    >
      Salin
    </button>
  );
}
