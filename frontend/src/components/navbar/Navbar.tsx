import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Logo from "../logo/Logo";
import useAuth from "../../store/useAuth";

// pages to show in navigation for authenticated users
const userPages = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Cart", path: "/cart" },
  { name: "Favorites", path: "/favorites" },
  { name: "Orders", path: "/orders" },
];

// pages to show in navigation for guests
const guestPages = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
];

// user settings (top-right avatar menu)
const settings = ["Profile", "Account", "Logout"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { isAuthenticated, user, role, logout } = useAuth();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  // Get pages based on authentication and role
  const getPages = () => {
    if (!isAuthenticated) return guestPages;
    
    if (role === 'admin') {
      return [
        { name: "Admin Dashboard", path: "/admin" },
        { name: "Products", path: "/products" },
      ];
    }
    
    return userPages;
  };

  const pages = getPages();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: '#102040',
        borderRadius: '1.5rem',
        boxShadow: '0 2px 12px 0 rgba(44, 62, 80, 0.08)',
        fontFamily: 'Inter, sans-serif',
        mt: 2,
        mx: 2,
        px: 2,
        py: 1,
        border: '1px solid #1769FA',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '64px' }}>
          {/* Logo on the left */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Logo width={40} height={40} textDirection="Row" />
              <Typography
                variant="h6"
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  color: '#1769FA',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.05em',
                }}
              >
                Nexora
              </Typography>
            </Link>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  color: '#F9FAFB',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2.5,
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  '&:hover': {
                    background: '#1769FA',
                    color: '#fff',
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
            
            {!isAuthenticated ? (
              <Button
                component={Link}
                to="/login"
                sx={{
                  background: '#1769FA',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  boxShadow: '0 2px 8px 0 rgba(44, 62, 80, 0.12)',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  ml: 2,
                  '&:hover': {
                    background: '#2563EB',
                  },
                }}
              >
                Login
              </Button>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0 }}
                >
                  <Avatar sx={{ bgcolor: '#1769FA', width: 32, height: 32 }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : (role === 'admin' ? 'A' : 'U')}
                  </Avatar>
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* User Info Header */}
                  <MenuItem sx={{ cursor: 'default', '&:hover': { backgroundColor: 'transparent' } }}>
                    <Typography textAlign="center" sx={{ fontFamily: 'Inter, sans-serif', color: '#1769FA', fontWeight: 700, fontSize: '0.9rem' }}>
                      {user?.name || 'User'}
                    </Typography>
                  </MenuItem>
                  <MenuItem sx={{ cursor: 'default', '&:hover': { backgroundColor: 'transparent' } }}>
                    <Typography textAlign="center" sx={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', fontWeight: 400, fontSize: '0.8rem' }}>
                      {role === 'admin' ? 'Administrator' : 'Customer'}
                    </Typography>
                  </MenuItem>
                  
                  {/* Menu Items */}
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
                      <Typography textAlign="center" sx={{ 
                        fontFamily: 'Inter, sans-serif', 
                        color: setting === 'Logout' ? '#DC2626' : '#102040', 
                        fontWeight: setting === 'Logout' ? 600 : 500 
                      }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" sx={{ fontFamily: 'Inter, sans-serif', color: '#102040', fontWeight: 500 }}>
                    <Link to={page.path} style={{ color: '#102040', textDecoration: 'none', fontWeight: 500 }}>{page.name}</Link>
                  </Typography>
                </MenuItem>
              ))}
              {!isAuthenticated ? (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to="/login" style={{ color: '#1769FA', textDecoration: 'none', fontWeight: 700 }}>Login</Link>
                </MenuItem>
              ) : (
                [
                  (
                    <MenuItem key="user-name" sx={{ cursor: 'default', '&:hover': { backgroundColor: 'transparent' } }}>
                      <Typography textAlign="center" sx={{ fontFamily: 'Inter, sans-serif', color: '#1769FA', fontWeight: 700 }}>
                        {user?.name || 'User'}
                      </Typography>
                    </MenuItem>
                  ),
                  (
                    <MenuItem key="user-role" sx={{ cursor: 'default', '&:hover': { backgroundColor: 'transparent' } }}>
                      <Typography textAlign="center" sx={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', fontWeight: 400, fontSize: '0.9rem' }}>
                        {role === 'admin' ? 'Administrator' : 'Customer'}
                      </Typography>
                    </MenuItem>
                  ),
                  (
                    <MenuItem key="logout" onClick={handleLogout}>
                      <Typography textAlign="center" sx={{ fontFamily: 'Inter, sans-serif', color: '#dc2626', fontWeight: 600 }}>
                        Logout
                      </Typography>
                    </MenuItem>
                  )
                ]
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
