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
import { Plus, Pencil, Trash2, BookX } from 'lucide-react';
import { AppCard } from '../ui/AppCard';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { StatusChip } from '../common/StatusChip';
import { staffApi } from '../../api/staffApi';
import { Arrear } from '../../types';
import { ArrearModal, ArrearModalProps } from './modals';
import { useApp } from '../../context/AppContext';
import { useThemeContext } from '../../context/ThemeContext';

interface ArrearsSectionProps {
  studentId: number;
  onChanged: () => void;
}

export const ArrearsSection: React.FC<ArrearsSectionProps> = ({ studentId, onChanged }) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const { showSnackbar, showConfirm } = useApp();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [records, setRecords] = useState<Arrear[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editRecord, setEditRecord] = useState<Arrear | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await staffApi.getArrears(studentId);
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

  const activeCount = records.filter((r) => r.arrearStatus === 'ACTIVE').length;
  const clearedCount = records.filter((r) => r.arrearStatus === 'CLEARED').length;

  const openAdd = () => {
    setModalMode('add');
    setEditRecord(null);
    setModalOpen(true);
  };

  const openEdit = (record: Arrear) => {
    setModalMode('edit');
    setEditRecord(record);
    setModalOpen(true);
  };

  const handleSubmit: ArrearModalProps['onSubmit'] = async (payload) => {
    setSaving(true);
    try {
      if (modalMode === 'add') {
        await staffApi.addArrear(studentId, payload);
        showSnackbar('Arrear added successfully.', 'success');
      } else if (editRecord) {
        await staffApi.updateArrear(editRecord.arrearId, payload);
        showSnackbar('Arrear updated successfully.', 'success');
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

  const handleDelete = (record: Arrear) => {
    showConfirm({
      title: 'Delete Arrear',
      message: `Are you sure you want to delete the arrear record for "${record.subjectName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmColor: 'error',
      onConfirm: async () => {
        try {
          await staffApi.deleteArrear(record.arrearId);
          showSnackbar('Arrear deleted successfully.', 'success');
          await load();
          onChanged();
        } catch (err) {
          showSnackbar(err instanceof Error ? err.message : 'Operation failed.', 'error');
        }
      },
    });
  };

  if (loading) {
    return (
      <AppCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <Skeleton width={160} height={30} />
          <Skeleton width={130} height={40} sx={{ borderRadius: '10px' }} />
        </Box>
        <Skeleton height={260} sx={{ borderRadius: '12px' }} />
      </AppCard>
    );
  }

  if (error) {
    return <ErrorState title="Unable to load arrears" description="We could not fetch arrear records for this student." onRetry={load} />;
  }

  return (
    <>
      <AppCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '15px', letterSpacing: '0.05em', textTransform: 'uppercase', color: isDark ? '#FFFFFF' : '#1E293B' }}>
            Arrears
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
            Add Arrear
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: '18px' }}>
          <Box
            sx={{
              flex: '1 1 160px',
              borderRadius: '12px',
              padding: '14px',
              backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#FEF3C7',
              border: `1px solid ${isDark ? 'rgba(245, 158, 11, 0.3)' : '#F59E0B'}`,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px', color: isDark ? '#FBBF24' : '#B45309' }}>
              Active Arrears
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? '#FBBF24' : '#B45309' }}>
              {activeCount}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: '1 1 160px',
              borderRadius: '12px',
              padding: '14px',
              backgroundColor: isDark ? 'rgba(22, 163, 74, 0.1)' : '#DCFCE7',
              border: `1px solid ${isDark ? 'rgba(22, 163, 74, 0.3)' : '#16A34A'}`,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px', color: isDark ? '#4ADE80' : '#15803D' }}>
              Cleared Arrears
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? '#4ADE80' : '#15803D' }}>
              {clearedCount}
            </Typography>
          </Box>
        </Box>

        {records.length === 0 ? (
          <EmptyState
            icon={BookX}
            title="No arrears recorded"
            description="Add arrear records for this student if any subjects are pending."
            actionLabel="Add Arrear"
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
                    Subject
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>
                    Attempt
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>
                    Remarks
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record, idx) => (
                  <TableRow
                    key={record.arrearId}
                    sx={{
                      height: '64px',
                      backgroundColor: idx % 2 === 0 ? (isDark ? '#1E293B' : '#FAFCFF') : isDark ? '#182232' : '#FFFFFF',
                      '&:hover': { backgroundColor: isDark ? '#334155' : '#EEF5FF' },
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B', padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>Sem {record.semesterNumber}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B', padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>{record.subjectName}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B', padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>{record.examAttempt}</TableCell>
                    <TableCell sx={{ padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>
                      <StatusChip status={record.arrearStatus} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, fontSize: '13px', color: isDark ? '#8B949E' : '#667085', padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>
                      {record.remarks || '-'}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>
                      <IconButton
                        size="small"
                        onClick={() => openEdit(record)}
                        title="Edit Arrear"
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
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(record)}
                        title="Delete Arrear"
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          marginLeft: '4px',
                          transition: 'all 180ms ease-in-out',
                          '&:hover': {
                            backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            transform: 'scale(1.15)',
                          },
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AppCard>

      <ArrearModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        initial={editRecord}
        saving={saving}
        onSubmit={handleSubmit}
      />
    </>
  );
};