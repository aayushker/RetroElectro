import { ProductCard } from './ProductCard';

function SearchResults() {
  // Example search results (in the future, these will come from the backend)
  const mockSearchResults = {
    query: "smartphone with good battery life",
    matchedProducts: [
      {
        id: 1,
        name: "Samsung Galaxy S21 Ultra 5G",
        image: "https://via.placeholder.com/300",
        rating: 4.7,
        reviews: 2345,
        features: [
          "5000mAh battery - lasts up to 2 days",
          "Exynos 2100 processor",
          "108MP quad camera setup",
          "6.8-inch Dynamic AMOLED display"
        ],
        price: 1199.99,
        originalPrice: 1399.99,
        discount: 14
      },
      {
        id: 2,
        name: "iPhone 13 Pro Max",
        image: "https://via.placeholder.com/300",
        rating: 4.8,
        reviews: 3211,
        features: [
          "Up to 28 hours of video playback",
          "A15 Bionic chip",
          "Pro camera system with 12MP cameras",
          "6.7-inch Super Retina XDR display"
        ],
        price: 1099.99,
        originalPrice: null,
        discount: null
      },
      {
        id: 3,
        name: "Xiaomi Redmi Note 10 Pro",
        image: "https://via.placeholder.com/300",
        rating: 4.5,
        reviews: 1876,
        features: [
          "5020mAh battery with fast charging",
          "Snapdragon 732G processor",
          "108MP quad camera setup",
          "6.67-inch AMOLED display"
        ],
        price: 299.99,
        originalPrice: 349.99,
        discount: 14
      },
      {
        id: 4,
        name: "Google Pixel 6 Pro",
        image: "https://via.placeholder.com/300",
        rating: 4.6,
        reviews: 1432,
        features: [
          "5003mAh battery with adaptive battery",
          "Google Tensor processor",
          "50MP triple camera system",
          "6.7-inch LTPO OLED display"
        ],
        price: 899.99,
        originalPrice: 999.99,
        discount: 10
      }
    ],
    relatedSearches: [
      "best smartphone camera 2023",
      "budget phones with good battery",
      "gaming smartphones",
      "smartphones with fastest charging"
    ]
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Search query and results count */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Results for "{mockSearchResults.query}"
          </h2>
          <p className="text-gray-600 mt-2">
            Found {mockSearchResults.matchedProducts.length} products that match your requirements
          </p>
        </div>

        {/* Filter and sort options */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="text-gray-700">Filters:</span>
            <button className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors">
              Price Range
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors">
              Brand
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors">
              Features
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Sort by:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
              <option>Reviews</option>
            </select>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {mockSearchResults.matchedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Related searches */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Related Searches</h3>
          <div className="flex flex-wrap gap-3">
            {mockSearchResults.relatedSearches.map((searchTerm, index) => (
              <a
                key={index}
                href="#"
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {searchTerm}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchResults; 