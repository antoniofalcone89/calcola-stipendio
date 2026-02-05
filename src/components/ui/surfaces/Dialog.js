import React from "react";
import PropTypes from "prop-types";

/**
 * Dialog Component
 * Modal dialog for displaying content
 */
const Dialog = ({ open, onClose, children, className = "", ...props }) => {
  if (!open) return null;

  return (
    <>
      <div
        className={`dialog-backdrop ${className}`}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1299,
        }}
      />
      <div
        className="dialog"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "4px",
          boxShadow: "0 5px 25px rgba(0, 0, 0, 0.3)",
          zIndex: 1300,
          minWidth: "300px",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Dialog;
