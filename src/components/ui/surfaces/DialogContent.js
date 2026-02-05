import React from "react";
import PropTypes from "prop-types";

/**
 * DialogContent Component
 * Content section of a dialog
 */
const DialogContent = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`dialog-content ${className}`}
      style={{
        padding: "20px 24px",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

DialogContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default DialogContent;
