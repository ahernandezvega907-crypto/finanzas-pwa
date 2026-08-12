import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Palette as PaletteIcon,
  Logout as LogoutIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Delete as DeleteIcon,
  Gavel as GavelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, setIsPinLocked } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Estados para la gestión del PIN
  const [pinCode, setPinCode] = useState('');
  const [hasExistingPin, setHasExistingPin] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Estado para la eliminación de cuenta
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const existing = localStorage.getItem('app_pin_code');
    if (existing) {
      setHasExistingPin(true);
      setPinCode(existing);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess('Perfil actualizado correctamente.');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    if (pinCode.length !== 4 || !/^\d+$/.test(pinCode)) {
      setPinError('El PIN debe ser exactamente de 4 dígitos numéricos.');
      return;
    }

    localStorage.setItem('app_pin_code', pinCode);
    setHasExistingPin(true);
    setSavedSuccess('PIN de seguridad guardado correctamente.');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleRemovePin = () => {
    localStorage.removeItem('app_pin_code');
    setPinCode('');
    setHasExistingPin(false);
    setSavedSuccess('PIN eliminado. La aplicación ya no solicitará código.');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleLockNow = () => {
    setIsPinLocked(true);
  };

  // Función para eliminar cuenta y limpiar Supabase (Derecho al Olvido)
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ ¿Estás completamente seguro de borrar tu cuenta?\n\nEsta acción eliminará de forma PERMANENTE e IRREVERSIBLE todos tus gastos, ingresos, presupuestos y configuraciones almacenadas. No podrás recuperar esta información.'
    );

    if (!confirmed) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      if (user) {
        // 1. Borrar registros asociados al perfil del usuario en Supabase (usando profile_id)
        await supabase.from('transactions').delete().eq('profile_id', user.id);
        await supabase.from('budgets').delete().eq('profile_id', user.id);
        await supabase.from('categories').delete().eq('profile_id', user.id);

        // 2. Limpiar datos de seguridad locales
        localStorage.removeItem('app_pin_code');

        // 3. Cerrar sesión y redireccionar
        await signOut();
        navigate('/login', { replace: true });
      }
    } catch (err: any) {
      console.error('Error al eliminar la cuenta:', err);
      setDeleteError('Ocurrió un problema al intentar eliminar tus datos. Por favor, intenta de nuevo.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Encabezado */}
      <Box>
        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 700 }}>
          Ajustes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestiona las preferencias de tu cuenta, seguridad y privacidad de datos.
        </Typography>
      </Box>

      {savedSuccess && (
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          {savedSuccess}
        </Alert>
      )}

      {deleteError && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {deleteError}
        </Alert>
      )}

      {/* Perfil de Usuario */}
      <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PersonIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Perfil de Usuario
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: '1.5rem', fontWeight: 'bold' }}>
            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {user?.id}
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSaveProfile} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre Completo"
            variant="outlined"
            size="small"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ingresa tu nombre"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Guardar Cambios
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Seguridad y PIN de Bloqueo */}
      <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LockIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Seguridad & PIN de Acceso
          </Typography>
        </Box>

        <Divider />

        {pinError && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {pinError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSavePin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Configura un PIN de 4 dígitos para proteger el acceso rápido a la aplicación en este dispositivo.
          </Typography>

          <TextField
            label="PIN de 4 dígitos"
            variant="outlined"
            size="small"
            type={showPin ? 'text' : 'password'}
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value.slice(0, 4))}
            slotProps={{
              htmlInput: {
                maxLength: 4,
                inputMode: 'numeric',
                pattern: '[0-9]*',
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPin(!showPin)} edge="end">
                      {showPin ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ maxWidth: 220 }}
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              {hasExistingPin ? 'Actualizar PIN' : 'Establecer PIN'}
            </Button>

            {hasExistingPin && (
              <>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleLockNow}
                  startIcon={<LockIcon />}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  Bloquear Ahora
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleRemovePin}
                  startIcon={<DeleteIcon />}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  Eliminar PIN
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Preferencias de la Aplicación */}
      <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PaletteIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Preferencias de Interfaz
          </Typography>
        </Box>

        <Divider />

        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                color="primary"
              />
            }
            label="Modo Oscuro (Dark Theme)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                color="primary"
              />
            }
            label="Notificaciones de Presupuesto y Alertas"
          />
        </Stack>
      </Paper>

      {/* Privacidad, Términos Legales & Gestión de Datos */}
      <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <GavelIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Privacidad & Legal
          </Typography>
        </Box>

        <Divider />

        <Typography variant="body2" color="text.secondary">
          Consulta nuestras políticas de tratamiento de datos o ejerce tus derechos de eliminación de la información almacenada en cumplimiento con las normativas internacionales de protección de datos.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/privacy-policy')}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Política de Privacidad
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/terms-of-service')}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Términos y Condiciones
          </Button>
        </Box>
      </Paper>

      {/* Cerrar Sesión */}
      <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Cerrar Sesión
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Finaliza tu sesión actual en este dispositivo de forma segura.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={() => signOut()}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Salir
        </Button>
      </Paper>

      {/* Zona Peligrosa: Eliminar Cuenta */}
      <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2, borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningIcon color="error" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'error.main' }}>
            Zona de Peligro: Eliminar Cuenta
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Esta acción eliminará de forma permanente e irreversible todas tus transacciones, categorías, presupuestos e historial. Cumple con la normativa del Derecho al Olvido (GDPR).
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            color="error"
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            onClick={handleDeleteAccount}
            disabled={deleting}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            {deleting ? 'Eliminando datos...' : 'Eliminar mi cuenta permanentemente'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;