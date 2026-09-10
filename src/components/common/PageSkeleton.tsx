import React from 'react';
import { Box, Skeleton } from '@mui/material';

interface PageSkeletonProps {
  variant?: 'list' | 'table' | 'profile' | 'dashboard';
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({ variant = 'table' }) => {
  if (variant === 'dashboard') {
    return (
      <Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: 3 }}>
          <Skeleton variant="rounded" width={280} height={130} sx={{ borderRadius: '16px' }} />
          <Skeleton variant="rounded" width={280} height={130} sx={{ borderRadius: '16px' }} />
        </Box>
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: '16px' }} />
      </Box>
    );
  }

  if (variant === 'profile') {
    return (
      <Box>
        <Skeleton variant="rounded" height={150} sx={{ borderRadius: '16px', marginBottom: 2 }} />
        <Skeleton variant="rounded" height={420} sx={{ borderRadius: '16px' }} />
      </Box>
    );
  }

  if (variant === 'list') {
    return (
      <Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: 2 }}>
          <Skeleton variant="rounded" width={380} height={56} sx={{ borderRadius: '12px' }} />
          <Skeleton variant="rounded" width={200} height={56} sx={{ borderRadius: '12px' }} />
        </Box>
        <Skeleton variant="rounded" height={420} sx={{ borderRadius: '16px' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Skeleton variant="rounded" width={240} height={40} sx={{ borderRadius: '10px' }} />
        <Skeleton variant="rounded" width={120} height={40} sx={{ borderRadius: '10px' }} />
      </Box>
      <Skeleton variant="rounded" height={420} sx={{ borderRadius: '16px' }} />
    </Box>
  );
};