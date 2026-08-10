import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export const EmptyState = React.memo(function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onActionClick,
}: EmptyStateProps) {
  const theme = useTheme();

  // Forzamos el tipado seguro o fallback numérico para evitar el error aritmético
  const baseRadius = typeof theme.shape?.borderRadius === 'number' ? theme.shape.borderRadius : 8;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 6,
        px: 3,
        border: `2px dashed ${theme.custom?.border || '#e4e4e7'}`,
        borderRadius: `${baseRadius * 2}px`, // Operación aritmética limpia con número garantizado
        backgroundColor: 'transparent',
        maxWidth: '400px',
        mx: 'auto',
      }}
    >
      {/* Icono Premium */}
      <Box 
        sx={{ 
          fontSize: 48, 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          opacity: 0.8
        }}
      >
        {icon}
      </Box>

      {/* Título Positivo - Movimos fontWeight adentro de sx para compatibilidad total */}
      <Typography 
        variant="h6" 
        sx={{ 
          color: 'text.primary', 
          mb: 1,
          fontWeight: 700 
        }}
      >
        {title}
      </Typography>

      {/* Descripción Orientada a la Acción */}
      <Typography 
        variant="body2" 
        sx={{ color: 'text.secondary', mb: actionLabel ? 3 : 0, maxWidth: '280px' }}
      >
        {description}
      </Typography>

      {/* CTA Integrado Opcional */}
      {actionLabel && onActionClick && (
        <Button
          variant="contained"
          onClick={onActionClick}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: `${baseRadius}px`,
            px: 3,
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
});