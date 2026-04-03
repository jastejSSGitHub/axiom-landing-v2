export type MockFuturesSignal = {
  id: string;
  symbol: string;
  displayName: string;
  direction: "LONG" | "SHORT";
  status: "ACTIVE" | "MONITORING";
  entryLow: number;
  entryHigh: number;
  stop: number;
  tp1: number;
  tp2: number;
  rr: number;
  confidence: number;
  session: string;
  setupScore: string;
  reasoningLayers: string[];
  circuitBreaker: string;
};

export const LANDING_FUTURES_SIGNALS: MockFuturesSignal[] = [
  {
    id: "sig-gc-1",
    symbol: "GC",
    displayName: "Gold",
    direction: "LONG",
    status: "ACTIVE",
    entryLow: 4808,
    entryHigh: 4818,
    stop: 4792,
    tp1: 4840,
    tp2: 4862,
    rr: 2.1,
    confidence: 82,
    session: "NY Core",
    setupScore: "A (4/5)",
    reasoningLayers: [
      "London swept the Asian low at 3AM — the most reliable Gold pattern. FVG formed on the reversal. Firing now.",
      "Layer 2 — Liquidity: Asian low swept pre-London; sell-side liquidity targeted.",
      "Layer 3 — Displacement: 1H FVG formed on CPI flush reversal.",
      "Layer 4 — Entry: 15m OB + FVG confluence inside NY Core window.",
      "Layer 5 — Risk: Stop beyond structural low; R:R > 2:1 to first opposing liquidity.",
    ],
    circuitBreaker: "Invalidate if 1H closes below $4,780 or if DXY spikes >0.8% in the same hour.",
  },
  {
    id: "sig-nq-1",
    symbol: "NQ",
    displayName: "Nasdaq 100",
    direction: "SHORT",
    status: "MONITORING",
    entryLow: 19275,
    entryHigh: 19295,
    stop: 19335,
    tp1: 19180,
    tp2: 19080,
    rr: 1.9,
    confidence: 71,
    session: "NY Core",
    setupScore: "B (3/5)",
    reasoningLayers: [
      "Layer 1 — Structure: Lower highs on 4H; price inside prior value area high.",
      "Layer 2 — Liquidity: Overnight highs untested — magnet above but fade setup building.",
      "Layer 3 — Displacement: Waiting for 15m FVG fill at 19,210 zone before activation.",
      "Layer 4 — Entry: Monitoring for rejection at 19,290–19,300 supply.",
      "Layer 5 — Risk: Tighten size until FVG fill confirms.",
    ],
    circuitBreaker: "Abort monitor if NQ reclaims 19,350 on a closing 15m basis.",
  },
  {
    id: "sig-es-1",
    symbol: "ES",
    displayName: "S&P 500",
    direction: "SHORT",
    status: "MONITORING",
    entryLow: 5288,
    entryHigh: 5295,
    stop: 5312,
    tp1: 5255,
    tp2: 5220,
    rr: 1.8,
    confidence: 71,
    session: "NY Core",
    setupScore: "B (3/5)",
    reasoningLayers: [
      "Layer 1 — Structure: 4H balance high holding; value area rotation lower.",
      "Layer 2 — Liquidity: Overnight low untested — potential magnet.",
      "Layer 3 — Displacement: Waiting for 15m supply confirmation at upper edge.",
      "Layer 4 — Entry: Monitoring fade at 5,290–5,295 if rejection prints.",
      "Layer 5 — Risk: Stand down if ES reclaims 5,320 on 15m close.",
    ],
    circuitBreaker: "Abort monitor if ES reclaims 5,320 on a closing 15m basis.",
  },
];

/** Hero mockup carousel only — not part of the 3-card futures showcase grid */
export const HERO_CRUDE_SIGNAL_SEED: MockFuturesSignal = {
  id: "sig-cl-hero",
  symbol: "CL",
  displayName: "Crude Oil",
  direction: "LONG",
  status: "ACTIVE",
  entryLow: 74.5,
  entryHigh: 75.05,
  stop: 73.55,
  tp1: 76.35,
  tp2: 77.9,
  rr: 2.2,
  confidence: 71,
  session: "NY Core",
  setupScore: "A (4/5)",
  reasoningLayers: [
    "Weekly inventory draw plus OPEC rhetoric priced a demand floor. CL holding above prior day's VAH — continuation setup.",
    "Layer 2 — Liquidity: Equal highs above; sell-side liquidity likely run on push.",
    "Layer 3 — Displacement: 1H bullish FVG after inventory.",
    "Layer 4 — Entry: 15m OB confluence with daily POC.",
    "Layer 5 — Risk: Stop below structural low; R:R > 2:1 to opposing liquidity.",
  ],
  circuitBreaker: "Invalidate if CL loses 73.20 on a closing 1H basis.",
};
