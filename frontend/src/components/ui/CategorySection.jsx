function CategorySection() {
  const categories = [
    {
      id: 1,
      name: 'Smartphones',
      description: 'Find the perfect smartphone for your needs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
          <path d="M12 16.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
        </svg>
      ),
    },
    {
      id: 2,
      name: 'Laptops',
      description: 'From gaming to business, find your ideal laptop',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
        </svg>
      ),
    },
    {
      id: 3,
      name: 'Headphones',
      description: 'Experience immersive sound quality',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
        </svg>
      ),
    },
    {
      id: 4,
      name: 'Smart Watches',
      description: 'Stay connected with stylish wearables',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20,12c0-2.54-1.19-4.81-3.04-6.27L16,0H8l-0.95,5.73C5.19,7.19,4,9.45,4,12s1.19,4.81,3.05,6.27L8,24h8l0.96-5.73C18.81,16.81,20,14.54,20,12z M6,12c0-3.31,2.69-6,6-6s6,2.69,6,6s-2.69,6-6,6S6,15.31,6,12z" />
        </svg>
      ),
    },
    {
      id: 5,
      name: 'Cameras',
      description: 'Capture life\'s moments in stunning detail',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
          <path d="M12 17c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3z" />
        </svg>
      ),
    },
    {
      id: 6,
      name: 'Smart Home',
      description: 'Make your home smarter and more efficient',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Browse by Category</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our wide range of electronic devices across popular categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all transform hover:-translate-y-1 text-center group"
            >
              <div className="text-blue-600 group-hover:text-purple-600 transition-colors">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{category.name}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <a
                href="#"
                className="inline-block text-blue-600 group-hover:text-purple-700 font-medium hover:underline"
              >
                Explore {category.name} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection; 