"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { YahooQuote } from "@/lib/market-data/yahoo";
import { FuturesIconAsset } from "@/components/landing/FuturesIconAsset";
import { formatChangePctLabel, formatFuturesPrice } from "@/lib/landing/format-quote";

type QuotesStatus = "loading" | "ok" | "error";

/** Session / confluence tier shown in “BEST: [OPTION] NOW” and optional card border. */
type WatchlistTradeQuality = "best" | "good" | "fair" | "avoid";

const TRADE_QUALITY_STYLES: Record<
  WatchlistTradeQuality,
  { label: string; pill: string }
> = {
  best: {
    label: "BEST",
    pill: "bg-emerald-50 text-emerald-700",
  },
  good: {
    label: "GOOD",
    pill: "bg-sky-100 text-blue-800",
  },
  fair: {
    label: "FAIR",
    pill: "bg-amber-50 text-amber-700",
  },
  avoid: {
    label: "AVOID",
    pill: "bg-gray-100 text-gray-600",
  },
};

/** Futures watchlist row — yahooKey must match symbols fetched in `TICKER_API_SYMBOLS` on the home page. */
const WATCHLIST_ROWS = [
  {
    symbol: "GC",
    yahooKey: "GC=F" as const,
    displayName: "Gold",
    exchange: "COMEX",
    hasActiveSignal: true,
    tradeQuality: "best" as const,
  },
  {
    symbol: "NQ",
    yahooKey: "MNQ=F" as const,
    displayName: "Nasdaq 100",
    exchange: "CME",
    hasActiveSignal: false,
    tradeQuality: "good" as const,
  },
  {
    symbol: "ES",
    yahooKey: "ES=F" as const,
    displayName: "S&P 500",
    exchange: "CME",
    hasActiveSignal: false,
    tradeQuality: "fair" as const,
  },
  {
    symbol: "CL",
    yahooKey: "CL=F" as const,
    displayName: "Crude Oil",
    exchange: "NYMEX",
    hasActiveSignal: false,
    tradeQuality: "avoid" as const,
  },
  {
    symbol: "SI",
    yahooKey: "SI=F" as const,
    displayName: "Silver",
    exchange: "COMEX",
    hasActiveSignal: false,
    tradeQuality: "good" as const,
  },
  {
    symbol: "NG",
    yahooKey: "NG=F" as const,
    displayName: "Natural Gas",
    exchange: "NYMEX",
    hasActiveSignal: false,
    tradeQuality: "avoid" as const,
  },
  {
    symbol: "YM",
    yahooKey: "YM=F" as const,
    displayName: "Dow Jones",
    exchange: "CBOT",
    hasActiveSignal: false,
    tradeQuality: "fair" as const,
  },
  {
    symbol: "RTY",
    yahooKey: "RTY=F" as const,
    displayName: "Russell 2000",
    exchange: "CME",
    hasActiveSignal: false,
    tradeQuality: "avoid" as const,
  },
  {
    symbol: "ZN",
    yahooKey: "ZN=F" as const,
    displayName: "US 10Y",
    exchange: "CBOT",
    hasActiveSignal: false,
    tradeQuality: "good" as const,
  },
  {
    symbol: "ZB",
    yahooKey: "ZB=F" as const,
    displayName: "US 30Y",
    exchange: "CBOT",
    hasActiveSignal: false,
    tradeQuality: "fair" as const,
  },
  {
    symbol: "6E",
    yahooKey: "6E=F" as const,
    displayName: "Euro FX",
    exchange: "CME",
    hasActiveSignal: false,
    tradeQuality: "best" as const,
  },
  {
    symbol: "6B",
    yahooKey: "6B=F" as const,
    displayName: "British Pound",
    exchange: "CME",
    hasActiveSignal: false,
    tradeQuality: "avoid" as const,
  },
  {
    symbol: "HG",
    yahooKey: "HG=F" as const,
    displayName: "Copper",
    exchange: "COMEX",
    hasActiveSignal: false,
    tradeQuality: "fair" as const,
  },
] as const;

