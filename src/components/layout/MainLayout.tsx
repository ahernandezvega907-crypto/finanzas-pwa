import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Drawer, Typography, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';

const DRAWER_WIDTH = 260;

export const MainLayout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Presupuestos', icon: <AccountBalanceWalletIcon />, path: '/budgets' },
    { text: 'Reportes', icon: <AssessmentIcon />, path: '/reports' },
  ];

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        width: '100vw', 
        maxWidth: '100%',
        minHeight: '100vh', 
        bgcolor: theme.palette.mode === 'dark' ? '#09090b' : '#f4f4f5',
        overflow: 'hidden'
      }}
    >
      {/* Barra de Navegación Lateral Fija */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: '0.5px' }}>
            MoneyFlow
          </Typography>
        </Box>
        <Divider sx={{ opacity: 0.6 }} />
        
        <List sx={{ px: 2, py: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: `${theme.shape?.borderRadius || 8}px`,
                  py: 1.2,
                  px: 2,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                    color: isActive ? 'primary.main' : 'text.primary',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500 }}>
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      {/* Contenedor Principal Flexbox Moderno */}
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, 
          overflow: 'auto',
          p: { xs: 2, sm: 3, md: 4 },
          boxSizing: 'border-box',
        }}
      >
        {/* Box interior crítico que estabiliza el comportamiento del Outlet */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};