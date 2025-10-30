import Link from "next/link";
import { PillBadge } from "@/app/components/ui";

export function CategoryChip({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  return (
    <Link href={`/category/${slug}`}>
      <PillBadge>{name}</PillBadge>
    </Link>
  );
}


