export type PropFirmId = "tradeify" | "lucid" | "topstep" | "alpha" | "myfunded" | "apex";

export type DrawdownKind = "eod" | "intraday";

/** Structured fields for the rules banner (Part D). */
export type PropAccountRules = {
  dailyLoss: string;
  profitTarget: string | null;
  maxDrawdown: string;
  minDays: string;
  consistency: string;
  profitSplit: string;
  /** Eval only; omit rendering when null */
  passInOneDay: boolean | null;
  /** Funded only; omit when null */
  drawdownType: DrawdownKind | null;
  /** Extra funded warning row */
  fundedIntradayDdWarning?: boolean;
};

export type PropAccountOption = {
  id: string;
  label: string;
  rules: PropAccountRules;
};

export const PROP_FIRM_ROWS: {
  id: PropFirmId;
  displayName: string;
  shortLabel: string;
}[] = [
  { id: "tradeify", displayName: "Tradeify", shortLabel: "TF" },
  { id: "lucid", displayName: "Lucid Trading", shortLabel: "LT" },
  { id: "topstep", displayName: "Topstep", shortLabel: "TS" },
  { id: "alpha", displayName: "Alpha Futures", shortLabel: "AF" },
  { id: "myfunded", displayName: "MyFundedFutures", shortLabel: "MF" },
  { id: "apex", displayName: "Apex", shortLabel: "AP" },
];

const none = (s: string) => s === "None";

export function isNoneGreen(value: string): boolean {
  return none(value);
}

