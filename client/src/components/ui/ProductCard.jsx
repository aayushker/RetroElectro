import Button from "./primitives/Button";
import Badge from "./primitives/Badge";
import Surface from "./primitives/Surface";

function ProductCard({ product }) {
  const title = product.title || product.name || "Unnamed product";
  const priceInr = Number(product.priceInr ?? product.price ?? 0);
  const rating = Number(product.rating ?? 0);
  const reviews = Number(product.reviews ?? 0);
  const score = Number(product.score ?? 0);
  const detailsUrl = product.productUrl || product.link || null;

  const features =
    Array.isArray(product.features) && product.features.length > 0
      ? product.features
      : [
          product.processor,
          product.ramGb ? `${product.ramGb}GB RAM` : null,
          product.batteryMah ? `${product.batteryMah}mAh battery` : null,
          product.backCameraMp ? `${product.backCameraMp}MP rear camera` : null,
        ].filter(Boolean);

  const formatInr = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <Surface
      variant="solid"
      raised
      className="overflow-hidden border border-re-border0 bg-white/4"
    >
      <div className="relative aspect-[4/3] bg-white/2">
        <img
          src={
            product.image ||
            product.imageUrl ||
            "https://via.placeholder.com/600x600?text=Device"
          }
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain p-6"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {score > 0 ? <Badge>Score {score.toFixed(3)}</Badge> : null}
        </div>

        {product.discount ? (
          <div className="absolute right-3 top-3">
            <Badge className="bg-white/12 text-re-text0">
              {product.discount}% off
            </Badge>
          </div>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-base font-semibold text-re-text0">
            {title}
          </h3>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex text-white/70" aria-label="Rating">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={i < Math.floor(rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-re-text2">
                {rating.toFixed(1)} · {reviews} reviews
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-re-accent0/70" />
              <span className="text-re-text1">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-re-text0">
              {formatInr(priceInr)}
            </div>
            {product.originalPrice ? (
              <div className="text-xs text-re-text2 line-through">
                {formatInr(product.originalPrice)}
              </div>
            ) : null}
          </div>

          {detailsUrl ? (
            <a href={detailsUrl} target="_blank" rel="noreferrer">
              <Button size="sm">View</Button>
            </a>
          ) : (
            <Button size="sm" variant="ghost" disabled>
              Added
            </Button>
          )}
        </div>
      </div>
    </Surface>
  );
}

// Example usage with mock data
function ProductCardDemo() {
  const exampleProduct = {
    id: 1,
    name: "Samsung Galaxy S21 Ultra 5G",
    image: "https://via.placeholder.com/300",
    rating: 4.7,
    reviews: 2345,
    features: [
      "Exynos 2100 processor",
      "5000mAh battery",
      "108MP quad camera setup",
      "6.8-inch Dynamic AMOLED display",
    ],
    price: 1199.99,
    originalPrice: 1399.99,
    discount: 14,
  };

  return <ProductCard product={exampleProduct} />;
}

export { ProductCard, ProductCardDemo };
