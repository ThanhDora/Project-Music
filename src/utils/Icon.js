import React from "react";
import { renderToString } from "react-dom/server";

export function renderIcon(IconComponent, props = {}) {
  const defaultProps = {
    size: 20,
    color: "currentColor",
    className: "",
    ...props,
  };
  const iconElement = React.createElement(IconComponent, defaultProps);
  return renderToString(iconElement);
}
