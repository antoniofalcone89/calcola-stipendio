import React from "react";
import PropTypes from "prop-types";

/**
 * DialogTitle Component
 * Title section of a dialog
 */
const DialogTitle = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`dialog-title ${className}`}
      style={{
        padding: "20px 24px",
        borderBottom: "1px solid #e0e0e0",
        margin: 0,
        fontSize: "1.25rem",
        fontWeight: 500,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

DialogTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default DialogTitle;
