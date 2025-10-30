"use client";
import * as React from "react";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 ${className}`}>
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="px-3 py-2 text-lg font-semibold text-slate-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      <span className="min-w-[2rem] text-center font-medium text-slate-900">{value}</span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="px-3 py-2 text-lg font-semibold text-slate-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  );
}