const PROP_OPTIONS: Record<PropFirmId, { evaluation: PropAccountOption[]; funded: PropAccountOption[] }> = {
  tradeify: {
    evaluation: [
      {
        id: "tf-ev-50g",
        label: "$50K Growth (DL: $1,250 | Target: $3,000 | DD: $2,000)",
        rules: {
          dailyLoss: "$1,250",
          profitTarget: "$3,000",
          maxDrawdown: "$2,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "tf-ev-100g",
        label: "$100K Growth (DL: $2,500 | Target: $6,000 | DD: $3,500)",
        rules: {
          dailyLoss: "$2,500",
          profitTarget: "$6,000",
          maxDrawdown: "$3,500",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "tf-ev-150g",
        label: "$150K Growth (DL: $3,750 | Target: $9,000 | DD: $5,000)",
        rules: {
          dailyLoss: "$3,750",
          profitTarget: "$9,000",
          maxDrawdown: "$5,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "tf-ev-50s",
        label: "$50K Select (No DLL | Target: $3,000 | DD: $2,000)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$3,000",
          maxDrawdown: "$2,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "tf-ev-100s",
        label: "$100K Select (No DLL | Target: $6,000 | DD: $3,000)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$6,000",
          maxDrawdown: "$3,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
    ],
    funded: [
      {
        id: "tf-fd-50g",
        label: "$50K Growth Funded (DL: $1,250 | DD locks at $52,100 | Min qualifying day: $150)",
        rules: {
          dailyLoss: "$1,250",
          profitTarget: null,
          maxDrawdown: "Locks at $52,100",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
      {
        id: "tf-fd-100g",
        label: "$100K Growth Funded (DL: $2,500 | DD locks | Min qualifying day: $200)",
        rules: {
          dailyLoss: "$2,500",
          profitTarget: null,
          maxDrawdown: "DD locks",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
      {
        id: "tf-fd-50sf",
        label: "$50K Select Flex (No DLL | No consistency rule)",
        rules: {
          dailyLoss: "None",
          profitTarget: null,
          maxDrawdown: "—",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
    ],
  },
  lucid: {
    evaluation: [
      {
        id: "lc-ev-50fx",
        label: "$50K LucidFlex (No DLL | Target: $3,000 | DD: $2,000 | Min days: 2)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$3,000",
          maxDrawdown: "$2,000",
          minDays: "2",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "lc-ev-100fx",
        label: "$100K LucidFlex (No DLL | Target: $6,000 | DD: $3,000 | Min days: 2)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$6,000",
          maxDrawdown: "$3,000",
          minDays: "2",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "lc-ev-50pr",
        label: "$50K LucidPro (DL: $1,200 | Target: $3,000 | DD: $2,000 | Pass in 1 day)",
        rules: {
          dailyLoss: "$1,200",
          profitTarget: "$3,000",
          maxDrawdown: "$2,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: true,
          drawdownType: null,
        },
      },
      {
        id: "lc-ev-100pr",
        label: "$100K LucidPro (DL: $1,800 | Target: $6,000 | DD: $3,000)",
        rules: {
          dailyLoss: "$1,800",
          profitTarget: "$6,000",
          maxDrawdown: "$3,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
    ],
    funded: [
      {
        id: "lc-fd-50fx",
        label: "$50K LucidFlex Funded (No DLL | 90/10 | $2,000 payout cap)",
        rules: {
          dailyLoss: "None",
          profitTarget: null,
          maxDrawdown: "—",
          minDays: "None",
          consistency: "None",
          profitSplit: "90/10",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
      {
        id: "lc-fd-100fx",
        label: "$100K LucidFlex Funded (No DLL | 90/10)",
        rules: {
          dailyLoss: "None",
          profitTarget: null,
          maxDrawdown: "—",
          minDays: "None",
          consistency: "None",
          profitSplit: "90/10",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
      {
        id: "lc-fd-50pr",
        label: "$50K LucidPro Funded (LucidScale DLL | 100% first $10K then 90/10)",
        rules: {
          dailyLoss: "LucidScale DLL",
          profitTarget: null,
          maxDrawdown: "—",
          minDays: "None",
          consistency: "None",
          profitSplit: "100%→90/10",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
    ],
  },
  topstep: {
    evaluation: [
      {
        id: "ts-ev-50c",
        label: "$50K Combine (No DLL TopstepX | Target: $3,000 | DD: $2,000 | Consistency: 50%)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$3,000",
          maxDrawdown: "$2,000",
          minDays: "None",
          consistency: "50%",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "ts-ev-100c",
        label: "$100K Combine (No DLL | Target: $6,000 | DD: $3,000)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$6,000",
          maxDrawdown: "$3,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "ts-ev-150c",
        label: "$150K Combine (No DLL | Target: $9,000 | DD: $4,500)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$9,000",
          maxDrawdown: "$4,500",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
    ],
    funded: [
      {
        id: "ts-fd-50x",
        label: "$50K XFA (No DLL | 90/10 | Min qualifying: 5 days × $150)",
        rules: {
          dailyLoss: "None",
          profitTarget: null,
          maxDrawdown: "—",
          minDays: "5 days × $150",
          consistency: "None",
          profitSplit: "90/10",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
      {
        id: "ts-fd-100x",
        label: "$100K XFA (No DLL | 90/10 | 5 days × $150)",
        rules: {
          dailyLoss: "None",
          profitTarget: null,
          maxDrawdown: "—",
          minDays: "5 days × $150",
          consistency: "None",
          profitSplit: "90/10",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
    ],
  },
  alpha: {
    evaluation: [
      {
        id: "af-ev-50z",
        label: "$50K Zero (DL: $1,000 | Target: $3,000 | DD: $2,000 | Pass in 1 day)",
        rules: {
          dailyLoss: "$1,000",
          profitTarget: "$3,000",
          maxDrawdown: "$2,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: true,
          drawdownType: null,
        },
      },
      {
        id: "af-ev-100z",
        label: "$100K Zero (DL: $2,000 | Target: $6,000 | DD: $4,000)",
        rules: {
          dailyLoss: "$2,000",
          profitTarget: "$6,000",
          maxDrawdown: "$4,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "af-ev-50st",
        label: "$50K Standard (No DLL | Target: $3,000 | DD: $2,000 | Min days: 2)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$3,000",
          maxDrawdown: "$2,000",
          minDays: "2",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "af-ev-50ad",
        label: "$50K Advanced (No DLL | Target: $4,000 | DD: $1,750)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$4,000",
          maxDrawdown: "$1,750",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
    ],
    funded: [
      {
        id: "af-fd-50ad",
        label: "$50K Advanced Funded (No DLL | No consistency | 90/10 flat)",
        rules: {
          dailyLoss: "None",
          profitTarget: null,
          maxDrawdown: "—",
          minDays: "None",
          consistency: "None",
          profitSplit: "90/10",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
      {
        id: "af-fd-50st",
        label: "$50K Standard Funded (DL: 2% | Tiered split 70→90%)",
        rules: {
          dailyLoss: "2%",
          profitTarget: null,
          maxDrawdown: "—",
          minDays: "None",
          consistency: "None",
          profitSplit: "70→90%",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
    ],
  },
  myfunded: {
    evaluation: [
      {
        id: "mf-ev-50r",
        label: "$50K Rapid (No DLL | Target: $3,000 | DD: $2,000 | Intraday trailing on funded!)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$3,000",
          maxDrawdown: "$2,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "mf-ev-100r",
        label: "$100K Rapid (No DLL | Target: $6,000 | DD: $3,000)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$6,000",
          maxDrawdown: "$3,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "mf-ev-50p",
        label: "$50K Pro (No DLL | Target: $3,000 | DD: $2,000)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$3,000",
          maxDrawdown: "$2,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
    ],
    funded: [
      {
        id: "mf-fd-50r",
        label: "$50K Rapid Funded (Intraday trailing DD | 90/10 | Daily payouts after buffer)",
        rules: {
          dailyLoss: "—",
          profitTarget: null,
          maxDrawdown: "Intraday trailing",
          minDays: "None",
          consistency: "None",
          profitSplit: "90/10",
          passInOneDay: null,
          drawdownType: "intraday",
          fundedIntradayDdWarning: true,
        },
      },
      {
        id: "mf-fd-50p",
        label: "$50K Pro Funded (EOD trailing DD | 80/20 | Bi-weekly payouts)",
        rules: {
          dailyLoss: "—",
          profitTarget: null,
          maxDrawdown: "EOD trailing",
          minDays: "None",
          consistency: "None",
          profitSplit: "80/20",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
    ],
  },
  apex: {
    evaluation: [
      {
        id: "ap-ev-50e",
        label: "$50K EOD (DL: $1,000 | Target: $3,000 | DD: $2,000 | Pass in 1 day)",
        rules: {
          dailyLoss: "$1,000",
          profitTarget: "$3,000",
          maxDrawdown: "$2,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: true,
          drawdownType: null,
        },
      },
      {
        id: "ap-ev-100e",
        label: "$100K EOD (DL: $1,500 | Target: $6,000 | DD: $3,000)",
        rules: {
          dailyLoss: "$1,500",
          profitTarget: "$6,000",
          maxDrawdown: "$3,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
      {
        id: "ap-ev-50i",
        label: "$50K Intraday (No DLL | Target: $3,000 | DD: $2,000 | Pass in 1 day)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$3,000",
          maxDrawdown: "$2,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: true,
          drawdownType: null,
        },
      },
      {
        id: "ap-ev-100i",
        label: "$100K Intraday (No DLL | Target: $6,000 | DD: $3,000)",
        rules: {
          dailyLoss: "None",
          profitTarget: "$6,000",
          maxDrawdown: "$3,000",
          minDays: "None",
          consistency: "None",
          profitSplit: "—",
          passInOneDay: false,
          drawdownType: null,
        },
      },
    ],
    funded: [
      {
        id: "ap-fd-50pa",
        label: "$50K PA (50% consistency | 90/10 | 6 payout ladder | Monthly fee: $85 Rithmic)",
        rules: {
          dailyLoss: "—",
          profitTarget: null,
          maxDrawdown: "—",
          minDays: "None",
          consistency: "50%",
          profitSplit: "90/10",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
      {
        id: "ap-fd-100pa",
        label: "$100K PA (50% consistency | 90/10)",
        rules: {
          dailyLoss: "—",
          profitTarget: null,
          maxDrawdown: "—",
          minDays: "None",
          consistency: "50%",
          profitSplit: "90/10",
          passInOneDay: null,
          drawdownType: "eod",
        },
      },
    ],
  },
};

export function getPropAccountOptions(firm: PropFirmId, mode: "evaluation" | "funded"): PropAccountOption[] {
  return PROP_OPTIONS[firm][mode];
}

export function getDefaultPlanId(firm: PropFirmId, mode: "evaluation" | "funded"): string {
  const list = getPropAccountOptions(firm, mode);
  return list[0]?.id ?? "";
}
