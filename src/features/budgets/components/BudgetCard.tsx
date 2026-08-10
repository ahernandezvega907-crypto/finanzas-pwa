import React, { useCallback } from 'react';
import { Card, Typography, Box, Button, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Budget } from '../../../types/budget';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  categoryName: string;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export const BudgetCard = React.memo(function BudgetCard({
  budget,
  spent,
  categoryName,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  const theme = useTheme();

  // === OPTIMIZACIÓN: Callbacks estables ===
  const handleEdit = useCallback(() => {
    onEdit(budget);
  }, [onEdit, budget]);

  const handleDelete = useCallback(() => {
    onDelete(budget.id);
  }, [onDelete, budget.id]);

  // Lógica de cálculo numérico
  const progress = budget.limit_amount > 0 
    ? Math.min((spent / budget.limit_amount) * 100, 100) 
    : 0;

  const isOverBudget = progress >= 100;

  // Fallback seguro de TypeScript para operaciones aritméticas
  const baseRadius = typeof theme.shape?.borderRadius === 'number' ? theme.shape.borderRadius : 8;

  // Color de la alerta semántica
  const getAlertColor = () => {
    if (progress >= 100) return theme.custom?.expense || '#ef4444'; 
    if (progress >= 80) return '#f59e0b'; 
    return theme.custom?.income || '#10b981'; 
  };

  return (
    <Card
      role="region"
      aria-label={`Presupuesto de ${categoryName}`}
      sx={{
        p: 3,
        backgroundColor: theme.custom?.card || 'background.paper',
        borderRadius: `${baseRadius * 2}px`,
        border: `1px solid ${isOverBudget ? 'rgba(239, 68, 68, 0.25)' : theme.custom?.border || 'rgba(0,0,0,0.08)'}`,
        background: isOverBudget 
          ? `linear-gradient(to right, rgba(239, 68, 68, 0.04), ${theme.custom?.card || '#ffffff'})`
          : theme.custom?.card,
        boxShadow: theme.shadows[1],
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[3],
        },
      }}
    >
      {/* Cabecera */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography 
            variant="subtitle1" 
            sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}
          >
            {categoryName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Límite: ${budget.limit_amount}
          </Typography>
        </Box>
        
        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            onClick={handleEdit}
            sx={{ textTransform: 'none', minWidth: 'auto', fontWeight: 600, color: 'primary.main' }}
          >
            Editar
          </Button>
          <Button 
            size="small" 
            onClick={handleDelete}
            sx={{ textTransform: 'none', minWidth: 'auto', fontWeight: 600, color: theme.custom?.expense || 'error.main' }}
          >
            Eliminar
          </Button>
        </Box>
      </Box>

      {/* Barra de progreso */}
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: getAlertColor(),
              transition: 'transform 0.4s ease-out',
            },
          }}
        />
      </Box>

      {/* Métricas e Info Inferior */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Gastado: ${spent}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: isOverBudget ? 700 : 600, 
            color: getAlertColor() 
          }}
        >
          {progress.toFixed(0)}%
        </Typography>
      </Box>
    </Card>
  );
});