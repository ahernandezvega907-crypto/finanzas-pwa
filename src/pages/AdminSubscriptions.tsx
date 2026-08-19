import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { supabase } from '../lib/supabase';

export const AdminSubscriptions: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleGrantPremium = async () => {
    if (!userId.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.rpc('grant_manual_premium', {
        target_user_id: userId.trim(),
        duration_days: Number(days),
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: `Plan Premium activado correctamente para el usuario por ${days} días.`,
      });
      setUserId('');
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Error al activar el plan Premium.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
          Administración de Suscripciones SINPE
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Activa manualmente el estado Premium a los usuarios tras verificar el comprobante de pago.
        </Typography>

        {message && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label="UUID del Usuario (Supabase User ID)"
            placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <TextField
            fullWidth
            type="number"
            label="Días de acceso Premium"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading || !userId.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <VerifiedIcon />}
            onClick={handleGrantPremium}
            sx={{ borderRadius: 2, fontWeight: 700, py: 1.2 }}
          >
            {loading ? 'Procesando...' : 'Activar Premium'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminSubscriptions;