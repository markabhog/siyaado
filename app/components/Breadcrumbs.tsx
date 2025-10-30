import Link from "next/link";

export function Breadcrumbs({
  items,
}: {
  items: Array<{ href?: string; label: string }>;
}) {
  return (
    <nav className="text-sm text-neutral-600">
      <ol className="flex items-center gap-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {item.href ? (
              <Link className="hover:underline" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-900">{item.label}</span>
            )}
            {idx < items.length - 1 ? <span className="mx-1 text-neutral-400">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}


