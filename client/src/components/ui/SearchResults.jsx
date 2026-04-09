import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { getRecommendations, logQuery } from "../../services/api";
import PageShell from "./primitives/PageShell";
import SectionHeading from "./primitives/SectionHeading";
import Input from "./primitives/Input";
import Select from "./primitives/Select";
import Button from "./primitives/Button";
import Skeleton from "./primitives/Skeleton";
import Badge from "./primitives/Badge";

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [parsedQuery, setParsedQuery] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");
  const [topKInput, setTopKInput] = useState("5");
  const [sortBy, setSortBy] = useState("relevance");

  const query = searchParams.get("q") || "";
  const topKParam = Number.parseInt(searchParams.get("k") || "5", 10);
  const budgetParam = Number.parseInt(searchParams.get("budget") || "", 10);

  const clampTopK = (value) => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) {
      return 5;
    }

    return Math.min(20, Math.max(1, parsed));
  };

  const formatInr = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.priceInr || 0) - Number(b.priceInr || 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.priceInr || 0) - Number(a.priceInr || 0));
    } else if (sortBy === "rating") {
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else {
      list.sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
    }

    return list;
  }, [products, sortBy]);

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.set("q", query);
    next.set("k", String(clampTopK(topKInput)));

    const parsedBudget = Number.parseInt(budgetInput, 10);
    if (Number.isFinite(parsedBudget) && parsedBudget > 0) {
      next.set("budget", String(parsedBudget));
    } else {
      next.delete("budget");
    }

    setSearchParams(next);
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!query) {
          setProducts([]);
          setParsedQuery({});
          return;
        }

        const effectiveTopK = clampTopK(topKParam);
        setTopKInput(String(effectiveTopK));
        setBudgetInput(Number.isFinite(budgetParam) ? String(budgetParam) : "");

        // Log the search query
        await logQuery({ query });

        // Get recommendations
        const response = await getRecommendations({
          query,
          topK: effectiveTopK,
          budgetInr: Number.isFinite(budgetParam) ? budgetParam : undefined,
        });

        const payload = response.data?.data || {};
        setProducts(payload.products || []);
        setParsedQuery(payload.parsedQuery || {});
      } catch (err) {
        setError(err.message);
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [budgetParam, query, topKParam]);

  if (loading) {
    return (
      <section className="py-10">
        <PageShell>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={idx} className="h-72" />
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
          <h2 className="text-2xl font-semibold text-re-text0">Error</h2>
          <p className="mt-2 text-sm text-re-text1">{error}</p>
        </PageShell>
      </section>
    );
  }

  if (!query) {
    return (
      <section className="py-10">
        <PageShell className="text-center">
          <h2 className="font-display text-3xl text-re-text0">
            Start with a query
          </h2>
          <p className="mt-2 text-sm text-re-text1">
            Describe what you need (budget + one priority) and we’ll shortlist
            the best matches.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/browse">
              <Button>Browse catalog</Button>
            </Link>
            <Link to="/compare">
              <Button variant="ghost">Open compare</Button>
            </Link>
          </div>
        </PageShell>
      </section>
    );
  }

  return (
    <section className="py-10">
      <PageShell>
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Results"
              title={`Results for “${query}”`}
              subtitle={`Found ${products.length} products${
                parsedQuery?.budgetInr
                  ? ` within ${formatInr(parsedQuery.budgetInr)}`
                  : ""
              }.`}
            />
            <div className="flex flex-wrap gap-2">
              <Badge>Sort: {sortBy}</Badge>
              <Badge>TopK: {clampTopK(topKInput)}</Badge>
              {budgetInput ? <Badge>Budget: {formatInr(budgetInput)}</Badge> : null}
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_160px_170px_160px_auto] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-re-text2">
                Budget (INR)
              </span>
              <Input
                type="number"
                min="0"
                value={budgetInput}
                onChange={(event) => setBudgetInput(event.target.value)}
                placeholder="20000"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-re-text2">
                Top K
              </span>
              <Select
                value={topKInput}
                onChange={(event) => setTopKInput(event.target.value)}
              >
                {[3, 5, 8, 10, 15, 20].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-re-text2">
                Sort by
              </span>
              <Select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </Select>
            </label>

            <div className="flex items-end">
              <Button onClick={applyFilters} variant="soft">
                Apply
              </Button>
            </div>

            <div className="hidden items-end lg:flex">
              <Link to="/browse">
                <Button variant="ghost">Browse</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {sortedProducts.length === 0 ? (
            <div className="rounded-re-xl border border-re-border0 bg-white/4 px-6 py-12 text-center">
              <h3 className="text-xl font-semibold text-re-text0">
                No products matched this filter
              </h3>
              <p className="mt-2 text-sm text-re-text1">
                Try increasing budget or switching to relevance sorting.
              </p>
            </div>
          ) : null}
        </div>
      </PageShell>
    </section>
  );
}

export default SearchResults;
