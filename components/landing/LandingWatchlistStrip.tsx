"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { YahooQuote } from "@/lib/market-data/yahoo";
import { FuturesSquareIcon } from "@/components/landing/FuturesSquareIcon";
import { formatChangePctLabel, formatFuturesPrice } from "@/lib/landing/format-quote";

type QuotesStatus = "loading" | "ok" | "error";

const ROWS = [
  { symbol: "GC", yahooKey: "GC=F" as const, displayName: "Gold", exchange: "COMEX", hasActiveSignal: true },
  { symbol: "NQ", yahooKey: "MNQ=F" as const, displayName: "Nasdaq 100", exchange: "CME", hasActiveSignal: false },
  { symbol: "CL", yahooKey: "CL=F" as const, displayName: "Crude Oil", exchange: "NYMEX", hasActiveSignal: false },
];

export function LandingWatchlistStrip({
  quoteById,
  status,
}: {
  quoteById: Record<string, YahooQuote>;
  status: QuotesStatus;
}) {
  return (
    <div className="w-full">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">Your watchlist</h3>
      <p className="mb-4 max-w-2xl text-sm text-gray-600">
        Pin the contracts you trade most — live prices, session-aware quality, and signal state in one glance. After you
        sign up, your watchlist syncs across web and alerts.
      </p>
      {/* Break out of parent horizontal padding on small screens so the carousel can use the full panel width. */}
      <div className="min-w-0 max-md:-mx-6 md:mx-0">
        <div
          className={cn(
            "grid auto-cols-[minmax(160px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide",
            "max-md:px-6 max-md:snap-x max-md:snap-mandatory max-md:overscroll-x-contain max-md:touch-pan-x",
            "md:grid-flow-row md:grid-cols-3 md:overflow-visible md:px-0 md:snap-none"
          )}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
        {ROWS.map((w) => {
          const q = quoteById[w.yahooKey];
          const loading = status === "loading" && !q;
          const up = q ? q.changePercent >= 0 : true;

          return (
            <div
              key={w.symbol}
              className={cn(
                "relative flex min-h-[200px] min-w-[160px] max-md:snap-start flex-col rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:min-w-0",
                w.hasActiveSignal && "ring-1 ring-emerald-500/20"
              )}
            >
              <div className="pointer-events-none absolute right-2 top-2 z-[2] text-amber-500" aria-hidden>
                <Star className="h-4 w-4 fill-amber-500" />
              </div>
              <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
                <div className="flex items-start gap-2.5">
                  <FuturesSquareIcon symbol={w.symbol} size={40} className="shrink-0" />
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
                  <p className="text-[10px] font-semibold uppercase leading-snug tracking-wide text-gray-500">
                    Best: <span className="text-blue-600">AVOID</span> now
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
