"use client";

import { motion } from "framer-motion";
import { Bell, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockFuturesSignal } from "@/lib/landing/mock-signals";
import { formatFuturesPrice } from "@/lib/landing/format-quote";
import { FuturesSquareIcon } from "@/components/landing/FuturesSquareIcon";

const COL_DIVIDER =
  "relative after:pointer-events-none after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-px after:bg-gray-200 after:content-['']";

function fmtUsd(sym: string, n: number) {
  return `$${formatFuturesPrice(sym, n)}`;
}

export type LandingSignalCardProps = {
  signal: MockFuturesSignal;
  className?: string;
  insightText?: string;
};

export function LandingSignalCard({ signal: s, className, insightText: insightTextProp }: LandingSignalCardProps) {
  const monitoring = s.status === "MONITORING";
  const statusIsShort = s.direction === "SHORT";

  const entryDisplay =
    Number.isFinite(s.entryLow) && Number.isFinite(s.entryHigh)
      ? `${fmtUsd(s.symbol, s.entryLow)}–${fmtUsd(s.symbol, s.entryHigh).replace("$", "")}`
      : "—";
  const stopDisplay = Number.isFinite(s.stop) ? fmtUsd(s.symbol, s.stop) : "—";
  const targetDisplay = Number.isFinite(s.tp1) ? fmtUsd(s.symbol, s.tp1) : "—";
  const rrDisplay = Number.isFinite(s.rr) ? `${s.rr} : 1` : "—";

  const statusLabel = `${monitoring ? "MONITORING" : "ACTIVE"} ${s.direction}`;
  const statusColorBase = monitoring
    ? "text-amber-600"
    : statusIsShort
      ? "text-red-500"
      : "text-emerald-600";
  const pulseOuterColor = monitoring ? "bg-amber-400" : statusIsShort ? "bg-red-400" : "bg-emerald-400";
  const pulseInnerColor = monitoring ? "bg-amber-500" : statusIsShort ? "bg-red-500" : "bg-emerald-500";

  const insightText = (insightTextProp ?? s.reasoningLayers[0] ?? "").trim();

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors hover:border-gray-300",
        className
      )}
    >
      <span className="absolute right-3 top-3 z-10 bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-medium rounded-full px-2 py-0.5">
        Demo
      </span>
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-4 pb-3 pt-4 pr-16">
        <div className="flex min-w-0 items-center gap-2.5">
          <FuturesSquareIcon symbol={s.symbol} size={40} className="shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-gray-900">{s.displayName}</span>
            <span className="text-gray-500"> · {s.symbol}</span>
          </div>
        </div>
        <span
          className={cn(
            "flex max-w-[min(100%,11rem)] shrink-0 items-center text-[10px] font-bold uppercase tracking-wider",
            statusColorBase
          )}
        >
          <span className="relative mr-1.5 flex h-2.5 w-2.5 shrink-0">
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                pulseOuterColor,
                monitoring ? "animate-pulse" : "animate-ping"
              )}
            />
            <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", pulseInnerColor)} />
          </span>
          <span className="min-w-0 truncate">{statusLabel}</span>
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 pt-4">
        <div className="min-w-0 rounded-lg border border-gray-200/80 bg-gray-50/50">
          <div className="grid min-w-0 grid-cols-3 gap-y-3 p-3">
            <div className={cn("min-w-0 space-y-1.5 pr-1 text-center sm:pr-2", COL_DIVIDER)}>
              <span className="block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                {monitoring ? "Trigger" : "Entry"}
              </span>
              <div className="break-words font-data text-[clamp(11px,2.4vw,13px)] font-bold leading-tight tracking-tight text-gray-900">
                {entryDisplay}
              </div>
            </div>
            <div className={cn("min-w-0 space-y-1.5 px-1 text-center sm:px-2", COL_DIVIDER)}>
              <span className="block text-[9px] font-semibold uppercase tracking-widest text-red-500/85">Stop</span>
              <div className="break-words font-data text-[clamp(11px,2.4vw,13px)] font-bold leading-tight tracking-tight text-[#991B1B]">
                {stopDisplay}
              </div>
            </div>
            <div className="min-w-0 space-y-1.5 pl-1 text-center sm:pl-2">
              <span className="block text-[9px] font-semibold uppercase tracking-widest text-emerald-600">Target</span>
              <div className="break-words font-data text-[clamp(11px,2.4vw,13px)] font-bold leading-tight tracking-tight text-emerald-600">
                {targetDisplay}
              </div>
            </div>
          </div>

          <div className="mx-3 border-t border-gray-200/60" />

          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 py-2.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-600">
              <Scale className="h-3.5 w-3.5 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
              Risk to Reward
            </span>
            <span className="font-data text-[13px] font-bold tabular-nums text-gray-900">{rrDisplay}</span>
          </div>
        </div>

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-500">Confidence</span>
            <div className="text-right">
              <span className="font-data text-xs font-bold tabular-nums text-blue-600">{s.confidence}%</span>
              <span className="ml-1.5 text-[10px] font-medium text-gray-500">Setup {s.setupScore}</span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${s.confidence}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.12 }}
              className="h-full rounded-full bg-blue-600"
            />
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          {insightText ? (
            <p className="min-w-0 flex-1 text-xs italic leading-relaxed text-gray-600 sm:line-clamp-3">{insightText}</p>
          ) : null}
          <div
            className={cn(
              "flex shrink-0 flex-row items-center justify-end gap-2 sm:flex-col sm:items-end",
              !insightText && "w-full sm:ml-auto sm:w-auto"
            )}
          >
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:border-gray-300 hover:text-blue-600"
              aria-label="Set alert"
            >
              <Bell className="h-4 w-4" strokeWidth={2} />
            </button>
            <a
              href="#pricing"
              className="inline-flex h-8 items-center whitespace-nowrap text-xs font-semibold text-blue-600 hover:underline"
            >
              View →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
