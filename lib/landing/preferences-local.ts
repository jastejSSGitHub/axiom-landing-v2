/** Max risk per trade — mirrors app `futures_preferences` key for consistent demo behavior. */
export function readFuturesMaxRiskDollars(): number {
  if (typeof window === "undefined") return 100;
  try {
    const raw = localStorage.getItem("futures_preferences");
    if (raw) {
      const j = JSON.parse(raw) as { max_risk_per_trade?: number };
      const n = Number(j.max_risk_per_trade);
      if (Number.isFinite(n) && n > 0) return n;
    }
  } catch {
    /* ignore */
  }
  return 100;
}
