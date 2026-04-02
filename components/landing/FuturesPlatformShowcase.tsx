"use client";

import { useMemo } from "react";
import type { YahooQuote } from "@/lib/market-data/yahoo";
import { LANDING_FUTURES_SIGNALS, type MockFuturesSignal } from "@/lib/landing/mock-signals";
import { LandingSignalCard } from "@/components/landing/LandingSignalCard";
import { LandingWatchlistStrip } from "@/components/landing/LandingWatchlistStrip";
import { LandingNewsFeed } from "@/components/landing/LandingNewsFeed";
import { LandingRiskCalculator } from "@/components/landing/LandingRiskCalculator";

type QuotesStatus = "loading" | "ok" | "error";

function buildSignals(quoteById: Record<string, YahooQuote>, status: QuotesStatus): MockFuturesSignal[] {
  const [gcBase, ...rest] = LANDING_FUTURES_SIGNALS;
  if (status !== "ok" || !gcBase) return LANDING_FUTURES_SIGNALS;

  const gcq = quoteById["GC=F"];
  if (!gcq || !Number.isFinite(gcq.price)) return LANDING_FUTURES_SIGNALS;

  const live = gcq.price;
  const gcLive: MockFuturesSignal = {
    ...gcBase,
    entryLow: live - 10,
    entryHigh: live + 10,
    stop: live - 26,
    tp1: live + 32,
    tp2: live + 54,
    rr: 2.1,
  };
  return [gcLive, ...rest];
}

export function FuturesPlatformShowcase({
  quoteById,
  quotesStatus,
}: {
  quoteById: Record<string, YahooQuote>;
  quotesStatus: QuotesStatus;
}) {
  const signals = useMemo(() => buildSignals(quoteById, quotesStatus), [quoteById, quotesStatus]);
  const gc = signals[0];
  const entryMid =
    gc && Number.isFinite(gc.entryLow) && Number.isFinite(gc.entryHigh) ? (gc.entryLow + gc.entryHigh) / 2 : undefined;
  const stop = gc?.stop;

  return (
    <div className="space-y-16">
      <div className="text-center">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">SIGNAL CARDS</h3>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Not a vague &quot;go long here.&quot; A specific entry zone, stop, and two targets — pre-computed from five
          layers of confluence before the candle closes.
        </p>
        <div className="grid gap-6 text-left lg:grid-cols-3">
          {signals.map((s) => (
            <LandingSignalCard key={s.id} signal={s} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-[#F9F8F6] p-6 md:p-10">
        <LandingWatchlistStrip quoteById={quoteById} status={quotesStatus} />
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <LandingNewsFeed />
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Prop firm risk calculator</p>
          <p className="mb-4 text-sm text-gray-600">
            Pick evaluation or funded, choose your firm and account size, and see contract count and dollar risk against
            daily loss limits and drawdown — before you place the trade.
          </p>
          <LandingRiskCalculator symbol="GC" entry={entryMid} stop={stop} />
        </div>
      </div>
    </div>
  );
}
