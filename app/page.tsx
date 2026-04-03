"use client";

/* eslint-disable react/no-unescaped-entities -- body copy uses contractions and quoted phrases */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, ArrowRight, Play, TrendingUp, TrendingDown, UploadCloud, Activity, PieChart, Phone, Box } from "lucide-react";
import type { YahooQuote } from "@/lib/market-data/yahoo";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AxiomScoreRow } from "@/lib/types/axiom-scores";
import { FuturesPlatformShowcase } from "@/components/landing/FuturesPlatformShowcase";
import { FuturesIconAsset } from "@/components/landing/FuturesIconAsset";
import { LandingSignalCard } from "@/components/landing/LandingSignalCard";
import {
  HERO_CRUDE_SIGNAL_SEED,
  LANDING_FUTURES_SIGNALS,
  type MockFuturesSignal,
} from "@/lib/landing/mock-signals";

const TICKER_API_SYMBOLS = [
  { sym: "NIFTY", label: "NIFTY 50" },
  { sym: "MNQ=F", label: "NQ FUT" },
  { sym: "GC=F", label: "GC GOLD" },
  { sym: "BANKNIFTY", label: "BANKNIFTY" },
  { sym: "ES=F", label: "ES FUT" },
  { sym: "CL=F", label: "CL CRUDE" },
  { sym: "SI=F", label: "SI SILVER" },
  { sym: "YM=F", label: "YM DOW" },
  { sym: "NG=F", label: "NG GAS" },
  { sym: "RTY=F", label: "RTY" },
  { sym: "ZN=F", label: "ZN 10Y" },
  { sym: "ZB=F", label: "ZB 30Y" },
  { sym: "6E=F", label: "6E EUR" },
  { sym: "6B=F", label: "6B GBP" },
  { sym: "HG=F", label: "HG CU" },
] as const;

const QUOTES_FETCH_URL = `/api/market/quotes?symbols=${TICKER_API_SYMBOLS.map((t) => t.sym).join(",")}`;

function TelegramLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M11.944 0A12 12 0 1 0 24 12.056 12 12 0 0 0 11.944 0zm4.962 7.224c.149-.365.38-.456.784-.271l10.9 4.206c.292.112.28.269.051.338l-2.79.868-6.531-4.11c-.309-.188-.591-.087-.36.125l5.29 4.795-.194 2.859c.112-.002.162.05.225.111l1.419 1.409.61-4.111 7.18-6.715c.297-.264.122-.478-.168-.512z" />
    </svg>
  );
}

function formatTickerPrice(sym: string, n: number): string {
  if (sym === "NIFTY" || sym === "BANKNIFTY") {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(n);
  }
  if (sym === "CL=F" || sym === "SI=F") {
    const abs = Math.abs(n);
    if (sym === "SI=F" && abs < 100) return n.toFixed(2);
    if (abs < 100) return n.toFixed(2);
    return n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }
  return n.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 });
}

function formatChangePct(q: YahooQuote): { text: string; up: boolean } {
  const cp = q.changePercent;
  if (!Number.isFinite(cp) || Math.abs(cp) < 0.0005) return { text: "0.00%", up: true };
  const sign = cp >= 0 ? "+" : "−";
  return { text: `${sign}${Math.abs(cp).toFixed(2)}%`, up: cp >= 0 };
}

type QuotesStatus = "loading" | "ok" | "error";

function quotesRecord(list: YahooQuote[]): Record<string, YahooQuote> {
  const m: Record<string, YahooQuote> = {};
  for (const q of list) m[q.id] = q;
  return m;
}

// --- ANIMATION VARIANTS ---
const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

// --- UTILITY COMPONENTS ---
function CountUp({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      const duration = 1500;
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        }
      };
      requestAnimationFrame(animateCount);
    }
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// --- LANDING TICKER BAR (borrowed from Axiom trading app MarketPulseBar) ---

const TICKER_LOOP_DEFS = [...TICKER_API_SYMBOLS, ...TICKER_API_SYMBOLS, ...TICKER_API_SYMBOLS];