function WatchlistCard({
  w,
  quoteById,
  status,
}: {
  w: (typeof WATCHLIST_ROWS)[number];
  quoteById: Record<string, YahooQuote>;
  status: QuotesStatus;
}) {
  const q = quoteById[w.yahooKey];
  const loading = status === "loading" && !q;
  const up = q ? q.changePercent >= 0 : true;
  const quality = TRADE_QUALITY_STYLES[w.tradeQuality];

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[200px] w-[168px] shrink-0 flex-col rounded-xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md",
        w.tradeQuality === "best" ? "border-emerald-200" : "border-gray-200/80",
        w.hasActiveSignal && "ring-1 ring-emerald-500/20"
      )}
    >
      <div className="pointer-events-none absolute right-2 top-2 z-[2] text-amber-500" aria-hidden>
        <Star className="h-4 w-4 fill-amber-500" />
      </div>
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
        <div className="flex items-start gap-2.5">
          <FuturesIconAsset symbol={w.symbol} size={40} className="shrink-0" />
          <div className="min-w-0 flex-1 pr-6">
            <p className="text-sm font-bold text-gray-900">{w.displayName}</p>
            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-gray-500">{w.exchange}</p>
          </div>
        </div>
        {loading ? (
          <div className="mt-4 space-y-2">
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        ) : q ? (
          <>
            <div className="mt-3">
              <p className="font-data text-2xl font-bold tabular-nums tracking-tight text-gray-900">
                {formatFuturesPrice(w.symbol, q.price)}
              </p>
            </div>
            <p
              className={cn(
                "mt-1 font-data text-xs font-semibold tabular-nums",
                up ? "text-emerald-600" : "text-red-500"
              )}
            >
              {up ? "▲" : "▼"} {formatChangePctLabel(q.changePercent)}
            </p>
          </>
        ) : (
          <p className="mt-4 text-xs text-gray-500">No quote</p>
        )}
        <div className="mt-auto flex flex-col gap-1 pt-3">
          <p
            className={cn(
              "text-[10px] font-bold uppercase leading-snug tracking-wide",
              w.hasActiveSignal ? "text-emerald-600" : "text-gray-500"
            )}
          >
            {w.hasActiveSignal ? (
              <>
                Active signal <span aria-hidden>●</span>
              </>
            ) : (
              "No active signal"
            )}
          </p>
          <p className="flex flex-wrap items-center gap-x-1 text-[10px] font-semibold uppercase leading-snug tracking-wide text-gray-500">
            <span>Best:</span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide",
                quality.pill
              )}
            >
              {quality.label}
            </span>
            <span>Now</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function LandingWatchlistStrip({
  quoteById,
  status,
}: {
  quoteById: Record<string, YahooQuote>;
  status: QuotesStatus;
}) {
  return (
    <div className="w-full min-w-0">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">Your watchlist</h3>
      <p className="mb-4 max-w-2xl text-sm text-gray-600">
        Pin the contracts you trade. Live prices, session quality, and signal state at a glance. Syncs to Telegram alerts
        the moment you sign up.
      </p>
      {/* Full viewport width — green gradient band behind the carousel (matches landing mock) */}
      <div
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] md:py-8"
        role="region"
        aria-label="Futures watchlist, infinite horizontal marquee"
        style={{
          backgroundImage: `
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.16) 0%,
              rgba(255, 255, 255, 0.06) 22%,
              rgba(255, 255, 255, 0) 42%,
              rgba(255, 255, 255, 0) 58%,
              rgba(0, 0, 0, 0.06) 100%
            ),
            linear-gradient(90deg, #9fe08a 0%, #5ec968 22%, #2fa85a 48%, #1d7a4a 74%, #0f4d32 100%)
          `,
        }}
      >
        <div className="landing-watchlist-strip-viewport pb-1 pt-0.5">
          <div className={cn("landing-watchlist-marquee flex flex-nowrap gap-3")}>
            <div className="flex shrink-0 gap-3">
              {WATCHLIST_ROWS.map((w) => (
                <div key={w.symbol} className="shrink-0">
                  <WatchlistCard w={w} quoteById={quoteById} status={status} />
                </div>
              ))}
            </div>
            <div className="watchlist-marquee-dup flex shrink-0 gap-3" aria-hidden>
              {WATCHLIST_ROWS.map((w) => (
                <div key={w.symbol} className="shrink-0">
                  <WatchlistCard w={w} quoteById={quoteById} status={status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
