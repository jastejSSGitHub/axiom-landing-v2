"use client";

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
}[] = [
  {
    sentiment: "bullish",
    confidence: 0.72,
    source: "Reuters",
    ago: "12m ago",
    headline: "Gold holds bid as real yields ease ahead of CPI",
    summary: "Flows show defensive positioning into metals; desk notes sticky inflation path supportive for haven demand.",
    reason: "Headline tone + commodity basket correlation weighted bullish.",
  },
  {
    sentiment: "neutral",
    confidence: 0.55,
    source: "Bloomberg",
    ago: "2h ago",
    headline: "Nasdaq futures digest tech earnings slate",
    summary: "Index futures chop in a tight range; options skew implies event vol into Friday close.",
    reason: "Mixed tape — sentiment model neutral with low conviction.",
  },
  {
    sentiment: "bearish",
    confidence: 0.68,
    source: "WSJ",
    ago: "3h ago",
    headline: "Crude slips as inventory build surprises consensus",
    summary: "Refinery throughput soft; prompt spread weakens — bearish near-term carry.",
    reason: "Inventory surprise + curve structure → bearish tilt.",
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

function NewsCard({ a, index }: { a: (typeof ARTICLES)[number]; index: number }) {
  const label = a.sentiment.toUpperCase();
  return (
    <li
      className={cn("flex w-full", index % 2 === 0 ? "justify-start" : "justify-end")}
    >
      <article
        className={cn(
          "flex w-full max-w-[80%] flex-col gap-1.5 rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-[0_8px_30px_-4px_rgba(15,40,80,0.12),0_2px_8px_-2px_rgba(0,0,0,0.06)] sm:p-4 md:gap-2 md:p-4"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <span
              className={cn(
                "inline-flex w-fit shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                sentimentBadgeClass(a.sentiment)
              )}
            >
              {label}
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
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{a.headline}</p>
        <p className="line-clamp-2 text-xs leading-snug text-gray-600">{a.summary}</p>
        <div className="mt-0.5 border-t border-gray-100 pt-1.5">
          <p className="line-clamp-1 text-[11px] leading-snug text-gray-500">{a.reason}</p>
        </div>
      </article>
    </li>
  );
}

export function LandingNewsFeed() {
  return (
    <div className="w-full min-w-0">
      <h2 className="mb-3 text-xs font-data font-bold uppercase tracking-widest text-gray-500 md:mb-3.5">
        Market news & sentiment
      </h2>
      <div
        className="rounded-2xl p-4 ring-1 ring-white/15 sm:p-5 md:p-6"
        style={{
          background: "linear-gradient(to bottom right, #c8e4fc 0%, #7eb3e8 35%, #3d7fc4 68%, #165a9e 100%)",
        }}
      >
        <ul className="flex flex-col gap-4 md:gap-5">
          {ARTICLES.map((a, i) => (
            <NewsCard key={i} a={a} index={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}
