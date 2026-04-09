import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { getRecommendations, logQuery } from "../../services/api";

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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Start with a query
        </h2>
        <p className="text-gray-600">
          Try searching for a phone with a budget and a key feature.
        </p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Search query and results count */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Results for "{query}"
          </h2>
          <p className="text-gray-600 mt-2">
            Found {products.length} products that match your requirements
            {parsedQuery?.budgetInr
              ? ` within ${formatInr(parsedQuery.budgetInr)}`
              : ""}
          </p>
        </div>

        {/* Filter and sort options */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-700 font-medium">Budget (INR)</span>
            <input
              type="number"
              min="0"
              value={budgetInput}
              onChange={(event) => setBudgetInput(event.target.value)}
              placeholder="20000"
              className="border border-gray-300 rounded px-3 py-2 text-sm w-36"
            />

            <span className="text-gray-700 font-medium">Top K</span>
            <select
              value={topKInput}
              onChange={(event) => setTopKInput(event.target.value)}
              className="border border-gray-300 rounded px-2 py-2 text-sm"
            >
              {[3, 5, 8, 10, 15, 20].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>

            <button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Apply
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              No products matched this filter
            </h3>
            <p className="text-gray-600 mt-2">
              Try increasing budget or reducing strict filters like minimum
              battery or RAM.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchResults;
