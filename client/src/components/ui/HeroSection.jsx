import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "./primitives/Container";
import Surface from "./primitives/Surface";
import SectionHeading from "./primitives/SectionHeading";
import Input from "./primitives/Input";
import Button from "./primitives/Button";
import Badge from "./primitives/Badge";

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePopularSearch = (query) => {
    setSearchQuery(query);
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="py-10">
      <Container>
        <Surface className="relative overflow-hidden rounded-re-xl px-6 py-12 sm:px-10">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-24 -top-28 h-[520px] w-[520px] rounded-full bg-white/8 blur-3xl" />
            <div className="absolute -right-24 -top-28 h-[520px] w-[520px] rounded-full bg-re-accent0/15 blur-3xl" />
            <div className="absolute -bottom-40 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-re-accent2/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl text-center re-fade-up">
            <SectionHeading
              eyebrow="RetroElectro"
              title="Find the right device in minutes"
              subtitle="Describe what you need in plain language. We’ll shortlist the best matches from the catalog, ranked by relevance."
              className="mx-auto max-w-3xl"
            />

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. phone under 20000 with strong battery and good camera"
                className="h-14 border-white/65 bg-white px-5 text-base text-slate-900 caret-slate-900 placeholder:text-slate-500 focus:border-white focus:bg-white"
              />
              <Button type="submit" className="h-14 px-8 text-base sm:w-auto">
                Find products
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] leading-none text-re-text2">
                Popular
              </span>
              <button
                type="button"
                className="inline-flex"
                onClick={() =>
                  handlePopularSearch(
                    "Best phone under 20000 with strong battery",
                  )
                }
              >
                <Badge className="h-8 hover:bg-white/10">
                  Battery under 20k
                </Badge>
              </button>
              <button
                type="button"
                className="inline-flex"
                onClick={() =>
                  handlePopularSearch("Smartphone with best camera under 30000")
                }
              >
                <Badge className="h-8 hover:bg-white/10">
                  Camera under 30k
                </Badge>
              </button>
              <button
                type="button"
                className="inline-flex"
                onClick={() =>
                  handlePopularSearch("Gaming phone with 8GB RAM under 25000")
                }
              >
                <Badge className="h-8 hover:bg-white/10">
                  Gaming under 25k
                </Badge>
              </button>
            </div>

            {/* <div className="mt-8 flex flex-wrap justify-center gap-2">
              <Badge>Browse</Badge>
              <Badge>Compare</Badge>
              <Badge>Semantic search</Badge>
            </div> */}
          </div>
        </Surface>
      </Container>
    </section>
  );
}

export default HeroSection;
