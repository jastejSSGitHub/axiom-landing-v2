"use client";

import { cn } from "@/lib/utils";
import { FuturesSquareIcon } from "@/components/landing/FuturesSquareIcon";

/** Stems that exist under `/public/futures_icons_square/` (synced from subscription app). */
const ASSET_SYMBOLS = new Set([
  "GC",
  "CL",
  "NQ",
  "ES",
  "SI",
  "NG",
  "YM",
  "RTY",
  "ZN",
  "ZB",
  "6E",
  "6B",
  "HG",
]);

export function futuresIconFileKey(symbol: string): string {
  const u = symbol.trim().toUpperCase();
  if (u === "MNQ") return "NQ";
  return u;
}

export function futuresIconSrc(symbol: string): string | null {
  const key = futuresIconFileKey(symbol);
  if (!ASSET_SYMBOLS.has(key)) return null;
  return `/futures_icons_square/${key}.svg`;
}

type FuturesIconAssetProps = {
  symbol: string;
  size?: number;
  className?: string;
  alt?: string;
};

export function FuturesIconAsset({
  symbol,
  size = 40,
  className,
  alt,
}: FuturesIconAssetProps) {
  const src = futuresIconSrc(symbol);
  if (!src) {
    return <FuturesSquareIcon symbol={symbol} size={size} className={className} />;
  }
  const key = futuresIconFileKey(symbol);
  return (
    <img
      src={src}
      alt={alt ?? `${key} futures contract`}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-[6px] object-contain", className)}
      loading="lazy"
      decoding="async"
    />
  );
}
