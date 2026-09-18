import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Divider,
} from '@mui/material';
import { SemesterGpa, Arrear, ArrearStatus } from '../../types';
import { useThemeContext } from '../../context/ThemeContext';
import { semesterOptions } from '../../utils/semesters';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const titleCase = (value: string): string =>
  value.replace(/\b\w/g, (c) => c.toUpperCase());

const validateGpaValue = (value: string, label = 'GPA'): string | null => {
  if (value.trim() === '') return `${label} is required.`;
  const num = Number(value);
  if (Number.isNaN(num)) return 'Enter a valid number.';
  if (num < 0 || num > 10) return `${label} must be between 0 and 10.`;
  const decimals = value.split('.')[1];
  if (decimals && decimals.length > 2) return `${label} allows at most 2 decimal places.`;
  return null;
};

const inputStyle = (isDark: boolean) => ({
  '& .MuiOutlinedInput-root': {
    height: '48px',
    borderRadius: '10px',
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    transition: 'all 200ms ease-in-out',
    '& fieldset': {
      borderColor: isDark ? '#334155' : '#D6E4F0',
    },
    '&:hover fieldset': {
      borderColor: isDark ? '#475569' : '#3B82F6',
    },
    '&.Mui-focused fieldset': {
      borderColor: isDark ? '#38BDF8' : '#0B3D91',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '13px',
    fontWeight: 600,
    color: isDark ? '#94A3B8' : '#64748B',
    '&.Mui-focused': {
      color: isDark ? '#38BDF8' : '#0B3D91',
    },
  },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    fontSize: '14px',
    fontWeight: 600,
    color: isDark ? '#E2E8F0' : '#1E293B',
  },
  '& .MuiFormHelperText-root': {
    fontSize: '11px',
    fontWeight: 600,
    marginLeft: '2px',
  },
});

const cancelButtonStyle = {
  height: '40px',
  minWidth: '96px',
  borderRadius: '8px',
  borderColor: '#D8E4F2',
  color: '#667085',
  fontWeight: 700,
  fontSize: '12px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  '&:hover': {
    borderColor: '#B6C9E2',
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
  },
};

const saveButtonStyle = (isDark: boolean) => ({
  height: '40px',
  minWidth: '120px',
  borderRadius: '8px',
  fontWeight: 700,
  fontSize: '12px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  backgroundColor: isDark ? '#38BDF8' : '#0B3D91',
  color: isDark ? '#0B1020' : '#FFFFFF',
  '&:hover': {
    backgroundColor: isDark ? '#0EA5E9' : '#0A2D6E',
  },
});

export interface GpaFormState {
  semesterNumber: number;
  semesterGpa: string;
}

export interface GpaModalProps extends ModalProps {
  mode: 'add' | 'edit';
  initial?: SemesterGpa | null;
  existingSemesters: number[];
  saving: boolean;
  onSubmit: (data: { semesterNumber: number; semesterGpa: number }) => void;
}

