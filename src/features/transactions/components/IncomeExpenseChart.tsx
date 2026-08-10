import React, { useMemo } from 'react';
import { Card, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDashboardStats } from "../hooks/useDashboardStats";
import type { Transaction } from "../../../types/transaction";

interface IncomeExpenseChartProps {
  transactions: Transaction[];
}

export const IncomeExpenseChart = React.memo(function IncomeExpenseChart({ 
  transactions 
}: IncomeExpenseChartProps) {
  const theme = useTheme();
  const stats = useDashboardStats(transactions);

  // === OPTIMIZACIÓN Y CONTROL DE ERRORES: Cálculo seguro de porcentajes ===
  const { incomePercentage, expensePercentage } = useMemo(() => {
    const total = stats.income + stats.expense;
    if (total === 0) {
      return { incomePercentage: 0, expensePercentage: 0 };
    }
    return {
      incomePercentage: (stats.income / total) * 100,
      expensePercentage: (stats.expense / total) * 100,
    };
  }, [stats.income, stats.expense]);

  // Tokens seguros con fallbacks del tema base
  const cardBg = theme.custom?.card ?? theme.palette.background.paper;
  const borderColor = theme.custom?.border ?? theme.palette.divider;
  const surfaceColor = theme.custom?.surface ?? theme.palette.background.default;
  const incomeColor = theme.custom?.income ?? theme.palette.success.main;
  const expenseColor = theme.custom?.expense ?? theme.palette.error.main;

  return (
    <Card
      sx={{
        p: 3,
        backgroundColor: cardBg,
        borderRadius: `${theme.shape.borderRadius}px`,
        border: `1px solid ${borderColor}`,
        boxShadow: theme.shadows[1],
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: theme.palette.text.primary,
        }}
      >
        Flujo financiero
      </Typography>

      {/* Contenedor de la barra de progreso general */}
      <Box
        sx={{
          height: 20,
          width: '100%',
          overflow: 'hidden',
          borderRadius: 9999,
          backgroundColor: surfaceColor,
          display: 'flex',
        }}
      >
        <Box
          sx={{
            height: '100%',
            backgroundColor: incomeColor,
            transition: 'all 500ms ease-in-out',
            width: `${incomePercentage}%`,
          }}
        />
        <Box
          sx={{
            height: '100%',
            backgroundColor: expenseColor,
            transition: 'all 500ms ease-in-out',
            width: `${expensePercentage}%`,
          }}
        />
      </Box>

      {/* Leyendas informativas inferiores */}
      <Box
        sx={{
          mt: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {/* Indicador de Ingresos */}
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontSize: '0.875rem',
            fontWeight: 500,
            color: incomeColor,
          }}
        >
          <Box
            component="span"
            sx={{
              height: 8,
              width: 8,
              borderRadius: '50%',
              backgroundColor: incomeColor,
            }}
          />
          Ingresos: {incomePercentage.toFixed(1)}%
        </Box>

        {/* Indicador de Gastos */}
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontSize: '0.875rem',
            fontWeight: 500,
            color: expenseColor,
          }}
        >
          <Box
            component="span"
            sx={{
              height: 8,
              width: 8,
              borderRadius: '50%',
              backgroundColor: expenseColor,
            }}
          />
          Gastos: {expensePercentage.toFixed(1)}%
        </Box>
      </Box>
    </Card>
  );
});