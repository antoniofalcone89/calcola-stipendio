import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Typography, Box, Avatar, Divider, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';

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
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-label="Apri menu utente"
        onClick={handleClick}
        sx={{ color: 'primary.main' }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'user-menu-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 200 }}>
          <Avatar 
            src={currentUser?.photoURL} 
            alt={currentUser?.displayName || 'User'}
            sx={{ width: 32, height: 32 }}
          >
            {!currentUser?.photoURL && <PersonIcon />}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" noWrap fontWeight="bold">
              {currentUser?.displayName || 'Utente'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap display="block">
              {currentUser?.email}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Esci
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
