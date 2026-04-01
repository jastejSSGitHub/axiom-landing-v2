"use client";

import { cn } from "@/lib/utils";

const STYLES: Record<string, { bg: string; label: string }> = {
  GC: { bg: "bg-amber-500", label: "Au" },
  NQ: { bg: "bg-blue-600", label: "NQ" },
  ES: { bg: "bg-indigo-600", label: "ES" },
  CL: { bg: "bg-slate-800", label: "CL" },
  SI: { bg: "bg-slate-500", label: "SI" },
  YM: { bg: "bg-rose-700", label: "YM" },
};

export function FuturesSquareIcon({
  symbol,
  size = 40,
  className,
}: {
  symbol: string;
  size?: number;
  className?: string;
}) {
  const u = symbol.toUpperCase();
  const st = STYLES[u] ?? { bg: "bg-gray-400", label: u.slice(0, 2) };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[6px] font-data text-[10px] font-bold uppercase tracking-tight text-white shadow-none",
        st.bg,
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {st.label}
    </span>
  );
}
