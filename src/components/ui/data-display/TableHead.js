import React from "react";
import PropTypes from "prop-types";

/**
 * TableHead Component
 * The table header section that replaces MUI TableHead
 * Follows Single Responsibility Principle - provides table header structure
 */
const TableHead = ({ children, className = "", ...props }) => {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
};

TableHead.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default TableHead;
