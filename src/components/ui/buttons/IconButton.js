import React from "react";
import PropTypes from "prop-types";

/**
 * IconButton Component
 * A button component specifically for icons, replacing MUI IconButton
 * Follows Single Responsibility Principle - handles icon button interactions
 */
const IconButton = React.forwardRef(
  (
    {
      children,
      size = "medium",
      disabled = false,
      onClick,
      className = "",
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    // Build CSS classes based on props
    const baseClasses = ["btn", "btn-icon"];
    const sizeClasses = {
      small: "btn-icon-sm",
      medium: "",
      large: "btn-icon-lg",
    };

    const classes = [
      ...baseClasses,
      sizeClasses[size] || "",
      disabled ? "disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        className={classes}
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  "aria-label": PropTypes.string,
};

IconButton.displayName = "IconButton";

export default IconButton;
