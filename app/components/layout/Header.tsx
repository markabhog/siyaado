"use client";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { CartDrawer } from "@/app/components/CartDrawer";
// Removed lucide-react imports due to React 19 compatibility issues

const BagIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const Badge: React.FC<{ value: number }> = ({ value }) => (
  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-md ring-2 ring-white">
    {value}
  </span>
);

const SearchBar: React.FC<{ onSearch: (q: string) => void }> = ({ onSearch }) => {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [q]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          setQ(suggestions[selectedIndex]);
          onSearch(suggestions[selectedIndex]);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQ(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(q);
          setShowSuggestions(false);
        }}
        className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-md transition-all duration-200"
      >
        <svg className="w-5 h-5 text-slate-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="flex-1 px-3 py-2.5 outline-none bg-transparent text-slate-700 placeholder-slate-400 text-sm"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setSuggestions([]);
            }}
            className="p-1 mr-1 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button 
          type="submit" 
          className="bg-blue-600 text-white font-medium px-6 py-2.5 hover:bg-blue-700 transition-colors text-sm cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-slate-700 text-sm">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const cartItems = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.total)();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onCartOpen = (_e: Event) => setIsCartOpen(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('eco:cart-open', onCartOpen as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('eco:cart-open', onCartOpen as EventListener);
      }
    };
  }, []);

  const handleSearch = (q: string) => {
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <header className="w-full bg-white border-b border-slate-200">
        <div className="w-full max-w-[1600px] mx-auto px-8">
          <div className="flex items-center h-20">
            {/* Logo Section - Bold and Prominent */}
            <Link href="/" className="flex items-center shrink-0 pr-6">
              <div className="relative h-16 flex items-center justify-start">
                <img 
                  src="/logo.png?v=2" 
                  alt="Logo" 
                  className="h-12 w-auto object-contain hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<span class="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Logo</span>';
                    }
                  }}
                />
              </div>
            </Link>

            {/* Search Bar - Centered with balanced spacing */}
            <div className="flex-1 flex justify-center px-8">
              <div className="w-full max-w-2xl">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

            {/* Right Actions - Balanced positioning */}
            <div className="flex items-center gap-5 shrink-0 w-64 justify-end pr-2">
              {/* Cart Button - Prominent Design */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative group flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer"
              >
                <div className="relative">
                  <BagIcon className="w-7 h-7 text-slate-700 group-hover:text-blue-600 transition-colors" />
                  {mounted && cartItems.length > 0 && (
                    <Badge value={cartItems.length} />
                  )}
                </div>
                {mounted && subtotal > 0 && (
                  <span className="hidden lg:inline text-base font-bold text-slate-900">
                    ${(subtotal / 100).toFixed(2)}
                  </span>
                )}
              </button>
            
              {/* Divider */}
              <div className="h-10 w-px bg-slate-200"></div>

              {/* User Menu or Sign Up */}
              {status === 'loading' ? (
                <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-base font-bold shadow-sm">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden xl:flex flex-col items-start">
                      <span className="text-xs text-slate-500 font-medium">Account</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {session.user?.name?.split(' ')[0]}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-slate-400 hidden xl:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 overflow-hidden">
                      <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                        <p className="text-base font-bold text-slate-900">{session.user?.name}</p>
                        <p className="text-xs text-slate-600 mt-1">{session.user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/account"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium">My Account</span>
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span className="font-medium">My Orders</span>
                        </Link>
                      </div>
                      <div className="border-t border-slate-200 pt-2 mt-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/signup"
                  className="relative group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}
