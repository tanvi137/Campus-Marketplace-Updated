import {
  ChevronDown,
  Filter,
  Heart,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import ProductGrid from "../components/ProductGrid";

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

const sortOptions = [
  "Newest first",
  "Price: Low to High",
  "Price: High to Low",
  "Name: A to Z",
];

function Favorites({
  products,
  favorites = [],
  onToggleFavorite,
  notifications = [],
  onNotifyAvailability,
}) {
  const [searchQuery, setSearchQuery] =
    useState("");

  const [category, setCategory] =
    useState("All categories");

  const [sortBy, setSortBy] =
    useState("Newest first");

  const favoriteProducts = useMemo(() => {
    let result = products.filter((product) =>
      favorites.includes(product.id)
    );

    const query = searchQuery
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
    favorites,
    searchQuery,
    category,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("All categories");
    setSortBy("Newest first");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    category !== "All categories" ||
    sortBy !== "Newest first";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-transparent dark:text-slate-100">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-transparent">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-1/2 h-72 w-72 rounded-full bg-red-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                  <Heart
                    size={21}
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                    Your collection
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
                    Saved{" "}
                    <span className="text-indigo-500">
                      Items
                    </span>
                  </h1>
                </div>
              </div>

              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Keep track of the products you want to
                come back to later.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                Saved items
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                {favorites.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative min-h-[50vh] overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-transparent">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          {favoriteProducts.length > 0 ||
          hasActiveFilters ? (
            <>
              {/* Filters */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value
                        )
                      }
                      placeholder="Search saved items..."
                      aria-label="Search saved items"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                    />

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearchQuery("")
                        }
                        aria-label="Clear search"
                        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <Filter
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      value={category}
                      onChange={(event) =>
                        setCategory(
                          event.target.value
                        )
                      }
                      aria-label="Filter favorites by category"
                      className="h-11 w-full min-w-[175px] appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                      {categories.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="relative">
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(
                          event.target.value
                        )
                      }
                      aria-label="Sort favorites"
                      className="h-11 w-full min-w-[175px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-9 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                      {sortOptions.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Showing{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {favoriteProducts.length}
                      </span>{" "}
                      matching saved{" "}
                      {favoriteProducts.length === 1
                        ? "item"
                        : "items"}
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-semibold text-slate-500 underline underline-offset-4 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {/* Products */}
              {favoriteProducts.length > 0 ? (
                <>
                  <div className="mb-7 mt-8 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-950 dark:text-white">
                        {favoriteProducts.length}
                      </span>{" "}
                      {favoriteProducts.length === 1
                        ? "saved item"
                        : "saved items"}
                    </p>

                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      Your saved products
                    </span>
                  </div>

                  <ProductGrid
                    products={favoriteProducts}
                    favorites={favorites}
                    onToggleFavorite={
                      onToggleFavorite
                    }
                    notifications={
                      notifications
                    }
                    onNotifyAvailability={
                      onNotifyAvailability
                    }
                  />
                </>
              ) : (
                <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <Search size={24} />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
                    No matching favorites
                  </h2>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Try another search term or remove
                    your filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty state */
            <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-400 dark:bg-red-500/10 dark:text-red-400">
                <Heart size={24} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
                No favorites yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                When you find something you like, tap the
                heart icon to save it here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Favorites;