import React from "react";
import PropTypes from "prop-types";

/**
 * TableContainer Component
 * A wrapper for table components that provides scrolling and styling
 * Follows Single Responsibility Principle - handles table container layout
 */
const TableContainer = ({ children, className = "", ...props }) => {
  const classes = ["table-container", className].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

TableContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default TableContainer;