function TickerItemRow({
  label,
  quote,
  sym,
  loading,
}: {
  label: string;
  sym: string;
  quote?: YahooQuote;
  loading: boolean;
}) {
  if (loading || !quote) {
    return (
      <div className="flex items-center gap-3 px-5 py-2 border-r border-gray-100 shrink-0">
        <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase font-data">{label}</span>
        <span className="inline-block h-[13px] w-[4.5rem] rounded bg-gray-200/90 animate-pulse tabular-nums" aria-hidden />
        <span className="inline-flex h-[11px] w-11 items-center rounded bg-gray-200/90 animate-pulse" aria-hidden />
      </div>
    );
  }
  const ch = formatChangePct(quote);
  const price = formatTickerPrice(sym, quote.price);
  return (
    <div className="flex items-center gap-3 px-5 py-2 border-r border-gray-100 shrink-0">
      <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase font-data">{label}</span>
      <span className="text-[13px] font-data font-medium tabular-nums text-gray-900">{price}</span>
      <span
        className={`text-[11px] font-data font-semibold tabular-nums flex items-center gap-0.5 ${
          ch.up ? "text-[#059669]" : "text-[#DC2626]"
        }`}
      >
        {ch.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {ch.text}
      </span>
    </div>
  );
}

function LandingTickerBar({
  quoteById,
  status,
}: {
  quoteById: Record<string, YahooQuote>;
  status: QuotesStatus;
}) {
  const loading = status === "loading";
  const marqueeClass = loading ? "market-pulse-marquee is-paused" : "market-pulse-marquee";

  return (
    <div
      role="region"
      aria-label="Live market tickers"
      className="w-full overflow-hidden border-b border-white/55 bg-white/[0.38] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/[0.32]"
      style={{ display: status === "error" ? "none" : undefined }}
    >
      <div className={`${marqueeClass} min-h-[40px] items-center`}>
        <div className="flex shrink-0 items-center">
          {TICKER_LOOP_DEFS.map((def, i) => (
            <TickerItemRow
              key={`a-${def.sym}-${i}`}
              label={def.label}
              sym={def.sym}
              quote={quoteById[def.sym]}
              loading={loading}
            />
          ))}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {TICKER_LOOP_DEFS.map((def, i) => (
            <TickerItemRow
              key={`b-${def.sym}-${i}`}
              label={def.label}
              sym={def.sym}
              quote={quoteById[def.sym]}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- UI CARD REPLICAS ---

function CardContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.10),0_40px_80px_rgba(0,0,0,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

function HeroMockupGradientFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[32px] p-4 sm:p-5 md:p-[22px]"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #E8F4FF 0%, #B4D7FC 35%, #4F8DEB 72%, #2563EB 100%)",
      }}
    >
      {children}
    </div>
  );
}

function buildHeroGoldSignal(
  quoteById: Record<string, YahooQuote>,
  quotesStatus: QuotesStatus
): MockFuturesSignal {
  const base = LANDING_FUTURES_SIGNALS[0];
  const gc = quoteById["GC=F"];
  const goldOk = quotesStatus === "ok" && gc && Number.isFinite(gc.price);
  if (!goldOk) return { ...base };
  const live = gc.price;
  return {
    ...base,
    entryLow: live - 10,
    entryHigh: live + 10,
    stop: live - 26,
    tp1: live + 32,
    tp2: live + 54,
  };
}

type HeroInstrumentId = "gold" | "nasdaq" | "crude";

const HERO_INSTRUMENT_CYCLE: { id: HeroInstrumentId; ms: number }[] = [
  { id: "gold", ms: 3000 },
  { id: "nasdaq", ms: 3000 },
  { id: "crude", ms: 3000 },
];

/** Below Tailwind `sm` (640px): header mock shows only GC + NQ and toggles between them. */
const HERO_INSTRUMENT_CYCLE_MOBILE: { id: HeroInstrumentId; ms: number }[] = [
  { id: "gold", ms: 3000 },
  { id: "nasdaq", ms: 3000 },
];

function useHeroMockupCompact(): boolean {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return compact;
}

function heroCycleIndex(stepIndex: number, isMobileTwoUp: boolean): number {
  const list = isMobileTwoUp ? HERO_INSTRUMENT_CYCLE_MOBILE : HERO_INSTRUMENT_CYCLE;
  if (isMobileTwoUp && stepIndex >= list.length) return 0;
  return Math.min(stepIndex, list.length - 1);
}

function useHeroInstrumentCycle(isMobileTwoUp: boolean): HeroInstrumentId {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const list = isMobileTwoUp ? HERO_INSTRUMENT_CYCLE_MOBILE : HERO_INSTRUMENT_CYCLE;
    const idx = heroCycleIndex(stepIndex, isMobileTwoUp);
    const { ms } = list[idx];
    const t = window.setTimeout(() => {
      setStepIndex((i) => {
        const L = isMobileTwoUp ? HERO_INSTRUMENT_CYCLE_MOBILE : HERO_INSTRUMENT_CYCLE;
        const cur = heroCycleIndex(i, isMobileTwoUp);
        return (cur + 1) % L.length;
      });
    }, ms);
    return () => window.clearTimeout(t);
  }, [stepIndex, isMobileTwoUp]);

  const list = isMobileTwoUp ? HERO_INSTRUMENT_CYCLE_MOBILE : HERO_INSTRUMENT_CYCLE;
  return list[heroCycleIndex(stepIndex, isMobileTwoUp)].id;
}

function nasdaqHeroSeed(): MockFuturesSignal {
  const nq = LANDING_FUTURES_SIGNALS.find((s) => s.symbol === "NQ")!;
  return {
    ...nq,
    direction: "LONG",
    status: "ACTIVE",
    confidence: 76,
    setupScore: "B (3/5)",
    reasoningLayers: [
      "★ NQ reclaimed the NY open gap into value; order flow flipped bullish on 15m while prior support holds.",
      ...nq.reasoningLayers.slice(1),
    ],
  };
}

function buildHeroCarouselSignal(
  active: HeroInstrumentId,
  quoteById: Record<string, YahooQuote>,
  quotesStatus: QuotesStatus
): MockFuturesSignal {
  if (active === "gold") {
    return buildHeroGoldSignal(quoteById, quotesStatus);
  }
  if (active === "nasdaq") {
    const base = nasdaqHeroSeed();
    const mnq = quoteById["MNQ=F"];
    const ok = quotesStatus === "ok" && mnq && Number.isFinite(mnq.price);
    if (!ok) return { ...base };
    const live = mnq.price;
    return {
      ...base,
      entryLow: live - 22,
      entryHigh: live - 6,
      stop: live - 95,
      tp1: live + 78,
      tp2: live + 155,
      rr: 2,
    };
  }
  const crudeBase = HERO_CRUDE_SIGNAL_SEED;
  const cl = quoteById["CL=F"];
  const ok = quotesStatus === "ok" && cl && Number.isFinite(cl.price);
  if (!ok) return { ...crudeBase };
  const live = cl.price;
  return {
    ...crudeBase,
    entryLow: live - 0.48,
    entryHigh: live + 0.12,
    stop: live - 1.12,
    tp1: live + 1.08,
    tp2: live + 2.4,
  };
}

