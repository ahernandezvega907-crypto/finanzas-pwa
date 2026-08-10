import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertColor, useTheme, useMediaQuery } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Error as ErrorOutlineIcon, Warning as WarningAmberIcon, Info as InfoOutlinedIcon } from '@mui/icons-material';

interface NotificationContextType {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyWarning: (message: string) => void;
  notifyInfo: (message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [duration, setDuration] = useState(2500);

  const showNotification = useCallback((msg: string, sev: AlertColor, dur: number) => {
    setMessage(msg);
    setSeverity(sev);
    setDuration(dur);
    setOpen(true);
  }, []);

  const notifySuccess = useCallback((msg: string) => showNotification(msg, 'success', 2500), [showNotification]);
  const notifyError = useCallback((msg: string) => showNotification(msg, 'error', 5000), [showNotification]);
  const notifyWarning = useCallback((msg: string) => showNotification(msg, 'warning', 4000), [showNotification]);
  const notifyInfo = useCallback((msg: string) => showNotification(msg, 'info', 3000), [showNotification]);

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  // Mapeo semántico de iconos institucionales con casteo dinámico preventivo
  const getIcon = () => {
    const customTheme = theme as any;
    switch (severity) {
      case 'success': 
        return <CheckCircleIcon fontSize="small" style={{ color: customTheme.custom?.income || '#10b981' }} />;
      case 'error': 
        return <ErrorOutlineIcon fontSize="small" style={{ color: customTheme.custom?.expense || '#ef4444' }} />;
      case 'warning': 
        return <WarningAmberIcon fontSize="small" style={{ color: '#f59e0b' }} />;
      default: 
        return <InfoOutlinedIcon fontSize="small" style={{ color: theme.palette.primary.main }} />;
    }
  };

  const customTheme = theme as any;

  return (
    <NotificationContext.Provider value={{ notifySuccess, notifyError, notifyWarning, notifyInfo }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isMobile ? 'center' : 'right',
        }}
      >
        <Alert
          onClose={handleClose}
          icon={getIcon()}
          sx={{
            width: '100%',
            minWidth: isMobile ? '90vw' : '320px',
            backgroundColor: customTheme.custom?.card || 'background.paper',
            color: 'text.primary',
            boxShadow: theme.shadows[4],
            borderRadius: `${theme.shape?.borderRadius || 8}px`,
            border: `1px solid ${customTheme.custom?.border || 'rgba(0,0,0,0.08)'}`,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            '& .MuiAlert-message': { fontSize: '0.875rem' }
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  return context;
};