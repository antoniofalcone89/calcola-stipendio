import React from "react";
import PropTypes from "prop-types";

/**
 * DialogActions Component
 * Actions/buttons section of a dialog
 */
const DialogActions = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`dialog-actions ${className}`}
      style={{
        padding: "16px 24px",
        borderTop: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "flex-end",
        gap: "8px",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

DialogActions.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default DialogActions;
