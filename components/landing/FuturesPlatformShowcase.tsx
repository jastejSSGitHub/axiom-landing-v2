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
          Not &quot;go long here.&quot; A specific entry zone, stop loss, and two targets — computed from five layers of
          confluence before the candle closes. Every layer visible. Every reason explained.
        </p>
        <div className="mx-auto w-full max-w-6xl rounded-[28px] bg-gradient-to-br from-[#cfe8ff] via-[#4a7eb8] to-[#0a1f3d] p-5 shadow-xl ring-1 ring-black/5 sm:p-7 md:p-8">
          <div className="grid gap-6 text-left lg:grid-cols-3 [&>div]:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]">
            {signals.map((s) => (
              <LandingSignalCard key={s.id} signal={s} />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-[#F9F8F6] p-6 md:p-10">
        <LandingWatchlistStrip quoteById={quoteById} status={quotesStatus} />
      </div>

      <div className="border-t border-gray-200/80">
        <div className="flex flex-col gap-8 md:gap-10">
          {/* News: white surface on warm page */}
          <div className="w-full min-w-0 overflow-visible rounded-2xl border border-gray-200/80 bg-white p-5 pt-12 shadow-sm md:p-8 md:pt-14">
            <div className="mb-8 text-left md:mb-10">
              <div className="mb-4 text-xs font-data font-bold uppercase tracking-widest text-gray-500">
                Market intelligence
              </div>
              <h2 className="mb-4 max-w-full text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                <span className="text-blue-600">Markets move on news.</span>
                <br />
                Know the tone before the trade.
              </h2>
              <p className="w-full max-w-none text-lg leading-relaxed text-gray-600 whitespace-nowrap overflow-x-auto [scrollbar-width:thin]">
                Every headline scored BULLISH, BEARISH, or NEUTRAL by AI — in real time. No spin. No noise. Just signal.
              </p>
            </div>
            <div className="min-w-0">
              <LandingNewsFeed />
            </div>
          </div>

          {/* Calculator: slightly darker warm surface + extra space before the card */}
          <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-[#EBE9E4] p-5 pt-12 md:p-8 md:pt-14">
            <div className="mb-10 text-left md:mb-14">
              <div className="mb-4 text-xs font-data font-bold uppercase tracking-widest text-gray-500">
                Prop firm risk calculator
              </div>
              <h2 className="mb-4 max-w-full text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                Know your exact risk before you click buy.
              </h2>
              <p className="w-full max-w-full text-pretty text-lg leading-relaxed text-gray-600 break-words sm:max-w-[560px]">
                Choose your firm, account size, and stop distance. See exactly how many contracts you can take and what
                your total dollar risk is — before you place the trade.
              </p>
            </div>
            <div className="min-w-0">
              <LandingRiskCalculator symbol="GC" entry={entryMid} stop={stop} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
