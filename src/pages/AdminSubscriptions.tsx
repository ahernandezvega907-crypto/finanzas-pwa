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
  TextField,
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

  const [durationDays, setDurationDays] = useState<Record<string, string>>({});
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      // Antes: consulta directa a `profiles`, sujeta a RLS — desde el fix
      // del #5, un admin ya no puede leer filas ajenas ahí, solo la propia.
      // Ahora: RPC SECURITY DEFINER que valida el email de admin server-side
      // y devuelve todos los perfiles.
      const { data, error: fetchError } = await supabase.rpc('admin_list_profiles');

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

  const handleGrantPremium = async (profileId: string) => {
    const days = Number(durationDays[profileId] || 30);
    if (isNaN(days) || days <= 0) {
      alert('Ingresá una cantidad de días válida.');
      return;
    }

    setActionLoadingId(profileId);
    try {
      const { error: rpcError } = await supabase.rpc('grant_manual_premium', {
        target_user_id: profileId,
        duration_days: days,
      });
      if (rpcError) throw rpcError;
      await fetchProfiles();
    } catch (err: any) {
      alert(err.message || 'Error al activar Premium');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRevokePremium = async (profileId: string) => {
    setActionLoadingId(profileId);
    try {
      const { error: rpcError } = await supabase.rpc('revoke_manual_premium', {
        target_user_id: profileId,
      });
      if (rpcError) throw rpcError;
      await fetchProfiles();
    } catch (err: any) {
      alert(err.message || 'Error al cancelar Premium');
    } finally {
      setActionLoadingId(null);
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
                    {p.is_premium ? (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        disabled={actionLoadingId === p.id}
                        onClick={() => handleRevokePremium(p.id)}
                      >
                        {actionLoadingId === p.id ? 'Procesando...' : 'Cancelar Premium'}
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <TextField
                          size="small"
                          type="number"
                          label="Días"
                          value={durationDays[p.id] ?? '30'}
                          onChange={(e) =>
                            setDurationDays((prev) => ({ ...prev, [p.id]: e.target.value }))
                          }
                          sx={{ width: 90 }}
                        />
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={actionLoadingId === p.id}
                          onClick={() => handleGrantPremium(p.id)}
                        >
                          {actionLoadingId === p.id ? 'Procesando...' : 'Activar Premium'}
                        </Button>
                      </Box>
                    )}
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