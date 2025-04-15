function ProductComparison() {
  // Mock data for comparison (will be replaced with real data from API)
  const comparisonProducts = [
    {
      id: 1,
      name: "Samsung Galaxy S21 Ultra",
      image: "https://via.placeholder.com/200",
      price: 1199.99,
      processor: "Exynos 2100",
      ram: "12 GB",
      storage: "256 GB",
      display: "6.8-inch Dynamic AMOLED 2X",
      resolution: "3200 x 1440 pixels",
      camera: "108MP + 10MP + 10MP + 12MP",
      battery: "5000 mAh",
      os: "Android 11",
      rating: 4.7,
    },
    {
      id: 2,
      name: "iPhone 13 Pro Max",
      image: "https://via.placeholder.com/200",
      price: 1099.99,
      processor: "A15 Bionic",
      ram: "6 GB",
      storage: "256 GB",
      display: "6.7-inch Super Retina XDR",
      resolution: "2778 x 1284 pixels",
      camera: "12MP + 12MP + 12MP",
      battery: "4352 mAh",
      os: "iOS 15",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Google Pixel 6 Pro",
      image: "https://via.placeholder.com/200",
      price: 899.99,
      processor: "Google Tensor",
      ram: "12 GB",
      storage: "128 GB",
      display: "6.7-inch LTPO OLED",
      resolution: "3120 x 1440 pixels",
      camera: "50MP + 48MP + 12MP",
      battery: "5003 mAh",
      os: "Android 12",
      rating: 4.6,
    }
  ];

  // Specifications to compare
  const specs = [
    { id: 'price', label: 'Price' },
    { id: 'processor', label: 'Processor' },
    { id: 'ram', label: 'RAM' },
    { id: 'storage', label: 'Storage' },
    { id: 'display', label: 'Display' },
    { id: 'resolution', label: 'Resolution' },
    { id: 'camera', label: 'Camera' },
    { id: 'battery', label: 'Battery' },
    { id: 'os', label: 'Operating System' },
    { id: 'rating', label: 'User Rating' },
  ];

  // Helper function to render individual cell value
  const renderSpecValue = (product, spec) => {
    if (spec.id === 'price') {
      return <span className="font-semibold">${product[spec.id]}</span>;
    }
    if (spec.id === 'rating') {
      return (
        <div className="flex items-center">
          <span className="mr-1">{product[spec.id]}</span>
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      );
    }
    return product[spec.id];
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Compare Products</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how these top smartphones stack up against each other
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[768px]">
            {/* Header Row */}
            <thead>
              <tr>
                <th className="bg-gray-50 p-4 text-left text-gray-900 font-medium border-b">Specifications</th>
                {comparisonProducts.map(product => (
                  <th key={product.id} className="p-4 text-center border-b">
                    <div className="flex flex-col items-center space-y-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-32 h-32 object-contain"
                      />
                      <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {specs.map((spec) => (
                <tr key={spec.id} className="hover:bg-gray-50">
                  <td className="p-4 border-b bg-gray-50 font-medium text-gray-900">{spec.label}</td>
                  {comparisonProducts.map(product => (
                    <td key={`${product.id}-${spec.id}`} className="p-4 text-center border-b">
                      {renderSpecValue(product, spec)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Action Row */}
              <tr>
                <td className="p-4"></td>
                {comparisonProducts.map(product => (
                  <td key={`${product.id}-action`} className="p-4 text-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Add More Products Option */}
        <div className="flex justify-center mt-8">
          <button className="flex items-center space-x-2 border-2 border-dashed border-gray-300 rounded-lg px-6 py-3 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add Another Product to Compare</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductComparison; 