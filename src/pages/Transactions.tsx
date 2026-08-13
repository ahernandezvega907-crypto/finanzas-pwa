import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { useCategories } from '../features/categories/hooks/useCategories';

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', () => {
    window.location.reload();
  });
}

export const Transactions: React.FC = () => {
  const { transactions, loading, error, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categoriesQuery } = useCategories();
  const loadedCategories = categoriesQuery?.data;

  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Estado para las notificaciones Toast
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const combinedCategories = useMemo(() => {
    return loadedCategories || [];
  }, [loadedCategories]);

  const filteredCategories = useMemo(() => {
    return combinedCategories.filter((cat: any) => cat.type === type);
  }, [combinedCategories, type]);

  const handleOpen = (tx?: any) => {
    if (tx) {
      setSelectedTransaction(tx);
      setType(tx.type || 'expense');
      setAmount(tx.amount ? String(tx.amount) : '');
      setCategoryId(tx.category_id || tx.categoryId || '');
      setDescription(tx.description || '');
      setDate(tx.date ? tx.date.split('T')[0] : new Date().toISOString().split('T')[0]);
    } else {
      setSelectedTransaction(null);
      setType('expense');
      setAmount('');
      setCategoryId('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setActionError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTransaction(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setActionError('Por favor ingresa un monto válido.');
      return;
    }

    setSubmitting(true);
    setActionError(null);

    const payload = {
      amount: parsedAmount,
      type,
      categoryId: categoryId || undefined,
      description: description.trim(),
      date,
    };

    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, payload);
        showToast('Movimiento actualizado con éxito');
      } else {
        await createTransaction(payload as any);
        showToast('Movimiento registrado con éxito');
      }
      handleClose();
    } catch (err: any) {
      setActionError(err.message || 'Ocurrió un error al guardar el movimiento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Deseas eliminar este movimiento?')) {
      try {
        await deleteTransaction(id);
        showToast('Movimiento eliminado', 'info');
      } catch (err: any) {
        showToast(err.message || 'Error al eliminar el movimiento', 'error');
      }
    }
  };

  const getCategoryName = (catId?: string) => {
    if (!catId) return 'General';
    const found = combinedCategories.find((c: any) => c.id === catId);
    return found ? found.name : 'General';
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Movimientos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: 2 }}
        >
          Nuevo Movimiento
        </Button>
      </Box>

      {/* Solo se muestra la alerta si hay error Y el navegador está ONLINE */}
      {error && navigator.onLine && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : (error as any).message || 'Error al cargar transacciones'}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : transactions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography color="text.secondary">No hay movimientos registrados.</Typography>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <List disablePadding>
            {transactions.map((tx: any, index: number) => {
              const isExpense = tx.type === 'expense';
              const catName = getCategoryName(tx.category_id || tx.categoryId);

              return (
                <ListItem
                  key={tx.id || index}
                  divider={index !== transactions.length - 1}
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: isExpense ? 'error.main' : 'success.main', fontWeight: 'bold', mr: 1 }}
                      >
                        {isExpense ? '-' : '+'}₡{tx.amount?.toLocaleString('es-CR')}
                      </Typography>
                      <IconButton edge="end" onClick={() => handleOpen(tx)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton edge="end" color="error" onClick={() => handleDelete(tx.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                >
                  <Box sx={{ mr: 2 }}>
                    {isExpense ? (
                      <ArrowDownwardIcon color="error" />
                    ) : (
                      <ArrowUpwardIcon color="success" />
                    )}
                  </Box>
                  <ListItemText
                    primary={tx.description || catName}
                    secondary={`${tx.date ? new Date(tx.date).toLocaleDateString('es-CR') : 'Sin fecha'} · ${catName}`}
                    slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                  />
                  <Chip
                    label={isExpense ? 'Gasto' : 'Ingreso'}
                    size="small"
                    color={isExpense ? 'error' : 'success'}
                    variant="outlined"
                    sx={{ mr: 2, display: { xs: 'none', sm: 'inline-flex' } }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            {selectedTransaction ? 'Editar Movimiento' : 'Registrar Movimiento'}
          </DialogTitle>
          <DialogContent dividers>
            {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                select
                label="Tipo de Movimiento"
                value={type}
                onChange={(e) => {
                  setType(e.target.value as 'expense' | 'income');
                  setCategoryId('');
                }}
                fullWidth
              >
                <MenuItem value="expense">Gasto</MenuItem>
                <MenuItem value="income">Ingreso</MenuItem>
              </TextField>

              <TextField
                label="Monto (₡)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                fullWidth
              />

              <TextField
                select
                label="Categoría"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                fullWidth
                disabled={filteredCategories.length === 0}
                helperText={
                  filteredCategories.length === 0
                    ? 'No hay categorías disponibles. Crea una en Categorías.'
                    : ''
                }
              >
                {filteredCategories.map((cat: any) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Descripción o Nota"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />

              <TextField
                label="Fecha"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || !amount || !categoryId || filteredCategories.length === 0}
            >
              {submitting ? <CircularProgress size={24} /> : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Componente de Notificaciones Toast (Snackbar) */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Transactions;