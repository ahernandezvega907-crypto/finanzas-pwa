import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
} from '@mui/icons-material';
import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';

const Transactions: React.FC = () => {
  const {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    selectedTransaction,
    startEditing,
    cancelEditing,
  } = useTransactions();

  const { categories } = useCategories();

  const [openModal, setOpenModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleOpenNew = () => {
    cancelEditing();
    setAmount('');
    setType('expense');
    setCategoryId('');
    setDescription('');
    setDate(new Date().toISOString().slice(0, 10));
    setActionError(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (tx: any) => {
    startEditing(tx);
    setAmount(tx.amount.toString());
    setType(tx.type);
    setCategoryId(tx.categoryId || tx.category_id || '');
    setDescription(tx.description || '');
    setDate(tx.date || tx.transaction_date || new Date().toISOString().slice(0, 10));
    setActionError(null);
    setOpenModal(true);
  };

  const handleClose = () => {
    cancelEditing();
    setOpenModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !categoryId) {
      setActionError('Por favor ingresa un monto válido y selecciona una categoría.');
      return;
    }

    setSubmitting(true);
    setActionError(null);

    const dto = {
      amount: parsedAmount,
      type,
      categoryId,
      description: description.trim(),
      date,
    };

    if (selectedTransaction) {
      await updateTransaction(selectedTransaction.id, dto);
    } else {
      await createTransaction(dto);
    }

    setSubmitting(false);
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este movimiento?')) {
      await deleteTransaction(id);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Movimientos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenNew}>
          Nuevo Movimiento
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error.message || 'Error al procesar transacciones'}</Alert>}

      {loading && transactions.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : transactions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary">
            No tienes movimientos registrados. Haz clic en "Nuevo Movimiento" para agregar uno.
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <List disablePadding>
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const catName = categories.find((c) => c.id === (tx.categoryId || (tx as any).category_id))?.name || 'Movimiento';

              return (
                <ListItem
                  key={tx.id}
                  divider
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: isIncome ? 'success.main' : 'error.main',
                        }}
                      >
                        {isIncome ? '+' : '-'}${tx.amount.toLocaleString()}
                      </Typography>
                      <IconButton edge="end" onClick={() => handleOpenEdit(tx)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" color="error" onClick={() => handleDelete(tx.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {isIncome ? <IncomeIcon color="success" /> : <ExpenseIcon color="error" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={tx.description || catName}
                    secondary={`${tx.date || (tx as any).transaction_date} • ${catName}`}
                  />
                  <Chip
                    label={isIncome ? 'Ingreso' : 'Gasto'}
                    size="small"
                    color={isIncome ? 'success' : 'error'}
                    variant="outlined"
                    sx={{ mr: 2, display: { xs: 'none', sm: 'inline-flex' } }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}

      {/* Modal Crear / Editar */}
      <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="xs">
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedTransaction ? 'Editar Movimiento' : 'Registrar Movimiento'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {actionError && <Alert severity="error">{actionError}</Alert>}

            <FormControl fullWidth required>
              <InputLabel id="tx-type-label">Tipo de Movimiento</InputLabel>
              <Select
                labelId="tx-type-label"
                value={type}
                label="Tipo de Movimiento"
                onChange={(e) => {
                  setType(e.target.value as 'income' | 'expense');
                  setCategoryId('');
                }}
              >
                <MenuItem value="expense">Gasto</MenuItem>
                <MenuItem value="income">Ingreso</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Monto ($)"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              slotProps={{ htmlInput: { min: 0.01, step: 'any' } }}
            />

            <FormControl fullWidth required>
              <InputLabel id="tx-category-label">Categoría</InputLabel>
              <Select
                labelId="tx-category-label"
                value={categoryId}
                label="Categoría"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {filteredCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Fecha"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              required
            />

            <TextField
              label="Descripción o Nota"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Supermercado, Salario, etc."
            />
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || !amount || !categoryId}
            >
              {submitting ? <CircularProgress size={24} /> : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Transactions;