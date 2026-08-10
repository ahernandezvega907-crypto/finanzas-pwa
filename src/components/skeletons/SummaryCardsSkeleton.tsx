import React from 'react';
import { Stack, SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { CardSkeleton } from './CardSkeleton';

interface SummaryCardsSkeletonProps {
  count?: number;
  animation?: 'pulse' | 'wave' | false;
  sx?: SxProps<Theme>;
}

const DEFAULT_CARD_HEIGHT = 130;

export const SummaryCardsSkeleton = React.memo(function SummaryCardsSkeleton({
  count = 3,
  animation = 'wave',
  sx,
}: SummaryCardsSkeletonProps) {
  return (
    <Stack
      aria-hidden="true"
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={[
        (theme: Theme) => ({
          width: '100%',
          marginBottom: theme.spacing(2),
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton
          key={index}
          height={DEFAULT_CARD_HEIGHT}
          animation={animation}
          sx={() => ({ 
            flex: 1 
          })}
        />
      ))}
    </Stack>
  );
});

SummaryCardsSkeleton.displayName = 'SummaryCardsSkeleton';