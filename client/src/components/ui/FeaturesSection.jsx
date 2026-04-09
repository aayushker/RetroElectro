function FeaturesSection() {
  const features = [
    {
      id: 1,
      title: "Natural Language Search",
      description:
        "Describe your needs in plain language. We convert it into constraints and match priorities.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "AI-Powered Recommendations",
      description:
        "We rank products by fit, budget, and real-world constraints—so the shortlist is practical.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v8m0 0l-4-4m4 4l4-4" />
          <circle cx="12" cy="17" r="5" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "User Reviews Integration",
      description:
        "Ratings and reviews help you avoid spec-sheet traps and focus on real experience.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Price Comparison",
      description:
        "Stay within budget with clear pricing and easy trade-off comparisons across picks.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="re-glass rounded-re-xl px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-re-text2">
                Why RetroElectro
              </p>
              <h2 className="mt-3 font-display text-4xl text-re-text0 sm:text-5xl">
                Built for confident choices
              </h2>
              <p className="mt-3 max-w-3xl text-sm text-re-text1 sm:text-base">
                A consistent flow: discover options, compare trade-offs, then
                refine your shortlist with semantic search.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="rounded-re-xl border border-re-border0 bg-white/4 p-6 re-raise"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-re-lg border border-re-border0 bg-white/6 text-re-accent1">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-re-text0">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-re-text1">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="/browse" className="inline-flex">
                <span className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition duration-re-2 ease-re-2 hover:bg-re-accent1">
                  Try browse
                </span>
              </a>
              <a href="/compare" className="inline-flex">
                <span className="inline-flex items-center justify-center rounded-full border border-re-border0 bg-transparent px-5 py-2.5 text-sm font-semibold text-re-text0 transition duration-re-2 ease-re-2 hover:bg-white/6 hover:border-re-border1">
                  Open compare
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;