import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Skeleton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export const CategoriesView: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const fetchCategories = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`profile_id.is.null,profile_id.eq.${user.id}`);

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user?.id]);

  const handleCreateCategory = async () => {
    if (!newCatName.trim() || !user?.id) return;
    try {
      const { error } = await supabase.from('categories').insert([
        {
          name: newCatName.trim(),
          profile_id: user.id
        }
      ]);

      if (error) throw error;
      setNewCatName('');
      setOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Error creando categoría:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Categorías
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona tus clasificaciones globales y personalizadas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}
        >
          Nueva Categoría
        </Button>
      </Box>

      {loading ? (
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
      ) : (
        <Grid container spacing={2}>
          {categories.map((cat) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.id}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {cat.name}
                  </Typography>
                  <Chip
                    label={cat.profile_id ? 'Personal' : 'Sistema'}
                    color={cat.profile_id ? 'primary' : 'default'}
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo Crear Categoría */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Nueva Categoría</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Categoría"
            type="text"
            fullWidth
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateCategory} variant="contained" disabled={!newCatName.trim()}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoriesView;