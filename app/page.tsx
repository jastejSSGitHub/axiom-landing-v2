"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight, Play, TrendingUp, TrendingDown, UploadCloud, Activity, PieChart } from "lucide-react";

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

const TICKER_ITEMS = [
  { label: "NIFTY 50",   price: "22,451",  change: "+0.8%",  up: true },
  { label: "NQ FUT",     price: "19,240",  change: "−1.2%",  up: false },
  { label: "GC GOLD",    price: "4,812",   change: "+0.4%",  up: true },
  { label: "BANKNIFTY",  price: "47,314",  change: "+1.1%",  up: true },
  { label: "ES FUT",     price: "5,340",   change: "−0.8%",  up: false },
  { label: "CL CRUDE",   price: "82.40",   change: "+1.1%",  up: true },
  { label: "SI SILVER",  price: "28.54",   change: "+0.6%",  up: true },
  { label: "YM DOW",     price: "38,920",  change: "−0.3%",  up: false },
];

const TICKER_LOOP = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

function TickerItem({ label, price, change, up }: typeof TICKER_ITEMS[0]) {
  return (
    <div className="flex items-center gap-3 px-5 py-2 border-r border-gray-100 shrink-0">
      <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase font-data">{label}</span>
      <span className="text-[13px] font-data font-medium tabular-nums text-gray-900">{price}</span>
      <span className={`text-[11px] font-data font-semibold tabular-nums flex items-center gap-0.5 ${
        up ? "text-[#059669]" : "text-[#DC2626]"
      }`}>
        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </span>
    </div>
  );
}

