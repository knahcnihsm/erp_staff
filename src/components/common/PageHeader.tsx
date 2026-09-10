import React from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeContext } from '../../context/ThemeContext';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, badge, action }) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2,
        padding: '4px 0 20px',
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: '1.75rem',
            lineHeight: 1.25,
            color: isDark ? '#FFFFFF' : '#0D47A1',
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: '0.95rem',
            color: isDark ? '#8B949E' : '#667085',
            marginTop: '4px',
          }}
        >
          {subtitle}
        </Typography>
        {badge && <Box sx={{ marginTop: '10px' }}>{badge}</Box>}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
};