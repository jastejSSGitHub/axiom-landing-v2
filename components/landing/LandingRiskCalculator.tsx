"use client";

/* eslint-disable react-hooks/set-state-in-effect -- ported from app RiskCalculator; effect-driven resets match production */
/* eslint-disable @next/next/no-img-element -- firm favicons via Google s2; same as trading app */

import { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ListboxSelect } from "@/components/landing/ui/ListboxSelect";
import { PlainNumericInput } from "@/components/landing/ui/PlainNumericInput";
import { StepperNumberInput } from "@/components/landing/ui/StepperNumberInput";
import { readFuturesMaxRiskDollars } from "@/lib/landing/preferences-local";
import {
  getDefaultPlanId,
  getPropAccountOptions,
  isNoneGreen,
  PROP_FIRM_ROWS,
  type PropFirmId,
} from "@/lib/landing/prop-firm-data";
import { getPropPlanRiskLimits } from "@/lib/landing/prop-plan-risk-limits";
import { formatInstrumentHeaderLine, getRiskInstrumentMath } from "@/lib/landing/risk-instrument-math";

type PropFirmCardEntry = {
  id: PropFirmId;
  name: string;
  domain: string;
  abbr: string;
};

const PROP_FIRMS: PropFirmCardEntry[] = [
  { id: "tradeify", name: "Tradeify", domain: "tradeify.co", abbr: "TF" },
  { id: "lucid", name: "Lucid Trading", domain: "lucidtrading.com", abbr: "LT" },
  { id: "topstep", name: "Topstep", domain: "topstep.com", abbr: "TS" },
  { id: "alpha", name: "Alpha Futures", domain: "alpha-futures.com", abbr: "AF" },
  { id: "myfunded", name: "MyFundedFut.", domain: "myfundedfutures.com", abbr: "MF" },
  { id: "apex", name: "Apex", domain: "apextraderfunding.com", abbr: "AP" },
];

const PROP_FIRM_CARD_BY_ID = Object.fromEntries(PROP_FIRMS.map((p) => [p.id, p])) as Record<
  PropFirmId,
  PropFirmCardEntry
>;

