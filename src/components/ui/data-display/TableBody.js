import React from "react";
import PropTypes from "prop-types";

/**
 * TableBody Component
 * The table body section that replaces MUI TableBody
 * Follows Single Responsibility Principle - provides table body structure
 */
const TableBody = ({ children, className = "", ...props }) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

TableBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default TableBody;
