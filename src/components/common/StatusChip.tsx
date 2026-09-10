import React from 'react';
import { Chip } from '@mui/material';
import { ArrearStatus } from '../../types';

interface StatusChipProps {
  status: ArrearStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const active = status === 'ACTIVE';

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        borderRadius: '8px',
        fontWeight: 800,
        fontSize: '11px',
        letterSpacing: '0.04em',
        backgroundColor: active ? '#FEF3C7' : '#DCFCE7',
        color: active ? '#B45309' : '#15803D',
        border: `1px solid ${active ? '#F59E0B' : '#16A34A'}`,
      }}
    />
  );
};