import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { Theme, SxProps } from '@mui/material/styles';

interface ListSkeletonProps {
  rows?: number;
  animation?: 'pulse' | 'wave' | false;
  sx?: SxProps<Theme>;
}

const AVATAR_SIZE = 40;
const TITLE_HEIGHT = 20;
const SUBTITLE_HEIGHT = 14;
const AMOUNT_HEIGHT = 24;

export const ListSkeleton = React.memo(function ListSkeleton({
  rows = 4,
  animation = 'wave',
  sx,
}: ListSkeletonProps) {
  const renderRow = (index: number) => (
    <Box
      key={index}
      sx={(theme: Theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: theme.spacing(1.5),
        borderBottom:
          index < rows - 1
            ? `1px solid ${theme.custom?.border ?? theme.palette.divider}`
            : 'none',
      })}
    >
      <Box
        sx={(theme: Theme) => ({
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing(2),
          flex: 1,
        })}
      >
        <Skeleton
          variant="circular"
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          animation={animation}
        />

        <Box sx={{ flex: 1 }}>
          <Skeleton
            variant="text"
            width="50%"
            height={TITLE_HEIGHT}
            animation={animation}
          />

          <Skeleton
            variant="text"
            width="30%"
            height={SUBTITLE_HEIGHT}
            animation={animation}
            sx={(theme: Theme) => ({
              mt: theme.spacing(0.5),
            })}
          />
        </Box>
      </Box>

      <Skeleton
        variant="text"
        width="20%"
        height={AMOUNT_HEIGHT}
        animation={animation}
      />
    </Box>
  );

  return (
    <Box
      aria-hidden="true"
      sx={[
        (theme: Theme) => ({
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: theme.spacing(1.5),
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {Array.from({ length: rows }, (_, index) => renderRow(index))}
    </Box>
  );
});

ListSkeleton.displayName = 'ListSkeleton';