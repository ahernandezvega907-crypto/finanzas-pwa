import React from 'react';
import { Box, Grid, SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { SummaryCardsSkeleton } from './SummaryCardsSkeleton';
import { ChartSkeleton } from './ChartSkeleton';

interface ReportSkeletonProps {
  animation?: 'pulse' | 'wave' | false;
  sx?: SxProps<Theme>;
}

export const ReportSkeleton = React.memo(function ReportSkeleton({
  animation = 'wave',
  sx,
}: ReportSkeletonProps) {
  return (
    <Box
      aria-hidden="true"
      sx={[
        (theme: Theme) => ({
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {/* KPIs superiores */}
      <SummaryCardsSkeleton
        animation={animation}
      />

      {/* Zona de gráficos */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartSkeleton
            animation={animation}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartSkeleton
            animation={animation}
          />
        </Grid>
      </Grid>
    </Box>
  );
});

ReportSkeleton.displayName = 'ReportSkeleton';