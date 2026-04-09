import { Link } from "react-router-dom";
import Container from "../ui/primitives/Container";
import Surface from "../ui/primitives/Surface";
import Button from "../ui/primitives/Button";
import Input from "../ui/primitives/Input";

function Footer() {
  return (
    <footer className="pb-10">
      <Container>
        <Surface className="rounded-re-xl px-6 py-10 sm:px-8" raised>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr_0.9fr]">
            <div className="space-y-4">
              <div className="font-display text-2xl text-re-text0">
                RetroElectro
              </div>
              <p className="text-sm leading-relaxed text-re-text1">
                Premium device discovery with a catalog-first workflow: Browse,
                Compare, then refine with semantic Search.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-re-text2">
                <span className="rounded-full border border-re-border0 bg-white/6 px-3 py-1">
                  AI-assisted
                </span>
                <span className="rounded-full border border-re-border0 bg-white/6 px-3 py-1">
                  Catalog-driven
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.26em] text-re-text2">
                Navigate
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  { label: "Home", to: "/" },
                  { label: "Browse", to: "/browse" },
                  { label: "Compare", to: "/compare" },
                  { label: "About", to: "/about" },
                ].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-re-text1 transition duration-re-2 ease-re-2 hover:text-re-text0"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.26em] text-re-text2">
                Shortcuts
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  { label: "Start browsing", to: "/browse" },
                  { label: "Open compare", to: "/compare" },
                  { label: "Search results", to: "/results?q=best%20phone" },
                ].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-re-text1 transition duration-re-2 ease-re-2 hover:text-re-text0"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.26em] text-re-text2">
                Updates
              </h3>
              <p className="text-sm text-re-text1">
                Get occasional product insights and new catalog drops.
              </p>
              <form
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
                onSubmit={(e) => e.preventDefault()}
              >
                <Input type="email" placeholder="Email address" />
                <Button type="submit" size="sm">
                  Subscribe
                </Button>
              </form>
            </div> */}
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-re-border0 pt-6 text-xs text-re-text2 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} RetroElectro.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {["Privacy", "Terms", "Cookies"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="transition duration-re-2 ease-re-2 hover:text-re-text0"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </Surface>
      </Container>
    </footer>
  );
}

export default Footer;
