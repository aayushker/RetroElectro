import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { getProducts } from "../../services/api";
import PageShell from "./primitives/PageShell";
import SectionHeading from "./primitives/SectionHeading";
import Badge from "./primitives/Badge";
import Input from "./primitives/Input";
import Select from "./primitives/Select";
import Button from "./primitives/Button";
import Skeleton from "./primitives/Skeleton";

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
      <section className="py-10">
        <PageShell>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-72" />
            ))}
          </div>
        </PageShell>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10">
        <PageShell className="text-center">
          <h2 className="text-2xl font-semibold text-re-text0">
            Unable to load catalog
          </h2>
          <p className="mt-2 text-sm text-re-text1">{error}</p>
        </PageShell>
      </section>
    );
  }

  return (
    <section className="py-10">
      <PageShell>
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Browse"
              title="Explore the RetroElectro catalog"
              subtitle="Filter by price, category, and launch year. Then jump into Compare with one click."
            />

            <div className="flex flex-wrap gap-2">
              <Badge>{stats.totalProducts} products</Badge>
              <Badge>{stats.brands} brands</Badge>
              <Badge>avg {stats.averageRating.toFixed(1)} rating</Badge>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-re-text2">
                Search
              </span>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                placeholder="Try: camera phone, gaming, AMOLED"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-re-text2">
                Category
              </span>
              <Select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All categories" : item}
                  </option>
                ))}
              </Select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-re-text2">
                Max price (INR)
              </span>
              <Input
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                type="number"
                min="0"
                placeholder={maxObservedPrice ? String(maxObservedPrice) : "50000"}
              />
              <p className="mt-2 text-xs text-re-text2">
                Budget cap{" "}
                {maxPrice === "" ? "disabled" : formatInr(Number(maxPrice || 0))}
              </p>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-re-text2">
                Sort by
              </span>
              <Select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="rating">Highest rating</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="latest">Latest launch</option>
              </Select>
            </label>

            <div className="flex items-end">
              <Button type="button" variant="soft" onClick={clearFilters}>
                Reset
              </Button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-re-xl border border-re-border0 bg-white/4 px-6 py-14 text-center">
              <h2 className="text-2xl font-semibold text-re-text0">
                No products match these filters
              </h2>
              <p className="mt-2 text-sm text-re-text1">
                Try widening budget or using a broader query.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-re-text2">
                Showing {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="space-y-3">
                    <ProductCard product={product} />
                    <div className="flex items-center justify-between rounded-re-lg border border-re-border0 bg-white/4 px-4 py-2 text-sm">
                      <span className="text-re-text1">
                        Want a side-by-side verdict?
                      </span>
                      <Link to={`/compare?ids=${encodeURIComponent(product.id)}`}>
                        <Button size="sm">Compare</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </PageShell>
    </section>
  );
}

export default BrowseCatalog;