function MockupHeroCard({
  quoteById,
  quotesStatus,
}: {
  quoteById: Record<string, YahooQuote>;
  quotesStatus: QuotesStatus;
}) {
  const heroCompact = useHeroMockupCompact();
  const activeInstrument = useHeroInstrumentCycle(heroCompact);
  const carouselSignal = useMemo(
    () => buildHeroCarouselSignal(activeInstrument, quoteById, quotesStatus),
    [activeInstrument, quoteById, quotesStatus]
  );
  const gc = quoteById["GC=F"];
  const nq = quoteById["MNQ=F"];
  const bn = quoteById["BANKNIFTY"];
  const es = quoteById["ES=F"];
  const cl = quoteById["CL=F"];

  const miniLine = (q: YahooQuote | undefined, label: string) => {
    if (quotesStatus === "loading" && !q) return `${label} …`;
    if (!q) return `${label} —`;
    const ch = formatChangePct(q);
    const color = ch.up ? "text-green-400" : "text-red-400";
    const arrow = ch.up ? "▲" : "▼";
    return (
      <>
        {label} {formatTickerPrice(q.id, q.price)} <span className={color}>{arrow}{ch.text}</span>
      </>
    );
  };

  const watchRow = (
    name: string,
    code: string,
    q: YahooQuote | undefined,
    active: boolean,
    iconSymbol: string
  ) => {
    const loading = quotesStatus === "loading" && !q;
    const ch = q ? formatChangePct(q) : null;
    return (
      <motion.div
        key={name}
        layout
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className={`rounded-xl border p-3 transition-colors duration-500 ${
          active ? "border-green-200 bg-green-50/30 shadow-[0_0_0_1px_rgba(74,222,128,0.35)]" : "border-gray-100 bg-white shadow-sm"
        }`}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <FuturesIconAsset symbol={iconSymbol} size={32} className="mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-gray-900">{name}</div>
              <div className="text-[9px] font-data font-semibold tracking-widest text-gray-400">{code}</div>
            </div>
          </div>
          {active && <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#00E676]" />}
        </div>
        <div className="text-[13px] font-data font-semibold mb-0.5">
          {loading ? <span className="inline-block h-4 w-14 rounded bg-gray-200 animate-pulse" /> : q ? formatTickerPrice(q.id, q.price) : "—"}
        </div>
        <div
          className={`text-[10px] font-data font-semibold ${
            ch ? (ch.up ? "text-green-600" : "text-red-500") : "text-gray-400"
          }`}
        >
          {loading ? (
            <span className="inline-block h-3 w-12 rounded bg-gray-200 animate-pulse" />
          ) : ch ? (
            <>
              {ch.up ? "▲" : "▼"} {ch.text}
            </>
          ) : (
            "—"
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-[520px]">
      <HeroMockupGradientFrame>
        <motion.div
          className="origin-center cursor-pointer transition-transform duration-500 ease-in-out"
          initial={{ rotate: "1.5deg", y: 0 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ rotate: "1.5deg" }}
          whileHover={{ rotate: "0deg" }}
        >
        <CardContainer className="text-left w-full border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_20px_50px_rgba(0,0,0,0.12)]">
        {/* Ticker */}
        <div className="bg-[#0a0a0a] text-white flex overflow-hidden whitespace-nowrap h-8 items-center border-b border-gray-800">
          <motion.div
            className="flex space-x-6 text-[11px] font-data tracking-widest text-gray-300"
            animate={{ x: [0, -500] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <span>{miniLine(nq, "NQ FUT")}</span>
            <span>·</span>
            <span>{miniLine(gc, "GC (GOLD)")}</span>
            <span>·</span>
            <span>{miniLine(bn, "BANKNIFTY")}</span>
            <span>·</span>
            <span>{miniLine(es, "ES FUT")}</span>
            <span>·</span>
            <span>{miniLine(cl, "CL")}</span>
          </motion.div>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Session Timeline */}
          <div>
            <div className="text-center font-data text-xs font-semibold text-gray-500 tracking-widest mb-3 uppercase">
              LONDON IN 2H 14M
            </div>
            <div className="flex justify-between items-center relative px-2">
              <div className="absolute top-1 left-2 right-2 h-[2px] bg-gray-100 z-0"></div>
              {["LONDON", "PRE-MKT", "NY CORE", "LUNCH", "PM", "CLOSE", "ASIA"].map((lbl, i) => (
                <div key={i} className="flex flex-col items-center gap-2 z-10 relative">
                  <div className={`w-2 h-2 rounded-full ${lbl === "ASIA" ? "bg-blue-600" : "bg-gray-300 ring-4 ring-white"}`} />
                  <span className="text-[9px] font-data font-semibold text-gray-400 tracking-widest uppercase">{lbl}</span>
                  {lbl === "ASIA" && (
                     <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-data font-bold">NOW</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Watchlist — mobile: GC + NQ only, animates GC ↔ NQ; sm+: adds CL */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {watchRow("Gold", "COMEX", gc, activeInstrument === "gold", "GC")}
            {watchRow("Nasdaq 100", "CME", nq, activeInstrument === "nasdaq", "NQ")}
            <div className="hidden sm:block">
              {watchRow("Crude Oil", "NYMEX", cl, activeInstrument === "crude", "CL")}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeInstrument}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0"
            >
              <LandingSignalCard signal={carouselSignal} />
            </motion.div>
          </AnimatePresence>

        </div>
        </CardContainer>
        </motion.div>
      </HeroMockupGradientFrame>
    </div>
  );
}

const PLACEHOLDER_SCORE_PILLARS = [
  { label: "FUNDAMENTAL", cap: "65" },
  { label: "TECHNICAL", cap: "20" },
  { label: "DISCOVERY", cap: "10" },
] as const;

function IndiaMartPlaceholderCard() {
  const reduceMotion = useReducedMotion();
  return (
    <CardContainer className="w-full max-w-[460px] text-left">
      <div className="p-6 md:p-8 border-b border-gray-200/80">
        <h3 className="text-xl font-bold text-gray-700 leading-tight flex items-center gap-2">
          IndiaMART InterMESH
          <span className="text-[11px] bg-gray-100 text-gray-400 px-2 py-1 rounded-md font-data tracking-widest">NSE</span>
        </h3>
        <p className="text-[14px] text-gray-500 mt-3 font-medium">Score computation in progress</p>
      </div>
      <div className="flex flex-col items-center gap-10 p-6 md:p-8">
        <div className="relative flex h-[240px] w-[240px] shrink-0 items-center justify-center">
          <svg className="pointer-events-none absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
          </svg>
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ rotate: reduceMotion ? 0 : 360 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 2.2, repeat: Infinity, ease: "linear" }
            }
          >
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-primary"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="62 190"
              />
            </svg>
          </motion.div>
          <div className="relative z-10 mt-2 flex flex-col items-center text-center">
            <span className="font-data text-6xl font-bold tracking-tighter text-gray-300">—</span>
            <span className="mt-3 font-data text-[12px] font-bold tracking-widest text-gray-400">SCORE</span>
            <span className="mt-2 text-[13px] font-semibold text-primary">Computing</span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5">
          {PLACEHOLDER_SCORE_PILLARS.map((p, i) => (
            <div key={p.label} className="flex w-full flex-col gap-2">
              <div className="flex justify-between font-data text-[11px] font-bold tracking-widest text-gray-500">
                <span>{p.label}</span>
                <span className="text-gray-400">
                  —/{p.cap}
                </span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  className="h-full rounded-full bg-primary/35"
                  animate={reduceMotion ? { width: "22%" } : { width: ["14%", "32%", "14%"] }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.18,
                        }
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContainer>
  );
}

function scoreTierLabel(total: number): { text: string; className: string } {
  if (total >= 80) return { text: "Strong", className: "text-green-600" };
  if (total >= 60) return { text: "Fair", className: "text-amber-500" };
  return { text: "Watch", className: "text-gray-500" };
}

function MockupScoreCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [row, setRow] = useState<AxiomScoreRow | null | undefined>(undefined);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      queueMicrotask(() => setRow(null));
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("axiom_scores")
        .select("score_total, score_fundamentals, score_technicals, score_discovery, narrative, symbol, computed_at")
        .or("symbol.eq.INDIAMART,symbol.eq.INDIAMART.NS")
        .order("computed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setRow(null);
        return;
      }
      setRow(data as AxiomScoreRow);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (row === undefined) {
    return (
      <CardContainer className="w-full max-w-[460px] text-left">
        <div className="p-6 md:p-8 flex items-center justify-center min-h-[200px] text-gray-400 text-sm font-medium">Loading…</div>
      </CardContainer>
    );
  }

  if (!row || row.score_total == null || !(row.score_total > 0)) {
    return <IndiaMartPlaceholderCard />;
  }

  const total = Number(row.score_total);
  const f = Number(row.score_fundamentals ?? 0);
  const t = Number(row.score_technicals ?? 0);
  const d = Number(row.score_discovery ?? 0);
  const pFund = Math.min(100, Math.max(0, (f / 65) * 100));
  const pTech = Math.min(100, Math.max(0, (t / 20) * 100));
  const pDisc = Math.min(100, Math.max(0, (d / 10) * 100));
  const pillars = [
    { label: "FUNDAMENTAL", val: `${Math.round(Math.min(65, f))}/65`, fill: pFund },
    { label: "TECHNICAL", val: `${Math.round(Math.min(20, t))}/20`, fill: pTech },
    { label: "DISCOVERY", val: `${Math.round(Math.min(10, d))}/10`, fill: pDisc },
  ];
  const tier = scoreTierLabel(total);
  const ringFrac = Math.min(1, Math.max(0, total / 100));

  return (
    <CardContainer className="w-full max-w-[460px] text-left">
      <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight flex items-center gap-2">
            IndiaMART InterMESH
            <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-data tracking-widest">NSE</span>
          </h3>
          <p className="text-[14px] text-gray-500 mt-2 font-medium">B2B Internet Platform · ₹12,735 Cr</p>
          <div className="mt-3 mb-1 inline-block bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[11px] font-data font-bold tracking-widest">
            #2 of 14 B2B Internet stocks
          </div>
          <div className="mt-4 flex items-center font-data text-lg font-semibold">
            ₹2,016.50 <span className="ml-3 text-red-500 font-medium flex items-center gap-1">▼ -2.4% today</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-6 md:p-8 gap-10 items-center">
        <div ref={ref} className="relative w-[240px] h-[240px] flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="#f59e0b"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={isInView ? { strokeDashoffset: 251.2 - 251.2 * ringFrac } : {}}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div className="text-center z-10 flex flex-col items-center mt-2">
            <span className="font-data text-6xl font-bold tracking-tighter text-gray-900">
              {isInView ? total.toFixed(1) : "—"}
            </span>
            <span className="text-[12px] font-data font-bold text-gray-400 tracking-widest leading-none mt-3">SCORE</span>
            <span className={`text-[14px] font-bold mt-1.5 tracking-tight ${tier.className}`}>{tier.text}</span>
          </div>
          <div className="absolute top-1 right-[-10px] bg-[#00E676] text-[#064E3B] px-3 py-1.5 rounded-full text-[10px] font-data font-bold tracking-widest shadow-md">
            WEALTH EXPLODER
          </div>
          <div className="absolute bottom-1 left-[-5px] bg-[#F59E0B] text-amber-900 px-3 py-1.5 rounded-full text-[10px] font-data font-bold tracking-widest shadow-md">
            MONITORING
          </div>
        </div>

        <div className="w-full flex flex-col gap-5">
          {pillars.map((p, i) => (
            <div key={p.label} className="flex flex-col gap-2 w-full">
              <div className="flex justify-between text-[11px] font-data text-gray-500 font-bold tracking-widest">
                <span>{p.label}</span>
                <span className="text-gray-900">{p.val}</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <motion.div
                  className="h-full bg-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${p.fill}%` } : {}}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 + i * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContainer>
  );
}

// --- MAIN PAGE ---

export default function Home() {
  const [quoteById, setQuoteById] = useState<Record<string, YahooQuote>>({});
  const [quotesStatus, setQuotesStatus] = useState<QuotesStatus>("loading");
  const [stockCountLoading, setStockCountLoading] = useState(true);
  /** 0 = use 220+ fallback */
  const [stockCountVal, setStockCountVal] = useState(0);

  const heroGoldSignal = useMemo(
    () => buildHeroGoldSignal(quoteById, quotesStatus),
    [quoteById, quotesStatus]
  );

  useEffect(() => {
    const ac = new AbortController();
    const t = window.setTimeout(() => ac.abort(), 5000);
    (async () => {
      try {
        const res = await fetch(QUOTES_FETCH_URL, { signal: ac.signal });
        if (!res.ok) throw new Error("quotes failed");
        const data = (await res.json()) as unknown;
        if (!Array.isArray(data)) throw new Error("bad shape");
        setQuoteById(quotesRecord(data as YahooQuote[]));
        setQuotesStatus("ok");
      } catch {
        setQuoteById({});
        setQuotesStatus("error");
      } finally {
        window.clearTimeout(t);
      }
    })();
    return () => {
      window.clearTimeout(t);
      ac.abort();
    };
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      queueMicrotask(() => {
        setStockCountVal(0);
        setStockCountLoading(false);
      });
      return;
    }
    let cancelled = false;
    (async () => {
      const { count, error } = await supabase
        .from("axiom_scores")
        .select("*", { count: "exact", head: true })
        .gt("score_total", 0);
      if (cancelled) return;
      setStockCountLoading(false);
      if (error || count == null || count <= 0) {
        setStockCountVal(0);
        return;
      }
      setStockCountVal(count);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Track whether user has scrolled past the hero section
  const [pastHero, setPastHero] = useState(false);
  // Track whether the sticky header is visible (hide on scroll-down, show on scroll-up)
  const [headerVisible, setHeaderVisible] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const heroBottom = heroRef.current
        ? heroRef.current.getBoundingClientRect().bottom + currentY
        : 600;

      const isAfterHero = currentY > heroBottom - 80;
      setPastHero(isAfterHero);

      const scrollingDown = currentY > lastScrollY.current + 6;
      const scrollingUp = currentY < lastScrollY.current - 6;

      // Near top: always show nav. Else: hide on scroll down, show on scroll up (both hero + sticky bars).
      if (currentY <= 24) {
        setHeaderVisible(true);
      } else {
        if (scrollingDown) setHeaderVisible(false);
        if (scrollingUp) setHeaderVisible(true);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="bg-white min-h-screen text-gray-900 overflow-x-hidden selection:bg-blue-200">

      {/*
       * STICKY HEADER BLOCK
       * ─────────────────────────────────────────────────────────
       * • Only appears after the hero section is scrolled past.
       * • Hides on scroll-down, reappears on scroll-up.
       * • Layout: [Navbar row] / [Ticker row] — same pattern as the Axiom trading AppShell.
       */}
      <div
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0",
          pastHero ? "" : "pointer-events-none",
          pastHero && headerVisible ? "translate-y-0" : "-translate-y-full",
        ].join(" ")}
        style={{ willChange: "transform" }}
      >
        {/* Navbar row — liquid glass (readable over any section) */}
        <header className="border-b border-white/70 bg-white/[0.48] shadow-[0_10px_40px_rgba(15,23,42,0.08),inset_0_1px_0_0_rgba(255,255,255,0.92)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/[0.42]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-14 flex justify-between items-center">
            <div className="font-bold text-xl tracking-tight flex items-center gap-2 text-primary">
              <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center text-xs">A</div>
              AXIOM
            </div>
            <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
              <a href="#platform" className="hover:text-primary transition-colors">Platform</a>
              <a href="#score" className="hover:text-primary transition-colors">Equities</a>
              <a href="#futures" className="hover:text-primary transition-colors">Futures</a>
              <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            </nav>
            <div className="flex items-center gap-4">
              <a href="#" className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900">Log in</a>
              <button className="bg-primary hover:bg-blue-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
                Start Free
              </button>
            </div>
          </div>
        </header>

        {/* Ticker row — sits directly below the navbar */}
        <LandingTickerBar quoteById={quoteById} status={quotesStatus} />
      </div>

      {/* Hero-era navbar — same hide-on-scroll-down / show-on-scroll-up as sticky bar */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-40",
          "border-b border-white/60 bg-white/[0.45] shadow-[0_10px_40px_rgba(15,23,42,0.07),inset_0_1px_0_0_rgba(255,255,255,0.88)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/[0.38]",
          "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0",
          pastHero
            ? "pointer-events-none -translate-y-full opacity-0"
            : headerVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-full opacity-0",
        ].join(" ")}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2 text-gray-900">
            <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center text-xs">A</div>
            AXIOM
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
            <a href="#platform" className="hover:text-primary transition-colors">Platform</a>
            <a href="#score" className="hover:text-primary transition-colors">Equities</a>
            <a href="#futures" className="hover:text-primary transition-colors">Futures</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#" className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900">Log in</a>
            <button className="bg-primary hover:bg-blue-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
              Start Free
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-bg-white">
        {/* Dot grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15]" 
             style={{ backgroundImage: 'radial-gradient(circle, #D1D5DB 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="w-full lg:w-1/2">
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={staggerContainer}
              >
                <motion.div variants={fadeUpVariant} className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold font-data tracking-widest uppercase shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Institutional Intelligence. No Broker. No BS.
                </motion.div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.05] mb-6">
                   <motion.span variants={fadeUpVariant} className="block">Stop trusting</motion.span>
                   <motion.span variants={fadeUpVariant} className="block">strangers with</motion.span>
                   <motion.span variants={fadeUpVariant} className="block text-primary">your money.</motion.span>
                </h1>
                
                <motion.p variants={fadeUpVariant} className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                  Axiom gives you the same research tools used by professional fund managers — for Indian equities, US futures, and everything in between. No cold calls. No referral commissions. No hidden agendas.
                </motion.p>
                
                <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4 mb-4">
                  <button className="bg-primary hover:bg-blue-800 text-white px-8 py-4 rounded-full text-base font-medium transition-transform hover:scale-[1.02] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
                    ⚡ Start free — no card needed
                  </button>
                  <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 px-8 py-4 rounded-full text-base font-medium transition-all hover:border-gray-300 flex items-center justify-center gap-2 shadow-sm">
                    Watch 2-min demo <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
                
                <motion.div variants={fadeUpVariant} className="text-[13px] font-medium text-gray-500 flex flex-wrap gap-x-4 gap-y-2">
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> Free to start</span>
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> No credit card</span>
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> Cancel anytime</span>
                </motion.div>
              </motion.div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative perspective-[1000px]">
               <MockupHeroCard quoteById={quoteById} quotesStatus={quotesStatus} />
            </div>

          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-[#F9F8F6] py-16 border-y border-gray-100 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center md:text-left divide-x-0 md:divide-x divide-gray-200">
             <FadeInSection delay={0.1}>
               <div className="px-4">
                 <div className="text-3xl lg:text-4xl font-data font-bold tracking-tighter text-gray-900 mb-1">
                   {stockCountLoading ? (
                     "—"
                   ) : stockCountVal > 0 ? (
                     <CountUp end={stockCountVal} suffix="+" />
                   ) : (
                     <CountUp end={220} suffix="+" />
                   )}
                 </div>
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">NSE/BSE stocks scored</div>
               </div>
             </FadeInSection>
             <FadeInSection delay={0.2}>
               <div className="px-4 md:pl-8">
                 <div className="text-3xl lg:text-4xl font-data font-bold tracking-tighter text-gray-900 mb-1">13</div>
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">13 instruments covered</div>
               </div>
             </FadeInSection>
             <FadeInSection delay={0.3}>
               <div className="px-4 md:pl-8">
                 <div className="text-3xl lg:text-4xl font-data font-bold tracking-tighter text-gray-900 mb-1">5-Layer</div>
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">5-Layer signal confirmation</div>
               </div>
             </FadeInSection>
             <FadeInSection delay={0.4}>
               <div className="px-4 md:pl-8">
                 <div className="text-3xl lg:text-4xl font-data font-bold tracking-tighter text-gray-900 mb-1">24/7</div>
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">AI analysis running</div>
               </div>
             </FadeInSection>
             <FadeInSection delay={0.5}>
               <div className="px-4 md:pl-8 col-span-2 md:col-span-1">
                 <div className="text-3xl lg:text-4xl font-data font-bold tracking-tighter text-primary mb-1">₹<CountUp end={0} /></div>
                 <div className="text-xs font-semibold text-primary/80 uppercase tracking-widest">Broker commissions</div>
               </div>
             </FadeInSection>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeInSection>
            <div className="max-w-2xl mx-auto text-center mb-16">
              <div className="text-xs font-data font-bold text-gray-400 tracking-widest uppercase mb-4">The problem with 'tips'</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">Your broker isn't working for you.</h2>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeInSection delay={0.1}>
              <div className="bg-gray-50 p-8 rounded-[2rem] h-full border border-gray-100">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-900 mb-6">
                   <Phone className="w-6 h-6" strokeWidth={1.75} aria-hidden />
                 </div>
                 <h3 className="text-xl font-bold mb-3">The cold call</h3>
                 <p className="text-gray-600 leading-relaxed text-sm">An unknown number calls. He has a 'hot tip.' He earns commission whether you make money or not. You have no idea how he derived the signal. You're trading blind.</p>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <div className="bg-gray-50 p-8 rounded-[2rem] h-full border border-gray-100">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-[#229ED9] mb-6">
                   <TelegramLogoIcon className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">The Telegram group</h3>
                 <p className="text-gray-600 leading-relaxed text-sm">500 members receive the same signal at the same time. By the time you act, the operator has already exited. You're the exit liquidity.</p>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.3}>
              <div className="bg-gray-50 p-8 rounded-[2rem] h-full border border-gray-100">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-900 mb-6">
                   <Box className="w-6 h-6" strokeWidth={1.75} aria-hidden />
                 </div>
                 <h3 className="text-xl font-bold mb-3">The black box tip</h3>
                 <p className="text-gray-600 leading-relaxed text-sm">No reasoning. No data. No accountability. Just 'trust me.' When it fails — and it will — there's no explanation. Just silence.</p>
              </div>
            </FadeInSection>
          </div>
          
          <FadeInSection delay={0.4}>
             <div className="mt-16 text-center text-2xl font-semibold tracking-tight text-primary">
                There is a better way.
             </div>
          </FadeInSection>
        </div>
      </section>

      {/* SCORE SECTION */}
      <section className="py-24 lg:py-32 bg-[#F9F8F6]" id="score">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
               <FadeInSection>
                 <div className="text-xs font-data font-bold text-primary tracking-widest uppercase mb-4">Axiom Score</div>
                 <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                  One number.
                  <br />
                  <span className="text-primary">Every variable.</span>
                </h2>
                 <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                   We run every Indian NSE/BSE stock through 8 institutional-grade financial models.
                   <br/><br/>
                   The output: a single score from 0–100. Rigorously validated. No hunches. No conflicts of interest.
                 </p>
                 <div className="space-y-3 font-data text-xs font-bold text-gray-500 tracking-widest uppercase">
                    <div className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Fundamental strength</div>
                    <div className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Technical structure</div>
                    <div className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Re-rating potential</div>
                    <div className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Discovery score (MDE)</div>
                 </div>
               </FadeInSection>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
               <FadeInSection delay={0.2}>
                  <div className="w-full max-w-[524px]">
                    <div className="rounded-[28px] bg-gradient-to-br from-[#cfe8ff] via-[#4a7eb8] to-[#0a1f3d] p-5 shadow-xl ring-1 ring-black/5 sm:p-7 md:p-8 [&>div]:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]">
                      <MockupScoreCard />
                    </div>
                  </div>
               </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* FUTURES SECTION */}
      <section className="py-24 lg:py-32 bg-white" id="futures">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
               <FadeInSection delay={0.2}>
                  <div className="w-full max-w-[500px]">
                    <div className="rounded-[28px] bg-gradient-to-br from-[#7a3340] via-[#5c2430] to-[#2a0f14] p-5 shadow-xl ring-1 ring-black/5 sm:p-7 md:p-8">
                      <LandingSignalCard
                        signal={heroGoldSignal}
                        className="shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]"
                      />
                    </div>
                  </div>
               </FadeInSection>
            </div>
            <div className="w-full lg:w-1/2">
               <FadeInSection>
                 <div className="text-xs font-data font-bold text-blue-600 tracking-widest uppercase mb-4">US Futures Signals</div>
                 <h2 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                   Know the exact entry.
                   <br />
                   <span className="text-primary">Know exactly why.</span>
                 </h2>
                 <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                   Every Axiom signal fires only when five independent confirmation layers align simultaneously. Structure. Liquidity. Displacement. Entry model. Risk parameters. 
                   <br/><br/>
                   You see every layer. You understand every reason. And if any layer fails — the signal doesn't fire.
                 </p>
                 <div className="flex gap-8 border-t border-gray-100 pt-6 mt-6">
                    <div>
                      <div className="font-data text-2xl font-bold tracking-tight text-gray-900">13</div>
                      <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1">Instruments</div>
                    </div>
                    <div>
                      <div className="font-data text-2xl font-bold tracking-tight text-gray-900">5</div>
                      <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1">Layers req.</div>
                    </div>
                    <div>
                      <div className="font-data text-2xl font-bold tracking-tight text-gray-900">2.1:1</div>
                      <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1">Min R:R</div>
                    </div>
                 </div>
               </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-24 lg:py-32 bg-[#F9F8F6] border-y border-gray-100"
        id="futures-platform"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center">
              <div className="text-xs font-data font-bold text-gray-500 tracking-widest uppercase mb-4">
                FUTURES WORKSPACE
              </div>
              <h2 className="mx-auto text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4 max-w-3xl">
                Stop watching setups fail because you entered a minute too late.{" "}
                <span className="text-primary">
                  Axiom tells you the zone <em className="italic">before</em> it matters.
                </span>
              </h2>
              <p className="mx-auto text-gray-600 mb-4 max-w-2xl text-lg leading-relaxed">
                Most prop traders blow accounts not from bad strategy — from bad timing. They see the setup after
                it&apos;s already moved. They size wrong. They hold through a news spike.
              </p>
              <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-600">
                Axiom pre-computes your entry zone, stop, and two targets from five-layer confluence — before the candle
                closes. You open the desk, you see the setup, you decide. That&apos;s it.
              </p>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.08}>
            <FuturesPlatformShowcase quoteById={quoteById} quotesStatus={quotesStatus} />
          </FadeInSection>
        </div>
      </section>

      {/* PRO ANALYSIS */}
      <section className="py-24 lg:py-32 bg-[#F0F4FF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-4xl">
           <FadeInSection>
             <div className="text-xs font-data font-bold text-blue-600 tracking-widest uppercase mb-4">Pro Analysis</div>
             <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">Bring your own chart. Get institutional analysis.</h2>
             <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
               Upload screenshots of any chart. Our proprietary multi-timeframe engine reads structure, identifies key levels, and delivers a full technical and contextual analysis in seconds.
             </p>
             <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-4 font-data text-xs font-bold text-gray-500 tracking-widest uppercase">
                <div className="bg-white px-6 py-4 rounded-xl border border-blue-100 shadow-sm flex items-center gap-3">
                  <UploadCloud className="w-5 h-5 text-blue-500"/> Upload charts
                </div>
                <ArrowRight className="text-blue-300 hidden md:block" />
                <div className="bg-white px-6 py-4 rounded-xl border border-blue-100 shadow-sm flex items-center gap-3">
                  <Play className="w-4 h-4 text-blue-500"/> Apply your rules
                </div>
                <ArrowRight className="text-blue-300 hidden md:block" />
                <div className="bg-white px-6 py-4 rounded-xl border-2 border-blue-600 shadow-sm flex items-center gap-3 text-gray-900">
                  <Check className="w-5 h-5 text-blue-600"/> Get full analysis
                </div>
             </div>
           </FadeInSection>
        </div>
      </section>

      {/* MARKETS */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <FadeInSection>
             <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-16">One platform.<br/>Every market that matters.</h2>
           </FadeInSection>
           <div className="grid md:grid-cols-3 gap-6">
              {/* Indian Equities */}
              <FadeInSection delay={0.1}>
                 <div className="p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full relative overflow-hidden bg-white">
                   <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-600"></div>
                   <div className="mb-6 mt-2"><TrendingUp className="w-7 h-7 text-blue-600" /></div>
                   <h3 className="text-[22px] font-bold mb-6 text-gray-900 tracking-tight">Indian Equities</h3>
                   <ul className="space-y-4 text-[15px] text-gray-500 mb-6">
                     <li><span className="font-bold text-gray-900">220+ stocks</span> — NSE and BSE</li>
                     <li><span className="font-bold text-gray-900">8 models</span> — institutional scoring</li>
                     <li><span className="font-bold text-gray-900">Quarterly</span> — score updates</li>
                   </ul>
                   <p className="text-[14px] text-gray-500 leading-relaxed mb-8 flex-grow">
                     Axiom Score ranks every covered NSE/BSE stock from 0–100. Fundamentals, technicals, re-rating potential, and discovery — in one number.
                   </p>
                   <div className="flex flex-wrap gap-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase font-data">
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">NIFTY 50</span>
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">MIDCAP</span>
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">SMALLCAP</span>
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">SECTORAL</span>
                   </div>
                 </div>
              </FadeInSection>

              {/* US Futures */}
              <FadeInSection delay={0.2}>
                 <div className="p-8 rounded-2xl border border-gray-100 hover:border-[#00E676] hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full relative overflow-hidden bg-white">
                   <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#00E676]"></div>
                   <div className="mb-6 mt-2"><Activity className="w-7 h-7 text-[#00E676]" /></div>
                   <h3 className="text-[22px] font-bold mb-6 text-gray-900 tracking-tight">US Futures</h3>
                   <ul className="space-y-4 text-[15px] text-gray-500 mb-6">
                     <li><span className="font-bold text-gray-900">13</span> instruments</li>
                     <li><span className="font-bold text-gray-900">24/7</span> signal scanning</li>
                     <li><span className="font-bold text-gray-900">5-layer</span> confirmation</li>
                     <li>
                       <span className="font-bold text-gray-900">Prop firm ready</span>
                       {" — Tradeify, Topstep, Lucid & more"}
                     </li>
                     <li>
                       <span className="font-bold text-gray-900">Eval & funded account</span>
                       {" risk calculator built in"}
                     </li>
                   </ul>
                   <p className="text-[14px] text-gray-500 leading-relaxed mb-8 flex-grow">
                     Gold, Silver, Crude Oil, Natural Gas, Nasdaq 100, S&P 500, Dow Jones, Russell 2000, Treasuries, FX pairs, and Copper.
                   </p>
                   <div className="flex flex-wrap gap-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase font-data">
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">METALS</span>
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">INDICES</span>
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">ENERGY</span>
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">BONDS</span>
                   </div>
                 </div>
              </FadeInSection>

              {/* Mutual Funds */}
              <FadeInSection delay={0.3}>
                 <div className="p-8 rounded-2xl border border-gray-100 hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full relative overflow-hidden bg-white">
                   <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-500"></div>
                   <div className="mb-6 mt-2"><PieChart className="w-7 h-7 text-amber-500" /></div>
                   <h3 className="text-[22px] font-bold mb-6 text-gray-900 tracking-tight">Mutual Funds</h3>
                   <ul className="space-y-4 text-[15px] text-gray-500 mb-6">
                     <li><span className="font-bold text-gray-900">All AMFI</span> — schemes tracked</li>
                     <li><span className="font-bold text-gray-900">XIRR</span> — accurate return calc</li>
                     <li><span className="font-bold text-gray-900">Benchmark</span> — comparison built-in</li>
                   </ul>
                   <p className="text-[14px] text-gray-500 leading-relaxed mb-8 flex-grow">
                     Track all your Indian mutual fund holdings in one place. See real XIRR, benchmark comparison, and AI-powered gap analysis.
                   </p>
                   <div className="flex flex-wrap gap-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase font-data">
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">EQUITY</span>
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">DEBT</span>
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">HYBRID</span>
                     <span className="bg-gray-100 px-2.5 py-1.5 rounded-md">INDEX</span>
                   </div>
                 </div>
              </FadeInSection>
           </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-24 bg-[#F9F8F6]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeInSection>
            <div className="text-yellow-400 flex justify-center gap-1 mb-8">
              {[1,2,3,4,5].map(i => <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/></svg>)}
            </div>
            <p className="text-2xl md:text-3xl font-medium text-gray-900 leading-snug mb-8">
              "I spent 4 years taking tips from a broker who charged me ₹8,000 a month for signals that had no logic behind them. One look at Axiom's five-layer reasoning and I understood more about one trade than I had in four years."
            </p>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest font-data">
              — Early Axiom user, Mumbai
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 lg:py-32 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-16">
              <div className="text-xs font-data font-bold text-gray-400 tracking-widest uppercase mb-4">Simple Pricing</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Start free.<br/>Upgrade when you're ready.</h2>
              <p className="text-gray-500 font-medium">7-day free trial. No credit card required.</p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Explorer */}
            <FadeInSection delay={0.1}>
              <div className="p-8 rounded-[2rem] border border-gray-100 flex flex-col h-full hover:border-gray-200 transition">
                <h3 className="text-xl font-bold mb-2">Explorer</h3>
                <div className="font-data text-4xl font-bold text-gray-900 mb-1 tracking-tight">₹0<span className="text-sm text-gray-500 font-sans tracking-normal font-medium">/month</span></div>
                <span className="text-sm text-gray-500 font-medium block mb-6">Free forever</span>
                <ul className="space-y-4 text-sm text-gray-600 font-medium flex-grow mb-8">
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5"/> 3 score lookups/day</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5"/> Live prices</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5"/> Market overview</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5"/> Session timeline</li>
                </ul>
                <button className="w-full py-3 rounded-full border border-gray-200 font-semibold hover:bg-gray-50 transition">Get Started</button>
              </div>
            </FadeInSection>

            {/* Pro */}
            <FadeInSection delay={0.2}>
              <div className="p-8 rounded-[2rem] border-2 border-primary shadow-xl flex flex-col h-full relative transform md:-translate-y-4 bg-white">
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-blue-100 text-primary text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  MOST POPULAR
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">Pro</h3>
                <div className="font-data text-4xl font-bold text-gray-900 mb-1 tracking-tight">₹799<span className="text-sm text-gray-500 font-sans tracking-normal font-medium">/month</span></div>
                <span className="text-xs text-gray-400 block">~$9 USD/mo</span>
                <div className="text-xs text-gray-400 mb-1 font-medium mt-2">(₹6,999/yr)</div>
                <span className="text-xs text-gray-400 block mb-6">~$80 USD/yr</span>
                <ul className="space-y-4 text-sm text-gray-800 font-medium flex-grow mb-8">
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5"/> Unlimited scores</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5"/> Real-time signals + 5-layer reasoning</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5"/> 50 AI messages</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5"/> Telegram alerts</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5"/> Pro Analysis 10/month</li>
                </ul>
                <button className="w-full py-4 rounded-full bg-primary text-white font-semibold hover:bg-blue-800 transition shadow-lg shadow-blue-500/20">Start 7-Day Free Trial</button>
              </div>
            </FadeInSection>

            {/* Elite */}
            <FadeInSection delay={0.3}>
              <div className="p-8 rounded-[2rem] border border-gray-100 flex flex-col h-full hover:border-gray-200 transition">
                <h3 className="text-xl font-bold mb-2">Elite</h3>
                 <div className="font-data text-4xl font-bold text-gray-900 mb-1 tracking-tight">₹1,999<span className="text-sm text-gray-500 font-sans tracking-normal font-medium">/month</span></div>
                <span className="text-xs text-gray-400 block">~$23 USD/mo</span>
                <div className="text-xs text-gray-400 mb-1 font-medium mt-2">(₹17,999/yr)</div>
                <span className="text-xs text-gray-400 block mb-6">~$205 USD/yr</span>
                <ul className="space-y-4 text-sm text-gray-600 font-medium flex-grow mb-8">
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-gray-900 shrink-0 mt-0.5"/> Everything in Pro</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-gray-900 shrink-0 mt-0.5"/> Unlimited AI</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-gray-900 shrink-0 mt-0.5"/> Unlimited uploads</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-gray-900 shrink-0 mt-0.5"/> API access</li>
                </ul>
                <button className="w-full py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-black transition">Upgrade to Elite</button>
              </div>
            </FadeInSection>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            USD billing available ·{" "}
            <a href="mailto:hello@axiom.trade" className="underline">
              contact us
            </a>
          </p>
        </div>
      </section>

      {/* FINAL CTA & FOOTER */}
      <section className="bg-slate-900 pt-24 pb-12 mt-12 rounded-t-[4rem] text-white overflow-hidden relative">
        {/* Subtle grid in background */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeInSection>
             <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
               The research is done.<br/>The signal is ready.<br/><span className="text-blue-400">What are you waiting for?</span>
             </h2>
             <p className="text-lg text-slate-300 mb-10">
               Join serious investors who stopped guessing and started knowing.
             </p>
             <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-full text-lg font-bold transition-transform hover:scale-105 mb-8 shadow-2xl shadow-blue-500/30">
                Start for free today
             </button>
             <div className="flex justify-center flex-wrap gap-6 text-xs font-bold text-slate-400 tracking-widest uppercase font-data mb-24">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/> Free to start</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/> No broker fees</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/> Cancel anytime</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/> Data never sold</span>
             </div>
          </FadeInSection>
        </div>

        {/* FOOTER */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-white/10 pt-12 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded bg-white text-slate-900 flex items-center justify-center text-xs font-bold">A</div>
             <span className="font-bold tracking-tight text-white uppercase">Axiom</span>
           </div>
           
           <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Twitter</a>
           </div>

           <div className="flex items-center gap-2 bg-slate-800/80 rounded-full px-4 py-2 border border-white/5">
             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
             <span className="text-[10px] font-data font-bold tracking-widest text-slate-300 uppercase">System Operational</span>
           </div>
        </div>
      </section>
      
    </div>
  );
}
