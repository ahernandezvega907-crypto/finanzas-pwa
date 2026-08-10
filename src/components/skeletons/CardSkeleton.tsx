import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { Theme, SxProps } from '@mui/material/styles';

interface CardSkeletonProps {
  height?: number | string;
  width?: number | string;
  animation?: 'pulse' | 'wave' | false;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const CardSkeleton = React.memo((props: CardSkeletonProps) => {
  const {
    height = 130,
    width = '100%',
    animation = 'wave',
    children,
    sx
  } = props;

  return (
    <Box
      aria-hidden="true"
      sx={[
        (theme: Theme) => ({
          p: theme.spacing(2.5),
          // 🛡️ Blindaje total con fallbacks por si custom viene undefined
          backgroundColor: theme.custom?.card ?? theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          border: `1px solid ${theme.custom?.border ?? theme.palette.divider}`,
          height,
          width,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children ?? (
        <>
          <Box>
            <Skeleton
              animation={animation}
              variant="text"
              width="40%"
              height={20}
              sx={{ mb: 1 }}
            />
            <Skeleton
              animation={animation}
              variant="text"
              width="70%"
              height={36}
            />
          </Box>
          <Skeleton
            animation={animation}
            variant="text"
            width="55%"
            height={16}
          />
        </>
      )}
    </Box>
  );
});

CardSkeleton.displayName = 'CardSkeleton';