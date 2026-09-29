import {
  ArrowUpRight,
  Bell,
  Heart,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductCard({
  product,
  isFavorite = false,
  onToggleFavorite,
  onNotifyAvailability,
}) {
  const isOutOfStock = product.inStock === false;

  const getSavedNotificationState = () => {
    try {
      const saved = localStorage.getItem(
        "campusmart-stock-notifications"
      );

      const notificationIds = saved
        ? JSON.parse(saved)
        : [];

      return notificationIds.includes(product.id);
    } catch (error) {
      console.error(
        "Unable to read notification state:",
        error
      );

      return false;
    }
  };

  const [notificationEnabled, setNotificationEnabled] =
    useState(getSavedNotificationState);

  useEffect(() => {
    setNotificationEnabled(
      getSavedNotificationState()
    );
  }, [product.id]);

  const handleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onToggleFavorite(product.id);
  };

  const handleNotifyToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const saved = localStorage.getItem(
        "campusmart-stock-notifications"
      );

      const notificationIds = saved
        ? JSON.parse(saved)
        : [];

      if (notificationEnabled) {
        const updatedNotifications =
          notificationIds.filter(
            (id) => id !== product.id
          );

        localStorage.setItem(
          "campusmart-stock-notifications",
          JSON.stringify(updatedNotifications)
        );

        setNotificationEnabled(false);

        return;
      }

      if (!notificationIds.includes(product.id)) {
        const updatedNotifications = [
          ...notificationIds,
          product.id,
        ];

        localStorage.setItem(
          "campusmart-stock-notifications",
          JSON.stringify(updatedNotifications)
        );
      }

      setNotificationEnabled(true);

      if (onNotifyAvailability) {
        onNotifyAvailability(product.id);
      }
    } catch (error) {
      console.error(
        "Unable to update notification:",
        error
      );
    }
  };

  return (
    <article
      id={`product-card-${product.id}`}
      className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 dark:bg-slate-900 ${
        isOutOfStock
          ? "border-slate-200 opacity-75 dark:border-slate-800"
          : "border-slate-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] dark:border-slate-800 dark:hover:border-slate-700 dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.30)]"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {isOutOfStock ? (
          <div
            className="h-full w-full cursor-not-allowed"
            aria-label={`${product.name} is out of stock`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover grayscale-[35%]"
            />
          </div>
        ) : (
          <Link
            to={`/product/${product.id}`}
            aria-label={`View ${product.name}`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        )}

        {/* Category */}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-200">
          {product.category}
        </span>

        {/* Out of stock */}
        {isOutOfStock && (
          <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm backdrop-blur-sm">
            Out of stock
          </span>
        )}

        {/* Favorite */}
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={
            isFavorite
              ? "Remove from favourites"
              : "Add to favourites"
          }
          aria-pressed={isFavorite}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-all hover:scale-105 ${
            isFavorite
              ? "bg-white/95 text-red-500 dark:bg-slate-900/90 dark:text-red-500"
              : "bg-white/95 text-slate-600 hover:text-slate-950 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:text-white"
          }`}
        >
          <Heart
            size={17}
            fill={
              isFavorite
                ? "currentColor"
                : "none"
            }
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Product content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {/* Product name */}
            {isOutOfStock ? (
              <h3 className="truncate text-[15px] font-semibold text-slate-500 dark:text-slate-400">
                {product.name}
              </h3>
            ) : (
              <Link
                to={`/product/${product.id}`}
              >
                <h3 className="truncate text-[15px] font-semibold text-slate-950 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
                  {product.name}
                </h3>
              </Link>
            )}

            {/* Price + condition */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`text-lg font-bold tracking-tight ${
                  isOutOfStock
                    ? "text-slate-500 dark:text-slate-500"
                    : "text-slate-950 dark:text-white"
                }`}
              >
                ₹
                {product.price.toLocaleString(
                  "en-IN"
                )}
              </span>

              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {product.condition}
              </span>
            </div>
          </div>

          {/* Details button */}
          {isOutOfStock ? (
            <button
              type="button"
              disabled
              aria-label="Product unavailable"
              className="flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-600"
            >
              <ArrowUpRight size={16} />
            </button>
          ) : (
            <Link
              to={`/product/${product.id}`}
              aria-label={`View ${product.name}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:bg-indigo-600 dark:hover:text-white"
            >
              <ArrowUpRight size={16} />
            </Link>
          )}
        </div>

        {/* Seller information */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div>
            <p
              className={`text-xs font-semibold ${
                isOutOfStock
                  ? "text-slate-500 dark:text-slate-500"
                  : "text-slate-700 dark:text-slate-200"
              }`}
            >
              {product.seller.name}
            </p>

            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
              <MapPin size={12} />
              {product.seller.location}
            </div>
          </div>

          {isOutOfStock ? (
            <span className="cursor-not-allowed text-xs font-semibold text-slate-300 dark:text-slate-700">
              View details
            </span>
          ) : (
            <Link
              to={`/product/${product.id}`}
              className="text-xs font-semibold text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              View details
            </Link>
          )}
        </div>

        {/* Stock notification */}
        {isOutOfStock && (
          <button
            type="button"
            onClick={handleNotifyToggle}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
              notificationEnabled
                ? "border-indigo-100 bg-indigo-50 text-indigo-600 hover:border-indigo-200 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/20"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
            }`}
          >
            <Bell
              size={15}
              fill={
                notificationEnabled
                  ? "currentColor"
                  : "none"
              }
            />

            {notificationEnabled
              ? "Notification enabled"
              : "Notify me when available"}
          </button>
        )}
      </div>
    </article>
  );
}

export default ProductCard;