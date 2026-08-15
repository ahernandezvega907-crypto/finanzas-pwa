import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { useAuth } from '../context/AuthContext';
import { useCategories } from '../features/categories/hooks/useCategories';
import { budgetsRepository, BudgetRow } from '../features/budgets/repositories/budget.repository';
import { getUserFriendlyError } from '../lib/getUserFriendlyError';

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toISODate = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toISODate(start), end: toISODate(end) };
}

export const Budgets: React.FC = () => {
  const { user } = useAuth();
  const { categoriesQuery } = useCategories();
  const categories = categoriesQuery?.data || [];

  const [budgets, setBudgets] = useState<BudgetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [limitAmount, setLimitAmount] = useState('');

  const fetchBudgets = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await budgetsRepository.getAll(user.id);
      setBudgets(data);
    } catch (err) {
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedCategory || !limitAmount) return;

    const amount = Number(limitAmount);
    if (isNaN(amount) || amount <= 0) return;

    setSaving(true);
    setError(null);

    try {
      const { start, end } = getCurrentMonthRange();

      await budgetsRepository.createOrUpdate({
        profile_id: user.id,
        category_id: selectedCategory,
        amount_limit: amount,
        start_date: start,
        end_date: end,
      });

      await fetchBudgets();
      setOpenModal(false);
      setSelectedCategory('');
      setLimitAmount('');
    } catch (err) {
      setError(getUserFriendlyError(err));
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₡${amount.toLocaleString('es-CR', { minimumFractionDigits: 0 })}`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Presupuestos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Nuevo Presupuesto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : budgets.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary">
            No has configurado ningún presupuesto para este mes. Haz clic en "Nuevo Presupuesto" para comenzar.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {budgets.map((item) => {
            const spent = item.spent_amount || 0;
            const percentage = Math.min(Math.round((spent / item.amount_limit) * 100), 100);
            const isOver = spent > item.amount_limit;
            const categoryName = item.categories?.name || 'Categoría';

            return (
              <Paper key={item.id} sx={{ p: 2.5, borderRadius: 3, boxShadow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {categoryName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(spent)} de {formatCurrency(item.amount_limit)}
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  color={isOver ? 'error' : percentage > 85 ? 'warning' : 'primary'}
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                />

                {isOver && (
                  <Alert severity="error" sx={{ py: 0, px: 2, borderRadius: 2 }}>
                    Has excedido el límite por {formatCurrency(spent - item.amount_limit)}
                  </Alert>
                )}
              </Paper>
            );
          })}
        </Box>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Establecer Presupuesto del Mes</DialogTitle>

        <Box component="form" onSubmit={handleAddBudget}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              select
              label="Categoría"
              fullWidth
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Monto Límite (₡)"
              type="number"
              fullWidth
              required
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
            />
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenModal(false)} color="inherit" disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Presupuesto'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Budgets;