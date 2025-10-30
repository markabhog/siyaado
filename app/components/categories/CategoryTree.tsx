import Link from "next/link";

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children?: CategoryNode[];
};

export function CategoryTree({ nodes }: { nodes: CategoryNode[] }) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <li key={node.id}>
          <Link className="text-sm text-neutral-800 hover:underline" href={`/category/${node.slug}`}>
            {node.name}
          </Link>
          {node.children && node.children.length > 0 ? (
            <div className="ml-4 mt-1 border-l border-neutral-200 pl-3">
              <CategoryTree nodes={node.children} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}


