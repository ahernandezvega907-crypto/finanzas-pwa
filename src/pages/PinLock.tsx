import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Avatar,
  Alert,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  BackspaceOutlined as BackspaceIcon,
  LogoutOutlined as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

interface PinLockProps {
  onSuccess?: () => void;
  savedPin?: string;
}

const PinLock: React.FC<PinLockProps> = ({ onSuccess, savedPin }) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setIsPinLocked, signOut } = useAuth();

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(null);

      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const verifyPin = (enteredPin: string) => {
    // Busca el PIN en localStorage, cae en el prop savedPin, o por defecto usa '1234'
    const validPin = localStorage.getItem('app_pin_code') || savedPin || '1234';

    if (enteredPin === validPin) {
      setIsPinLocked(false);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setError('PIN incorrecto. Intenta de nuevo.');
      setPin('');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 360,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <LockIcon fontSize="large" />
        </Avatar>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            MoneyFlow
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ingresa tu PIN de 4 dígitos para continuar
          </Typography>
        </Box>

        {/* Indicadores de Dígitos */}
        <Box sx={{ display: 'flex', gap: 2, my: 1 }}>
          {[0, 1, 2, 3].map((index) => (
            <Box
              key={index}
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: pin.length > index ? 'primary.main' : 'action.disabledBackground',
                border: '2px solid',
                borderColor: pin.length > index ? 'primary.main' : 'divider',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </Box>

        {error && (
          <Alert severity="error" sx={{ width: '100%', py: 0.5, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Teclado Numérico con CSS Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            maxWidth: 280,
            width: '100%',
          }}
        >
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <Button
              key={num}
              fullWidth
              variant="outlined"
              onClick={() => handleKeyPress(num)}
              sx={{
                height: 60,
                borderRadius: 3,
                fontSize: '1.5rem',
                fontWeight: 600,
                borderColor: 'divider',
              }}
            >
              {num}
            </Button>
          ))}
          <Box /> {/* Espacio vacío alineado a la izquierda */}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleKeyPress('0')}
            sx={{
              height: 60,
              borderRadius: 3,
              fontSize: '1.5rem',
              fontWeight: 600,
              borderColor: 'divider',
            }}
          >
            0
          </Button>
          <IconButton
            onClick={handleDelete}
            sx={{
              width: '100%',
              height: 60,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <BackspaceIcon />
          </IconButton>
        </Box>

        {/* Botón de salida/cierre de sesión si se olvida el PIN */}
        <Button
          startIcon={<LogoutIcon />}
          color="error"
          size="small"
          onClick={handleLogout}
          sx={{ textTransform: 'none', mt: 1 }}
        >
          Cerrar sesión
        </Button>
      </Paper>
    </Box>
  );
};

export default PinLock;