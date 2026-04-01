"use client";

import { cn } from "@/lib/utils";

const noSpinner =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
  /** decimal allows negative P&amp;L; numeric for budgets */
  inputMode?: "decimal" | "numeric";
};

/**
 * Styled number-like field without native steppers (optional empty string).
 */
export function PlainNumericInput({
  value,
  onChange,
  placeholder,
  min,
  disabled,
  className,
  id,
  inputMode = "numeric",
}: Props) {
  return (
    <input
      id={id}
      type="number"
      inputMode={inputMode}
      disabled={disabled}
      placeholder={placeholder}
      min={min}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        noSpinner,
        "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-data text-sm text-gray-900 shadow-sm",
        "placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  );
}
