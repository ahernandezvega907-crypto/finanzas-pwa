import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Typography,
  useTheme,
  CircularProgress,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  createTransactionSchema,
  CreateTransactionForm,
} from '../schemas/transaction.schema';
import { useCategories } from '../../categories/hooks/useCategories';
import type { Transaction } from '../domain/transaction.types';

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionForm) => Promise<void>;
  initialData?: Transaction | null;
  onCancel?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = React.memo(
  ({ onSubmit, initialData, onCancel }) => {
    const theme = useTheme();
    const { categories, loading, error, isEmpty, refresh } = useCategories();

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<CreateTransactionForm>({
      resolver: zodResolver(createTransactionSchema),
      defaultValues: {
        type: 'expense',
        categoryId: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
      },
    });

    useEffect(() => {
      if (initialData) {
        reset({
          type: initialData.type,
          categoryId: initialData.categoryId,
          amount: initialData.amount,
          description: initialData.description,
          date: initialData.date,
        });
      }
    }, [initialData, reset]);

    const cardBg = theme.custom.card;
    const borderColor = theme.custom.border;
    const inputBg = theme.palette.background.default;

    return (
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
          p: theme.spacing(3),
          backgroundColor: cardBg,
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${borderColor}`,
          boxShadow: theme.shadows[1],
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {initialData ? 'Editar Transacción' : 'Nueva Transacción'}
        </Typography>

        {/* Tipo */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Tipo</InputLabel>
              <Select {...field} label="Tipo" sx={{ bgcolor: inputBg }}>
                <MenuItem value="income">Ingreso</MenuItem>
                <MenuItem value="expense">Gasto</MenuItem>
              </Select>
              {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
            </FormControl>
          )}
        />

        {/* Categoría */}
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.categoryId} disabled={loading}>
              <InputLabel>Categoría</InputLabel>
              {loading ? (
                <Skeleton variant="rounded" height={56} />
              ) : error ? (
                <Alert
                  severity="error"
                  action={
                    <Button color="inherit" size="small" onClick={refresh}>
                      Reintentar
                    </Button>
                  }
                >
                  Error al cargar categorías
                </Alert>
              ) : isEmpty ? (
                <Alert severity="info">No hay categorías disponibles. Crea una primero.</Alert>
              ) : (
                <Select {...field} label="Categoría" sx={{ bgcolor: inputBg }}>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
              {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
            </FormControl>
          )}
        />

        {/* Monto */}
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Monto"
              type="number"
              inputProps={{ step: '0.01' }}
              error={!!errors.amount}
              helperText={errors.amount?.message}
              sx={{ bgcolor: inputBg }}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        {/* Descripción */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Descripción"
              multiline
              rows={2}
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ bgcolor: inputBg }}
            />
          )}
        />

        {/* Fecha */}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Fecha"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date?.message}
              sx={{ bgcolor: inputBg }}
            />
          )}
        />

        {/* Botones */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing(2), mt: theme.spacing(2) }}>
          {onCancel && (
            <Button onClick={onCancel} disabled={isSubmitting} sx={{ color: theme.palette.text.secondary }}>
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || loading}
            sx={{
              bgcolor: theme.custom.income,
              color: theme.palette.common.white,
              '&:hover': { bgcolor: theme.palette.success.dark },
            }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : initialData ? 'Guardar Cambios' : 'Crear Transacción'}
          </Button>
        </Box>
      </Box>
    );
  }
);

TransactionForm.displayName = 'TransactionForm';