import React from "react";

function Surface({
  as = "div",
  variant = "glass",
  raised = false,
  className = "",
  children,
  ...props
}) {
  const variantClassName =
    variant === "solid"
      ? "bg-re-surface1 border border-re-border0 shadow-re-0"
      : "re-glass shadow-re-0";

  return React.createElement(
    as,
    {
      className: [
        "rounded-re-xl",
        variantClassName,
        raised ? "re-raise" : "",
        className,
      ]
        .filter(Boolean)
        .join(" "),
      ...props,
    },
    children,
  );
}

export default Surface;

