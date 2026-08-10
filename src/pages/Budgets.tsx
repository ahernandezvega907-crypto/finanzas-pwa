import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Warning as WarningIcon } from '@mui/icons-material';
import { useBudgets, Budget } from '../features/budgets/hooks/useBudgets';
import { useCategories } from '../hooks/useCategories';

const Budgets: React.FC = () => {
  const { budgets, loading, error, saveBudget } = useBudgets();
  const { categories } = useCategories();

  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const expenseCategories = categories.filter((cat) => cat.type === 'expense');

  const handleOpen = (categoryId?: string, currentLimit?: number) => {
    setSelectedCategory(categoryId || '');
    setLimit(currentLimit ? currentLimit.toString() : '');
    setActionError(null);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit);
    if (!selectedCategory || isNaN(parsedLimit) || parsedLimit <= 0) {
      setActionError('Por favor ingresa un monto válido.');
      return;
    }

    setSubmitting(true);
    setActionError(null);

    const res = await saveBudget(selectedCategory, parsedLimit);
    setSubmitting(false);

    if (res.success) {
      handleClose();
    } else {
      setActionError(res.error || 'No se pudo guardar el presupuesto.');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Presupuestos
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Consumo en tiempo real para el mes en curso
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Establecer Límite
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : budgets.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary">
            No has configurado límites de presupuesto aún.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {budgets.map((b: Budget) => {
            const spent = b.spent_amount || 0;
            const progress = Math.min((spent / b.amount_limit) * 100, 100);
            const isExceeded = spent >= b.amount_limit;
            const isWarning = progress >= 75 && !isExceeded;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={b.id || b.category_id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 2,
                    borderLeft: isExceeded
                      ? '5px solid #d32f2f'
                      : isWarning
                      ? '5px solid #ed6c02'
                      : '5px solid #2e7d32',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {b.category_name}
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpen(b.category_id, b.amount_limit)}
                      >
                        Editar
                      </Button>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Límite: ${b.amount_limit.toLocaleString()}
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      color={isExceeded ? 'error' : isWarning ? 'warning' : 'success'}
                      sx={{ height: 10, borderRadius: 5, mb: 1.5 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Gastado: ${spent.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: b.remaining_amount < 0 ? 'error.main' : 'text.primary',
                        }}
                      >
                        {b.remaining_amount < 0
                          ? `Excedido por $${Math.abs(b.remaining_amount).toLocaleString()}`
                          : `Disponible: $${b.remaining_amount.toLocaleString()}`}
                      </Typography>
                    </Box>

                    {isExceeded && (
                      <Chip
                        icon={<WarningIcon />}
                        label="Presupuesto Superado"
                        color="error"
                        size="small"
                        sx={{ mt: 1.5, width: '100%' }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Modal para Ajustar Presupuesto */}
      <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="xs">
        <form onSubmit={handleSubmit}>
          <DialogTitle>Ajustar Límite de Presupuesto</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {actionError && <Alert severity="error">{actionError}</Alert>}

            <FormControl fullWidth required>
              <InputLabel id="budget-category-label">Categoría de Gasto</InputLabel>
              <Select
                labelId="budget-category-label"
                value={selectedCategory}
                label="Categoría de Gasto"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {expenseCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Monto Límite Mensual ($)"
              type="number"
              fullWidth
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
              slotProps={{ htmlInput: { min: 1, step: 'any' } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || !selectedCategory || !limit}
            >
              {submitting ? <CircularProgress size={24} /> : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Budgets;