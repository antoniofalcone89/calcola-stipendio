import React, { useState } from "react";
import { IconButton } from "./ui/buttons";
import { Typography } from "./ui/data-display";
import { Box } from "./ui/layout";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../contexts/AuthContext";

const UserMenu = () => {
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <>
      <IconButton
        id="user-menu-button"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        aria-label="Apri menu utente"
        onClick={handleClick}
        className="button-icon text-primary"
      >
        <MenuIcon color="rgb(189, 94, 0)" />
      </IconButton>
      <div
        id="user-menu"
        className={`dropdown-menu ${open ? "open" : ""}`}
        style={{ display: open ? "block" : "none" }}
      >
        <Box
          className="menu-header"
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "200px",
          }}
        >
          <div
            className="avatar"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--color-gray-200)",
            }}
          >
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser?.displayName || "User"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <PersonIcon fontSize="small" />
            )}
          </div>
          <Box style={{ overflow: "hidden" }}>
            <Typography
              variant="subtitle2"
              style={{
                fontWeight: "bold",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {currentUser?.displayName || "Utente"}
            </Typography>
            <Typography
              variant="caption"
              className="text-secondary"
              style={{
                display: "block",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {currentUser?.email}
            </Typography>
          </Box>
        </Box>
        <hr
          style={{
            margin: "4px 0",
            border: "none",
            borderTop: "1px solid var(--color-gray-200)",
          }}
        />
        <button
          className="menu-item"
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            width: "100%",
            textAlign: "left",
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <LogoutIcon fontSize="small" />
          Esci
        </button>
      </div>
      {open && (
        <div
          className="menu-backdrop"
          onClick={handleClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        />
      )}
    </>
  );
};

export default UserMenu;