function FirmFavicon({ firm }: { firm: PropFirmCardEntry }) {
  const [err, setErr] = useState(false);
  if (err) {
    return <span className="text-xs font-bold text-gray-600">{firm.abbr}</span>;
  }
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${firm.domain}&sz=32`}
      width={24}
      height={24}
      alt={firm.name}
      className="object-contain"
      onError={() => setErr(true)}
    />
  );
}

function planOptionShortLabel(label: string): string {
  const i = label.indexOf(" (");
  return i === -1 ? label : label.slice(0, i).trim();
}

type AccountKind = "personal" | "evaluation" | "funded";

type Props = {
  symbol: string;
  entry?: number;
  stop?: number;
};

type WarningItem = {
  id: string;
  priority: number;
  tone: "red" | "amber" | "yellow" | "green";
  message: string;
};

type RuleChipTone =
  | "dll-active"
  | "dll-none"
  | "profit"
  | "mdd"
  | "none-green"
  | "neutral"
  | "pass-yes"
  | "pass-no"
  | "dd-intra"
  | "dd-eod";

const RULE_CHIP_TONE_CLASS: Record<RuleChipTone, string> = {
  "dll-active": "border-red-200 bg-red-50 text-red-700",
  "dll-none": "border-green-200 bg-green-50 text-green-700",
  profit: "border-yellow-200 bg-yellow-50 text-yellow-700",
  mdd: "border-red-200 bg-red-50 text-red-700",
  "none-green": "border-green-200 bg-green-50 text-green-700",
  neutral: "border-gray-200 bg-gray-100 text-gray-600",
  "pass-yes": "border-green-200 bg-green-50 text-green-700",
  "pass-no": "border-gray-200 bg-gray-100 text-gray-600",
  "dd-intra": "border-amber-200 bg-amber-50 text-amber-700",
  "dd-eod": "border-gray-200 bg-gray-100 text-gray-600",
};

function RuleChip({
  icon,
  label,
  value,
  tone,
}: {
  icon: string;
  label: string;
  value: string;
  tone: RuleChipTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        RULE_CHIP_TONE_CLASS[tone]
      )}
    >
      <span aria-hidden>{icon}</span>
      <span className="shrink-0">{label}:</span>
      <span className="min-w-0 truncate font-data font-semibold">{value}</span>
    </span>
  );
}

export function LandingRiskCalculator({ symbol, entry, stop }: Props) {
  const symU = symbol.toUpperCase();
  const instr = useMemo(() => getRiskInstrumentMath(symU), [symU]);
  const headerLine = useMemo(() => formatInstrumentHeaderLine(instr), [instr]);

  const [accountType, setAccountType] = useState<AccountKind>("personal");
  const [selectedFirm, setSelectedFirm] = useState<PropFirmId>("tradeify");
  const [selectedPlanId, setSelectedPlanId] = useState(() => getDefaultPlanId("tradeify", "evaluation"));
  const [maxRisk, setMaxRisk] = useState(() => readFuturesMaxRiskDollars());
  const [dllUsedToday, setDllUsedToday] = useState("");
  const [qualifyingDays, setQualifyingDays] = useState(0);
  const [todaysPnL, setTodaysPnL] = useState("");
  const [dismissedWarnings, setDismissedWarnings] = useState<string[]>([]);

  const dismiss = useCallback((id: string) => {
    setDismissedWarnings((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  useEffect(() => {
    setDismissedWarnings([]);
  }, [accountType, selectedPlanId, selectedFirm]);

  useEffect(() => {
    if (accountType === "personal") {
      setMaxRisk(readFuturesMaxRiskDollars());
    }
  }, [accountType]);

  const [stopPoints, setStopPoints] = useState(() => {
    if (entry != null && stop != null) return Math.abs(entry - stop);
    return symU === "GC" ? 16 : symU === "NQ" ? 40 : 10;
  });

  useEffect(() => {
    if (entry != null && stop != null) {
      setStopPoints(Math.abs(entry - stop));
    }
  }, [entry, stop]);

  const propMode = accountType === "personal" ? null : accountType;

  useEffect(() => {
    if (!propMode) return;
    setSelectedPlanId(getDefaultPlanId(selectedFirm, propMode));
  }, [propMode, selectedFirm]);

  const planOptions = useMemo(() => {
    if (!propMode) return [];
    return getPropAccountOptions(selectedFirm, propMode);
  }, [propMode, selectedFirm]);

  const planSelectOptions = useMemo(
    () => planOptions.map((opt) => ({ value: opt.id, label: planOptionShortLabel(opt.label) })),
    [planOptions]
  );

  const selectedPlan = useMemo(() => planOptions.find((p) => p.id === selectedPlanId) ?? planOptions[0], [planOptions, selectedPlanId]);

  const riskLimits = useMemo(() => (selectedPlanId ? getPropPlanRiskLimits(selectedPlanId) : null), [selectedPlanId]);

  useEffect(() => {
    if (!planOptions.length) return;
    if (!planOptions.some((p) => p.id === selectedPlanId)) {
      setSelectedPlanId(planOptions[0].id);
    }
  }, [planOptions, selectedPlanId]);

  useEffect(() => {
    if (accountType === "personal") return;
    const limits = getPropPlanRiskLimits(selectedPlanId);
    const mode = accountType === "evaluation" ? "evaluation" : "funded";
    const plans = getPropAccountOptions(selectedFirm, mode);
    const plan = plans.find((p) => p.id === selectedPlanId);
    if (!limits || !plan) return;
    let v =
      accountType === "evaluation"
        ? Math.floor(limits.maxDrawdownDollars * 0.06)
        : Math.floor(limits.maxDrawdownDollars * 0.04);
    if (accountType === "funded" && plan.rules.drawdownType === "intraday") {
      v = Math.floor(v * 0.7);
    }
    setMaxRisk(Math.max(0, v));
  }, [accountType, selectedPlanId, selectedFirm]);

  const tickSize = instr.tickSizePoints;
  const ticks = useMemo(() => {
    if (tickSize <= 0 || !Number.isFinite(stopPoints)) return 0;
    return Math.max(1, Math.round(stopPoints / tickSize));
  }, [stopPoints, tickSize]);

  const riskPerContract = ticks * instr.dollarsPerTick;
  const contracts = riskPerContract > 0 ? Math.floor(maxRisk / riskPerContract) : 0;
  const totalRiskDollars = contracts * riskPerContract;
  const wideStop = contracts < 1 && riskPerContract > 0 && maxRisk > 0;

  const showPropUi = accountType !== "personal";
  const rules = selectedPlan?.rules;

  const dllLimit = accountType === "evaluation" ? riskLimits?.dailyLossLimitDollars ?? null : null;
  const dllUsedNum = dllUsedToday === "" ? 0 : Math.max(0, Number(dllUsedToday) || 0);
  const remainingDll =
    dllLimit != null && dllLimit > 0 ? Math.max(0, dllLimit - dllUsedNum) : null;
  const remainingDllPct = remainingDll != null && dllLimit != null && dllLimit > 0 ? remainingDll / dllLimit : null;

  const exceedsDll = dllLimit != null && maxRisk > dllLimit;
  const exceedsTenPctDd =
    riskLimits != null && maxRisk > riskLimits.maxDrawdownDollars * 0.1;
  const fundedIntraday = accountType === "funded" && selectedPlan?.rules.drawdownType === "intraday";

  const todaysPnLNum = todaysPnL === "" ? null : Number(todaysPnL);
  const consistencyPct = riskLimits?.consistencyPercent;
  const consistencyMessage = useMemo(() => {
    if (todaysPnLNum == null || !Number.isFinite(todaysPnLNum) || todaysPnLNum <= 0) return null;
    if (consistencyPct == null || !riskLimits) return null;
    if (accountType === "evaluation" && riskLimits.profitTargetDollars != null && riskLimits.profitTargetDollars > 0) {
      const cap = riskLimits.profitTargetDollars * (consistencyPct / 100);
      const pctOf = Math.round((Math.abs(todaysPnLNum) / riskLimits.profitTargetDollars) * 100);
      if (todaysPnLNum > cap) {
        return { ok: false as const, text: `⚠️ Today at ${pctOf}% of cycle — reduce size` };
      }
      return { ok: true as const, text: `✅ Within ${consistencyPct}% consistency rule` };
    }
    if (accountType === "funded") {
      const cap = riskLimits.maxDrawdownDollars * (consistencyPct / 100);
      const pctOf = Math.round((Math.abs(todaysPnLNum) / riskLimits.maxDrawdownDollars) * 100);
      if (todaysPnLNum > cap) {
        return { ok: false as const, text: `⚠️ Today at ${pctOf}% of cycle — reduce size` };
      }
      return { ok: true as const, text: `✅ Within ${consistencyPct}% consistency rule` };
    }
    return null;
  }, [todaysPnLNum, consistencyPct, riskLimits, accountType]);

  const warnings = useMemo((): WarningItem[] => {
    const out: WarningItem[] = [];
    if (showPropUi && riskLimits) {
      if (exceedsDll) {
        out.push({
          id: "dll-hard",
          priority: 1,
          tone: "red",
          message: "🚨 Exceeds daily loss limit — this trade would violate your account rules",
        });
      }
      if (exceedsTenPctDd && !exceedsDll) {
        out.push({
          id: "dd-soft",
          priority: 2,
          tone: "amber",
          message: "⚠️ Risk exceeds 10% of your drawdown — consider reducing",
        });
      }
      if (fundedIntraday) {
        out.push({
          id: "intraday-dd",
          priority: 3,
          tone: "amber",
          message: "🟠 Intraday DD — reduce size 30%",
        });
      }
    }
    if (wideStop && riskPerContract > 0) {
      out.push({
        id: "wide-stop",
        priority: 4,
        tone: "yellow",
        message: "🟡 Stop wide for max risk — fewer than 1 contract possible",
      });
    }
    const noBlock =
      showPropUi &&
      riskLimits &&
      !exceedsDll &&
      !exceedsTenPctDd &&
      maxRisk > 0 &&
      (!dllLimit || maxRisk <= dllLimit);
    if (noBlock) {
      out.push({
        id: "rules-ok",
        priority: 5,
        tone: "green",
        message: "🟢 ✓ Within prop firm rules",
      });
    }
    return out.sort((a, b) => a.priority - b.priority);
  }, [
    showPropUi,
    riskLimits,
    exceedsDll,
    exceedsTenPctDd,
    fundedIntraday,
    wideStop,
    riskPerContract,
    maxRisk,
    dllLimit,
  ]);

  const visibleWarnings = warnings.filter((w) => !dismissedWarnings.includes(w.id));

  const stopTileValue =
    instr.stopUnit === "oz"
      ? `${stopPoints.toFixed(2)}/oz`
      : instr.stopUnit === "bbl"
        ? `${stopPoints.toFixed(2)} bbl`
        : `${stopPoints} pts`;

  const r1 = contracts * riskPerContract;
  const r2 = contracts * riskPerContract * 2;
  const r3 = contracts * riskPerContract * 3;

  const minQual = riskLimits?.qualifyingDayMinProfitDollars;

  const pillInactive =
    "rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900";

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2 border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Risk calculator</h2>
          <p className="mt-1 font-mono text-xs text-gray-500">{headerLine}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-xs font-semibold text-gray-500">Account</span>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAccountType("personal")}
              className={cn(
                pillInactive,
                accountType === "personal" && "border-gray-800 bg-gray-800 text-white hover:border-gray-800 hover:bg-gray-800 hover:text-white"
              )}
            >
              Personal
            </button>
            <button
              type="button"
              onClick={() => setAccountType("evaluation")}
              className={cn(
                pillInactive,
                accountType === "evaluation" && "border-amber-500 bg-amber-500 text-white hover:border-amber-500 hover:bg-amber-500 hover:text-white"
              )}
            >
              EVAL
            </button>
            <button
              type="button"
              onClick={() => setAccountType("funded")}
              className={cn(
                pillInactive,
                accountType === "funded" && "border-teal-500 bg-teal-500 text-white hover:border-teal-500 hover:bg-teal-500 hover:text-white"
              )}
            >
              FUNDED
            </button>
          </div>
        </div>

        {showPropUi && (
          <div className="space-y-3 border-t border-gray-200 pt-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Select Your Firm</p>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
                {PROP_FIRM_ROWS.map((f) => {
                  const firmCard = PROP_FIRM_CARD_BY_ID[f.id];
                  const active = selectedFirm === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFirm(f.id)}
                      className={cn(
                        "flex min-w-[72px] shrink-0 flex-col items-center rounded-lg border py-2 px-2 text-center transition-colors",
                        active
                          ? "border-2 border-blue-500 bg-blue-50"
                          : "border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <FirmFavicon firm={firmCard} />
                      <span
                        className={cn(
                          "mt-1 line-clamp-2 text-[11px] leading-tight text-gray-500",
                          active && "font-medium text-blue-700"
                        )}
                      >
                        {firmCard.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="risk-calc-account-size" className="text-xs font-semibold text-gray-500">
                Account Size
              </label>
              <ListboxSelect
                id="risk-calc-account-size"
                className="mt-1"
                value={selectedPlan?.id ?? planSelectOptions[0]?.value ?? ""}
                onChange={setSelectedPlanId}
                options={planSelectOptions}
              />
            </div>

            {rules && (
              <div
                className={cn(
                  "rounded-lg border border-l-4 p-3",
                  accountType === "evaluation" && "border-amber-200 border-l-amber-400 bg-amber-50",
                  accountType === "funded" && "border-teal-200 border-l-teal-400 bg-teal-50"
                )}
              >
                <div className="flex flex-wrap gap-1.5">
                  <RuleChip
                    icon="📉"
                    label="Daily Loss"
                    value={rules.dailyLoss}
                    tone={isNoneGreen(rules.dailyLoss) ? "dll-none" : "dll-active"}
                  />
                  {rules.profitTarget != null && (
                    <RuleChip icon="🎯" label="Profit Target" value={rules.profitTarget} tone="profit" />
                  )}
                  <RuleChip icon="⚠️" label="Max Drawdown" value={rules.maxDrawdown} tone="mdd" />
                  <RuleChip
                    icon="📅"
                    label="Min Days"
                    value={rules.minDays}
                    tone={isNoneGreen(rules.minDays) ? "none-green" : "neutral"}
                  />
                  <RuleChip
                    icon="🔁"
                    label="Consistency"
                    value={rules.consistency}
                    tone={isNoneGreen(rules.consistency) ? "none-green" : "neutral"}
                  />
                  <RuleChip icon="💸" label="Profit Split" value={rules.profitSplit} tone="neutral" />
                  {rules.passInOneDay != null && (
                    <RuleChip
                      icon="⚡"
                      label="Pass in 1 Day"
                      value={rules.passInOneDay ? "Yes" : "No"}
                      tone={rules.passInOneDay ? "pass-yes" : "pass-no"}
                    />
                  )}
                  {rules.drawdownType != null && (
                    <RuleChip
                      icon="🏦"
                      label="Drawdown Type"
                      value={rules.drawdownType === "eod" ? "EOD" : "Intraday"}
                      tone={rules.drawdownType === "intraday" ? "dd-intra" : "dd-eod"}
                    />
                  )}
                </div>
                {rules.fundedIntradayDdWarning && (
                  <p className="mt-2 inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">
                    <span aria-hidden>⚠️</span> Intraday DD — tighter risk needed
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {fundedIntraday && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            ⚠️ This firm uses INTRADAY trailing drawdown. Your unrealized loss counts. Recommend reducing max risk by
            30% vs EOD accounts.
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="block">
            <span className="text-xs font-semibold text-gray-500">Max risk ($)</span>
            <StepperNumberInput
              className="mt-1"
              value={maxRisk}
              onChange={(n) => setMaxRisk(Math.max(0, n))}
              min={0}
              step={10}
              integerOnly
            />
          </div>

          {accountType === "evaluation" && dllLimit != null ? (
            <label className="block">
              <span className="text-xs font-semibold text-gray-500">Daily budget used ($)</span>
              <span className="ml-1 text-[10px] font-normal text-gray-400">optional</span>
              <PlainNumericInput
                value={dllUsedToday}
                onChange={setDllUsedToday}
                placeholder="0"
                min={0}
              />
            </label>
          ) : null}

          <div className="block">
            <span className="text-xs font-semibold text-gray-500">
              Stop distance ({instr.stopUnit === "oz" ? "$/oz" : instr.stopUnit === "bbl" ? "bbl" : "pts"})
            </span>
            <StepperNumberInput
              className="mt-1"
              value={stopPoints}
              onChange={(n) => setStopPoints(Math.max(0, n))}
              min={0}
              step={tickSize > 0 ? tickSize : 1}
            />
          </div>
        </div>

        {accountType === "evaluation" && dllLimit != null && dllLimit > 0 && remainingDll != null && (
          <div className="inline-flex flex-wrap items-center gap-1.5">
            <span className="text-sm text-gray-500">Remaining DLL:</span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                remainingDllPct != null && remainingDllPct > 0.5 && "border-green-200 bg-green-100 text-green-700",
                remainingDllPct != null &&
                  remainingDllPct > 0.25 &&
                  remainingDllPct <= 0.5 &&
                  "border-amber-200 bg-amber-100 text-amber-700",
                remainingDllPct != null && remainingDllPct <= 0.25 && "border-red-200 bg-red-100 text-red-700"
              )}
            >
              ${remainingDll.toLocaleString()}
            </span>
          </div>
        )}

        {accountType === "funded" && (
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">Days to payout</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="sr-only" htmlFor="qual-days">
                Qualifying days logged
              </label>
              <StepperNumberInput
                id="qual-days"
                className="max-w-[10rem]"
                value={qualifyingDays}
                onChange={(n) => setQualifyingDays(Math.min(5, Math.max(0, n)))}
                min={0}
                max={5}
                step={1}
                integerOnly
              />
              <span className="text-xs text-gray-600">/ 5 qualifying days</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-500 transition-[width]"
                style={{ width: `${Math.min(100, (qualifyingDays / 5) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              {minQual != null ? (
                <>
                  Need <span className="font-data font-semibold text-gray-900">${minQual}+</span> to count today
                </>
              ) : (
                "Minimum qualifying profit — see firm rules"
              )}
            </p>
          </div>
        )}

        {showPropUi && consistencyPct != null && (
          <label className="block">
            <span className="text-xs font-semibold text-gray-500">Today&apos;s P&amp;L ($)</span>
            <span className="ml-1 text-[10px] font-normal text-gray-400">optional — consistency check</span>
            <PlainNumericInput
              value={todaysPnL}
              onChange={setTodaysPnL}
              placeholder="0"
              inputMode="decimal"
            />
            {consistencyMessage && (
              <p
                className={cn(
                  "mt-2 text-xs font-medium",
                  consistencyMessage.ok ? "text-green-700" : "text-amber-700"
                )}
              >
                {consistencyMessage.text}
              </p>
            )}
          </label>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-lg border p-3",
                contracts >= 1 ? "border-blue-200 bg-blue-50" : "border-amber-200 bg-amber-50"
              )}
            >
              <p
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wide",
                  contracts >= 1 ? "text-blue-500" : "text-amber-500"
                )}
              >
                Contracts
              </p>
              <p
                className={cn(
                  "font-data text-3xl font-semibold",
                  contracts >= 1 ? "text-blue-700" : "text-amber-600"
                )}
              >
                {contracts}
              </p>
              <p
                className={cn(
                  "text-[11px]",
                  contracts >= 1 ? "text-blue-500/80" : "text-amber-600/80"
                )}
              >
                ({instr.microLabel})
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Risk / Contract</p>
              <p className="font-data text-lg font-semibold text-gray-900">${riskPerContract.toFixed(2)}</p>
              <p className="text-[10px] text-gray-500">Stop × point value</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Total Risk</p>
              <p className="font-data text-lg font-semibold text-gray-900">${totalRiskDollars.toFixed(0)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Stop Distance</p>
              <p className="font-data text-lg font-semibold text-gray-900">{stopTileValue}</p>
              <p className="text-[10px] text-gray-500">Est. ticks: {ticks}</p>
            </div>
          </div>
          {contracts >= 1 ? (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-200 pt-3">
              <span className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-2.5 py-1 font-data text-xs font-bold text-green-700">
                1R: +${r1.toFixed(0)}
              </span>
              <span className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-2.5 py-1 font-data text-xs font-bold text-green-700">
                2R: +${r2.toFixed(0)}
              </span>
              <span className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-2.5 py-1 font-data text-xs font-bold text-green-700">
                3R: +${r3.toFixed(0)}
              </span>
            </div>
          ) : null}
        </div>

        {visibleWarnings.length > 0 && (
          <div className="flex flex-col gap-2">
            {visibleWarnings.map((w) => (
              <div
                key={w.id}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium",
                  w.tone === "red" && "border-red-200 bg-red-50 text-red-700",
                  w.tone === "amber" && "border-amber-200 bg-amber-50 text-amber-800",
                  w.tone === "yellow" && "border-amber-200 bg-amber-50 text-amber-800",
                  w.tone === "green" && "border-green-200 bg-green-50 text-green-700"
                )}
              >
                <span className="min-w-0 flex-1 leading-snug">{w.message}</span>
                <button
                  type="button"
                  onClick={() => dismiss(w.id)}
                  className="shrink-0 rounded p-0.5 text-gray-500 hover:bg-black/5 hover:text-gray-900"
                  aria-label={`Dismiss: ${w.message}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
