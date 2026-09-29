import {
  ArrowRight,
  Heart,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function Hero({
  products = [],
  favorites = [],
  onToggleFavorite,
  onSearch,
  onCategorySelect,
  theme = "light",
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isDark = theme === "dark";

  const featuredProducts = useMemo(() => {
    return products.slice(0, Math.min(products.length, 6));
  }, [products]);

  useEffect(() => {
    if (featuredProducts.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const activeProduct = featuredProducts[activeIndex] || products[0];

  const floatingProducts = useMemo(() => {
    if (!featuredProducts.length) return [];

    return featuredProducts.filter((product) => product.id !== activeProduct?.id).slice(0, 3);
  }, [featuredProducts, activeProduct]);

  const suggestions = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) return [];

    const normalize = (value) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const categories = [
      "Books",
      "Electronics",
      "Lab Equipment",
      "Furniture",
      "Clothing",
      "Sports",
      "Accessories",
      "Other",
    ];

    const queryWords = normalize(trimmedQuery).split(" ").filter(Boolean);

    const getSimilarityScore = (first, second) => {
      const a = normalize(first);
      const b = normalize(second);

      if (a === b) return 100;
      if (a.includes(b) || b.includes(a)) return 80;

      const bWords = b.split(" ");
      let matchedWords = 0;

      queryWords.forEach((queryWord) => {
        const matched = bWords.some((word) => {
          if (word.startsWith(queryWord) || queryWord.startsWith(word)) return true;
          if (queryWord.length >= 3 && word.length >= 3) {
            let differences = 0;
            const maxLength = Math.max(queryWord.length, word.length);

            for (let index = 0; index < maxLength; index += 1) {
              if (queryWord[index] !== word[index]) differences += 1;
            }

            return differences <= 1;
          }

          return false;
        });

        if (matched) matchedWords += 1;
      });

      if (queryWords.length > 0 && matchedWords === queryWords.length) return 70;
      if (queryWords.length > 0 && matchedWords > 0) return 45;

      return 0;
    };

    const categorySuggestions = categories
      .map((category) => ({
        type: "category",
        label: category,
        category,
        score: getSimilarityScore(trimmedQuery, category),
      }))
      .filter((item) => item.score > 0);

    const productSuggestions = products
      .map((product) => ({
        type: "product",
        label: product.name,
        category: product.category,
        productId: product.id,
        score: Math.max(
          getSimilarityScore(trimmedQuery, product.name),
          getSimilarityScore(trimmedQuery, product.category)
        ),
      }))
      .filter((item) => item.score > 0);

    const combined = [...categorySuggestions, ...productSuggestions];
    const unique = [];

    combined
      .sort((a, b) => b.score - a.score)
      .forEach((item) => {
        const alreadyExists = unique.some(
          (existing) => existing.type === item.type && existing.label === item.label
        );

        if (!alreadyExists) unique.push(item);
      });

    return unique.slice(0, 6);
  }, [query, products]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const correctedCategory = suggestions.find(
      (suggestion) =>
        suggestion.type === "category" && suggestion.score >= 70
    );

    setShowSuggestions(false);

    if (correctedCategory) {
      setQuery(correctedCategory.category);
      onCategorySelect(correctedCategory.category);
      return;
    }

    onSearch(query);
  };

  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);

    if (suggestion.type === "category") {
      setQuery(suggestion.category);
      onCategorySelect(suggestion.category);
      return;
    }

    setQuery(suggestion.label);
    onSearch(suggestion.label);
  };

  const handleHeroFavorite = (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite(productId);
  };

  if (!activeProduct) return null;

  const isActiveFavorite = favorites.includes(activeProduct.id);

  return (
    <section className="relative overflow-hidden">
      {!isDark && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full bg-[#d9c2ad]/25 blur-[110px]" />
          <div className="absolute -left-28 top-20 h-[22rem] w-[22rem] rounded-full bg-[#dacfb6]/25 blur-[120px]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#f5f1ea] to-transparent" />
        </div>
      )}

      {isDark && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-36 top-20 h-[22rem] w-[22rem] rounded-full bg-stone-900 blur-3xl" />
          <div className="absolute right-0 top-0 h-[24rem] w-[24rem] rounded-full bg-[#201612]/80 blur-[120px]" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pb-20 lg:px-10 lg:pb-18 lg:pt-10">
        <div className="grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
          <div className="relative z-10">
            <div className={`mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] ${isDark ? "border-stone-700 bg-stone-900 text-stone-200" : "border-stone-200 bg-white/90 text-stone-600"}`}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#b86d4d] text-white">
                <Sparkles size={10} strokeWidth={2.5} />
              </span>
              Built for campus life
            </div>

            <h1 className={`max-w-xl text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-[5rem] ${isDark ? "text-stone-50" : "text-stone-900"}`}>
              CampusMart
              <span className="mt-2 block text-stone-500">The things we have.</span>
              <span className="mt-2 block text-stone-500">The things we need.</span>
            </h1>

            <p className={`mt-7 max-w-xl text-base leading-7 ${isDark ? "text-stone-300" : "text-stone-600"}`}>
              Buy, sell, and discover the everyday essentials students actually use — from books and laptops to furniture, lab gear, and the little things that make campus life easier.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#4c362d] dark:bg-stone-100 dark:text-stone-900"
              >
                Explore listings
                <ArrowRight size={16} />
              </Link>

            </div>

            <form onSubmit={handleSubmit} className="relative mt-8 max-w-xl">
              <div className={`flex items-center gap-3 rounded-[1.6rem] border px-3 py-2.5 ${isDark ? "border-stone-700 bg-stone-900/80" : "border-stone-200 bg-white/85"}`}>
                <Search size={18} className={isDark ? "text-stone-400" : "text-stone-500"} />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setShowSuggestions(event.target.value.trim().length > 0);
                  }}
                  onFocus={() => query.trim() && setShowSuggestions(true)}
                  placeholder="Search campus essentials"
                  className={`w-full bg-transparent py-2 text-sm outline-none ${isDark ? "text-stone-100 placeholder:text-stone-500" : "text-stone-900 placeholder:text-stone-400"}`}
                  aria-label="Search marketplace"
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setShowSuggestions(false);
                    }}
                    aria-label="Clear search"
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-lg ${isDark ? "text-stone-400 hover:bg-stone-800 hover:text-stone-200" : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"}`}
                  >
                    ×
                  </button>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#b86d4d] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#9a5d41]"
                >
                  Search
                </button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className={`absolute left-0 right-0 top-[calc(100%+0.6rem)] overflow-hidden rounded-[1.3rem] border ${isDark ? "border-stone-700 bg-stone-950" : "border-stone-200 bg-white"}`}>
                  {suggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.type}-${suggestion.label}`}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors ${isDark ? "text-stone-200 hover:bg-stone-900" : "text-stone-700 hover:bg-stone-100"}`}
                    >
                      <span>{suggestion.label}</span>
                      <span className={`text-[10px] uppercase tracking-[0.18em] ${isDark ? "text-stone-500" : "text-stone-400"}`}>
                        {suggestion.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          <div className="relative z-10">
            <div className="relative mx-auto h-[540px] max-w-[620px]">
              <div className={`absolute inset-6 rounded-[2.5rem] border ${isDark ? "border-stone-800 bg-stone-900/40" : "border-stone-200 bg-white/40"}`} />

              <div className={`absolute left-8 top-8 z-20 overflow-hidden rounded-[2rem] border shadow-[0_30px_60px_rgba(15,23,42,0.12)] ${isDark ? "border-stone-700 bg-stone-950" : "border-stone-200 bg-white"}`} style={{ width: "62%", transform: "rotate(-9deg)" }}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={activeProduct.image} alt={activeProduct.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                    {activeProduct.category}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-stone-200">Featured</p>
                        <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">{activeProduct.name}</h3>
                      </div>
                      <span className="text-lg font-semibold">₹{activeProduct.price.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {floatingProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute overflow-hidden rounded-[1.5rem] border shadow-[0_18px_40px_rgba(15,23,42,0.1)] ${isDark ? "border-stone-700 bg-stone-900" : "border-stone-200 bg-white"}`}
                  style={{
                    width: index === 0 ? "36%" : "30%",
                    right: index === 0 ? "32px" : index === 1 ? "110px" : "28px",
                    top: index === 0 ? "40px" : index === 1 ? "180px" : "270px",
                    transform: index === 0 ? "rotate(8deg)" : index === 1 ? "rotate(-5deg)" : "rotate(7deg)",
                  }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(event) => handleHeroFavorite(event, product.id)}
                      aria-label={favorites.includes(product.id) ? "Remove from favourites" : "Add to favourites"}
                      className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border ${favorites.includes(product.id) ? "border-red-500 bg-red-500 text-white" : isDark ? "border-stone-700 bg-stone-950/80 text-stone-100" : "border-white/80 bg-white/80 text-stone-700"}`}
                    >
                      <Heart size={14} fill={favorites.includes(product.id) ? "currentColor" : "none"} strokeWidth={2} />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent p-3 text-white">
                      <p className="text-[9px] uppercase tracking-[0.16em] text-stone-200">{product.category}</p>
                      <p className="mt-2 text-sm font-medium">{product.name}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className={`absolute bottom-3 left-4 rounded-[1.3rem] border px-4 py-3 ${isDark ? "border-stone-700 bg-stone-900/80" : "border-stone-200 bg-white/85"}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${isDark ? "bg-stone-800 text-stone-100" : "bg-stone-900 text-white"}`}>
                    {activeProduct.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase tracking-[0.2em] ${isDark ? "text-stone-400" : "text-stone-500"}`}>Campus pick</p>
                    <p className={`mt-0.5 text-sm font-medium ${isDark ? "text-stone-200" : "text-stone-800"}`}>
                      {activeProduct.seller?.location || "On campus"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(event) => handleHeroFavorite(event, activeProduct.id)}
                className={`absolute right-8 top-10 flex h-12 w-12 items-center justify-center rounded-full border ${isActiveFavorite ? "border-red-500 bg-red-500 text-white" : isDark ? "border-stone-700 bg-stone-900 text-stone-100" : "border-stone-200 bg-white text-stone-700"}`}
                aria-label={isActiveFavorite ? "Remove from favourites" : "Add to favourites"}
              >
                <Heart size={18} fill={isActiveFavorite ? "currentColor" : "none"} strokeWidth={2} />
              </button>

              <Link
                to={`/product/${activeProduct.id}`}
                className={`absolute bottom-8 right-8 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${isDark ? "border-stone-700 bg-stone-900 text-stone-100" : "border-stone-200 bg-white text-stone-800"}`}
              >
                <MapPin size={14} />
                View listing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
