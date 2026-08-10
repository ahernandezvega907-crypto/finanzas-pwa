import React from 'react';
import { Box, Skeleton, useTheme } from '@mui/material';

export const PageSkeleton: React.FC = React.memo(() => {
  const theme = useTheme();
  const customTheme = theme as any;

  return (
    <Box 
      sx={{ 
        p: theme.spacing(3), 
        display: 'flex', 
        flexDirection: 'column', 
        gap: theme.spacing(3),
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default 
      }}
    >
      {/* Encabezado de Página */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Skeleton variant="text" width={180} height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={260} height={20} />
        </Box>
        <Skeleton variant="circular" width={40} height={40} />
      </Box>

      {/* Grid de Contenedores Base */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '150px 150px 150px', md: '1fr 1fr 1fr' }, 
          gap: theme.spacing(2) 
        }}
      >
        <Skeleton 
          variant="rounded" 
          height={140} 
          sx={{ 
            borderRadius: `${theme.shape?.borderRadius || 8}px`,
            backgroundColor: customTheme.custom?.card || 'background.paper'
          }} 
        />
        <Skeleton 
          variant="rounded" 
          height={140} 
          sx={{ 
            borderRadius: `${theme.shape?.borderRadius || 8}px`,
            backgroundColor: customTheme.custom?.card || 'background.paper'
          }} 
        />
        <Skeleton 
          variant="rounded" 
          height={140} 
          sx={{ 
            borderRadius: `${theme.shape?.borderRadius || 8}px`,
            backgroundColor: customTheme.custom?.card || 'background.paper'
          }} 
        />
      </Box>
    </Box>
  );
});

PageSkeleton.displayName = 'PageSkeleton';