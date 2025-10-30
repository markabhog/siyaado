import * as React from "react";
import Link from "next/link";

export function SectionHeader({
  title,
  viewAllHref,
  className = "",
}: {
  title: string;
  viewAllHref?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {viewAllHref ? (
        <Link href={viewAllHref} className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors">
          View all →
        </Link>
      ) : null}
    </div>
  );
}

