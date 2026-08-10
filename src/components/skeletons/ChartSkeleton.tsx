import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { Theme, SxProps } from '@mui/material/styles';
import { CardSkeleton } from './CardSkeleton';

interface ChartSkeletonProps {
  height?: number | string;
  width?: number | string;
  animation?: 'pulse' | 'wave' | false;
  sx?: SxProps<Theme>;
}

export const ChartSkeleton = React.memo(function ChartSkeleton({
  height = 350,
  width = '100%',
  animation = 'wave',
  sx
}: ChartSkeletonProps) {
  return (
    <CardSkeleton
      height={height}
      width={width}
      animation={animation}
      sx={sx}
    >
      <Box
        sx={(theme: Theme) => ({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: theme.spacing(2),
          mb: theme.spacing(2),
        })}
      >
        <Skeleton
          variant="text"
          width={140}
          height={24}
          animation={animation}
        />
        <Skeleton
          variant="rounded"
          width={80}
          height={28}
          animation={animation}
        />
      </Box>

      <Skeleton
        variant="rounded"
        animation={animation}
        sx={() => ({
          width: '100%',
          flexGrow: 1,
        })}
      />
    </CardSkeleton>
  );
});

ChartSkeleton.displayName = 'ChartSkeleton';