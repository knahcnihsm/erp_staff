import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Skeleton,
} from '@mui/material';
import { Plus, Pencil, GraduationCap } from 'lucide-react';
import { AppCard } from '../ui/AppCard';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { staffApi } from '../../api/staffApi';
import { SemesterGpa } from '../../types';
import { GpaModal, GpaModalProps } from './modals';
import { useApp } from '../../context/AppContext';
import { useThemeContext } from '../../context/ThemeContext';

interface GpaSectionProps {
  studentId: number;
  onChanged: () => void;
}

export const GpaSection: React.FC<GpaSectionProps> = ({ studentId, onChanged }) => {
  const { showSnackbar } = useApp();
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [records, setRecords] = useState<SemesterGpa[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editRecord, setEditRecord] = useState<SemesterGpa | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await staffApi.getGpa(studentId);
      setRecords(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [studentId]);

  const openAdd = () => {
    setModalMode('add');
    setEditRecord(null);
    setModalOpen(true);
  };

  const openEdit = (record: SemesterGpa) => {
    setModalMode('edit');
    setEditRecord(record);
    setModalOpen(true);
  };

  const handleSubmit: GpaModalProps['onSubmit'] = async (payload) => {
    setSaving(true);
    try {
      if (modalMode === 'add') {
        await staffApi.addGpa(studentId, payload);
        showSnackbar('Semester GPA added successfully.', 'success');
      } else if (editRecord) {
        await staffApi.updateGpa(editRecord.gpaId, payload);
        showSnackbar('Semester GPA updated successfully.', 'success');
      }
      setModalOpen(false);
      await load();
      onChanged();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Operation failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <Skeleton width={160} height={30} />
          <Skeleton width={110} height={40} sx={{ borderRadius: '10px' }} />
        </Box>
        <Skeleton height={240} sx={{ borderRadius: '12px' }} />
      </AppCard>
    );
  }

  if (error) {
    return <ErrorState title="Unable to load GPA" description="We could not fetch semester GPA records." onRetry={load} />;
  }

  return (
    <>
      <AppCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '15px', letterSpacing: '0.05em', textTransform: 'uppercase', color: isDark ? '#FFFFFF' : '#1E293B' }}>
            Semester-wise GPA
          </Typography>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Plus size={16} />}
            onClick={openAdd}
            sx={{
              height: '40px',
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
            Add GPA
          </Button>
        </Box>

        {records.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No GPA records yet"
            description="Add the first semester GPA record for this student."
            actionLabel="Add GPA"
            onAction={openAdd}
          />
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#E2EBF6'}`, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ height: '58px' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>
                    Semester
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>
                    Academic Year
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>
                    Semester GPA
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record, idx) => (
                  <TableRow
                    key={record.gpaId}
                    sx={{
                      height: '64px',
                      backgroundColor: idx % 2 === 0 ? (isDark ? '#1E293B' : '#FAFCFF') : isDark ? '#182232' : '#FFFFFF',
                      '&:hover': { backgroundColor: isDark ? '#334155' : '#EEF5FF' },
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B', padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>
                      Semester {record.semesterNumber}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B', padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>{record.academicYear}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#0284C7', padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>
                      {record.semesterGpa.toFixed(2)}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>
                      <IconButton
                        size="small"
                        onClick={() => openEdit(record)}
                        title="Edit GPA"
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          color: '#1E5EFF',
                          transition: 'all 180ms ease-in-out',
                          '&:hover': {
                            backgroundColor: 'rgba(30, 94, 255, 0.1)',
                            transform: 'scale(1.15)',
                          },
                        }}
                      >
                        <Pencil size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AppCard>

      <GpaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        initial={editRecord}
        existingSemesters={records.map((r) => r.semesterNumber)}
        saving={saving}
        onSubmit={handleSubmit}
      />
    </>
  );
};