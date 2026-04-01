export type YahooQuote = {
  id: string;
  displayName: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  high?: number;
  low?: number;
  volume?: number;
  timestamp?: number;
};

export const YAHOO_SYMBOLS: Record<string, string> = {
  GC: "GC=F",
  SI: "SI=F",
  CL: "CL=F",
  NG: "NG=F",
  NQ: "NQ=F",
  ES: "ES=F",
  YM: "YM=F",
  RTY: "RTY=F",
  ZN: "ZN=F",
  ZB: "ZB=F",
  "6E": "6E=F",
  "6B": "6B=F",
  HG: "HG=F",
  NIFTY50: "^NSEI",
  NIFTY: "^NSEI",
  BANKNIFTY: "^NSEBANK",
};

const DISPLAY_NAMES: Record<string, string> = {
  GC: "Gold",
  SI: "Silver",
  CL: "Crude Oil",
  NG: "Natural Gas",
  NQ: "Nasdaq 100",
  ES: "S&P 500",
  YM: "Dow Jones",
  RTY: "Russell 2000",
  ZN: "US 10Y",
  ZB: "US 30Y",
  "6E": "Euro FX",
  "6B": "British Pound",
  HG: "Copper",
  NIFTY50: "NIFTY 50",
  NIFTY: "Nifty 50",
  BANKNIFTY: "BANKNIFTY",
};

const EXCHANGES: Record<string, string> = {
  GC: "COMEX",
  SI: "COMEX",
  CL: "NYMEX",
  NG: "NYMEX",
  NQ: "CME",
  ES: "CME",
  YM: "CBOT",
  RTY: "CME",
  ZN: "CBOT",
  ZB: "CBOT",
  "6E": "CME",
  "6B": "CME",
  HG: "COMEX",
  NIFTY50: "NSE",
  NIFTY: "NSE",
  BANKNIFTY: "NSE",
};

const YAHOO_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "application/json,text/plain,*/*",
} as const;

function lastNumericCloseFromChart(result: {
  indicators?: { quote?: Array<{ close?: (number | null)[] }> };
}): number {
  const closes = result.indicators?.quote?.[0]?.close;
  if (!Array.isArray(closes) || closes.length === 0) return NaN;
  for (let i = closes.length - 1; i >= 0; i--) {
    const v = closes[i];
    if (v != null && Number.isFinite(v) && v > 0) return Number(v);
  }
  return NaN;
}

export async function getQuote(symbol: string): Promise<YahooQuote> {
  const yahooSymbol = YAHOO_SYMBOLS[symbol] || symbol;

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    yahooSymbol
  )}?interval=1d&range=1d`;

  const response = await fetch(url, {
    headers: YAHOO_FETCH_HEADERS,
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Yahoo fetch failed: ${symbol}`);

  const data = (await response.json()) as {
    chart?: { result?: Array<Record<string, unknown>> };
  };
  const result = data?.chart?.result?.[0] as
    | {
        meta?: Record<string, number | undefined>;
        indicators?: { quote?: Array<{ close?: (number | null)[] }> };
      }
    | undefined;

  if (!result) throw new Error(`No data for ${symbol}`);

  const meta = result.meta ?? {};
  let price = Number(
    meta.regularMarketPrice ?? meta.postMarketPrice ?? meta.preMarketPrice ?? meta.chartPreviousClose
  );
  if (!Number.isFinite(price) || price <= 0) {
    price = lastNumericCloseFromChart(result);
  }
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error(`Invalid quote for ${symbol}`);
  }

  let prevClose = Number(meta.previousClose ?? meta.chartPreviousClose);
  if (!Number.isFinite(prevClose) || prevClose <= 0) {
    prevClose = Number(meta.open ?? meta.regularMarketOpen);
  }
  if (!Number.isFinite(prevClose) || prevClose <= 0) {
    prevClose = price;
  }

  const change = price - prevClose;
  const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

  return {
    id: symbol,
    displayName: DISPLAY_NAMES[symbol] || symbol,
    exchange: EXCHANGES[symbol] || "",
    price: Number(price.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    high: meta.regularMarketDayHigh,
    low: meta.regularMarketDayLow,
    volume: meta.regularMarketVolume,
    timestamp: meta.regularMarketTime,
  };
}

export async function getBatchQuotes(symbols: string[]): Promise<YahooQuote[]> {
  const results = await Promise.allSettled(symbols.map((sym) => getQuote(sym)));

  return results
    .filter((r): r is PromiseFulfilledResult<YahooQuote> => r.status === "fulfilled")
    .map((r) => r.value);
}
