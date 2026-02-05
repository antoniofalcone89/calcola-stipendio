import React from "react";
import PropTypes from "prop-types";

/**
 * Grid Component
 * A CSS Grid layout component that replaces MUI Grid
 * Follows Single Responsibility Principle - provides grid-based layout
 */
const Grid = ({
  children,
  container = false,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl, // Grid breakpoints
  spacing = 0,
  className = "",
  ...props
}) => {
  let classes = [className];

  if (container) {
    classes.push("grid");

    // Add responsive grid classes
    if (xs) classes.push(`grid-cols-${xs}`);
    if (sm) classes.push(`grid-cols-sm-${sm}`);
    if (md) classes.push(`grid-cols-md-${md}`);
    if (lg) classes.push(`grid-cols-lg-${lg}`);
    if (xl) classes.push(`grid-cols-xl-${xl}`);

    // Handle spacing (convert MUI spacing to our gap system)
    if (spacing > 0) {
      const gapClass = `gap-${spacing}`;
      classes.push(gapClass);
    }
  }

  if (item) {
    // For grid items, we could add span classes if needed
    // For now, we'll rely on CSS Grid auto-placement
  }

  const finalClass = classes.filter(Boolean).join(" ");

  return (
    <div className={finalClass} {...props}>
      {children}
    </div>
  );
};

Grid.propTypes = {
  children: PropTypes.node,
  container: PropTypes.bool,
  item: PropTypes.bool,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  spacing: PropTypes.number,
  className: PropTypes.string,
};

export default Grid;
