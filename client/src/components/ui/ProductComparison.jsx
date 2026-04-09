import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/api";

const formatInr = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const COMPARISON_SPECS = [
  {
    id: "priceInr",
    label: "Price",
    mode: "min",
    getNumericValue: (product) => Number(product.priceInr || 0),
    renderValue: (product) => formatInr(product.priceInr),
  },
  {
    id: "rating",
    label: "Rating",
    mode: "max",
    getNumericValue: (product) => Number(product.rating || 0),
    renderValue: (product) => Number(product.rating || 0).toFixed(1),
  },
  {
    id: "ramGb",
    label: "RAM",
    mode: "max",
    getNumericValue: (product) => Number(product.ramGb || 0),
    renderValue: (product) =>
      product.ramGb ? `${product.ramGb} GB` : "Not available",
  },
  {
    id: "batteryMah",
    label: "Battery",
    mode: "max",
    getNumericValue: (product) => Number(product.batteryMah || 0),
    renderValue: (product) =>
      product.batteryMah ? `${product.batteryMah} mAh` : "Not available",
  },
  {
    id: "backCameraMp",
    label: "Rear Camera",
    mode: "max",
    getNumericValue: (product) => Number(product.backCameraMp || 0),
    renderValue: (product) =>
      product.backCameraMp ? `${product.backCameraMp} MP` : "Not available",
  },
  {
    id: "screenSizeInches",
    label: "Display",
    mode: "max",
    getNumericValue: (product) => Number(product.screenSizeInches || 0),
    renderValue: (product) =>
      product.screenSizeInches
        ? `${Number(product.screenSizeInches).toFixed(1)}"`
        : "Not available",
  },
  {
    id: "processor",
    label: "Processor",
    mode: "text",
    getNumericValue: () => null,
    renderValue: (product) => product.processor || "Not available",
  },
  {
    id: "launchedYear",
    label: "Launch Year",
    mode: "max",
    getNumericValue: (product) => Number(product.launchedYear || 0),
    renderValue: (product) => product.launchedYear || "Not available",
  },
];

const normalizeText = (value) => String(value || "").toLowerCase();

