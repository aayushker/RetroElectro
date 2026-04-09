function Select({ className = "", children, ...props }) {
  return (
    <select
      className={[
        "w-full rounded-re-md border border-white/65 bg-white px-3 py-2.5 text-sm text-slate-900",
        "outline-none transition duration-re-2 ease-re-2",
        "focus:border-white focus:bg-white focus:ring-2 focus:ring-re-accent0/35",
        "disabled:cursor-not-allowed disabled:bg-white/75 disabled:text-slate-500",
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
