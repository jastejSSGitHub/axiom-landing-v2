export type RiskInstrumentMath = {
  microLabel: string;
  dollarsPerPoint: number;
  dollarsPerTick: number;
  tickSizePoints: number;
  stopUnit: "pts" | "oz" | "bbl";
};

const TABLE: Record<string, RiskInstrumentMath> = {
  MNQ: {
    microLabel: "MNQ",
    dollarsPerPoint: 2,
    dollarsPerTick: 0.5,
    tickSizePoints: 0.25,
    stopUnit: "pts",
  },
  NQ: {
    microLabel: "NQ",
    dollarsPerPoint: 20,
    dollarsPerTick: 5,
    tickSizePoints: 0.25,
    stopUnit: "pts",
  },
  ES: {
    microLabel: "ES",
    dollarsPerPoint: 50,
    dollarsPerTick: 12.5,
    tickSizePoints: 0.25,
    stopUnit: "pts",
  },
  MES: {
    microLabel: "MES",
    dollarsPerPoint: 5,
    dollarsPerTick: 1.25,
    tickSizePoints: 0.25,
    stopUnit: "pts",
  },
  GC: {
    microLabel: "MGC",
    dollarsPerPoint: 10,
    dollarsPerTick: 1,
    tickSizePoints: 0.1,
    stopUnit: "oz",
  },
  CL: {
    microLabel: "CL",
    dollarsPerPoint: 1000,
    dollarsPerTick: 10,
    tickSizePoints: 0.01,
    stopUnit: "bbl",
  },
};

const SYMBOL_TO_MATH_KEY: Record<string, keyof typeof TABLE> = {
  NQ: "MNQ",
  GC: "GC",
  ES: "MES",
};

export function getRiskInstrumentMath(symbol: string): RiskInstrumentMath {
  const u = symbol.toUpperCase();
  const key = SYMBOL_TO_MATH_KEY[u];
  if (key && TABLE[key]) return { ...TABLE[key] };
  if (TABLE[u]) return { ...TABLE[u] };
  return { ...TABLE.MNQ };
}

export function formatInstrumentHeaderLine(math: RiskInstrumentMath): string {
  return `${math.microLabel} · $${math.dollarsPerPoint.toFixed(2)}/pt · $${math.dollarsPerTick.toFixed(2)}/tick`;
}
