import Link from "next/link";
import Image from "next/image";

export function CategoryTile({
  name,
  slug,
  image,
}: {
  name: string;
  slug: string;
  image?: string;
}) {
  return (
    <Link
      href={`/category/${slug}`}
      className="group relative overflow-hidden rounded-2xl shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
    >
      <div className="relative aspect-[4/3] w-full">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sky-100 to-sky-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-lg font-bold text-white drop-shadow-lg">{name}</h3>
        </div>
      </div>
    </Link>
  );
}

