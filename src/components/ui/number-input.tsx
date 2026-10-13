"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

type NumberInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "type" | "min" | "max"
> & {
  value: number | null;
  onValueChange: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Allow a decimal point (money). Defaults to integers only (quantities). */
  decimal?: boolean;
  /**
   * Committed on blur when the field is left empty. Omit to allow an empty
   * value (onValueChange(null)), e.g. "received amount" before anything is typed.
   */
  emptyValue?: number;
};

/**
 * Numeric text field that can be cleared while typing.
 *
 * `<input type="number">` bound straight to a number snaps "" back to the
 * minimum, so you cannot delete "1" to type "20". This keeps a string draft,
 * reports parsed values live, and only falls back / clamps on blur.
 * Selects all on focus so a new value can be typed straight over the old one.
 */
function NumberInput({
  value,
  onValueChange,
  min,
  max,
  decimal = false,
  emptyValue,
  onFocus,
  onBlur,
  ...props
}: NumberInputProps) {
  // The draft only exists while editing; otherwise show the parent's value, so
  // outside changes (e.g. the +/- buttons) appear immediately.
  const [draft, setDraft] = React.useState<string | null>(null);
  const shown = draft ?? (value == null ? "" : String(value));

  const pattern = decimal ? /^\d*\.?\d{0,2}$/ : /^\d*$/;

  function clamp(n: number) {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  }

  return (
    <Input
      {...props}
      type="text"
      inputMode={decimal ? "decimal" : "numeric"}
      autoComplete="off"
      value={shown}
      onFocus={(e) => {
        setDraft(shown);
        e.currentTarget.select();
        onFocus?.(e);
      }}
      onChange={(e) => {
        const next = e.target.value.replace(/,/g, "");
        if (!pattern.test(next)) return;
        setDraft(next);
        if (next === "" || next === ".") {
          if (emptyValue === undefined) onValueChange(null);
          return;
        }
        const n = Number(next);
        // Report in-range values live; out-of-range ones wait for blur to clamp,
        // so a transient "0" never zeroes a cart line mid-typing.
        if ((min == null || n >= min) && (max == null || n <= max)) onValueChange(n);
      }}
      onBlur={(e) => {
        const n = Number(shown);
        if (shown === "" || shown === "." || Number.isNaN(n)) {
          onValueChange(emptyValue ?? null);
        } else {
          onValueChange(clamp(n));
        }
        setDraft(null);
        onBlur?.(e);
      }}
    />
  );
}

export { NumberInput };
