import React from 'react';
import { Stack, Box } from '@mui/material';
import { SummaryCardsSkeleton } from './SummaryCardsSkeleton';
import { ChartSkeleton } from './ChartSkeleton';
import { ListSkeleton } from './ListSkeleton';
import { CardSkeleton } from './CardSkeleton';

export const DashboardSkeleton: React.FC = React.memo(() => {
  return (
    <Stack spacing={4} sx={{ width: '100%' }}>
      {/* Nivel 2: Fila de tarjetas de balance */}
      <SummaryCardsSkeleton />
      
      {/* Distribución responsive idéntica al Dashboard real */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} sx={{ width: '100%' }}>
        {/* Panel Izquierdo: Gráfico e Historial */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '2 2 0%' }, width: '100%' }}>
          <Stack spacing={4}>
            <ChartSkeleton />
            
            {/* Contenedor del Historial adaptado al Theme */}
            <Box sx={{ 
              p: 3, 
              backgroundColor: (theme: any) => theme.custom?.card || 'background.paper',
              borderRadius: (theme) => `${theme.shape?.borderRadius || 8}px`,
              border: 1,
              borderColor: (theme: any) => theme.custom?.border || 'rgba(0,0,0,0.08)',
              boxShadow: (theme) => theme.shadows[1]
            }}>
              <ListSkeleton rows={4} />
            </Box>
          </Stack>
        </Box>

        {/* Panel Derecho: Formulario de Transacciones */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 0%' }, width: '100%' }}>
          <CardSkeleton height={380} />
        </Box>
      </Stack>
    </Stack>
  );
});

DashboardSkeleton.displayName = 'DashboardSkeleton';