export const GpaModal: React.FC<GpaModalProps> = ({
  open,
  onClose,
  mode,
  initial,
  existingSemesters,
  saving,
  onSubmit,
}) => {
  const { mode: themeMode } = useThemeContext();
  const isDark = themeMode === 'dark';
  const [form, setForm] = useState<GpaFormState>({
    semesterNumber: 1,
    semesterGpa: '',
  });
  const [errors, setErrors] = useState<{ semesterNumber?: string; semesterGpa?: string }>({});

  const reset = () => {
    setForm({
      semesterNumber: -1,
      semesterGpa: '',
    });
    setErrors({});
  };

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initial) {
        setForm({
          semesterNumber: initial.semesterNumber,
          semesterGpa: String(initial.semesterGpa),
        });
      } else {
        reset();
      }
      setErrors({});
    }
  }, [open, mode, initial]);

  const availableSemesters = mode === 'edit' && initial
    ? semesterOptions
    : semesterOptions.filter((s) => !existingSemesters.includes(s));

  const handleSubmit = () => {
    const nextErrors: typeof errors = {};
    if (form.semesterNumber < 0) {
      nextErrors.semesterNumber = 'Semester is required.';
    }
    const gpaError = validateGpaValue(form.semesterGpa);
    if (gpaError) {
      nextErrors.semesterGpa = gpaError;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      semesterNumber: form.semesterNumber,
      semesterGpa: Number(Number(form.semesterGpa).toFixed(2)),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: '15px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: isDark ? '#E2E8F0' : '#0D47A1',
          padding: '20px 24px 12px',
        }}
      >
        {mode === 'add' ? 'Add Semester GPA' : 'Edit Semester GPA'}
      </DialogTitle>
      <Divider sx={{ borderColor: isDark ? '#334155' : '#E6ECF5' }} />
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: '16px' }}>
          <TextField
            select
            label="Semester"
            value={mode === 'add' ? (form.semesterNumber >= 0 ? form.semesterNumber : '') : form.semesterNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, semesterNumber: Number(e.target.value) }))}
            error={Boolean(errors.semesterNumber)}
            helperText={errors.semesterNumber}
            disabled={mode === 'edit'}
            sx={inputStyle(isDark)}
          >
            {availableSemesters.map((s) => (
              <MenuItem key={s} value={s}>
                Semester {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Semester GPA"
            type="number"
            inputProps={{ step: '0.01', min: 0, max: 10 }}
            placeholder="e.g. 8.50"
            value={form.semesterGpa}
            onChange={(e) => setForm((prev) => ({ ...prev, semesterGpa: e.target.value }))}
            error={Boolean(errors.semesterGpa)}
            helperText={errors.semesterGpa}
            sx={inputStyle(isDark)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '6px 24px 20px' }}>
        <Button onClick={onClose} variant="outlined" sx={cancelButtonStyle}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disableElevation disabled={saving} sx={saveButtonStyle(isDark)}>
          {mode === 'add' ? 'Save GPA' : 'Update GPA'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export interface EditCgpaModalProps extends ModalProps {
  initialValue: number | null;
  saving: boolean;
  onSubmit: (value: number) => void;
}

export const EditCgpaModal: React.FC<EditCgpaModalProps> = ({
  open,
  onClose,
  initialValue,
  saving,
  onSubmit,
}) => {
  const { mode: themeMode } = useThemeContext();
  const isDark = themeMode === 'dark';
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      setValue(initialValue != null ? String(initialValue) : '');
      setError(undefined);
    }
  }, [open, initialValue]);

  const handleSubmit = () => {
    const cgpaError = validateGpaValue(value, 'CGPA');
    if (cgpaError) {
      setError(cgpaError);
      return;
    }
    onSubmit(Number(Number(value).toFixed(2)));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: '15px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: isDark ? '#E2E8F0' : '#0D47A1',
          padding: '20px 24px 12px',
        }}
      >
        Edit CGPA
      </DialogTitle>
      <Divider sx={{ borderColor: isDark ? '#334155' : '#E6ECF5' }} />
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: '16px' }}>
          <TextField
            label="CGPA"
            type="number"
            inputProps={{ step: '0.01', min: 0, max: 10 }}
            placeholder="e.g. 8.60"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={Boolean(error)}
            helperText={error}
            sx={inputStyle(isDark)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '6px 24px 20px' }}>
        <Button onClick={onClose} variant="outlined" sx={cancelButtonStyle}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disableElevation disabled={saving} sx={saveButtonStyle(isDark)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export interface ArrearFormState {
  semesterNumber: number;
  subjectName: string;
  examAttempt: string;
  arrearStatus: ArrearStatus;
  remarks: string;
}

export interface ArrearModalProps extends ModalProps {
  mode: 'add' | 'edit';
  initial?: Arrear | null;
  saving: boolean;
  onSubmit: (data: {
    semesterNumber: number;
    subjectName: string;
    examAttempt: number;
    arrearStatus: ArrearStatus;
    remarks: string;
  }) => void;
}

export const ArrearModal: React.FC<ArrearModalProps> = ({
  open,
  onClose,
  mode,
  initial,
  saving,
  onSubmit,
}) => {
  const { mode: themeMode } = useThemeContext();
  const isDark = themeMode === 'dark';
  const [form, setForm] = useState<ArrearFormState>({
    semesterNumber: 1,
    subjectName: '',
    examAttempt: '1',
    arrearStatus: 'ACTIVE',
    remarks: '',
  });
  const [errors, setErrors] = useState<{ semesterNumber?: string; subjectName?: string; examAttempt?: string }>({});

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initial) {
        setForm({
          semesterNumber: initial.semesterNumber,
          subjectName: initial.subjectName,
          examAttempt: String(initial.examAttempt),
          arrearStatus: initial.arrearStatus,
          remarks: initial.remarks || '',
        });
      } else {
        setForm({
          semesterNumber: 1,
          subjectName: '',
          examAttempt: '1',
          arrearStatus: 'ACTIVE',
          remarks: '',
        });
      }
      setErrors({});
    }
  }, [open, mode, initial]);

  const handleSubmit = () => {
    const nextErrors: typeof errors = {};
    if (form.semesterNumber < 0) {
      nextErrors.semesterNumber = 'Semester is required.';
    }
    if (!form.subjectName.trim()) {
      nextErrors.subjectName = 'Subject name is required.';
    }
    const attempt = Number(form.examAttempt);
    if (form.examAttempt.trim() === '' || Number.isNaN(attempt) || attempt < 1) {
      nextErrors.examAttempt = 'Attempt must be at least 1.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      semesterNumber: form.semesterNumber,
      subjectName: titleCase(form.subjectName.trim()),
      examAttempt: attempt,
      arrearStatus: form.arrearStatus,
      remarks: form.remarks.trim(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: '15px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: isDark ? '#E2E8F0' : '#0D47A1',
          padding: '20px 24px 12px',
        }}
      >
        {mode === 'add' ? 'Add Arrear' : 'Edit Arrear'}
      </DialogTitle>
      <Divider sx={{ borderColor: isDark ? '#334155' : '#E6ECF5' }} />
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: '16px' }}>
          <TextField
            select
            label="Semester"
            value={form.semesterNumber >= 0 ? form.semesterNumber : ''}
            onChange={(e) => setForm((prev) => ({ ...prev, semesterNumber: Number(e.target.value) }))}
            error={Boolean(errors.semesterNumber)}
            helperText={errors.semesterNumber}
            sx={inputStyle(isDark)}
          >
            {semesterOptions.map((s) => (
              <MenuItem key={s} value={s}>
                Semester {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Subject Name"
            placeholder="e.g. Digital Electronics"
            value={form.subjectName}
            onChange={(e) => setForm((prev) => ({ ...prev, subjectName: e.target.value }))}
            error={Boolean(errors.subjectName)}
            helperText={errors.subjectName}
            sx={inputStyle(isDark)}
          />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Exam Attempt"
              type="number"
              inputProps={{ min: 1, step: 1 }}
              value={form.examAttempt}
              onChange={(e) => setForm((prev) => ({ ...prev, examAttempt: e.target.value }))}
              error={Boolean(errors.examAttempt)}
              helperText={errors.examAttempt}
              sx={{ flex: '1 1 140px', ...inputStyle(isDark) }}
            />
            <TextField
              select
              label="Status"
              value={form.arrearStatus}
              onChange={(e) => setForm((prev) => ({ ...prev, arrearStatus: e.target.value as ArrearStatus }))}
              sx={{ flex: '1 1 140px', ...inputStyle(isDark) }}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="CLEARED">Cleared</MenuItem>
            </TextField>
          </Box>
          <TextField
            label="Remarks"
            multiline
            rows={2}
            placeholder="Optional remarks, e.g. Supplementary exam scheduled"
            value={form.remarks}
            onChange={(e) => setForm((prev) => ({ ...prev, remarks: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                '& fieldset': { borderColor: isDark ? '#334155' : '#D6E4F0' },
                '&:hover fieldset': { borderColor: isDark ? '#475569' : '#3B82F6' },
                '&.Mui-focused fieldset': { borderColor: isDark ? '#38BDF8' : '#0B3D91', borderWidth: '2px' },
              },
              '& .MuiInputLabel-root': {
                fontSize: '13px',
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#64748B',
                '&.Mui-focused': { color: isDark ? '#38BDF8' : '#0B3D91' },
              },
              '& .MuiInputBase-input': {
                fontSize: '14px',
                fontWeight: 600,
                color: isDark ? '#E2E8F0' : '#1E293B',
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '6px 24px 20px' }}>
        <Button onClick={onClose} variant="outlined" sx={cancelButtonStyle}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disableElevation disabled={saving} sx={saveButtonStyle(isDark)}>
          {mode === 'add' ? 'Save Arrear' : 'Update Arrear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};