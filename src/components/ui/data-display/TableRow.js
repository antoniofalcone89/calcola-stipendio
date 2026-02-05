import React from "react";
import PropTypes from "prop-types";

/**
 * TableRow Component
 * A table row that replaces MUI TableRow
 * Follows Single Responsibility Principle - provides table row structure
 */
const TableRow = ({ children, className = "", ...props }) => {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
};

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default TableRow;
