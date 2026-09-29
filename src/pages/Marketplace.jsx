import {
  ArrowLeft,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import ProductCard from "../components/ProductCard";

const categories = [
  "All",
  "Books",
  "Electronics",
  "Lab Equipment",
  "Furniture",
  "Clothing",
  "Sports",
  "Accessories",
  "Other",
];

const sortOptions = [
  {
    value: "newest",
    label: "Newest first",
  },
  {
    value: "price-low",
    label: "Price: Low to high",
  },
  {
    value: "price-high",
    label: "Price: High to low",
  },
  {
    value: "name",
    label: "Name: A to Z",
  },
];

function Marketplace({
  products,
  favorites,
  onToggleFavorite,
  notifications,
  onNotifyAvailability,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] =
    useState(false);
  const [availability, setAvailability] =
    useState("all");

  const filteredProducts = useMemo(() => {
    const normalizedQuery =
      searchQuery.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !normalizedQuery ||
        product.name
          .toLowerCase()
          .includes(normalizedQuery) ||
        product.category
          .toLowerCase()
          .includes(normalizedQuery) ||
        product.description
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesAvailability =
        availability === "all" ||
        (availability === "available" &&
          product.inStock) ||
        (availability === "unavailable" &&
          !product.inStock);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });

    return [...result].sort((a, b) => {
      if (sortBy === "price-low") {
        return a.price - b.price;
      }

      if (sortBy === "price-high") {
        return b.price - a.price;
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      const dateA = new Date(
        a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || 0
      ).getTime();

      return dateB - dateA;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    sortBy,
    availability,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("newest");
    setAvailability("all");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    availability !== "all" ||
    sortBy !== "newest";

  return (
    <main className="min-h-screen bg-transparent text-slate-950 transition-colors duration-300 dark:bg-transparent dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        {/* Back navigation */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to home
        </Link>

        {/* Header */}
        <section className="mt-9">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                Campus marketplace
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Find what you need
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Browse books, electronics, lab equipment,
                and other essentials listed by students.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                Results
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                {filteredProducts.length}
              </p>
            </div>
          </div>
        </section>

        {/* Search + controls */}
        <section className="mt-9">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search products, categories, or descriptions..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              type="button"
              onClick={() =>
                setShowFilters((current) => !current)
              }
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-semibold transition-colors ${
                showFilters
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>

            {/* Sort */}
            <div className="relative">
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 pl-4 pr-10 text-sm font-semibold text-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:w-52"
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Filter
                      size={16}
                      className="text-indigo-600 dark:text-indigo-400"
                    />

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Category
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() =>
                          setSelectedCategory(category)
                        }
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                          selectedCategory === category
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:w-64">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Availability
                  </p>

                  <select
                    value={availability}
                    onChange={(event) =>
                      setAvailability(
                        event.target.value
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                  >
                    <option value="all">
                      All products
                    </option>

                    <option value="available">
                      Available only
                    </option>

                    <option value="unavailable">
                      Out of stock
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Active filter summary */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Active:
              </span>

              {searchQuery.trim() && (
                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  Search: {searchQuery}
                </span>
              )}

              {selectedCategory !== "All" && (
                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  {selectedCategory}
                </span>
              )}

              {availability !== "all" && (
                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  {availability === "available"
                    ? "Available"
                    : "Out of stock"}
                </span>
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="ml-1 text-xs font-semibold text-slate-500 underline underline-offset-4 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* Product grid */}
        <section className="mt-10">
          {filteredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
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
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <Search size={24} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
                No products found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Try a different search term or remove some
                filters to see more listings.
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Marketplace;