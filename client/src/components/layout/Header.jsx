import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Browse", to: "/browse" },
  { label: "Compare", to: "/compare" },
  { label: "About", to: "/about" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      navigate("/browse");
      return;
    }

    navigate(`/results?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const desktopNavClassName = ({ isActive }) =>
    `text-sm font-semibold tracking-wide transition-colors ${
      isActive ? "text-amber-300" : "text-slate-100 hover:text-amber-200"
    }`;

  const mobileNavClassName = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-base font-medium transition-colors ${
      isActive
        ? "bg-cyan-900/50 text-amber-300"
        : "text-white hover:bg-cyan-900/30 hover:text-amber-200"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-cyan-600/40 bg-gradient-to-r from-slate-950 via-sky-900 to-cyan-800 shadow-xl backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-amber-300"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13 7h-2v2h2V7zm0 4h-2v6h2v-6zm-1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            RetroElectro
          </span>
        </Link>

        {/* <form
          onSubmit={handleSearch}
          className="relative hidden flex-1 lg:block lg:max-w-xl"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by budget, feature, or use-case"
            className="w-full rounded-full border border-cyan-200/30 bg-white/90 px-4 py-2.5 pr-28 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:ring-2"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-cyan-700 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
          >
            Smart Search
          </button>
        </form> */}

        <nav className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                desktopNavClassName({
                  isActive:
                    isActive ||
                    (link.to === "/browse" && location.pathname === "/results"),
                })
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/browse"
            className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
          >
            Explore Catalog
          </Link>
        </nav>

        <button
          className="ml-auto text-white md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute inset-x-0 top-full border-b border-cyan-500/30 bg-slate-950/95 p-4 md:hidden">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by battery, gaming, camera..."
                  className="w-full rounded-full border border-cyan-200/20 bg-white/95 px-4 py-2.5 pr-12 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-700"
                  aria-label="Search products"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    mobileNavClassName({
                      isActive:
                        isActive ||
                        (link.to === "/browse" &&
                          location.pathname === "/results"),
                    })
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