function ProductComparison() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const seededIdsParam = searchParams.get("ids") || "";

  const querySeedIds = useMemo(() => {
    const fromQuery = seededIdsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    return Array.from(new Set(fromQuery)).slice(0, 3);
  }, [seededIdsParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getProducts({ limit: 120 });
        const catalog = response.data?.data || [];
        setProducts(catalog);

        setSelectedIds((current) => {
          if (current.length > 0) {
            return current;
          }

          const seededFromUrl = querySeedIds.filter((id) =>
            catalog.some((product) => product.id === id),
          );

          if (seededFromUrl.length > 0) {
            return seededFromUrl;
          }

          return [...catalog]
            .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
            .slice(0, 2)
            .map((product) => product.id);
        });
      } catch (requestError) {
        setError(requestError.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [querySeedIds]);

  const selectedProducts = useMemo(
    () =>
      selectedIds
        .map((id) => products.find((product) => product.id === id))
        .filter(Boolean),
    [products, selectedIds],
  );

  const suggestedProducts = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery.trim());

    return products
      .filter((product) => !selectedIds.includes(product.id))
      .filter((product) => {
        if (!normalizedQuery) {
          return true;
        }

        return [
          product.title,
          product.brand,
          product.modelName,
          product.processor,
          Array.isArray(product.tags) ? product.tags.join(" ") : "",
        ]
          .map(normalizeText)
          .some((value) => value.includes(normalizedQuery));
      })
      .slice(0, 8);
  }, [products, searchQuery, selectedIds]);

  const addProduct = (id) => {
    setSelectedIds((current) => {
      if (current.includes(id) || current.length >= 3) {
        return current;
      }

      return [...current, id];
    });
  };

  const removeProduct = (id) => {
    setSelectedIds((current) => current.filter((item) => item !== id));
  };

  const loadTopRated = () => {
    const topRated = [...products]
      .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
      .slice(0, 3)
      .map((product) => product.id);

    setSelectedIds(topRated);
  };

  const getBestValue = (spec) => {
    if (spec.mode === "text") {
      return null;
    }

    const values = selectedProducts
      .map((product) => spec.getNumericValue(product))
      .filter((value) => Number.isFinite(value));

    if (values.length === 0) {
      return null;
    }

    return spec.mode === "min" ? Math.min(...values) : Math.max(...values);
  };

  if (loading) {
    return (
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
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
            Unable to load comparison data
          </h2>
          <p className="mt-2 text-slate-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[radial-gradient(circle_at_top_left,_#ecfeff_0,_#f8fafc_38%,_#fef3c7_100%)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-8 rounded-3xl border border-cyan-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Compare
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
            Build your product showdown
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Select up to three products and compare practical specs side-by-side
            before deciding.
          </p>
        </header>

        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Add products</h2>
              <button
                type="button"
                onClick={loadTopRated}
                className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-200"
              >
                Top Rated Picks
              </button>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search catalog to add"
              className="mb-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />

            <div className="max-h-[24rem] space-y-3 overflow-y-auto pr-1">
              {suggestedProducts.map((product) => (
                <article
                  key={product.id}
                  className="rounded-xl border border-slate-200 p-3 transition hover:border-cyan-200 hover:bg-cyan-50/40"
                >
                  <div className="flex gap-3">
                    <img
                      src={
                        product.imageUrl ||
                        "https://via.placeholder.com/120x120?text=Phone"
                      }
                      alt={product.title}
                      className="h-16 w-16 rounded-lg border border-slate-200 object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-slate-900">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">
                        {formatInr(product.priceInr)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Rating {Number(product.rating || 0).toFixed(1)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => addProduct(product.id)}
                    disabled={selectedIds.length >= 3}
                    className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {selectedIds.length >= 3
                      ? "Limit reached"
                      : "Add to comparison"}
                  </button>
                </article>
              ))}

              {suggestedProducts.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-600">
                  No products matched your search.
                </p>
              )}
            </div>
          </aside>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Selected ({selectedProducts.length}/3)
              </h2>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Clear all
              </button>
            </div>

            {selectedProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
                <p className="text-slate-600">
                  Add products from the left panel to start comparing.
                </p>
                <Link
                  to="/browse"
                  className="mt-4 inline-flex rounded-full bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
                >
                  Go to Browse
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {selectedProducts.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        {product.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </div>
                    <img
                      src={
                        product.imageUrl ||
                        "https://via.placeholder.com/320x220?text=Device"
                      }
                      alt={product.title}
                      className="mb-3 h-32 w-full rounded-lg border border-slate-200 bg-white object-contain p-2"
                    />
                    <p className="text-sm text-slate-700">
                      {formatInr(product.priceInr)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Rating {Number(product.rating || 0).toFixed(1)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedProducts.length < 2 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Select at least two products
            </h2>
            <p className="mt-2 text-slate-600">
              Pick one more product to unlock side-by-side spec comparison.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[760px] w-full border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Specification
                  </th>
                  {selectedProducts.map((product) => (
                    <th
                      key={product.id}
                      className="px-4 py-3 text-left text-sm font-semibold"
                    >
                      {product.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_SPECS.map((spec) => {
                  const bestValue = getBestValue(spec);

                  return (
                    <tr key={spec.id} className="border-t border-slate-200">
                      <td className="bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
                        {spec.label}
                      </td>
                      {selectedProducts.map((product) => {
                        const numericValue = spec.getNumericValue(product);
                        const isBest =
                          spec.mode !== "text" &&
                          Number.isFinite(numericValue) &&
                          numericValue === bestValue;

                        return (
                          <td
                            key={`${spec.id}-${product.id}`}
                            className={`px-4 py-3 text-sm ${
                              isBest
                                ? "bg-emerald-50 font-semibold text-emerald-800"
                                : "text-slate-700"
                            }`}
                          >
                            {spec.renderValue(product)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductComparison;
