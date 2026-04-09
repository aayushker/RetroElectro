function ProductCard({ product }) {
  const title = product.title || product.name || "Unnamed product";
  const priceInr = Number(product.priceInr ?? product.price ?? 0);
  const rating = Number(product.rating ?? 0);
  const reviews = Number(product.reviews ?? 0);
  const score = Number(product.score ?? 0);

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
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      {/* Product Image */}
      <div className="relative pb-[60%] bg-gray-100">
        <img
          src={
            product.image ||
            product.imageUrl ||
            "https://via.placeholder.com/600x600?text=Phone"
          }
          alt={title}
          className="absolute inset-0 w-full h-full object-contain p-4"
        />
        {product.discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
          {title}
        </h3>

        {score > 0 && (
          <p className="text-sm text-blue-700 font-medium mb-2">
            Match score: {score.toFixed(3)}
          </p>
        )}

        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                stroke="currentColor"
                className="w-4 h-4"
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
          <span className="text-gray-500 text-sm">
            {rating.toFixed(1)} ({reviews} reviews)
          </span>
        </div>

        <div className="mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start text-sm mb-1">
              <svg
                className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-gray-900 font-bold text-xl">
              {formatInr(priceInr)}
            </span>
            {product.originalPrice && (
              <span className="text-gray-500 text-sm line-through ml-2">
                {formatInr(product.originalPrice)}
              </span>
            )}
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
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
