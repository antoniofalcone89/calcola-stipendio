import React from "react";
import PropTypes from "prop-types";

/**
 * Skeleton Component
 * A loading placeholder component that replaces MUI Skeleton
 * Follows Single Responsibility Principle - provides animated loading placeholders
 */
const Skeleton = ({
  variant = "text",
  width,
  height,
  className = "",
  animation = "pulse",
  ...props
}) => {
  // Build CSS classes based on props
  const baseClasses = ["skeleton"];
  const variantClasses = {
    text: "skeleton-text",
    rectangular: "skeleton-rectangular",
    circular: "skeleton-circular",
  };
  const animationClasses = {
    pulse: "skeleton-pulse",
    wave: "skeleton-wave",
  };

  const classes = [
    ...baseClasses,
    variantClasses[variant] || variantClasses.text,
    animationClasses[animation] || animationClasses.pulse,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Style object for dynamic width/height
  const style = {
    width: width || (variant === "text" ? "100%" : undefined),
    height:
      height ||
      (variant === "text"
        ? "1.2em"
        : variant === "circular"
          ? "40px"
          : undefined),
    ...props.style,
  };

  return <span className={classes} style={style} {...props} />;
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(["text", "rectangular", "circular"]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  animation: PropTypes.oneOf(["pulse", "wave"]),
  className: PropTypes.string,
};

export default Skeleton;
