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
  Chip,
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
  WorkspacePremium as WorkspacePremiumIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SinpePaymentModal } from '../components/SinpePaymentModal';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, setIsPinLocked } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Estados de suscripción Premium y Modal SINPE
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState<string | null>(null);
  const [showSinpeModal, setShowSinpeModal] = useState<boolean>(false);

  // Clave dinámica de almacenamiento para aislar el PIN por usuario
  const pinStorageKey = user?.id ? `app_pin_code_${user.id}` : null;

  // Estados para la gestión del PIN
  const [pinCode, setPinCode] = useState('');
  const [hasExistingPin, setHasExistingPin] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Estado para la eliminación de cuenta
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!pinStorageKey) return;
    const existing = localStorage.getItem(pinStorageKey);
    if (existing) {
      setHasExistingPin(true);
    }
  }, [pinStorageKey]);

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      if (!user?.id) return;
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium, premium_expires_at')
          .eq('id', user.id)
          .single();

        if (profile) {
          setIsPremium(!!profile.is_premium);
          setPremiumExpiresAt(profile.premium_expires_at);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchPremiumStatus();
  }, [user?.id]);

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

    if (!pinStorageKey) {
      setPinError('No se pudo verificar tu sesión. Intenta iniciar sesión de nuevo.');
      return;
    }

    localStorage.setItem(pinStorageKey, pinCode);
    setHasExistingPin(true);
    setSavedSuccess('PIN de seguridad guardado correctamente.');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleRemovePin = () => {
    if (!pinStorageKey) return;
    localStorage.removeItem(pinStorageKey);
    setPinCode('');
    setHasExistingPin(false);
    setSavedSuccess('PIN eliminado. La aplicación ya no solicitará código.');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleLockNow = () => {
    setIsPinLocked(true);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ ¿Estás completamente seguro de borrar tu cuenta?\n\nEsta acción eliminará de forma PERMANENTE e IRREVERSIBLE todos tus gastos, ingresos, presupuestos, configuraciones y tu cuenta de acceso (correo/contraseña). No podrás recuperar esta información.'
    );

    if (!confirmed) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Tu sesión expiró. Inicia sesión de nuevo.');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

      const response = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          apikey: supabaseAnonKey,
        },
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(responseBody?.error || `Error del servidor (${response.status}).`);
      }

      if (pinStorageKey) {
        localStorage.removeItem(pinStorageKey);
      }

      await signOut();
      navigate('/login', { replace: true });
    } catch (err: any) {
      console.error('Error al eliminar la cuenta:', err);
      setDeleteError(
        err.message || 'Ocurrió un problema al intentar eliminar tu cuenta. Por favor, intenta de nuevo.'
      );
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
          Gestiona la suscripción de tu cuenta, seguridad y privacidad de datos.
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

      {/* Plan de Suscripción */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: isPremium
            ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
            : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid',
          borderColor: isPremium ? '#6366f1' : '#334155',
          color: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <WorkspacePremiumIcon sx={{ color: isPremium ? '#eab308' : '#94a3b8', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Plan de Suscripción
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                MoneyFlow Guru Cloud
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={isPremium ? <StarIcon sx={{ fontSize: '1rem !important', color: '#fff' }} /> : undefined}
            label={isPremium ? 'PREMIUM ACTIVO' : 'PLAN GRATUITO'}
            color={isPremium ? 'primary' : 'default'}
            sx={{
              fontWeight: 800,
              px: 1,
              bgcolor: isPremium ? '#6366f1' : '#334155',
              color: '#fff',
            }}
          />
        </Box>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            {isPremium ? (
              <Box>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  Tienes acceso ilimitado a transacciones, presupuestos, exportación PDF/Excel y 20 consultas diarias con el Gurú IA.
                </Typography>
                {premiumExpiresAt && (
                  <Typography variant="caption" sx={{ color: '#818cf8', display: 'block', mt: 1 }}>
                    Vence el: {new Date(premiumExpiresAt).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  Estás en el Plan Gratuito (límite de 250 movimientos y 5 consultas/día al Gurú IA). Actualiza a Premium para desbloquear todo el potencial.
                </Typography>
              </Box>
            )}
          </Box>

          {!isPremium && (
            <Button
              variant="contained"
              onClick={() => setShowSinpeModal(true)}
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Obtener Premium (₡2.990/mes)
            </Button>
          )}
        </Box>
      </Paper>

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
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderColor: 'error.main',
          borderWidth: 1,
          borderStyle: 'solid',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningIcon color="error" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'error.main' }}>
            Zona de Peligro: Eliminar Cuenta
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Esta acción eliminará de forma permanente e irreversible todas tus transacciones, categorías, presupuestos, historial de uso del Gurú IA, y tu cuenta de acceso completa, conforme a tu derecho de cancelación bajo la Ley 8968.
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
            {deleting ? 'Eliminando cuenta...' : 'Eliminar mi cuenta permanentemente'}
          </Button>
        </Box>
      </Paper>

      {/* Modal SINPE */}
      <SinpePaymentModal
      visible={showSinpeModal}
      onClose={() => setShowSinpeModal(false)}
      sinpePhone="89855110"
      sinpeOwner="Armando Hernández"
      plan="mensual"
      />
    </Box>
  );
};

export default Settings;