"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const noSpinner =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

type Props = {
  id?: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  /** Use false for wide fractional values (e.g. stop distance). */
  integerOnly?: boolean;
};

export function StepperNumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  className,
  inputClassName,
  integerOnly = false,
}: Props) {
  const clamp = (n: number) => {
    let x = n;
    if (min != null && x < min) x = min;
    if (max != null && x > max) x = max;
    return x;
  };

  const parseIn = (raw: string) => {
    if (raw === "" || raw === "-") return null;
    const n = integerOnly ? parseInt(raw, 10) : parseFloat(raw);
    return Number.isFinite(n) ? n : null;
  };

  const dec = () => {
    if (disabled) return;
    const delta = step;
    const next = clamp((Number.isFinite(value) ? value : 0) - delta);
    onChange(next);
  };

  const inc = () => {
    if (disabled) return;
    const delta = step;
    const next = clamp((Number.isFinite(value) ? value : 0) + delta);
    onChange(next);
  };

  return (
    <div
      className={cn(
        "flex h-10 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm",
        disabled && "opacity-50",
        className
      )}
    >
      <button
        type="button"
        disabled={disabled || (min != null && value <= min)}
        onClick={dec}
        aria-label="Decrease"
        className={cn(
          "flex w-10 shrink-0 items-center justify-center border-r border-gray-200 bg-gray-50 text-gray-600",
          "hover:bg-gray-100 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/40",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </button>
      <input
        id={id}
        type="number"
        disabled={disabled}
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={integerOnly ? Math.max(1, step) : step !== 1 ? step : "any"}
        onChange={(e) => {
          const n = parseIn(e.target.value);
          if (n == null) return;
          onChange(clamp(n));
        }}
        className={cn(
          noSpinner,
          "min-w-0 flex-1 border-0 bg-white px-2 py-0 text-center font-data text-sm text-gray-900",
          "focus:z-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/30",
          inputClassName
        )}
      />
      <button
        type="button"
        disabled={disabled || (max != null && value >= max)}
        onClick={inc}
        aria-label="Increase"
        className={cn(
          "flex w-10 shrink-0 items-center justify-center border-l border-gray-200 bg-gray-50 text-gray-600",
          "hover:bg-gray-100 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/40",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
