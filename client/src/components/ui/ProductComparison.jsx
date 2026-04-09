import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/api";
import PageShell from "./primitives/PageShell";
import SectionHeading from "./primitives/SectionHeading";
import Input from "./primitives/Input";
import Button from "./primitives/Button";
import Badge from "./primitives/Badge";
import Skeleton from "./primitives/Skeleton";

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
      <section className="py-10">
        <PageShell>
          <div className="grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64" />
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
            Unable to load comparison data
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
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Compare"
              title="Build your product showdown"
              subtitle="Select up to three products and compare practical specs side-by-side."
            />
            <div className="flex flex-wrap gap-2">
              <Badge>Selected: {selectedProducts.length}/3</Badge>
              {seededIdsParam ? <Badge>Seeded</Badge> : null}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_1.95fr]">
            <aside className="rounded-re-xl border border-re-border0 bg-white/4 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-re-text2">
                  Add products
                </h2>
                <Button type="button" size="sm" variant="soft" onClick={loadTopRated}>
                  Top rated
                </Button>
              </div>

              <Input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search catalog to add"
                className="mb-4"
              />

              <div className="max-h-[26rem] space-y-3 overflow-y-auto pr-1">
                {suggestedProducts.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-re-lg border border-re-border0 bg-white/3 p-3 re-raise"
                  >
                    <div className="flex gap-3">
                      <img
                        src={
                          product.imageUrl ||
                          "https://via.placeholder.com/120x120?text=Phone"
                        }
                        alt={product.title}
                        className="h-16 w-16 rounded-re-md border border-re-border0 bg-white/4 object-contain p-2"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-re-text0">
                          {product.title}
                        </h3>
                        <p className="mt-1 text-xs text-re-text1">
                          {formatInr(product.priceInr)}
                        </p>
                        <p className="text-xs text-re-text2">
                          Rating {Number(product.rating || 0).toFixed(1)}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => addProduct(product.id)}
                      disabled={selectedIds.length >= 3}
                      variant="soft"
                      className="mt-3 w-full"
                    >
                      {selectedIds.length >= 3 ? "Limit reached" : "Add to comparison"}
                    </Button>
                  </article>
                ))}

                {suggestedProducts.length === 0 ? (
                  <p className="rounded-re-lg border border-re-border0 bg-white/2 px-4 py-6 text-center text-sm text-re-text1">
                    No products matched your search.
                  </p>
                ) : null}
              </div>
            </aside>

            <div className="rounded-re-xl border border-re-border0 bg-white/4 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-re-text2">
                  Selected
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                >
                  Clear
                </Button>
              </div>

              {selectedProducts.length === 0 ? (
                <div className="rounded-re-xl border border-re-border0 bg-white/2 px-6 py-12 text-center">
                  <p className="text-sm text-re-text1">
                    Add products from the left panel to start comparing.
                  </p>
                  <div className="mt-5">
                    <Link to="/browse">
                      <Button>Go to browse</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {selectedProducts.map((product) => (
                    <article
                      key={product.id}
                      className="rounded-re-lg border border-re-border0 bg-white/3 p-4"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold text-re-text0">
                          {product.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          className="rounded-full border border-re-border0 bg-white/4 px-3 py-1 text-xs font-semibold text-re-text1 transition duration-re-2 ease-re-2 hover:bg-white/8 hover:text-re-text0"
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
                        className="mb-3 h-32 w-full rounded-re-md border border-re-border0 bg-white/4 object-contain p-3"
                      />
                      <p className="text-sm text-re-text1">{formatInr(product.priceInr)}</p>
                      <p className="text-xs text-re-text2">
                        Rating {Number(product.rating || 0).toFixed(1)}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedProducts.length < 2 ? (
            <div className="rounded-re-xl border border-re-border0 bg-white/3 px-6 py-10 text-center">
              <h2 className="text-xl font-semibold text-re-text0">
                Select at least two products
              </h2>
              <p className="mt-2 text-sm text-re-text1">
                Pick one more product to unlock side-by-side spec comparison.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-re-xl border border-re-border0 bg-white/3">
              <table className="min-w-[860px] w-full border-collapse">
                <thead>
                  <tr className="border-b border-re-border0 bg-white/4">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-re-text2">
                      Spec
                    </th>
                    {selectedProducts.map((product) => (
                      <th
                        key={product.id}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-re-text2"
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
                      <tr key={spec.id} className="border-t border-re-border0">
                        <td className="bg-white/3 px-4 py-3 text-sm font-semibold text-re-text1">
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
                              className={[
                                "px-4 py-3 text-sm",
                                isBest
                                  ? "bg-white/6 font-semibold text-re-accent1"
                                  : "text-re-text0",
                              ].join(" ")}
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
      </PageShell>
    </section>
  );
}

export default ProductComparison;
