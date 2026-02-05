import React from "react";
import PropTypes from "prop-types";

/**
 * Button Component
 * A customizable button component that replaces MUI Button
 * Follows Single Responsibility Principle - handles button rendering and interactions
 */
const Button = React.forwardRef(
  (
    {
      children,
      variant = "contained",
      size = "medium",
      disabled = false,
      fullWidth = false,
      type = "button",
      onClick,
      className = "",
      ...props
    },
    ref,
  ) => {
    // Build CSS classes based on props
    const baseClasses = ["btn"];
    const variantClasses = {
      contained: "btn-contained",
      outlined: "btn-outlined",
      text: "btn-text",
    };
    const sizeClasses = {
      small: "btn-sm",
      medium: "",
      large: "btn-lg",
    };

    const classes = [
      ...baseClasses,
      variantClasses[variant] || variantClasses.contained,
      sizeClasses[size] || "",
      fullWidth ? "btn-full" : "",
      disabled ? "disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["contained", "outlined", "text"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.displayName = "Button";

export default Button;
