import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In the future, this will pass the search query to the backend
      navigate('/results');
    }
  };
  
  return (
    <header className="bg-gradient-to-r from-purple-800 to-blue-700 shadow-lg fixed w-full z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 7h-2v2h2V7zm0 4h-2v6h2v-6zm-1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            <span className="text-2xl font-bold text-white">RetroElectro</span>
          </Link>
          
          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What device are you looking for today?"
                className="w-full py-2 px-4 pr-10 rounded-full border-2 border-gray-200 focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-yellow-300 transition-colors">Home</Link>
            <Link to="/results" className="text-white hover:text-yellow-300 transition-colors">Browse</Link>
            <Link to="/compare" className="text-white hover:text-yellow-300 transition-colors">Compare</Link>
            <a href="#" className="text-white hover:text-yellow-300 transition-colors">About</a>
            <button className="bg-yellow-400 text-blue-900 font-medium py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors">
              Sign In
            </button>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile menu and search bar */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What device are you looking for?"
                    className="w-full py-2 px-4 pr-10 rounded-full border-2 border-gray-200 focus:outline-none focus:border-blue-500"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
              <Link to="/" className="text-white hover:text-yellow-300 py-2">Home</Link>
              <Link to="/results" className="text-white hover:text-yellow-300 py-2">Browse</Link>
              <Link to="/compare" className="text-white hover:text-yellow-300 py-2">Compare</Link>
              <a href="#" className="text-white hover:text-yellow-300 py-2">About</a>
              <button className="bg-yellow-400 text-blue-900 font-medium py-2 px-4 rounded-full hover:bg-yellow-300 w-full">
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header; 