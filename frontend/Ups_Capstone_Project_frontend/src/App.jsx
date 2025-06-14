import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import {
  CssBaseline, AppBar, Toolbar, Typography, Button, Box, Container, Stack,
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';

import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';
import DashboardPage from './components/DashboardPage';
import AnalyticsPage from './components/AnalyticsPage';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './components/RegisterPage';
import ConfirmationPage from './components/ConfirmationPage';
import { AuthProvider, useAuth } from './auth/AuthContext';
import theme from './theme';

function App() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const profileMenuOpen = Boolean(profileAnchor);

  const noAppBarPaths = ['/login', '/register', '/confirmation'];
  const shouldShowAppBar = !noAppBarPaths.includes(location.pathname);

  const navItems = [
    { label: 'Upload', path: '/upload', icon: <CloudUploadIcon /> },
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
  ];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const closeProfile = () => {
    setProfileAnchor(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeProfile();
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {shouldShowAppBar && (
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
              <Container maxWidth="lg">
                <Toolbar sx={{ px: { xs: 0 } }}>
                  {isAuthenticated && (
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      edge="start"
                      onClick={handleMenuClick}
                      sx={{ mr: 2 }}
                    >
                      <MenuIcon />
                    </IconButton>
                  )}
                  <Typography
                    variant="h6"
                    sx={{
                      flexGrow: 1,
                      fontWeight: 500,
                      cursor: 'pointer',
                      userSelect: 'none',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => navigate(isAuthenticated ? '/upload' : '/login')}
                  >
                    <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.1em' }}>P</Box>ackage&nbsp;
                    <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.1em' }}>A</Box>nalysis &&nbsp;
                    <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.1em' }}>R</Box>erouting&nbsp;
                    <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.1em' }}>S</Box>ystem
                  </Typography>
                  {isAuthenticated && (
                    <Box sx={{ ml: 'auto' }}>
                      <IconButton color="inherit" onClick={handleProfileClick}>
                        <AccountCircle />
                      </IconButton>
                      <Menu
                        anchorEl={profileAnchor}
                        open={profileMenuOpen}
                        onClose={closeProfile}
                      >
                        <MenuItem disabled>
                          <ListItemIcon>
                            <AccountCircle fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={user?.username || 'User'}
                            secondary={user?.email || 'email@example.com'}
                          />
                        </MenuItem>
                        <MenuItem onClick={() => {
                          navigate('/settings');
                          closeProfile();
                        }}>
                          <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Settings</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                          <ListItemIcon>
                            <ExitToAppIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Logout</ListItemText>
                        </MenuItem>
                      </Menu>
                    </Box>
                  )}
                </Toolbar>
              </Container>
            </AppBar>
          )}

          {isAuthenticated && (
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            >
              {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <MenuItem
                  key={item.label}
                  onClick={() => handleMenuItemClick(item.path)}
                  sx={{
                    fontWeight: isActive ? 'bold' : 'normal',
                    textDecoration: isActive ? 'underline' : 'none',
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'primary.main' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </MenuItem>
              );
            })}

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          )}

          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', py: 4 }}>
            <Container maxWidth="lg">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/upload" : "/login"} />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
