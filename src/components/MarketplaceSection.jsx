import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import ProductCard from "./ProductCard";

function MarketplaceSection({
  products,
  searchQuery = "",
  searchVersion = 0,
  onClearSearch,
  favorites,
  onToggleFavorite,
  notifications,
  onNotifyAvailability,
}) {
  const [localSearch, setLocalSearch] =
    useState(searchQuery);

  const [category, setCategory] =
    useState("All categories");

  const [sortBy, setSortBy] =
    useState("Newest first");

  const categories = [
    "All categories",
    "Books",
    "Electronics",
    "Lab Equipment",
    "Furniture",
    "Sports",
    "Accessories",
    "Clothing",
    "Other",
  ];

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery, searchVersion]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const query = localSearch
      .trim()
      .toLowerCase();

    if (query) {
      result = result.filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          product.condition,
          product.description,
          product.seller?.name,
          product.seller?.location,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    if (category !== "All categories") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    if (sortBy === "Newest first") {
      result.sort((a, b) => {
        const dateA = new Date(
          a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      });
    }

    if (sortBy === "Price: Low to High") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sortBy === "Price: High to Low") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sortBy === "Name: A to Z") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [
    products,
    localSearch,
    category,
    sortBy,
  ]);

  const featuredProducts =
    filteredProducts.slice(0, 6);

  const clearSearch = () => {
    setLocalSearch("");

    if (onClearSearch) {
      onClearSearch();
    }
  };

  const clearFilters = () => {
    setLocalSearch("");
    setCategory("All categories");
    setSortBy("Newest first");

    if (onClearSearch) {
      onClearSearch();
    }
  };

  const hasFilters =
    localSearch.trim() !== "" ||
    category !== "All categories" ||
    sortBy !== "Newest first";

  return (
    <section
      id="marketplace"
      className="relative min-h-screen bg-transparent py-20 transition-colors duration-300 dark:bg-transparent"
    >
      {/* LIGHT MODE REFLECTION */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
      >
        <div className="absolute left-[-15%] top-[10%] h-[32rem] w-[32rem] rounded-full bg-blue-200/20 blur-[110px] dark:hidden" />

        <div className="absolute right-[-12%] top-[5%] h-[34rem] w-[34rem] rounded-full bg-indigo-200/20 blur-[120px] dark:hidden" />

        <div className="absolute bottom-[-10%] left-[35%] h-[30rem] w-[30rem] rounded-full bg-sky-100/30 blur-[120px] dark:hidden" />
      </div>

      <div className="relative z-[2] mx-auto max-w-6xl px-6 lg:px-8">
        {/* SECTION HEADING */}
        <div className="border-b border-slate-200 pb-8 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500">
            Marketplace
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Recently listed
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Discover useful things your fellow
                students are selling around campus.
              </p>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            {/* SEARCH */}
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />

              <input
                type="text"
                value={localSearch}
                onChange={(event) =>
                  setLocalSearch(
                    event.target.value
                  )
                }
                placeholder="Search listings..."
                aria-label="Search marketplace listings"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />

              {localSearch && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* CATEGORY */}
            <div className="relative">
              <SlidersHorizontal
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                aria-label="Filter by category"
                className="h-11 w-full min-w-[165px] appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* SORT */}
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              aria-label="Sort listings"
              className="h-11 min-w-[165px] rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option>
                Newest first
              </option>

              <option>
                Price: Low to High
              </option>

              <option>
                Price: High to Low
              </option>

              <option>
                Name: A to Z
              </option>
            </select>
          </div>
        </div>

        {/* RESULT COUNT */}
        <div className="mt-7 flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-950 dark:text-white">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1
              ? "listing"
              : "listings"}{" "}
            found
          </p>

          <div className="flex items-center gap-4">
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-slate-500 underline underline-offset-4 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                Clear filters
              </button>
            )}

            <Link
              to="/marketplace"
              className="group flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              View all listings

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* PRODUCT GRID */}
        {featuredProducts.length > 0 ? (
          <>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(
                    product.id
                  )}
                  onToggleFavorite={
                    onToggleFavorite
                  }
                  notifications={notifications}
                  onNotifyAvailability={
                    onNotifyAvailability
                  }
                />
              ))}
            </div>

            {/* MORE RESULTS */}
            {filteredProducts.length > 6 && (
              <div className="mt-8 flex justify-center">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400"
                >
                  View all {filteredProducts.length}{" "}
                  listings

                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Search size={20} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">
              No listings found
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No products match your current search or
              category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default MarketplaceSection;