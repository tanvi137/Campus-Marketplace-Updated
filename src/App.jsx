import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MarketplaceSection from "./components/MarketplaceSection";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Favorites from "./pages/Favorites";
import Sell from "./pages/Sell";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import useLocalStorage from "./hooks/useLocalStorage";
import { initialProducts as seedProducts } from "./data/products";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useLocalStorage("campusmart-theme", "light");
  const [products, setProducts] = useLocalStorage("campusmart-products", seedProducts);
  const [favorites, setFavorites] = useLocalStorage("campusmart-favorites", []);
  const [notifications, setNotifications] = useLocalStorage("campusmart-stock-notifications", []);

  const [stockAlerts, setStockAlerts] = useState([]);
  const [activeStockAlert, setActiveStockAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVersion, setSearchVersion] = useState(0);

  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  const handleToggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    setProducts((currentProducts) => {
      const currentMap = new Map(currentProducts.map((product) => [product.id, product]));

      const mergedProducts = seedProducts.map((seedProduct) => {
        const existingProduct = currentMap.get(seedProduct.id);

        if (!existingProduct) {
          return seedProduct;
        }

        return {
          ...seedProduct,
          ...existingProduct,
          inStock: existingProduct.inStock === false ? false : seedProduct.inStock !== false,
        };
      });

      const customProducts = currentProducts.filter(
        (product) => !seedProducts.some((seedProduct) => seedProduct.id === product.id)
      );

      return [...mergedProducts, ...customProducts];
    });
  }, [setProducts]);

  const handleToggleFavorite = (productId) => {
    setFavorites((currentFavorites) => {
      if (currentFavorites.includes(productId)) {
        return currentFavorites.filter((id) => id !== productId);
      }

      return [...currentFavorites, productId];
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchVersion((currentVersion) => currentVersion + 1);

    setTimeout(() => {
      document.getElementById("marketplace")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleCategorySelect = (category) => {
    setSearchQuery(category);
    setSearchVersion((currentVersion) => currentVersion + 1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchVersion((currentVersion) => currentVersion + 1);
  };

  const handleAddProduct = (product) => {
    const productWithDefaults = {
      ...product,
      ownerId: product.ownerId || "current-user",
      inStock: product.inStock !== false,
    };

    setProducts((currentProducts) => [productWithDefaults, ...currentProducts]);
  };

  const handleDeleteProduct = (productId) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
    setFavorites((currentFavorites) => currentFavorites.filter((id) => id !== productId));
    setNotifications((currentNotifications) => currentNotifications.filter((id) => id !== productId));
    setStockAlerts((currentAlerts) => currentAlerts.filter((alert) => alert.id !== productId));
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((currentProducts) => {
      const previousProduct = currentProducts.find((product) => product.id === updatedProduct.id);

      if (previousProduct?.inStock === false && updatedProduct.inStock !== false) {
        try {
          const savedNotifications = localStorage.getItem("campusmart-stock-notifications");
          const notificationIds = savedNotifications ? JSON.parse(savedNotifications) : [];

          if (notificationIds.includes(updatedProduct.id)) {
            setStockAlerts((currentAlerts) => {
              if (currentAlerts.some((alert) => alert.id === updatedProduct.id)) {
                return currentAlerts;
              }

              return [...currentAlerts, updatedProduct];
            });

            const remainingNotifications = notificationIds.filter((id) => id !== updatedProduct.id);
            localStorage.setItem("campusmart-stock-notifications", JSON.stringify(remainingNotifications));
            setNotifications(remainingNotifications);
          }
        } catch (error) {
          console.error("Unable to process stock notification:", error);
        }
      }

      return currentProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
    });
  };

  const handleNotifyAvailability = (productId) => {
    setNotifications((currentNotifications) => {
      if (currentNotifications.includes(productId)) {
        return currentNotifications;
      }

      return [...currentNotifications, productId];
    });
  };

  const dismissStockAlert = (event) => {
    event.stopPropagation();

    if (!activeStockAlert) {
      return;
    }

    setStockAlerts((currentAlerts) => currentAlerts.filter((alert) => alert.id !== activeStockAlert.id));
    setActiveStockAlert(null);
  };

  const handleStockAlertClick = () => {
    if (!activeStockAlert) {
      return;
    }

    const productId = activeStockAlert.id;

    if (location.pathname === `/product/${productId}`) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setStockAlerts((currentAlerts) => currentAlerts.filter((alert) => alert.id !== productId));
      setActiveStockAlert(null);
      return;
    }

    const productCard = document.getElementById(`product-card-${productId}`);

    if (productCard) {
      productCard.scrollIntoView({ behavior: "smooth", block: "center" });
      productCard.classList.add("ring-2", "ring-[#b86d4d]", "ring-offset-4");

      setTimeout(() => {
        productCard.classList.remove("ring-2", "ring-[#b86d4d]", "ring-offset-4");
      }, 2500);

      setStockAlerts((currentAlerts) => currentAlerts.filter((alert) => alert.id !== productId));
      setActiveStockAlert(null);
      return;
    }

    setStockAlerts((currentAlerts) => currentAlerts.filter((alert) => alert.id !== productId));
    setActiveStockAlert(null);
    navigate(`/product/${productId}`);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 100);
  };

  useEffect(() => {
    if (stockAlerts.length === 0) {
      setActiveStockAlert(null);
      return;
    }

    const latestAlert = stockAlerts[stockAlerts.length - 1];
    setActiveStockAlert(latestAlert);
  }, [stockAlerts]);

  const categoryHighlights = useMemo(
    () => [
      { name: "Books", description: "Course reads and study essentials", count: products.filter((item) => item.category === "Books").length },
      { name: "Electronics", description: "Laptops, accessories, and tech", count: products.filter((item) => item.category === "Electronics").length },
      { name: "Lab Equipment", description: "Practical gear for design and science", count: products.filter((item) => item.category === "Lab Equipment").length },
      { name: "Furniture", description: "Room-ready pieces and study setups", count: products.filter((item) => item.category === "Furniture").length },
    ],
    [products]
  );

  return (
    <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${isDark ? "bg-[#0d0b09] text-stone-100" : "bg-[#f5f1ea] text-stone-900"}`}>
      <div className="relative z-[2]">
        <Navbar favorites={favorites} theme={theme} onToggleTheme={handleToggleTheme} />

        {activeStockAlert && (
          <div className="fixed right-5 top-20 z-[100] w-[calc(100%-2.5rem)] max-w-sm">
            <div className={`relative overflow-hidden rounded-[1.5rem] border ${isDark ? "border-stone-700 bg-stone-900" : "border-stone-200 bg-white"}`}>
              <div className="absolute left-0 top-0 h-full w-1 bg-[#b86d4d]" />
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <button type="button" onClick={handleStockAlertClick} className="min-w-0 flex-1 rounded-xl text-left outline-none focus:ring-2 focus:ring-[#b86d4d] focus:ring-offset-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b86d4d]">Back in stock</p>
                    <p className={`mt-1 text-sm font-semibold ${isDark ? "text-stone-100" : "text-stone-900"}`}>{activeStockAlert.name}</p>
                    <p className={`mt-1 text-xs leading-5 ${isDark ? "text-stone-400" : "text-stone-600"}`}>This item is available again.</p>
                    <p className="mt-3 text-xs font-semibold text-[#b86d4d]">Click to view product →</p>
                  </button>
                  <button type="button" onClick={dismissStockAlert} aria-label="Dismiss notification" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg ${isDark ? "text-stone-400 hover:bg-stone-800 hover:text-stone-100" : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"}`}>
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero
                  products={products}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onSearch={handleSearch}
                  onCategorySelect={handleCategorySelect}
                  theme={theme}
                />

                <section className="mx-auto max-w-7xl px-5 pb-8 pt-5 sm:px-8 lg:px-10 lg:pb-14">
                  <div className="mb-7 flex items-end justify-between gap-4 border-b border-stone-200/80 pb-6 dark:border-stone-800">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500 dark:text-stone-400">01 — Discover</p>
                      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-stone-900 dark:text-stone-100 sm:text-4xl">Curated for campus life</h2>
                    </div>

                    <Link to="/marketplace" className="hidden text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-300 dark:hover:text-white sm:inline-flex">
                      Browse all listings →
                    </Link>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {categoryHighlights.map((category, index) => (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => handleCategorySelect(category.name)}
                        className="group rounded-[1.6rem] border border-stone-200 bg-white/70 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:bg-white dark:border-stone-800 dark:bg-stone-900/60 dark:hover:border-stone-700 dark:hover:bg-stone-900"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">0{index + 2}</span>
                          <span className="text-xl text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-stone-700 dark:text-stone-500 dark:group-hover:text-stone-200">→</span>
                        </div>

                        <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-stone-900 dark:text-stone-100">{category.name}</h3>
                        <p className="mt-3 text-sm leading-6 text-stone-500 dark:text-stone-400">{category.description}</p>

                        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4 text-[10px] font-medium uppercase tracking-[0.18em] text-stone-500 dark:border-stone-800 dark:text-stone-400">
                          <span>{category.count} listings</span>
                          <span>Explore</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
                  <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-[2rem] border border-stone-200 bg-[#f8f3ed] p-6 dark:border-stone-800 dark:bg-stone-900/80 sm:p-8">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500 dark:text-stone-400">02 — Campus moments</p>
                      <h3 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-stone-900 dark:text-stone-100">What students are finding</h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {products.slice(0, 3).map((product, index) => (
                        <Link key={product.id} to={`/product/${product.id}`} className="group overflow-hidden rounded-[1.6rem] border border-stone-200 bg-white transition-transform duration-300 hover:-translate-y-1 dark:border-stone-800 dark:bg-stone-900">
                          <div className="relative aspect-[4/4.2] overflow-hidden">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
                            <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">{index + 1}</div>
                          </div>
                          <div className="p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">{product.category}</p>
                            <h4 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-stone-900 dark:text-stone-100">{product.name}</h4>
                            <div className="mt-3 flex items-center justify-between text-sm text-stone-600 dark:text-stone-300">
                              <span>₹{product.price.toLocaleString("en-IN")}</span>
                              <span className="text-stone-400">→</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
                  <div className="grid gap-6 rounded-[2rem] border border-stone-200 bg-white/80 p-6 dark:border-stone-800 dark:bg-stone-900/70 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">03 — Built for campus life</p>
                      <h3 className="mt-4 max-w-xl text-4xl font-semibold leading-none tracking-[-0.07em] text-stone-900 dark:text-stone-100 sm:text-5xl">A simpler way to trade, save, and discover.</h3>
                    </div>

                    <p className="self-end text-base leading-7 text-stone-600 dark:text-stone-300">
                      CampusMart is a student-first marketplace for the objects that shape everyday study, living, and campus routines. Buy less new, share more locally, and find what you actually need.
                    </p>
                  </div>
                </section>

                <MarketplaceSection
                  products={products}
                  searchQuery={searchQuery}
                  searchVersion={searchVersion}
                  onClearSearch={handleClearSearch}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  notifications={notifications}
                  onNotifyAvailability={handleNotifyAvailability}
                />
              </>
            }
          />

          <Route path="/marketplace" element={<Marketplace products={products} favorites={favorites} onToggleFavorite={handleToggleFavorite} notifications={notifications} onNotifyAvailability={handleNotifyAvailability} />} />
          <Route path="/product/:id" element={<ProductDetails products={products} favorites={favorites} onToggleFavorite={handleToggleFavorite} notifications={notifications} onNotifyAvailability={handleNotifyAvailability} />} />
          <Route path="/favorites" element={<Favorites products={products} favorites={favorites} onToggleFavorite={handleToggleFavorite} notifications={notifications} onNotifyAvailability={handleNotifyAvailability} />} />
          <Route path="/sell" element={<Sell onAddProduct={handleAddProduct} />} />
          <Route path="/my-listings" element={<MyListings products={products} onDeleteProduct={handleDeleteProduct} />} />
          <Route path="/edit/:id" element={<EditListing products={products} onUpdateProduct={handleUpdateProduct} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
