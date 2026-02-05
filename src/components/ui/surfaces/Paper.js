import React from "react";
import PropTypes from "prop-types";

/**
 * Paper Component
 * A surface component that replaces MUI Paper
 * Follows Single Responsibility Principle - provides elevated surface styling
 */
const Paper = ({ children, elevation = 1, className = "", ...props }) => {
  // Map elevation to our CSS classes
  const elevationClasses = {
    0: "paper-flat",
    1: "paper",
    2: "paper-elevated",
    3: "paper-elevated",
    4: "paper-elevated",
    5: "paper-elevated",
  };

  const classes = [elevationClasses[elevation] || "paper", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Paper.propTypes = {
  children: PropTypes.node,
  elevation: PropTypes.number,
  className: PropTypes.string,
};

export default Paper;
