import React from "react";
import PropTypes from "prop-types";

/**
 * Table Component
 * The main table element that replaces MUI Table
 * Follows Single Responsibility Principle - provides table structure
 */
const Table = ({ children, size = "medium", className = "", ...props }) => {
  const sizeClasses = {
    small: "table-sm",
    medium: "",
    large: "table-lg",
  };

  const classes = ["table", sizeClasses[size] || "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <table className={classes} {...props}>
      {children}
    </table>
  );
};

Table.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
};

export default Table;
