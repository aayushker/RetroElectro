function Badge({ className = "", children, ...props }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border border-re-border0 bg-white/6 px-3 py-1 text-xs font-semibold text-re-text1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;

