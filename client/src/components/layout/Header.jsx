import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Container from "../ui/primitives/Container";
import Surface from "../ui/primitives/Surface";
import Button from "../ui/primitives/Button";
import Input from "../ui/primitives/Input";

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
    [
      "text-xs font-semibold uppercase tracking-[0.22em] transition duration-re-2 ease-re-2",
      isActive ? "text-re-accent1" : "text-re-text2 hover:text-re-text0",
    ].join(" ");

  const mobileNavClassName = ({ isActive }) =>
    [
      "rounded-re-md px-3 py-2 text-sm font-semibold transition duration-re-2 ease-re-2",
      isActive
        ? "bg-white/10 text-re-accent1"
        : "text-re-text1 hover:bg-white/6 hover:text-re-text0",
    ].join(" ");

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <Container className="py-4">
        <Surface
          as="div"
          raised
          className="relative rounded-re-xl px-4 py-3 sm:px-5"
        >
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full border border-re-border0 bg-white/8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-re-accent1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="font-display text-xl text-re-text0 sm:text-2xl">
                  RetroElectro
                </div>
                <div className="text-xs tracking-[0.24em] text-re-text2">
                  Smart catalog discovery
                </div>
              </div>
            </Link>

            <nav className="ml-auto hidden items-center gap-5 md:flex">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    desktopNavClassName({
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
            </nav>

            {/* <form
              onSubmit={handleSearch}
              className="ml-auto hidden w-[420px] max-w-[42vw] items-center gap-2 md:flex"
            >
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search (budget, camera, gaming...)"
                aria-label="Search products"
              />
              <Button type="submit" size="sm" className="shrink-0">
                Search
              </Button>
            </form> */}

            <button
              className="ml-auto inline-flex items-center justify-center rounded-full border border-re-border0 bg-white/6 p-2 text-re-text0 transition duration-re-2 ease-re-2 hover:bg-white/10 md:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 7h16M4 12h16M4 17h16"
                  }
                />
              </svg>
            </button>
          </div>

          {isMenuOpen ? (
            <div className="re-fade-up mt-4 space-y-3 border-t border-re-border0 pt-4 md:hidden">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search (budget, camera, gaming...)"
                />
                <Button type="submit" size="sm">
                  Go
                </Button>
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
          ) : null}
        </Surface>
      </Container>
    </header>
  );
}

export default Header;
