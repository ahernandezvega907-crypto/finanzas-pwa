import React, { useState, useMemo } from 'react';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { useCategories } from '../features/categories/hooks/useCategories';

interface Budget {
  id: string;
  categoryId: string;
  limitAmount: number;
}

export const Budgets: React.FC = () => {
  const { transactions, loading: loadingTx } = useTransactions();
  const { categoriesQuery } = useCategories();
  const categories = categoriesQuery?.data || [];

  // Persistencia local de presupuestos
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('moneyflow_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [limitAmount, setLimitAmount] = useState('');

  const saveBudgets = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    localStorage.setItem('moneyflow_budgets', JSON.stringify(newBudgets));
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !limitAmount) return;

    const amount = Number(limitAmount);
    if (isNaN(amount) || amount <= 0) return;

    // Si la categoría ya tiene un presupuesto, lo actualiza; si no, agrega uno nuevo
    const existingIndex = budgets.findIndex((b) => b.categoryId === selectedCategory);
    let updated: Budget[];

    if (existingIndex >= 0) {
      updated = [...budgets];
      updated[existingIndex].limitAmount = amount;
    } else {
      updated = [
        ...budgets,
        {
          id: crypto.randomUUID(),
          categoryId: selectedCategory,
          limitAmount: amount,
        },
      ];
    }

    saveBudgets(updated);
    setOpenModal(false);
    setSelectedCategory('');
    setLimitAmount('');
  };

  const handleDeleteBudget = (id: string) => {
    const updated = budgets.filter((b) => b.id !== id);
    saveBudgets(updated);
  };

  // Mapeo del consumo actual por categoría frente al límite
  const budgetProgress = useMemo(() => {
    return budgets.map((b) => {
      const category = categories.find((c: any) => c.id === b.categoryId);
      const categoryName = category ? category.name : 'Categoría Desconocida';

      const spent = transactions
        .filter((tx: any) => tx.type === 'expense' && (tx.category_id === b.categoryId || tx.categoryId === b.categoryId))
        .reduce((sum: number, tx: any) => sum + (Number(tx.amount) || 0), 0);

      const percentage = Math.min(Math.round((spent / b.limitAmount) * 100), 100);
      const isOver = spent > b.limitAmount;

      return {
        ...b,
        categoryName,
        spent,
        percentage,
        isOver,
      };
    });
  }, [budgets, transactions, categories]);

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

      {loadingTx ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : budgetProgress.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary">
            No has configurado ningún presupuesto. Haz clic en "Nuevo Presupuesto" para comenzar.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {budgetProgress.map((item) => (
            <Paper key={item.id} sx={{ p: 2.5, borderRadius: 3, boxShadow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {item.categoryName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(item.spent)} de {formatCurrency(item.limitAmount)}
                  </Typography>
                  <Tooltip title="Eliminar Presupuesto">
                    <IconButton size="small" color="error" onClick={() => handleDeleteBudget(item.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={item.percentage}
                color={item.isOver ? 'error' : item.percentage > 85 ? 'warning' : 'primary'}
                sx={{ height: 10, borderRadius: 5, mb: 1 }}
              />

              {item.isOver && (
                <Alert severity="error" sx={{ py: 0, px: 2, borderRadius: 2 }}>
                  Has excedido el límite por {formatCurrency(item.spent - item.limitAmount)}
                </Alert>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {/* Modal para Crear Presupuesto */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Establecer Presupuesto</DialogTitle>

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
            <Button onClick={() => setOpenModal(false)} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Guardar Presupuesto
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Budgets;