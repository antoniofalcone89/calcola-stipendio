import React, { useState, useEffect, memo } from "react";
import { Typography } from "./ui/data-display";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../contexts/AuthContext";

const UserMenu = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger-btn ${isOpen ? "active" : ""}`}
        onClick={handleToggle}
        aria-label={isOpen ? "Chiudi menu" : "Apri menu utente"}
        aria-expanded={isOpen}
        aria-controls="fullscreen-menu"
      >
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Fullscreen Menu */}
      <div
        id="fullscreen-menu"
        className={`fullscreen-menu ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu utente"
      >
        <div className="fullscreen-menu-content">
          {/* User Info */}
          <div className="menu-user-info">
            <div className="menu-user-avatar">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser?.displayName || "User"}
                />
              ) : (
                <PersonIcon />
              )}
            </div>
            <Typography variant="h5" className="menu-user-name">
              {currentUser?.displayName || "Utente"}
            </Typography>
            <Typography variant="body2" className="menu-user-email">
              {currentUser?.email}
            </Typography>
          </div>

          {/* Menu Items */}
          <div className="menu-items">
            <button className="menu-item-btn" onClick={handleLogout}>
              <LogoutIcon />
              Esci
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(UserMenu);
