import * as React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  );
}

