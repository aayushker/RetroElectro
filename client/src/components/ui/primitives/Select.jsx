function Select({ className = "", children, ...props }) {
  return (
    <select
      className={[
        "w-full rounded-re-md border border-re-border0 bg-white/6 px-3 py-2.5 text-sm text-re-text0",
        "outline-none transition duration-re-2 ease-re-2",
        "focus:border-re-border1 focus:bg-white/8 focus:ring-2 focus:ring-re-accent0/35",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;

