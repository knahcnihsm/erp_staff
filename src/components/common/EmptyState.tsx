import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useThemeContext } from '../../context/ThemeContext';

interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number | string; style?: React.CSSProperties }>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 24px',
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          backgroundColor: isDark ? '#1E293B' : '#F0F9FF',
          border: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`,
        }}
      >
        <Icon style={{ width: 34, height: 34, color: isDark ? '#38BDF8' : '#0B3D91' }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '6px' }}>
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            maxWidth: 420,
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: actionLabel ? '18px' : 0,
          }}
        >
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};