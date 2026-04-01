"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ListboxOption = { value: string; label: string };

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: ListboxOption[];
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
};

export function ListboxSelect({
  id: idProp,
  value,
  onChange,
  options,
  disabled,
  className,
  buttonClassName,
}: Props) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const listId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        disabled={disabled || options.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-3 text-left text-sm font-medium text-gray-900 shadow-sm",
          "focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25",
          "disabled:cursor-not-allowed disabled:opacity-50",
          buttonClassName
        )}
      >
        <span className="min-w-0 truncate">{selected?.label ?? "—"}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && options.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={id}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "text-gray-900 hover:bg-gray-50"
                  )}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {isSelected ? (
                    <Check className="h-4 w-4 shrink-0 text-white" aria-hidden />
                  ) : (
                    <span className="inline-block w-4 shrink-0" aria-hidden />
                  )}
                  <span className="min-w-0 truncate">{opt.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
