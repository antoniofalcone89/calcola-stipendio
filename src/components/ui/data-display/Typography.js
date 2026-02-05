import React from "react";
import PropTypes from "prop-types";

/**
 * Typography Component
 * A text component that replaces MUI Typography
 * Follows Single Responsibility Principle - handles text styling and hierarchy
 */
const Typography = ({
  children,
  variant = "body1",
  component,
  className = "",
  ...props
}) => {
  // Map variants to CSS classes
  const variantClasses = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    body1: "",
    body2: "text-secondary",
    caption: "text-secondary font-sm",
    overline: "text-secondary font-sm uppercase tracking-wide",
  };

  const classes = [variantClasses[variant] || "", className]
    .filter(Boolean)
    .join(" ");

  // Determine the HTML element to use
  const Component =
    component ||
    (() => {
      switch (variant) {
        case "h1":
          return "h1";
        case "h2":
          return "h2";
        case "h3":
          return "h3";
        case "h4":
          return "h4";
        case "h5":
          return "h5";
        case "h6":
          return "h6";
        default:
          return "p";
      }
    })();

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

Typography.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "body1",
    "body2",
    "caption",
    "overline",
  ]),
  component: PropTypes.elementType,
  className: PropTypes.string,
};

export default Typography;
