import {
  ArrowLeft,
  Edit3,
  Eye,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function MyListings({ products, onDeleteProduct }) {
  const navigate = useNavigate();

  const myListings = products.filter(
    (product) => product.ownerId === "current-user"
  );

  const handleDelete = (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    onDeleteProduct(product.id);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-transparent dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        {/* Back navigation */}
        <Link
          to="/"
          className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to marketplace
        </Link>

        {/* Header */}
        <section className="mt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
                <Package size={21} />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Seller dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                My listings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Manage the items you've listed on CampusMart.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                Total listings
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                {myListings.length}
              </p>
            </div>
          </div>
        </section>

        {/* Listings */}
        {myListings.length === 0 ? (
          <section className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900 sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Package size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
              No listings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              You haven't listed anything for sale yet. Create
              your first listing and start selling to other
              students.
            </p>

            <Link
              to="/sell"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-md"
            >
              <Plus size={17} />
              Create your first listing
            </Link>
          </section>
        ) : (
          <section className="mt-10">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {myListings.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.09)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_12px_35px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.3)]"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-500">
                        <Package size={42} />
                      </div>
                    )}

                    {/* Availability */}
                    <div className="absolute left-3 top-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-md ${
                          product.inStock
                            ? "bg-emerald-500/95 text-white"
                            : "bg-red-500/95 text-white"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />

                        {product.inStock
                          ? "Available"
                          : "Out of stock"}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="absolute right-3 top-3">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md dark:bg-slate-900/95 dark:text-slate-200">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-bold text-slate-950 dark:text-white">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                          {product.condition}
                        </p>
                      </div>

                      <p className="shrink-0 text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        ₹{product.price}
                      </p>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {product.description}
                    </p>

                    {/* Actions */}
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/product/${product.id}`)
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <Eye size={15} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/edit/${product.id}`)
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default MyListings;