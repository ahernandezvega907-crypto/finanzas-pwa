import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Profile {
  id: string;
  email: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
}

export const AdminSubscriptions: React.FC = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email, is_premium, premium_expires_at')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProfiles(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email === 'ahernandezvega907@gmail.com') {
      fetchProfiles();
    }
  }, [user]);

  if (user?.email !== 'ahernandezvega907@gmail.com') {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error">No tienes permisos para acceder a esta página.</Alert>
      </Container>
    );
  }

  const togglePremium = async (profileId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const expiresAt = newStatus
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_premium: newStatus,
          premium_expires_at: expiresAt,
        })
        .eq('id', profileId);

      if (updateError) throw updateError;
      await fetchProfiles();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar suscripción');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Administración de Suscripciones
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email / ID</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Expira</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.email || p.id}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.is_premium ? 'PREMIUM' : 'FREE'}
                      color={p.is_premium ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {p.premium_expires_at
                      ? new Date(p.premium_expires_at).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant={p.is_premium ? 'outlined' : 'contained'}
                      color={p.is_premium ? 'error' : 'success'}
                      size="small"
                      onClick={() => togglePremium(p.id, p.is_premium)}
                    >
                      {p.is_premium ? 'Cancelar Premium' : 'Activar Premium'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AdminSubscriptions;