import React from "react";
import PropTypes from "prop-types";

/**
 * TableCell Component
 * A table cell that replaces MUI TableCell
 * Follows Single Responsibility Principle - provides table cell structure
 */
const TableCell = ({ children, align = "left", className = "", ...props }) => {
  const alignClasses = {
    left: "",
    center: "text-center",
    right: "text-right",
  };

  const classes = [alignClasses[align] || "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <td className={classes} {...props}>
      {children}
    </td>
  );
};

TableCell.propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf(["left", "center", "right"]),
  className: PropTypes.string,
};

export default TableCell;
