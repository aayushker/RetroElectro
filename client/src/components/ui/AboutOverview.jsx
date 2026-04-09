import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/api";

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
    <section className="bg-[linear-gradient(160deg,#f8fafc_0%,#ecfeff_45%,#fff7ed_100%)] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            About
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-5xl">
            Built for people choosing devices in the real world
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            RetroElectro combines catalog data, semantic search, and practical
            comparison workflows so users can move from question to confident
            purchase decision quickly.
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
            <p className="text-sm font-semibold text-cyan-700">Catalog items</p>
            <p className="mt-2 text-3xl font-bold text-cyan-900">
              {loading ? "..." : metrics.total}
            </p>
          </article>
          <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-700">
              Brands tracked
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-900">
              {loading ? "..." : metrics.brands}
            </p>
          </article>
          <article className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-700">
              Average price
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-900">
              {loading ? "..." : formatInr(metrics.averagePrice)}
            </p>
          </article>
          <article className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
            <p className="text-sm font-semibold text-violet-700">
              Average user rating
            </p>
            <p className="mt-2 text-3xl font-bold text-violet-900">
              {loading ? "..." : metrics.averageRating.toFixed(1)}
            </p>
          </article>
        </div>

        <div className="mb-10 grid gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900">
                {principle.title}
              </h2>
              <p className="mt-2 text-slate-600">{principle.description}</p>
            </article>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold">Try the full flow</h2>
          <p className="mt-2 max-w-2xl text-slate-300">
            Start in Browse to discover options, then use Compare to inspect key
            specs side-by-side before making your final pick.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/browse"
              className="rounded-full bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Open Browse
            </Link>
            <Link
              to="/compare"
              className="rounded-full border border-white/40 px-5 py-2.5 font-semibold text-white transition hover:border-white"
            >
              Open Compare
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutOverview;
