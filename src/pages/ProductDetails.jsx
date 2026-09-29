import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";

function ProductDetails({
  products,
  favorites = [],
  onToggleFavorite,
  notifications = [],
  onNotifyAvailability,
}) {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === id
  );

  const isOutOfStock =
    product?.inStock === false;

  const [notificationEnabled, setNotificationEnabled] =
    useState(false);

  useEffect(() => {
    if (!product) {
      return;
    }

    try {
      const saved = localStorage.getItem(
        "campusmart-stock-notifications"
      );

      const notificationIds = saved
        ? JSON.parse(saved)
        : [];

      setNotificationEnabled(
        notificationIds.includes(product.id)
      );
    } catch (error) {
      console.error(
        "Unable to read notification state:",
        error
      );

      setNotificationEnabled(false);
    }
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-20 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <MessageCircle size={24} />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Listing not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            This listing may have been removed or the
            link may be incorrect.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-500 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to marketplace
          </Link>
        </div>
      </main>
    );
  }

  const sellerEmail = product.seller?.email || "";

  const isFavorite = favorites.includes(product.id);

  const relatedProducts = products.filter(
    (item) =>
      item.id !== product.id &&
      item.category === product.category
  );

  const productPageUrl = `${window.location.origin}/product/${product.id}`;

  const isRemoteImage =
    typeof product.image === "string" &&
    /^https?:\/\//i.test(product.image);

  const emailSubject = `Interested in: ${product.name}`;

  const imageSection = isRemoteImage
    ? `VIEW PRODUCT IMAGE
------------------------------
${product.image}

`
    : `VIEW PRODUCT IMAGE
------------------------------
The product image is available on the CampusMart listing.

${productPageUrl}

`;

  const emailBody = `Hi ${
    product.seller?.name || "Seller"
  },

I'm interested in this CampusMart listing.

PRODUCT DETAILS
------------------------------
Product: ${product.name}
Price: ₹${product.price.toLocaleString("en-IN")}
Condition: ${product.condition}
Category: ${product.category}
Seller: ${product.seller?.name || "Seller"}

${imageSection}VIEW CAMPUSMART LISTING
------------------------------
${productPageUrl}

Is this item still available?

Thanks!`;

  const mailtoLink = sellerEmail
    ? `mailto:${sellerEmail}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`
    : "#";

  const handleFavorite = () => {
    onToggleFavorite(product.id);
  };

  const handleNotifyToggle = () => {
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
            (notificationId) =>
              notificationId !== product.id
          );

        localStorage.setItem(
          "campusmart-stock-notifications",
          JSON.stringify(updatedNotifications)
        );

        setNotificationEnabled(false);

        return;
      }

      const updatedNotifications =
        notificationIds.includes(product.id)
          ? notificationIds
          : [
              ...notificationIds,
              product.id,
            ];

      localStorage.setItem(
        "campusmart-stock-notifications",
        JSON.stringify(updatedNotifications)
      );

      setNotificationEnabled(true);

      if (onNotifyAvailability) {
        onNotifyAvailability(product.id);
      }
    } catch (error) {
      console.error(
        "Unable to update stock notification:",
        error
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        {/* Back */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to marketplace
        </Link>

        {/* Product */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
            <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800 sm:min-h-[520px]">
              <img
                src={product.image}
                alt={product.name}
                className={`h-full max-h-[520px] w-full object-contain ${
                  isOutOfStock
                    ? "grayscale-[30%] opacity-80"
                    : ""
                }`}
              />

              {/* Category */}
              <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-200">
                {product.category}
              </span>

              {/* Availability */}
              <span
                className={`absolute bottom-5 left-5 rounded-full px-3.5 py-2 text-xs font-bold shadow-sm backdrop-blur-sm ${
                  isOutOfStock
                    ? "bg-slate-950/90 text-white"
                    : "bg-emerald-50/95 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                }`}
              >
                {isOutOfStock
                  ? "Out of stock"
                  : "Available"}
              </span>

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
                className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-105 ${
                  isFavorite
                    ? "bg-white/95 text-red-500 dark:bg-slate-900/90 dark:text-red-500"
                    : "bg-white/95 text-slate-600 hover:text-slate-950 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                <Heart
                  size={20}
                  fill={
                    isFavorite
                      ? "currentColor"
                      : "none"
                  }
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>

          {/* Information */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_50px_rgba(0,0,0,0.25)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isOutOfStock
                    ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                }`}
              >
                {isOutOfStock
                  ? "Currently unavailable"
                  : "Available now"}
              </span>

              <button
                type="button"
                onClick={handleFavorite}
                aria-label={
                  isFavorite
                    ? "Remove from favourites"
                    : "Add to favourites"
                }
                aria-pressed={isFavorite}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all hover:scale-105 ${
                  isFavorite
                    ? "border-red-100 bg-red-50 text-red-500 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white"
                }`}
              >
                <Heart
                  size={18}
                  fill={
                    isFavorite
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span
                className={`text-3xl font-bold tracking-tight ${
                  isOutOfStock
                    ? "text-slate-500 dark:text-slate-500"
                    : "text-slate-950 dark:text-white"
                }`}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {product.condition}
              </span>
            </div>

            {/* Availability notice */}
            {isOutOfStock ? (
              <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-start gap-3">
                  <Bell
                    size={18}
                    className="mt-0.5 shrink-0 text-slate-500 dark:text-slate-400"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      This item is currently out of stock
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Get notified when the seller makes
                      this item available again.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNotifyToggle}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                    notificationEnabled
                      ? "border-indigo-100 bg-indigo-50 text-indigo-600 hover:border-indigo-200 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                  }`}
                >
                  <Bell
                    size={17}
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
              </div>
            ) : (
              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <CheckCircle2
                  size={19}
                  className="shrink-0 text-emerald-600 dark:text-emerald-400"
                />

                <div>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    This item is available
                  </p>

                  <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                    You can contact the seller about this
                    listing.
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-8 border-t border-slate-100 pt-7 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                About this item
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                {product.description}
              </p>
            </div>

            {/* Seller */}
            <div className="mt-8 border-t border-slate-100 pt-7 dark:border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                Seller
              </p>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                    {product.seller?.name ||
                      "Student Seller"}
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                    <MapPin size={13} />

                    {product.seller?.location ||
                      "Campus"}
                  </div>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {(
                    product.seller?.name ||
                    "S"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>
              </div>
            </div>

            {/* Contact */}
            {isOutOfStock ? (
              <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Contact seller after availability
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
                  This listing is currently unavailable.
                </p>
              </div>
            ) : sellerEmail ? (
              <>
                <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                  <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    Email includes listing details
                  </p>

                  <p className="mt-1 text-xs leading-5 text-indigo-600 dark:text-indigo-400">
                    Product details, image access, and a
                    direct CampusMart listing link are
                    included.
                  </p>
                </div>

                <a
                  href={mailtoLink}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-md dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-500 dark:hover:text-white"
                >
                  <Mail size={18} />
                  Contact Seller
                </a>
              </>
            ) : (
              <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                Seller contact information is not
                available for this listing.
              </div>
            )}

            {/* Trust information */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-950">
                <ShieldCheck
                  size={17}
                  className="shrink-0 text-slate-500 dark:text-slate-400"
                />

                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Campus marketplace
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-950">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-slate-500 dark:text-slate-400"
                />

                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Student listing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800 lg:mt-20 lg:pt-16">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                You may also like
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                More in {product.category}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Explore other listings from the same
                category.
              </p>
            </div>

            <ProductGrid
              products={relatedProducts.slice(0, 3)}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              notifications={notifications}
              onNotifyAvailability={
                onNotifyAvailability
              }
            />
          </section>
        )}
      </div>
    </main>
  );
}

export default ProductDetails;