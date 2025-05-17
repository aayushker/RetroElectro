import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { getRecommendations, logQuery } from '../../services/api';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const query = searchParams.get('q') || '';
        
        // Log the search query
        await logQuery({ query });
        
        // Get recommendations
        const response = await getRecommendations({ query });
        setResults(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

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

  if (!results) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
        <p className="text-gray-600">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Search query and results count */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Results for "{results.query}"
          </h2>
          <p className="text-gray-600 mt-2">
            Found {results.matchedProducts.length} products that match your requirements
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
          {results.matchedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Related searches */}
        {results.relatedSearches && results.relatedSearches.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Related Searches</h3>
            <div className="flex flex-wrap gap-3">
              {results.relatedSearches.map((searchTerm, index) => (
                <a
                  key={index}
                  href={`/results?q=${encodeURIComponent(searchTerm)}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  {searchTerm}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchResults; 