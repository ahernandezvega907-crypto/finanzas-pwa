import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useNotification } from '../../../context/NotificationContext';
import { LoadingButton } from '../../../components/ui/LoadingButton';
import { Budget } from '../../../types/budget';

interface BudgetFormProps {
  initialData?: Budget;
  onSubmit: (data: Partial<Budget>) => Promise<void>;
  onClose: () => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ initialData, onSubmit, onClose }) => {
  const { notifySuccess, notifyError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(initialData?.limit_amount?.toString() || '');
  const [category, setCategory] = useState(initialData?.category_id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) {
      notifyError('Por favor complete todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        limit_amount: parseFloat(amount),
        category_id: category,
      });
      notifySuccess(`Presupuesto ${initialData ? 'actualizado' : 'creado'} correctamente`);
      onClose();
    } catch (error) {
      notifyError('Ocurrió un error inesperado al procesar el presupuesto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {initialData ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
      </Typography>

      <TextField
        label="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        required
        disabled={isSubmitting}
      />

      <TextField
  label="Monto Límite"
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  fullWidth
  required
  disabled={isSubmitting}
  slotProps={{
    htmlInput: { min: 0, step: '0.01' }
  }}
/>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
        <LoadingButton 
          type="button" 
          loading={false} 
          disabled={isSubmitting} 
          onClick={onClose}
          sx={{ color: 'text.secondary' } as any}
        >
          Cancelar
        </LoadingButton>
        <LoadingButton loading={isSubmitting}>
          {initialData ? 'Actualizar' : 'Guardar'}
        </LoadingButton>
      </Box>
    </Box>
  );
};