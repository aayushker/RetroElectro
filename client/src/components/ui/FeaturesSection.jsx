function FeaturesSection() {
  const features = [
    {
      id: 1,
      title: 'Natural Language Search',
      description: 'Simply describe what you\'re looking for in plain language, and we\'ll find the perfect match.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'AI-Powered Recommendations',
      description: 'Our advanced AI analyzes thousands of products to match your specific requirements.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v8m0 0l-4-4m4 4l4-4" />
          <circle cx="12" cy="17" r="5" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'User Reviews Integration',
      description: 'We aggregate user reviews from multiple sources to provide authentic feedback on products.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Price Comparison',
      description: 'Compare prices across different retailers to ensure you get the best deal.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Choose RetroElectro</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our intelligent platform makes finding the perfect electronic device simple and hassle-free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-100 text-blue-600 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Call To Action */}
        <div className="mt-16 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors">
            Try It Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection; 