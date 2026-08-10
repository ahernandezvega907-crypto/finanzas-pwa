import React from 'react';
import { Box, Skeleton, SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { CardSkeleton } from './CardSkeleton';

interface BudgetCardSkeletonProps {
  animation?: 'pulse' | 'wave' | false;
  width?: number | string;
  sx?: SxProps<Theme>;
}

const HEADER_ICON_SIZE = 28;
const TITLE_HEIGHT = 24;
const AMOUNT_HEIGHT = 32;
const DETAIL_HEIGHT = 16;
const PROGRESS_HEIGHT = 8;

export const BudgetCardSkeleton = React.memo(function BudgetCardSkeleton({
  animation = 'wave',
  width = '100%',
  sx,
}: BudgetCardSkeletonProps) {
  return (
    <CardSkeleton
      width={width}
      animation={animation}
      sx={sx}
    >
      <Box
        sx={(theme: Theme) => ({
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(2),
          width: '100%',
          height: '100%',
        })}
      >
        {/* Encabezado */}
        <Box
          sx={() => ({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          })}
        >
          <Skeleton
            variant="text"
            width="45%"
            height={TITLE_HEIGHT}
            animation={animation}
          />

          <Skeleton
            variant="circular"
            width={HEADER_ICON_SIZE}
            height={HEADER_ICON_SIZE}
            animation={animation}
          />
        </Box>

        {/* Montos */}
        <Box>
          <Skeleton
            variant="text"
            width="60%"
            height={AMOUNT_HEIGHT}
            animation={animation}
          />

          <Skeleton
            variant="text"
            width="35%"
            height={DETAIL_HEIGHT}
            animation={animation}
            sx={(theme: Theme) => ({ 
              mt: theme.spacing(0.5) 
            })}
          />
        </Box>

        {/* Barra de progreso */}
        <Skeleton
          variant="rounded"
          width="100%"
          height={PROGRESS_HEIGHT}
          animation={animation}
          sx={() => ({ 
            mt: 'auto' 
          })}
        />
      </Box>
    </CardSkeleton>
  );
});

BudgetCardSkeleton.displayName = 'BudgetCardSkeleton';