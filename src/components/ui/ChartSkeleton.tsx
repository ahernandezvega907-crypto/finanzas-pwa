import React from 'react';
import { Box, Skeleton } from '@mui/material';

export const ChartSkeleton: React.FC = React.memo(() => {
  return (
    <Box 
      sx={{ 
        p: 3,
        backgroundColor: (theme: any) => theme.custom?.card || 'background.paper',
        borderRadius: (theme) => `${theme.shape?.borderRadius || 8}px`,
        boxShadow: (theme) => theme.shadows[1],
        border: 1,
        borderColor: (theme: any) => theme.custom?.border || 'rgba(0,0,0,0.08)',
        width: '100%',
        height: 350,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="text" width={140} height={24} animation="wave" />
        <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 1 }} animation="wave" />
      </Box>
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height="100%" 
        animation="wave"
        sx={{ 
          borderRadius: (theme) => `${theme.shape?.borderRadius || 8}px`,
          flexGrow: 1 
        }} 
      />
    </Box>
  );
});

ChartSkeleton.displayName = 'ChartSkeleton';