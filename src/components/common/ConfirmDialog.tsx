import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useApp } from '../../context/AppContext';

export const ConfirmDialog: React.FC = () => {
  const { confirmDialog, hideConfirm } = useApp();

  const handleCancel = () => {
    hideConfirm();
  };

  const handleConfirm = () => {
    const confirmFn = confirmDialog.onConfirm;
    hideConfirm();
    if (confirmFn) {
      confirmFn();
    }
  };

  return (
    <Dialog
      open={confirmDialog.open}
      onClose={handleCancel}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '8px',
          maxWidth: '440px',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: '#1A2B49' }}>
        {confirmDialog.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#667085', fontSize: '0.9375rem' }}>
          {confirmDialog.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{
            borderColor: '#D8E4F2',
            color: '#667085',
            borderRadius: '8px',
          }}
        >
          {confirmDialog.cancelText || 'Cancel'}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={confirmDialog.confirmColor || 'error'}
          disableElevation
          sx={{ borderRadius: '8px', fontWeight: 600 }}
        >
          {confirmDialog.confirmText || 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};