function LandingTickerBar() {
  return (
    <div
      role="region"
      aria-label="Live market tickers"
      className="w-full overflow-hidden bg-[#F8FAFC] border-b border-gray-100"
    >
      <div className="market-pulse-marquee min-h-[40px] items-center">
        <div className="flex shrink-0 items-center">
          {TICKER_LOOP.map((item, i) => (
            <TickerItem key={`a-${i}`} {...item} />
          ))}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {TICKER_LOOP.map((item, i) => (
            <TickerItem key={`b-${i}`} {...item} />
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

function MockupHeroCard() {
  return (
    <motion.div
      className="origin-center w-full max-w-[500px] hover:rotate-0 transition-transform duration-500 cursor-pointer"
      initial={{ rotate: "1.5deg", y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ rotate: "1.5deg" }}
      whileHover={{ rotate: "0deg" }}
    >
      <CardContainer className="text-left w-full">
        {/* Ticker */}
        <div className="bg-[#0a0a0a] text-white flex overflow-hidden whitespace-nowrap h-8 items-center border-b border-gray-800">
          <motion.div
            className="flex space-x-6 text-[11px] font-data tracking-widest text-gray-300"
            animate={{ x: [0, -500] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <span>NQ FUT 19,240 <span className="text-red-400">▼-1.2%</span></span>
            <span>·</span>
            <span>GC (GOLD) 4,812 <span className="text-green-400">▲+0.4%</span></span>
            <span>·</span>
            <span>BANKNIFTY 47,314 <span className="text-green-400">▲+1.1%</span></span>
            <span>·</span>
            <span>ES FUT 5,340 <span className="text-red-400">▼-0.8%</span></span>
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

          {/* Watchlist */}
          <div className="grid grid-cols-3 gap-3">
            {[ 
              { name: "Gold", code: "COMEX", price: "4,812", chg: "+0.38%", up: true, active: true },
              { name: "Nasdaq 100", code: "CME", price: "19,240", chg: "-1.20%", up: false },
              { name: "Crude Oil", code: "NYMEX", price: "82.40", chg: "+1.12%", up: true }
            ].map((itm, i) => (
              <div key={i} className={`p-3 rounded-xl border ${itm.active ? 'border-green-200 bg-green-50/30' : 'border-gray-100 bg-white shadow-sm'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-[11px] font-bold text-gray-900">{itm.name}</div>
                    <div className="text-[9px] font-data text-gray-400 tracking-widest font-semibold">{itm.code}</div>
                  </div>
                  {itm.active && <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"></div>}
                </div>
                <div className="text-[13px] font-data font-semibold mb-0.5">{itm.price}</div>
                <div className={`text-[10px] font-data font-semibold ${itm.up ? 'text-green-600' : 'text-red-500'}`}>
                  {itm.up ? '▲' : '▼'} {itm.chg}
                </div>
              </div>
            ))}
          </div>

          {/* Signal Card */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2 font-data text-[11px] font-bold text-gray-800 tracking-wider">
                Gold · GC <span className="text-[#00E676] mx-1">●</span> <span className="text-green-600">↗ LONG</span>
              </div>
              <div className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-data font-bold tracking-widest">
                ACTIVE
              </div>
            </div>
            <div className="p-4 bg-white grid gap-3">
              <div className="grid grid-cols-3 gap-4 text-[11px] font-data">
                <div><div className="text-gray-400 tracking-widest font-semibold mb-1">ENTRY</div><div className="font-semibold">4,808–4,818</div></div>
                <div><div className="text-gray-400 tracking-widest font-semibold mb-1">STOP</div><div className="text-red-500 font-semibold">4,792</div></div>
                <div><div className="text-gray-400 tracking-widest font-semibold mb-1">R:R</div><div className="font-semibold">2.1:1</div></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-[11px] font-data">
                <div><div className="text-gray-400 tracking-widest font-semibold mb-1">TARGET 1</div><div className="text-[#059669] font-semibold">4,840</div></div>
                <div><div className="text-gray-400 tracking-widest font-semibold mb-1">TARGET 2</div><div className="text-[#059669] font-semibold">4,862</div></div>
                <div><div className="text-gray-400 tracking-widest font-semibold mb-1">CONFIDENCE</div><div className="font-semibold">82%</div></div>
              </div>
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-[10px] flex justify-between items-center text-gray-500 font-data tracking-widest font-semibold">
              <span>NY Core · Setup: A (4/5)</span>
              <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors flex items-center gap-1">View reasoning <ArrowRight className="w-3 h-3"/></span>
            </div>
          </div>

        </div>
      </CardContainer>
    </motion.div>
  );
}

function MockupScoreCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

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
        {/* SVG Ring */}
        <div ref={ref} className="relative w-[240px] h-[240px] flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
            <motion.circle 
              cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="8" fill="none"
              strokeLinecap="round"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={isInView ? { strokeDashoffset: 251.2 - (251.2 * 0.683) } : {}}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div className="text-center z-10 flex flex-col items-center mt-2">
            <span className="font-data text-6xl font-bold tracking-tighter text-gray-900">
              {isInView ? <CountUp end={68.3} suffix="" /> : "0.0"}
            </span>
            <span className="text-[12px] font-data font-bold text-gray-400 tracking-widest leading-none mt-3">SCORE</span>
            <span className="text-[14px] font-bold text-amber-500 mt-1.5 tracking-tight">Fair</span>
          </div>
          {/* Chips */}
          <div className="absolute top-1 right-[-10px] bg-[#00E676] text-[#064E3B] px-3 py-1.5 rounded-full text-[10px] font-data font-bold tracking-widest shadow-md">WEALTH EXPLODER</div>
          <div className="absolute bottom-1 left-[-5px] bg-[#F59E0B] text-amber-900 px-3 py-1.5 rounded-full text-[10px] font-data font-bold tracking-widest shadow-md">MONITORING</div>
        </div>

        {/* Pillars */}
        <div className="w-full flex flex-col gap-5">
          {[
            { label: "FUNDAMENTAL", val: "49/65", fill: 75.3 },
            { label: "TECHNICAL", val: "14/20", fill: 70 },
            { label: "RERATING", val: "14/20", fill: 70 },
            { label: "DISCOVERY", val: "7/10", fill: 70 },
          ].map((row, i) => (
             <div key={i} className="flex flex-col gap-2 w-full">
               <div className="flex justify-between text-[11px] font-data text-gray-500 font-bold tracking-widest">
                 <span>{row.label}</span>
                 <span className="text-gray-900">{row.val}</span>
               </div>
               <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <motion.div 
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${row.fill}%` } : {}}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 + (i * 0.1) }}
                  />
               </div>
             </div>
          ))}
        </div>
      </div>
    </CardContainer>
  );
}

// Confidence bar animate on view
function ConfidenceBar({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <div ref={ref} className="h-2 w-full overflow-hidden rounded-full bg-gray-100 mt-1.5">
      <motion.div
        className="h-full rounded-full bg-blue-600"
        initial={{ width: 0 }}
        animate={isInView ? { width: `${value}%` } : {}}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      />
    </div>
  );
}

// Vertical rule between columns (mirrors the actual SignalCard COL_DIVIDER)
function ColDivider({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className} after:pointer-events-none after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-px after:bg-gray-200 after:content-['']`}>
      {children}
    </div>
  );
}

const SESSION_NODES = [
  { key: "LONDON",  label: "LONDON",  time: "2AM–5AM ET",     active: false, hasSignal: true  },
  { key: "PREMKT",  label: "PRE-MKT", time: "5–9:30AM ET",    active: true,  hasSignal: false },
  { key: "NYCORE",  label: "NY CORE", time: "9:30–11:30AM ET",active: false, hasSignal: false },
  { key: "LUNCH",   label: "LUNCH",   time: "11:30AM–1PM ET", active: false, hasSignal: false },
  { key: "PM",      label: "PM",      time: "1–3:30PM ET",    active: false, hasSignal: false },
  { key: "CLOSE",   label: "CLOSE",   time: "3:30–6PM ET",    active: false, hasSignal: false },
  { key: "ASIA",    label: "ASIA",    time: "6PM–2AM ET",     active: false, hasSignal: false },
];

const LAYERS = [
  { l: 1, text: "Higher timeframe bullish structure confirmed; discount zone held." },
  { l: 2, text: "Liquidity sweep below prior low; displacement up with volume." },
  { l: 3, text: "Order block alignment with fair value gap fill zone." },
  { l: 4, text: "Entry model: break-and-retest of internal range." },
  { l: 5, text: "Risk capped; R:R exceeds desk minimum before release." },
];

function MockupReasoningCard() {
  const activeIdx = SESSION_NODES.findIndex((s) => s.active);

  return (
    <CardContainer className="w-full text-left max-w-[560px]">
      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="text-[10px] font-data font-bold tracking-widest text-gray-400 uppercase">
          NY CORE IN <span className="text-gray-700">28M</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-data font-bold tracking-widest text-gray-400 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse inline-block" />
          1 Active · 1 Monitoring
        </div>
      </div>

      {/* ── Session Timeline ────────────────────────────── */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-100">
        <div className="relative flex items-start justify-between gap-0">
          {/* baseline track */}
          <div
            className="absolute h-0.5 bg-gray-200 z-0"
            style={{ top: "6px", left: `calc(100% / ${SESSION_NODES.length * 2})`, right: `calc(100% / ${SESSION_NODES.length * 2})` }}
          />
          {/* active progress fill */}
          <div
            className="absolute h-0.5 bg-blue-500 z-0"
            style={{
              top: "6px",
              left: `calc(100% / ${SESSION_NODES.length * 2})`,
              width: `${(activeIdx / (SESSION_NODES.length - 1)) * (100 - (100 / SESSION_NODES.length))}%`,
            }}
          />

          {SESSION_NODES.map((node, i) => {
            const isActive = node.active;
            return (
              <div key={node.key} className="relative flex flex-col items-center gap-0 z-10 flex-1">
                {/* Signal dot above node */}
                {node.hasSignal && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00E676] shadow-[0_0_5px_#00E676] z-20" />
                )}
                {/* NOW pill */}
                {isActive && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded-sm bg-blue-600 text-white text-[8px] font-data font-bold tracking-widest z-20">
                    NOW
                  </div>
                )}
                {/* Node dot */}
                <div
                  className={`w-3 h-3 rounded-full border-2 border-white shadow-sm flex-shrink-0 ${
                    isActive
                      ? "bg-blue-600 ring-2 ring-blue-200"
                      : i < activeIdx
                      ? "bg-blue-300"
                      : "bg-gray-300"
                  }`}
                />
                {/* Label + time */}
                <div className="mt-2 flex flex-col items-center text-center gap-0.5">
                  <span className={`text-[8px] font-bold tracking-widest uppercase leading-none ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                    {node.label}
                  </span>
                  <span className="text-[7px] font-data text-gray-400 leading-tight whitespace-nowrap hidden sm:block">
                    {node.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Signal Header ───────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-bold text-sm text-gray-900 tracking-tight">Gold · GC</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[10px] font-data font-bold text-green-700 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] inline-block" />
            ↗ LONG
          </span>
        </div>
        <span className="text-[10px] font-data font-bold tracking-widest text-gray-400 border border-gray-200 rounded px-2 py-0.5 uppercase">
          ACTIVE
        </span>
      </div>

      {/* ── Signal Data Grid ────────────────────────────── */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/40">
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-0 mb-0">
          <ColDivider className="pr-4 space-y-1">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Entry zone</div>
            <div className="font-data text-[15px] font-bold leading-tight text-gray-900 tabular-nums">4,808 – 4,818</div>
          </ColDivider>
          <ColDivider className="px-4 space-y-1">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Stop loss</div>
            <div className="font-data text-[15px] font-bold leading-tight text-red-700 tabular-nums">4,792</div>
            <div className="text-[9px] font-data text-gray-400">26 pts · −$260</div>
          </ColDivider>
          <div className="pl-4 space-y-1">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">R:R</div>
            <div className="font-data text-[15px] font-bold leading-tight text-gray-900 tabular-nums">2.1 : 1</div>
          </div>
        </div>

        {/* Thin divider */}
        <div className="my-3 border-t border-gray-200/60" />

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-0">
          <ColDivider className="pr-4 space-y-1 text-center">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 text-center">Target 1</div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-data text-[14px] font-medium tabular-nums text-[#059669]">4,840</span>
              <span className="font-data text-[9px] tabular-nums text-gray-500">+$320</span>
            </div>
          </ColDivider>
          <ColDivider className="px-4 space-y-1 text-center">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 text-center">Target 2</div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-data text-[14px] font-medium tabular-nums text-[#059669]">4,862</span>
              <span className="font-data text-[9px] tabular-nums text-gray-500">+$540</span>
            </div>
          </ColDivider>
          <div className="pl-4 space-y-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Confidence</span>
              <span className="font-data text-[9px] font-bold text-blue-600 tabular-nums">82%</span>
            </div>
            <ConfidenceBar value={82} />
          </div>
        </div>
      </div>

      {/* ── Five-Layer Reasoning ─────────────────────────── */}
      <div className="px-5 py-4">
        <div className="text-[9px] font-data font-bold tracking-widest uppercase text-gray-400 mb-3">
          Five-Layer Reasoning
        </div>
        <div className="space-y-3">
          {LAYERS.map((layer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i, duration: 0.35 }}
              className="flex gap-2.5 items-start"
            >
              <div className="mt-0.5 w-4 h-4 rounded-full bg-green-50 border border-green-200 text-[#059669] flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[9px] font-data font-bold text-[#059669] tracking-wider uppercase">
                  Layer {layer.l} ✓ CONFIRMED
                </span>
                <span className="text-[9px] text-gray-500 ml-1">— {layer.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Footer row */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[9px] font-data font-semibold tracking-widest text-gray-400">
          <span>NY Core · Setup: A (4/5)</span>
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors flex items-center gap-1">
            View full reasoning <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </CardContainer>
  );
}

// --- MAIN PAGE ---

export default function Home() {
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

      // Only show sticky header after hero is scrolled past
      const isAfterHero = currentY > heroBottom - 80;
      setPastHero(isAfterHero);

      if (isAfterHero) {
        const scrollingDown = currentY > lastScrollY.current + 4;
        const scrollingUp = currentY < lastScrollY.current - 4;
        if (scrollingDown) setHeaderVisible(false);
        if (scrollingUp)   setHeaderVisible(true);
      } else {
        setHeaderVisible(true);
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
          "transition-transform duration-300 ease-out",
          pastHero ? "" : "pointer-events-none",
          pastHero && headerVisible  ? "translate-y-0"    : "-translate-y-full",
        ].join(" ")}
        style={{ willChange: "transform" }}
      >
        {/* Navbar row */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
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
        <LandingTickerBar />
      </div>

      {/* Transparent hero-era navbar — only visible before hero is scrolled past */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-40",
          "transition-all duration-300",
          pastHero ? "opacity-0 pointer-events-none" : "opacity-100",
        ].join(" ")}
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
               <MockupHeroCard />
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
                 <div className="text-3xl lg:text-4xl font-data font-bold tracking-tighter text-gray-900 mb-1"><CountUp end={220} suffix="+" /></div>
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">NSE/BSE stocks scored</div>
               </div>
             </FadeInSection>
             <FadeInSection delay={0.2}>
               <div className="px-4 md:pl-8">
                 <div className="text-3xl lg:text-4xl font-data font-bold tracking-tighter text-gray-900 mb-1"><CountUp end={13} /></div>
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">US futures instruments</div>
               </div>
             </FadeInSection>
             <FadeInSection delay={0.3}>
               <div className="px-4 md:pl-8">
                 <div className="text-3xl lg:text-4xl font-data font-bold tracking-tighter text-gray-900 mb-1"><CountUp end={5} suffix="-Layer" /></div>
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Signal reasoning</div>
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
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-xl font-bold mb-6">1</div>
                 <h3 className="text-xl font-bold mb-3">The cold call</h3>
                 <p className="text-gray-600 leading-relaxed text-sm">An unknown number calls. He has a 'hot tip.' He earns commission whether you make money or not. You have no idea how he derived the signal. You're trading blind.</p>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <div className="bg-gray-50 p-8 rounded-[2rem] h-full border border-gray-100">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-xl font-bold mb-6">2</div>
                 <h3 className="text-xl font-bold mb-3">The Telegram group</h3>
                 <p className="text-gray-600 leading-relaxed text-sm">500 members receive the same signal at the same time. By the time you act, the operator has already exited. You're the exit liquidity.</p>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.3}>
              <div className="bg-gray-50 p-8 rounded-[2rem] h-full border border-gray-100">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-xl font-bold mb-6">3</div>
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
                 <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">One number.<br/>Every variable.</h2>
                 <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                   We run every Indian NSE/BSE stock through 8 institutional-grade financial models — Piotroski F-Score, Altman Z-Score, Montier C-Score, DuPont Analysis, and four others adapted for Indian markets. 
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
                  <MockupScoreCard />
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
                  <MockupReasoningCard />
               </FadeInSection>
            </div>
            <div className="w-full lg:w-1/2">
               <FadeInSection>
                 <div className="text-xs font-data font-bold text-blue-600 tracking-widest uppercase mb-4">US Futures Signals</div>
                 <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">Know the exact entry.<br/>Know exactly why.</h2>
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
              <p className="text-gray-500 font-medium">14-day free trial. No credit card required.</p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Explorer */}
            <FadeInSection delay={0.1}>
              <div className="p-8 rounded-[2rem] border border-gray-100 flex flex-col h-full hover:border-gray-200 transition">
                <h3 className="text-xl font-bold mb-2">Explorer</h3>
                <div className="font-data text-4xl font-bold text-gray-900 mb-6 tracking-tight">₹0<span className="text-sm text-gray-500 font-sans tracking-normal font-medium">/month</span></div>
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
                <div className="text-xs text-gray-400 mb-6 font-medium">(₹6,999/yr)</div>
                <ul className="space-y-4 text-sm text-gray-800 font-medium flex-grow mb-8">
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5"/> Unlimited scores</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5"/> Real-time signals + 5-layer reasoning</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5"/> 50 AI messages</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5"/> Telegram alerts</li>
                  <li className="flex items-start gap-3"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5"/> Pro Analysis 10/month</li>
                </ul>
                <button className="w-full py-4 rounded-full bg-primary text-white font-semibold hover:bg-blue-800 transition shadow-lg shadow-blue-500/20">Start 14-Day Free Trial</button>
              </div>
            </FadeInSection>

            {/* Elite */}
            <FadeInSection delay={0.3}>
              <div className="p-8 rounded-[2rem] border border-gray-100 flex flex-col h-full hover:border-gray-200 transition">
                <h3 className="text-xl font-bold mb-2">Elite</h3>
                 <div className="font-data text-4xl font-bold text-gray-900 mb-1 tracking-tight">₹1,999<span className="text-sm text-gray-500 font-sans tracking-normal font-medium">/month</span></div>
                <div className="text-xs text-gray-400 mb-6 font-medium">(₹17,999/yr)</div>
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
