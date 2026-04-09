function Input({ className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-re-md border border-re-border0 bg-white/6 px-3 py-2.5 text-sm text-re-text0",
        "placeholder:text-re-text2 outline-none transition duration-re-2 ease-re-2",
        "focus:border-re-border1 focus:bg-white/8 focus:ring-2 focus:ring-re-accent0/35",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export default Input;

