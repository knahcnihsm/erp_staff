import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

export interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'error' | 'primary';
  onConfirm?: () => void;
}

interface AppContextType {
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
  hideSnackbar: () => void;
  confirmDialog: ConfirmDialogState;
  showConfirm: (options: Omit<ConfirmDialogState, 'open'>) => void;
  hideConfirm: () => void;
}

const defaultSnackbar: SnackbarState = {
  open: false,
  message: '',
  severity: 'success',
};

const defaultConfirm: ConfirmDialogState = {
  open: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmColor: 'error',
};

const AppContext = createContext<AppContextType | null>(null);

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>(defaultSnackbar);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(defaultConfirm);

  const hideSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const showSnackbar = useCallback((message: string, severity: SnackbarSeverity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  }, []);

  const showConfirm = useCallback((options: Omit<ConfirmDialogState, 'open'>) => {
    setConfirmDialog({ ...defaultConfirm, ...options, open: true });
  }, []);

  const value = useMemo(
    () => ({
      snackbar,
      showSnackbar,
      hideSnackbar,
      confirmDialog,
      showConfirm,
      hideConfirm,
    }),
    [snackbar, confirmDialog, showSnackbar, hideSnackbar, showConfirm, hideConfirm]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};