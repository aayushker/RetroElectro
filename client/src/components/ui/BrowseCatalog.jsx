import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { getProducts } from "../../services/api";

const formatInr = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const normalizeText = (value) => String(value || "").toLowerCase();

function BrowseCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProducts({ limit: 120 });
        setProducts(response.data?.data || []);
      } catch (requestError) {
        setError(requestError.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const maxObservedPrice = useMemo(
    () =>
      Math.max(...products.map((product) => Number(product.priceInr || 0)), 0),
    [products],
  );

  const categories = useMemo(() => {
    const set = new Set(
      products
        .map((product) => normalizeText(product.category))
        .filter(Boolean),
    );
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  const stats = useMemo(() => {
    const brands = new Set(
      products.map((product) => normalizeText(product.brand)).filter(Boolean),
    );
    const averageRating =
      products.length === 0
        ? 0
        : products.reduce(
            (acc, product) => acc + Number(product.rating || 0),
            0,
          ) / products.length;

    return {
      totalProducts: products.length,
      brands: brands.size,
      averageRating,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    const activeMaxPrice = maxPrice === "" ? null : Number(maxPrice);

    const list = products.filter((product) => {
      const queryMatched =
        !normalizedQuery ||
        [
          product.title,
          product.brand,
          product.modelName,
          product.processor,
          Array.isArray(product.tags) ? product.tags.join(" ") : "",
        ]
          .map(normalizeText)
          .some((value) => value.includes(normalizedQuery));

      const categoryMatched =
        category === "all" || normalizeText(product.category) === category;

      const priceMatched =
        activeMaxPrice === null ||
        Number(product.priceInr || 0) <= activeMaxPrice;

      return queryMatched && categoryMatched && priceMatched;
    });

    list.sort((a, b) => {
      if (sortBy === "price-asc") {
        return Number(a.priceInr || 0) - Number(b.priceInr || 0);
      }

      if (sortBy === "price-desc") {
        return Number(b.priceInr || 0) - Number(a.priceInr || 0);
      }

      if (sortBy === "latest") {
        return Number(b.launchedYear || 0) - Number(a.launchedYear || 0);
      }

      return Number(b.rating || 0) - Number(a.rating || 0);
    });

    return list;
  }, [category, maxPrice, products, query, sortBy]);

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setMaxPrice("");
    setSortBy("rating");
  };

  if (loading) {
    return (
      <section className="bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-white px-6 py-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-rose-700">
            Unable to load catalog
          </h2>
          <p className="mt-2 text-slate-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[radial-gradient(circle_at_top_right,_#d1fae5_0,_#eff6ff_40%,_#f8fafc_75%)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-8 rounded-3xl border border-cyan-100 bg-white/85 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Browse
              </p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
                Explore the RetroElectro Catalog
              </h1>
              <p className="mt-2 max-w-3xl text-slate-600">
                Filter by price, category, and priorities, then jump into
                Compare with one click.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-cyan-50 px-4 py-2 font-semibold text-cyan-700">
                {stats.totalProducts} products
              </span>
              <span className="rounded-full bg-emerald-50 px-4 py-2 font-semibold text-emerald-700">
                {stats.brands} brands
              </span>
              <span className="rounded-full bg-amber-50 px-4 py-2 font-semibold text-amber-700">
                Avg rating {stats.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </header>

        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">
                Search
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                placeholder="Try: camera phone, gaming, AMOLED"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">
                Category
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All categories" : item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">
                Max Price
              </span>
              <input
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                type="number"
                min="0"
                placeholder={
                  maxObservedPrice ? String(maxObservedPrice) : "50000"
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
              <p className="mt-1 text-xs text-slate-500">
                Budget cap{" "}
                {maxPrice === ""
                  ? "disabled"
                  : formatInr(Number(maxPrice || 0))}
              </p>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">
                Sort By
              </span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              >
                <option value="rating">Highest rating</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="latest">Latest launch</option>
              </select>
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Reset
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              No products match these filters
            </h2>
            <p className="mt-2 text-slate-600">
              Try widening your budget or using a broader search phrase.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm font-medium text-slate-600">
              Showing {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="space-y-3">
                  <ProductCard product={product} />
                  <div className="flex items-center justify-between rounded-xl border border-cyan-100 bg-cyan-50/60 px-4 py-2 text-sm">
                    <span className="font-medium text-cyan-800">
                      Want a side-by-side verdict?
                    </span>
                    <Link
                      to={`/compare?ids=${encodeURIComponent(product.id)}`}
                      className="rounded-full bg-cyan-700 px-3 py-1.5 font-semibold text-white transition hover:bg-cyan-600"
                    >
                      Compare
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default BrowseCatalog;
