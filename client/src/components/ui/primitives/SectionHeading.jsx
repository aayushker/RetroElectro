function SectionHeading({ eyebrow, title, subtitle, className = "" }) {
  return (
    <header className={["space-y-3", className].filter(Boolean).join(" ")}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-re-text2">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h1 className="font-display text-4xl leading-[1.02] text-re-text0 sm:text-5xl">
          {title}
        </h1>
      ) : null}
      {subtitle ? (
        <p className="max-w-3xl text-base text-re-text1 sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

export default SectionHeading;

