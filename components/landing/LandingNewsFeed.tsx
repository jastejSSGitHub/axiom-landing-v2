"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Sentiment = "bullish" | "bearish" | "neutral";

const ARTICLES: {
  sentiment: Sentiment;
  confidence: number;
  source: string;
  ago: string;
  headline: string;
  summary: string;
  reason: string;
  url: string;
}[] = [
  {
    sentiment: "bullish",
    confidence: 0.72,
    source: "Reuters",
    ago: "12m ago",
    headline: "Gold holds bid as real yields ease ahead of CPI",
    summary: "Flows show defensive positioning into metals; desk notes sticky inflation path supportive for haven demand.",
    reason: "Headline tone + commodity basket correlation weighted bullish.",
    url: "https://www.reuters.com",
  },
  {
    sentiment: "neutral",
    confidence: 0.55,
    source: "Bloomberg",
    ago: "2h ago",
    headline: "Nasdaq futures digest tech earnings slate",
    summary: "Index futures chop in a tight range; options skew implies event vol into Friday close.",
    reason: "Mixed tape — sentiment model neutral with low conviction.",
    url: "https://www.bloomberg.com",
  },
  {
    sentiment: "bearish",
    confidence: 0.68,
    source: "WSJ",
    ago: "3h ago",
    headline: "Crude slips as inventory build surprises consensus",
    summary: "Refinery throughput soft; prompt spread weakens — bearish near-term carry.",
    reason: "Inventory surprise + curve structure → bearish tilt.",
    url: "https://www.wsj.com",
  },
];

function sentimentBadgeClass(s: Sentiment): string {
  switch (s) {
    case "bullish":
      return "bg-emerald-500/15 text-emerald-700";
    case "bearish":
      return "bg-red-500/15 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function sentimentBarClass(s: Sentiment): string {
  switch (s) {
    case "bullish":
      return "bg-emerald-500";
    case "bearish":
      return "bg-red-500";
    default:
      return "bg-gray-400/60";
  }
}

export function LandingNewsFeed() {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 flex-1 text-sm font-bold uppercase tracking-wider text-gray-500">Market News & Sentiment</h2>
        <span className="shrink-0 text-xs font-semibold text-blue-600">Demo feed</span>
      </div>
      <ul className="space-y-2">
        {ARTICLES.map((a, i) => (
          <li
            key={i}
            className="flex min-h-[132px] flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                <span
                  className={cn(
                    "inline-flex w-fit shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    sentimentBadgeClass(a.sentiment)
                  )}
                >
                  {a.sentiment}
                </span>
                <div className="h-1 w-[72px] shrink-0 overflow-hidden rounded-full bg-gray-200" aria-hidden>
                  <div
                    className={cn("h-full rounded-full opacity-80", sentimentBarClass(a.sentiment))}
                    style={{ width: `${Math.round(Math.max(0, Math.min(1, a.confidence)) * 100)}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-[11px] text-gray-500">
                {a.source} · {a.ago}
              </span>
            </div>
            <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">{a.headline}</p>
            <p className="line-clamp-2 text-xs leading-relaxed text-gray-600">{a.summary}</p>
            <div className="mt-auto flex items-end justify-between gap-2 pt-0.5">
              <p className="line-clamp-2 min-w-0 flex-1 text-[11px] text-gray-500">{a.reason}</p>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                Link
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
