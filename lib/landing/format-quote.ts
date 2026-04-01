export function formatFuturesPrice(symbol: string, n: number): string {
  const abs = Math.abs(n);
  if (symbol === "6E" || symbol === "6B") return n.toFixed(4);
  if (symbol === "ZN" || symbol === "ZB") return n.toFixed(2);
  if (symbol === "NG" || symbol === "SI" || symbol === "HG" || symbol === "CL") {
    if (abs < 100 && symbol !== "CL") return n.toFixed(2);
    return n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }
  return n.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 });
}

export function formatChangePctLabel(changePercent: number): string {
  const s = changePercent >= 0 ? "+" : "";
  return `${s}${changePercent.toFixed(2)}%`;
}
