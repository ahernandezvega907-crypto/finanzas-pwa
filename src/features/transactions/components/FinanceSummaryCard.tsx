import React from 'react';
import { Card, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface FinanceSummaryCardProps {
  title: string;
  value: string;
  variant: 'income' | 'expense' | 'balance';
  isNegativeBalance?: boolean;
}

export const FinanceSummaryCard = React.memo(function FinanceSummaryCard({
  title,
  value,
  variant,
  isNegativeBalance = false,
}: FinanceSummaryCardProps) {
  const theme = useTheme();

  // Colores de texto principales del valor
  const getValueColor = () => {
    if (variant === 'income') return theme.custom?.income ?? theme.palette.success.main;
    if (variant === 'expense') return theme.custom?.expense ?? theme.palette.error.main;
    return isNegativeBalance
      ? (theme.custom?.expense ?? theme.palette.error.main)
      : (theme.custom?.income ?? theme.palette.success.main);
  };

  // Color del borde decorativo izquierdo
  const getBorderColor = () => {
    if (variant === 'income') return theme.custom?.income ?? theme.palette.success.main;
    if (variant === 'expense') return theme.custom?.expense ?? theme.palette.error.main;
    return isNegativeBalance
      ? (theme.custom?.expense ?? theme.palette.error.main)
      : (theme.custom?.border ?? theme.palette.divider);
  };

  // === ALERTA INTELIGENTE: Fondo dinámico basado en el estado financiero ===
  const getCardBackground = () => {
    const safeCardBg = theme.custom?.card ?? theme.palette.background.paper;
    if (variant === 'balance' && isNegativeBalance) {
      // Fondo sutil rojizo/gasto para alertar balance negativo sin estridencias
      return `linear-gradient(to right, rgba(239, 68, 68, 0.08), ${safeCardBg})`;
    }
    return safeCardBg;
  };

  const safeBorderColor = theme.custom?.border ?? theme.palette.divider;

  return (
    <Card
      role="region"
      aria-label={`${title}: ${value}`}
      sx={{
        p: 3,
        background: getCardBackground(),
        borderRadius: `${theme.shape.borderRadius}px`,
        border: `1px solid ${variant === 'balance' && isNegativeBalance ? 'rgba(239, 68, 68, 0.25)' : safeBorderColor}`,
        borderLeft: `4px solid ${getBorderColor()}`,
        boxShadow: theme.shadows[1],
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[3],
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: getValueColor(),
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </Typography>
    </Card>
  );
});