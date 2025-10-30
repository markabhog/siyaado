import Link from 'next/link';

export default function HeaderNav() {
  const links = [
    { name: "DEALS", href: "/deals" },
    { name: "GIFTS", href: "/gifts" },
    { name: "ELECTRONICS", href: "/electronics" },
    { name: "HEALTHY & BEAUTY", href: "/beauty" },
    { name: "BOOKS", href: "/books" },
    { name: "FURNITURE", href: "/furniture" },
    { name: "FITNESS & SPORTS", href: "/fitness" }
  ];
  
  return (
    <nav className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-11 text-slate-700 text-sm font-semibold overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6">
          {links.map((link, i) => (
            <div key={link.name} className="flex items-center gap-6">
              <Link href={link.href} className="hover:text-blue-600 whitespace-nowrap transition-colors">
                {link.name}
              </Link>
              {i === 0 && <span className="h-5 w-px bg-slate-200" />}
            </div>
          ))}
        </div>
        
        {/* Sell With Us - Prominent Text Link */}
        <div className="flex items-center gap-4 ml-auto pl-6">
          <span className="h-5 w-px bg-slate-200" />
          <Link
            href="/reseller"
            className="text-blue-600 hover:text-blue-700 font-bold tracking-wide whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            SELL WITH US
          </Link>
        </div>
      </div>
    </nav>
  );
}
