import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined';

const drawerWidth = 240;

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    name: 'Transacciones',
    path: '/transactions',
    icon: <ReceiptLongIcon />,
  },
  {
    name: 'Categorías',
    path: '/categories',
    icon: <CategoryIcon />,
  },
  {
    name: 'Presupuestos',
    path: '/budgets',
    icon: <AccountBalanceWalletIcon />,
  },
  {
    name: 'Reportes',
    path: '/reports',
    icon: <AssessmentIcon />,
  },
  {
    name: 'Gurú IA',
    path: '/ai-guru',
    icon: <AutoAwesomeIcon />,
  },
  {
    name: 'Soporte',
    path: '/soporte',
    icon: <HelpOutlineIcon />,
  },
  {
    name: 'Ajustes',
    path: '/settings',
    icon: <SettingsIcon />,
  },
];

export const AppLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          MoneyFlow
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => {
          const isSelected = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isSelected ? 'inherit' : 'action.active' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            MoneyFlow
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;