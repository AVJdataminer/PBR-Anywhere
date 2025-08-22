import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  Search,
  SportsMotorsports,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ minHeight: 80 }}>
        {/* Logo and Brand */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            mr: 3,
          }}
          onClick={handleLogoClick}
        >
          <SportsMotorsports
            sx={{
              fontSize: 40,
              color: theme.palette.secondary.main,
              mr: 2,
            }}
          />
          <Box>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 800,
                color: theme.palette.secondary.main,
                lineHeight: 1,
                mb: -0.5,
              }}
            >
              PBR
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                lineHeight: 1,
                letterSpacing: '0.2em',
              }}
            >
              ANYWHERE
            </Typography>
          </Box>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Search Button */}
        {!isMobile && (
          <IconButton
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => navigate('/search')}
          >
            <Search />
          </IconButton>
        )}

        {/* Notifications */}
        {user && (
          <IconButton
            color="inherit"
            sx={{ mr: 2 }}
            onClick={handleNotificationMenuOpen}
          >
            <Badge badgeContent={3} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
        )}

        {/* User Menu */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="body2"
              sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}
            >
              Welcome, {user.username}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user.avatar ? (
                <Avatar
                  src={user.avatar}
                  sx={{ width: 40, height: 40 }}
                />
              ) : (
                <AccountCircle sx={{ fontSize: 40 }} />
              )}
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
                '&:hover': {
                  borderColor: theme.palette.secondary.light,
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                },
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuToggle}
            sx={{ ml: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.primary.main}`,
              mt: 1,
            },
          }}
        >
          <MenuItem onClick={handleProfileClick}>
            <AccountCircle sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => navigate('/settings')}>
            <AccountCircle sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <AccountCircle sx={{ mr: 2 }} />
            Sign Out
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.primary.main}`,
              mt: 1,
              minWidth: 300,
            },
          }}
        >
          <MenuItem>
            <Typography variant="subtitle2" color="primary">
              New PBR event scheduled: Austin Gambler Days
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography variant="subtitle2" color="primary">
              Recording completed: Missouri Thunder Days
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography variant="subtitle2" color="primary">
              Your favorite rider is competing tonight!
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
