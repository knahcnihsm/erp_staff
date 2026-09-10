import React from 'react';
import { Chip, SxProps, Theme } from '@mui/material';
import { Lock, RefreshCw, Pencil } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';

interface PermissionBadgeProps {
  variant: 'viewonly' | 'synced' | 'editable';
  sx?: SxProps<Theme>;
}

const CONFIG = {
  viewonly: { label: 'VIEW ONLY', icon: Lock, color: '#64748B' },
  synced: { label: 'SYNCED DATA', icon: RefreshCw, color: '#0284C7' },
  editable: { label: 'STAFF EDITABLE', icon: Pencil, color: '#7C3AED' },
} as const;

export const PermissionBadge: React.FC<PermissionBadgeProps> = ({ variant, sx }) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const cfg = CONFIG[variant];
  const Icon = cfg.icon;

  return (
    <Chip
      icon={<Icon size={14} />}
      label={cfg.label}
      size="small"
      sx={{
        border: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`,
        backgroundColor: isDark ? 'rgba(148, 163, 184, 0.1)' : '#F8FAFC',
        color: cfg.color,
        fontWeight: 700,
        fontSize: '11px',
        letterSpacing: '0.04em',
        borderRadius: '8px',
        '& .MuiChip-icon': { marginLeft: '6px', marginRight: '-4px', color: 'inherit' },
        ...sx,
      }}
    />
  );
};