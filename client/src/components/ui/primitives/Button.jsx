import React from "react";

function Button({
  as = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const sizeClassName =
    size === "sm"
      ? "px-3 py-1.5 text-sm rounded-full"
      : size === "lg"
        ? "px-5 py-3 text-base rounded-full"
        : "px-4 py-2.5 text-sm rounded-full";

  const variantClassName =
    variant === "ghost"
      ? "bg-transparent border border-re-border0 text-re-text0 hover:border-re-border1 hover:bg-white/5"
      : variant === "soft"
        ? "bg-white/8 border border-re-border0 text-re-text0 hover:bg-white/12 hover:border-re-border1"
        : "bg-white text-black hover:bg-re-accent1";

  const base =
    "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition duration-re-2 ease-re-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-re-accent0/60 focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed";

  return React.createElement(
    as,
    {
      className: `${base} ${sizeClassName} ${variantClassName} ${className}`,
      ...props,
    },
    children,
  );
}

export default Button;

