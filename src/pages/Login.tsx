import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [tabIndex, setTabIndex] = useState(0); // 0 = Iniciar Sesión, 1 = Registrarse
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tabIndex === 0) {
        // Modo Inicio de Sesión
        const { error: authError } = await signInWithEmail(email, password);
        if (authError) throw authError;

        navigate('/dashboard');
      } else {
        // Modo Registro
        const { error: authError } = await signUpWithEmail(email, password);
        if (authError) throw authError;

        setSuccessMsg('Registro exitoso. Revisa tu correo de confirmación o inicia sesión.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Revisa tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
            MoneyFlow
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Control financiero personal
          </Typography>
        </Box>

        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 1 }}>
          <Tab label="Iniciar Sesión" />
          <Tab label="Registrarse" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            {successMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Correo Electrónico"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
              mt: 1,
              borderRadius: 2,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : tabIndex === 0 ? (
              'Ingresar de forma segura'
            ) : (
              'Crear Cuenta'
            )}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;