/**
 * Numeric limits per prop plan id for risk pre-fill and validation.
 * Sourced from Prompt 1 account copy; funded max DD uses trailing/equity DD where stated.
 */
export type PropPlanRiskLimits = {
  maxDrawdownDollars: number;
  dailyLossLimitDollars: number | null;
  /** Profit target (eval) — consistency heuristic */
  profitTargetDollars: number | null;
  consistencyPercent: number | null;
  /** Funded: min profit for a qualifying day toward payout */
  qualifyingDayMinProfitDollars: number | null;
};

export const PROP_PLAN_RISK_LIMITS: Record<string, PropPlanRiskLimits> = {
  "tf-ev-50g": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: 1250,
    profitTargetDollars: 3000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "tf-ev-100g": {
    maxDrawdownDollars: 3500,
    dailyLossLimitDollars: 2500,
    profitTargetDollars: 6000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "tf-ev-150g": {
    maxDrawdownDollars: 5000,
    dailyLossLimitDollars: 3750,
    profitTargetDollars: 9000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "tf-ev-50s": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 3000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "tf-ev-100s": {
    maxDrawdownDollars: 3000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 6000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "tf-fd-50g": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: 1250,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: 150,
  },
  "tf-fd-100g": {
    maxDrawdownDollars: 3500,
    dailyLossLimitDollars: 2500,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: 200,
  },
  "tf-fd-50sf": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "lc-ev-50fx": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 3000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "lc-ev-100fx": {
    maxDrawdownDollars: 3000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 6000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "lc-ev-50pr": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: 1200,
    profitTargetDollars: 3000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "lc-ev-100pr": {
    maxDrawdownDollars: 3000,
    dailyLossLimitDollars: 1800,
    profitTargetDollars: 6000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "lc-fd-50fx": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "lc-fd-100fx": {
    maxDrawdownDollars: 3000,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "lc-fd-50pr": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "ts-ev-50c": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 3000,
    consistencyPercent: 50,
    qualifyingDayMinProfitDollars: null,
  },
  "ts-ev-100c": {
    maxDrawdownDollars: 3000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 6000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "ts-ev-150c": {
    maxDrawdownDollars: 4500,
    dailyLossLimitDollars: null,
    profitTargetDollars: 9000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "ts-fd-50x": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: 150,
  },
  "ts-fd-100x": {
    maxDrawdownDollars: 3000,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: 150,
  },
  "af-ev-50z": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: 1000,
    profitTargetDollars: 3000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "af-ev-100z": {
    maxDrawdownDollars: 4000,
    dailyLossLimitDollars: 2000,
    profitTargetDollars: 6000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "af-ev-50st": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 3000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "af-ev-50ad": {
    maxDrawdownDollars: 1750,
    dailyLossLimitDollars: null,
    profitTargetDollars: 4000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "af-fd-50ad": {
    maxDrawdownDollars: 1750,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "af-fd-50st": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "mf-ev-50r": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 3000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "mf-ev-100r": {
    maxDrawdownDollars: 3000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 6000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "mf-ev-50p": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 3000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "mf-fd-50r": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "mf-fd-50p": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "ap-ev-50e": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: 1000,
    profitTargetDollars: 3000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "ap-ev-100e": {
    maxDrawdownDollars: 3000,
    dailyLossLimitDollars: 1500,
    profitTargetDollars: 6000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "ap-ev-50i": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 3000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "ap-ev-100i": {
    maxDrawdownDollars: 3000,
    dailyLossLimitDollars: null,
    profitTargetDollars: 6000,
    consistencyPercent: null,
    qualifyingDayMinProfitDollars: null,
  },
  "ap-fd-50pa": {
    maxDrawdownDollars: 2000,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: 50,
    qualifyingDayMinProfitDollars: null,
  },
  "ap-fd-100pa": {
    maxDrawdownDollars: 3000,
    dailyLossLimitDollars: null,
    profitTargetDollars: null,
    consistencyPercent: 50,
    qualifyingDayMinProfitDollars: null,
  },
};

export function getPropPlanRiskLimits(planId: string): PropPlanRiskLimits | null {
  return PROP_PLAN_RISK_LIMITS[planId] ?? null;
}
