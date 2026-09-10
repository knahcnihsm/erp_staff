import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, description, onRetry }) => {
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
          backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : '#FEF2F2',
          border: `1px solid ${isDark ? 'rgba(220, 38, 38, 0.3)' : '#FECACA'}`,
        }}
      >
        <AlertCircle
          style={{ width: 34, height: 34, color: isDark ? '#F87171' : '#DC2626' }}
        />
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
            marginBottom: '18px',
          }}
        >
          {description}
        </Typography>
      )}
      <Button variant="contained" startIcon={<RefreshCw size={16} />} onClick={onRetry}>
        Retry
      </Button>
    </Box>
  );
};