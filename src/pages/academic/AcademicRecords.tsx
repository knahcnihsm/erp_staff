import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { Users, Save } from 'lucide-react';
import { staffApi } from '../../api/staffApi';
import { AcademicRecordRow, AcademicRecordUpdate } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { PageSkeleton } from '../../components/common/PageSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { useThemeContext } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { semesterOptions } from '../../utils/semesters';

type DraftValue = { gpa: string; cgpa: string };
type Drafts = Record<string, DraftValue>;

const controlsStyle = (isDark: boolean) => ({
  '& .MuiOutlinedInput-root': {
    height: '42px',
    minWidth: '160px',
    borderRadius: '10px',
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    border: `1px solid ${isDark ? '#334155' : '#D6E4F0'} !important`,
    transition: 'all 200ms ease-in-out',
    '&:hover': {
      border: `1px solid ${isDark ? '#475569' : '#3B82F6'} !important`,
    },
    '&.Mui-focused': {
      border: `1px solid ${isDark ? '#38BDF8' : '#0B3D91'} !important`,
      boxShadow: `0 0 0 4px ${isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(11, 61, 145, 0.2)'}`,
    },
    '& fieldset': {
      border: 'none',
    },
    '& .MuiSelect-select': {
      fontSize: '14px',
      fontWeight: 600,
      color: isDark ? '#E2E8F0' : '#1E293B',
      padding: '10px 14px',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
    fontWeight: 600,
    color: isDark ? '#94A3B8' : '#64748B',
  },
});

const cellInputStyle = (isDark: boolean) => ({
  '& .MuiOutlinedInput-root': {
    height: '38px',
    borderRadius: '8px',
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    border: `1px solid ${isDark ? '#334155' : '#D6E4F0'} !important`,
    transition: 'all 200ms ease-in-out',
    '&:hover': {
      border: `1px solid ${isDark ? '#475569' : '#94A3B8'} !important`,
    },
    '&.Mui-focused': {
      border: `1px solid ${isDark ? '#38BDF8' : '#0B3D91'} !important`,
      boxShadow: `0 0 0 3px ${isDark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(11, 61, 145, 0.15)'}`,
    },
    '& fieldset': {
      border: 'none',
    },
    '& input': {
      fontSize: '14px',
      fontWeight: 700,
      textAlign: 'center',
      color: isDark ? '#E2E8F0' : '#1E293B',
      padding: '0 8px',
    },
  },
});

const thStyle = (isDark: boolean) => ({
  fontWeight: 700,
  fontSize: '13px',
  color: isDark ? '#CBD5E1' : '#0B3D91',
  letterSpacing: '0.05em',
  padding: '16px 18px',
  borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`,
  backgroundColor: isDark ? '#0F172A' : '#EEF3FB',
});

const tdStyle = (isDark: boolean) => ({
  fontWeight: 600,
  color: isDark ? '#F1F5F9' : '#1E293B',
  padding: '12px 18px',
  borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}`,
});

type ParseResult = { ok: true; value: number } | { ok: false };

const parseDecimal = (value: string): ParseResult => {
  const trimmed = value.trim();
  if (trimmed === '') return { ok: false };
  const num = Number(trimmed);
  const decimals = trimmed.split('.')[1];
  if (Number.isNaN(num) || num < 0 || num > 10 || (decimals !== undefined && decimals.length > 2)) {
    return { ok: false };
  }
  return { ok: true, value: num };
};

export const AcademicRecords: React.FC = () => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const { showSnackbar } = useApp();

  const [semester, setSemester] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rows, setRows] = useState<AcademicRecordRow[]>([]);
  const [drafts, setDrafts] = useState<Drafts>({});
  const [saving, setSaving] = useState(false);

  const load = async (sem: number) => {
    setLoading(true);
    setError(false);
    try {
      const data = await staffApi.getAcademicRecords(sem);
      setRows(data);
      const next: Drafts = {};
      data.forEach((row) => {
        next[String(row.studentId)] = {
          gpa: row.semesterGpa != null ? String(row.semesterGpa) : '',
          cgpa: row.cgpa != null ? String(row.cgpa) : '',
        };
      });
      setDrafts(next);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(semester);
  }, [semester]);

  const updateDraft = (studentId: number, field: 'gpa' | 'cgpa', value: string) => {
    setDrafts((prev) => {
      const key = String(studentId);
      const current = prev[key] ?? { gpa: '', cgpa: '' };
      return { ...prev, [key]: { ...current, [field]: value } };
    });
  };

  const handleSave = async () => {
    const records: AcademicRecordUpdate[] = [];

    for (const row of rows) {
      const draft = drafts[String(row.studentId)];
      if (!draft) continue;

      const update: AcademicRecordUpdate = { studentId: row.studentId };

      if (draft.gpa.trim() !== '') {
        const parsed = parseDecimal(draft.gpa);
        if (!parsed.ok) {
          showSnackbar(`Invalid GPA for Register No. ${row.regNo}.`, 'error');
          return;
        }
        if (row.semesterGpa == null || parsed.value !== row.semesterGpa) {
          update.gpa = parsed.value;
        }
      }

      if (draft.cgpa.trim() !== '') {
        const parsed = parseDecimal(draft.cgpa);
        if (!parsed.ok) {
          showSnackbar(`Invalid CGPA for Register No. ${row.regNo}.`, 'error');
          return;
        }
        if (row.cgpa == null || parsed.value !== row.cgpa) {
          update.cgpa = parsed.value;
        }
      }

      if (update.gpa !== undefined || update.cgpa !== undefined) {
        records.push(update);
      }
    }

    if (records.length === 0) {
      showSnackbar('No changes to save.', 'info');
      return;
    }

    setSaving(true);
    try {
      await staffApi.saveAcademicRecords({ semesterNumber: semester, records });
      showSnackbar('Academic records saved successfully.', 'success');
      await load(semester);
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Failed to save academic records.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Academic Records"
        subtitle="Bulk entry of student GPA and CGPA for a selected semester."
      />

      {loading ? (
        <PageSkeleton variant="table" />
      ) : error ? (
        <ErrorState
          title="Unable to load academic records"
          description="We could not fetch academic records for the selected semester."
          onRetry={() => load(semester)}
        />
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: `1px solid ${isDark ? '#334155' : '#E2EBF6'}`,
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            padding: '24px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '15px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: isDark ? '#FFFFFF' : '#1E293B',
              }}
            >
              Students
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91' }}
              >
                Semester
              </Typography>
              <TextField
                select
                size="small"
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                sx={controlsStyle(isDark)}
              >
                {semesterOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    Semester {s}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {rows.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No students found"
              description="There are no students available for the selected semester."
            />
          ) : (
            <>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#E2EBF6'}`, overflow: 'hidden' }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ height: '58px' }}>
                      <TableCell sx={thStyle(isDark)}>Reg. No.</TableCell>
                      <TableCell sx={thStyle(isDark)}>Student Name</TableCell>
                      <TableCell sx={thStyle(isDark)}>Semester</TableCell>
                      <TableCell sx={thStyle(isDark)}>GPA</TableCell>
                      <TableCell sx={thStyle(isDark)}>CGPA</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      const draft = drafts[String(row.studentId)] ?? { gpa: '', cgpa: '' };
                      return (
                        <TableRow key={row.studentId}>
                          <TableCell sx={tdStyle(isDark)}>{row.regNo}</TableCell>
                          <TableCell sx={tdStyle(isDark)}>{row.name}</TableCell>
                          <TableCell sx={tdStyle(isDark)}>Semester {row.semester}</TableCell>
                          <TableCell sx={tdStyle(isDark)}>
                            <TextField
                              size="small"
                              value={draft.gpa}
                              onChange={(e) => updateDraft(row.studentId, 'gpa', e.target.value)}
                              inputProps={{ step: '0.01', min: 0, max: 10, inputMode: 'decimal' }}
                              placeholder={row.semesterGpa == null ? '—' : undefined}
                              sx={cellInputStyle(isDark)}
                            />
                          </TableCell>
                          <TableCell sx={tdStyle(isDark)}>
                            <TextField
                              size="small"
                              value={draft.cgpa}
                              onChange={(e) => updateDraft(row.studentId, 'cgpa', e.target.value)}
                              inputProps={{ step: '0.01', min: 0, max: 10, inputMode: 'decimal' }}
                              placeholder={row.cgpa == null ? '—' : undefined}
                              sx={cellInputStyle(isDark)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
                <Button
                  variant="contained"
                  disableElevation
                  disabled={saving}
                  startIcon={<Save size={16} />}
                  onClick={handleSave}
                  sx={{
                    height: '42px',
                    minWidth: '140px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    backgroundColor: isDark ? '#38BDF8' : '#0B3D91',
                    color: isDark ? '#0B1020' : '#FFFFFF',
                    '&:hover': {
                      backgroundColor: isDark ? '#0EA5E9' : '#0A2D6E',
                    },
                  }}
                >
                  Save
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
};