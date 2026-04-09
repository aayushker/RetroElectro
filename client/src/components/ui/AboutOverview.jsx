import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/api";
import PageShell from "./primitives/PageShell";
import SectionHeading from "./primitives/SectionHeading";
import Badge from "./primitives/Badge";
import Button from "./primitives/Button";
import Skeleton from "./primitives/Skeleton";

const formatInr = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

function AboutOverview() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ limit: 120 });
        setProducts(response.data?.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const metrics = useMemo(() => {
    if (products.length === 0) {
      return {
        total: 0,
        brands: 0,
        averagePrice: 0,
        averageRating: 0,
      };
    }

    const brandSet = new Set(
      products
        .map((product) => String(product.brand || "").toLowerCase())
        .filter(Boolean),
    );
    const totalPrice = products.reduce(
      (sum, product) => sum + Number(product.priceInr || 0),
      0,
    );
    const totalRating = products.reduce(
      (sum, product) => sum + Number(product.rating || 0),
      0,
    );

    return {
      total: products.length,
      brands: brandSet.size,
      averagePrice: totalPrice / products.length,
      averageRating: totalRating / products.length,
    };
  }, [products]);

  const principles = [
    {
      title: "Human Language First",
      description:
        "You describe use-cases naturally and we convert that into technical constraints and matching priorities.",
    },
    {
      title: "Transparent Ranking",
      description:
        "Scores are based on relevance, feature fit, and practical constraints like budget, launch year, and rating.",
    },
    {
      title: "Decision Support, Not Noise",
      description:
        "Browse helps discovery, Compare helps trade-offs, and Search accelerates shortlisting.",
    },
  ];

  return (
    <section className="py-10">
      <PageShell>
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="About"
            title="Built for people choosing devices in the real world"
            subtitle="RetroElectro combines catalog data, semantic search, and practical comparison workflows so users can move from question to confident purchase quickly."
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Catalog items", value: loading ? null : metrics.total },
              { label: "Brands tracked", value: loading ? null : metrics.brands },
              {
                label: "Average price",
                value: loading ? null : formatInr(metrics.averagePrice),
              },
              {
                label: "Average rating",
                value: loading ? null : metrics.averageRating.toFixed(1),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-re-xl border border-re-border0 bg-white/4 p-5"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-re-text2">
                  {item.label}
                </div>
                <div className="mt-3 text-3xl font-semibold text-re-text0">
                  {item.value === null ? (
                    <Skeleton className="h-10 w-28" />
                  ) : (
                    item.value
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge>Browse → filter & shortlist</Badge>
            <Badge>Compare → trade-offs</Badge>
            <Badge>Search → semantic matches</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className="rounded-re-xl border border-re-border0 bg-white/4 p-6 re-raise"
              >
                <h2 className="text-lg font-semibold text-re-text0">
                  {principle.title}
                </h2>
                <p className="mt-2 text-sm text-re-text1">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>

          <div className="rounded-re-xl border border-re-border0 bg-white/4 p-7">
            <h2 className="font-display text-2xl text-re-text0">
              Try the full flow
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-re-text1">
              Start in Browse to discover options, then use Compare to inspect key
              specs side-by-side before making your final pick.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/browse">
                <Button>Open browse</Button>
              </Link>
              <Link to="/compare">
                <Button variant="ghost">Open compare</Button>
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    </section>
  );
}

export default AboutOverview;
