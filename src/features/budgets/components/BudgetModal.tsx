import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Typography,
  InputAdornment,
  Box,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  amountLimit: z.number().positive('El límite debe ser mayor a 0'),
  period: z.string().min(1, 'Selecciona un periodo'),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => Promise<void>;
  categories: Array<{ id: string; name: string }>;
  loading?: boolean;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  open,
  onClose,
  onSubmit,
  categories,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      categoryId: '',
      amountLimit: undefined,
      period: new Date().toISOString().slice(0, 7),
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleFormSubmit = async (data: BudgetFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              p: 1,
              borderRadius: 2,
              display: 'flex',
            }}
          >
            <AccountBalanceWalletIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Establecer Límite
          </Typography>
        </Box>
        <IconButton aria-label="close" onClick={onClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Categoría"
                  fullWidth
                  error={!!errors.categoryId}
                  helperText={errors.categoryId?.message}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="amountLimit"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Límite Mensual"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">₡</InputAdornment>,
                    },
                  }}
                  onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                  error={!!errors.amountLimit}
                  helperText={errors.amountLimit?.message}
                />
              )}
            />

            <Controller
              name="period"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="month"
                  label="Mes de Aplicación"
                  fullWidth
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  error={!!errors.period}
                  helperText={errors.period?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ borderRadius: 2, px: 3, fontWeight: 'bold' }}
          >
            {loading ? 'Guardando...' : 'Guardar Límite'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};