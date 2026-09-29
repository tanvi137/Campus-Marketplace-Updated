import ProductCard from "./ProductCard";

function ProductGrid({
  products,
  favorites = [],
  onToggleFavorite,
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center transition-colors dark:border-slate-700 dark:bg-[#0b1120]">
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
          No products found
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Try changing your search or category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favorites.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

export default ProductGrid;