import { useState } from 'react';

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // This will be implemented later with actual functionality
    console.log('Search query:', searchQuery);
  };
  
  return (
    <div className="bg-gradient-to-b from-purple-900 via-blue-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find Your Perfect Electronic Device
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100">
            Just describe what you need, and we'll find the best match for your requirements.
          </p>
          
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-10">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="I want a laptop with good battery life under $1000..."
              className="w-full px-6 py-4 rounded-full text-lg text-gray-900 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Find Products
            </button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <p className="text-blue-200">Popular searches:</p>
            <button 
              onClick={() => setSearchQuery("Best gaming laptop under $1500")}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              Gaming laptop under $1500
            </button>
            <button 
              onClick={() => setSearchQuery("Smartphone with best camera")}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              Smartphone with best camera
            </button>
            <button 
              onClick={() => setSearchQuery("Noise cancelling headphones")}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              Noise cancelling headphones
            </button>
          </div>
        </div>
      </div>
      
      {/* Wave shape divider */}
      <div className="w-full">
        <svg className="w-full h-16 md:h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}

export default HeroSection; 