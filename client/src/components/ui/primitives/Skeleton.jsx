function Skeleton({ className = "" }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-re-lg border border-re-border0 bg-white/6",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:animate-[reShimmer_1.2s_linear_infinite]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export default Skeleton;

