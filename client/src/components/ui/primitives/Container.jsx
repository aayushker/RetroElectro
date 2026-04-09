import React from "react";

function Container({ as = "div", className = "", children, ...props }) {
  return React.createElement(
    as,
    {
      className: `mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`,
      ...props,
    },
    children,
  );
}

export default Container;

