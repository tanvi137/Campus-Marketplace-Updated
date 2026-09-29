import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  Menu,
  Moon,
  Plus,
  ShoppingBag,
  Sun,
  X,
} from "lucide-react";
import { useState } from "react";

function Navbar({
  favorites = [],
  theme = "light",
  onToggleTheme,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const location = useLocation();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isDark = theme === "dark";

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const navLinkClass = (active) =>
    `relative text-sm font-medium transition-colors ${
      active
        ? isDark
          ? "text-stone-50"
          : "text-stone-900"
        : isDark
          ? "text-stone-300 hover:text-stone-100"
          : "text-stone-600 hover:text-stone-900"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        isDark
          ? "border-stone-800/80 bg-[#0d0b09]/85"
          : "border-stone-200/90 bg-[#f7f3ee]/80"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-3"
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 group-hover:-translate-y-0.5 ${
              isDark
                ? "border-stone-700 bg-stone-900 text-stone-100"
                : "border-stone-200 bg-white text-stone-900"
            }`}
          >
            <ShoppingBag size={18} strokeWidth={2} />
          </div>

          <div className="leading-none">
            <span className={`block text-[17px] font-semibold tracking-[-0.04em] ${isDark ? "text-stone-50" : "text-stone-900"}`}>
              CampusMart
            </span>
            <span className={`mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-stone-400" : "text-stone-500"}`}>
              Student marketplace
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link to="/" className={navLinkClass(isActive("/"))}>
            Browse
          </Link>
          <Link to="/my-listings" className={navLinkClass(isActive("/my-listings"))}>
            My Listings
          </Link>
          <Link to="/favorites" className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${isActive("/favorites") ? (isDark ? "text-stone-50" : "text-stone-900") : (isDark ? "text-stone-300 hover:text-stone-100" : "text-stone-600 hover:text-stone-900")}`}>
            <Heart size={15} fill={favorites.length > 0 ? "currentColor" : "none"} strokeWidth={2} />
            Favorites
            {favorites.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b86d4d] px-1.5 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
              isDark
                ? "border-stone-700 bg-stone-900 text-stone-100 hover:border-stone-600 hover:bg-stone-800"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-100"
            }`}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <Link
            to="/sell"
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              isDark
                ? "bg-stone-100 text-stone-900 hover:bg-white"
                : "bg-stone-900 text-white hover:bg-[#4c362d]"
            }`}
          >
            <Plus size={17} strokeWidth={2.5} />
            Sell an item
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
              isDark ? "border-stone-700 bg-stone-900 text-stone-100" : "border-stone-200 bg-white text-stone-700"
            }`}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
              isDark ? "border-stone-700 bg-stone-900 text-stone-100" : "border-stone-200 bg-white text-stone-700"
            }`}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`border-t md:hidden ${isDark ? "border-stone-800 bg-[#0d0b09]" : "border-stone-200 bg-[#f7f3ee]"}`}>
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-4">
            <Link to="/" onClick={closeMobileMenu} className={`py-3 text-sm font-medium ${isDark ? "text-stone-200" : "text-stone-700"}`}>
              Browse
            </Link>
            <Link to="/my-listings" onClick={closeMobileMenu} className={`py-3 text-sm font-medium ${isDark ? "text-stone-200" : "text-stone-700"}`}>
              My Listings
            </Link>
            <Link to="/favorites" onClick={closeMobileMenu} className={`py-3 text-sm font-medium ${isDark ? "text-stone-200" : "text-stone-700"}`}>
              Favorites
            </Link>
            <Link to="/sell" onClick={closeMobileMenu} className={`mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${isDark ? "bg-stone-100 text-stone-900" : "bg-stone-900 text-white"}`}>
              <Plus size={17} strokeWidth={2.5} />
              Sell an item
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;