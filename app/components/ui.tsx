import * as React from "react";

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
  }
) {
  const { className = "", variant = "primary", size = "md", ...rest } = props;
  
  const sizeStyles = 
    size === "sm" 
      ? "h-8 px-3 py-1.5 text-xs"
      : size === "lg"
      ? "h-12 px-6 py-3 text-base"
      : "h-10 px-4 py-2 text-sm";
  
  const base = `inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${sizeStyles}`;
  
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md"
      : variant === "outline"
      ? "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 focus:ring-slate-300"
      : "bg-slate-900/5 text-slate-900 hover:bg-slate-900/10 active:bg-slate-900/20 focus:ring-slate-300";
  
  return <button className={`${base} ${styles} ${className}`} {...rest} />;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      className={`w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${className}`}
      {...rest}
    />
  );
}

export function PillBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700">
      {children}
    </span>
  );
}

export function Skeleton({ className = "h-4 w-full" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-neutral-200 ${className}`} />;
}


