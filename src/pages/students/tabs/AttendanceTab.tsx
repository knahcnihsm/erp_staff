import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import { RefreshCw } from 'lucide-react';
import { AppCard } from '../../../components/ui/AppCard';
import { PermissionBadge } from '../../../components/common/PermissionBadge';
import { ErrorState } from '../../../components/common/ErrorState';
import { PageSkeleton } from '../../../components/common/PageSkeleton';
import { staffApi } from '../../../api/staffApi';
import { AttendanceData } from '../../../types';
import { useThemeContext } from '../../../context/ThemeContext';
import { useApp } from '../../../context/AppContext';

interface AttendanceTabProps {
  studentId: number;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ studentId }) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const { showSnackbar } = useApp();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<AttendanceData | null>(null);

  const load = async (showToast = false) => {
    setLoading(true);
    setError(false);
    try {
      const result = await staffApi.getAttendance(studentId);
      setData(result);
      if (showToast) {
        showSnackbar('Attendance data refreshed.', 'success');
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [studentId]);

  if (loading) {
    return <PageSkeleton variant="table" />;
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Unable to load attendance"
        description="We could not fetch attendance for this student. Please try again."
        onRetry={() => load()}
      />
    );
  }

  const attendanceColor =
    data.overall >= 85 ? '#16A34A' : data.overall >= 75 ? '#F59E0B' : '#DC2626';

  return (
    <AppCard>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '15px', letterSpacing: '0.05em', textTransform: 'uppercase', color: isDark ? '#FFFFFF' : '#1E293B' }}>
          Attendance Overview
        </Typography>
        <PermissionBadge variant="synced" />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          flexWrap: 'wrap',
          marginBottom: '24px',
          padding: '18px',
          borderRadius: '12px',
          backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
          border: `1px dashed ${isDark ? '#334155' : '#D8E4F2'}`,
        }}
      >
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            border: `6px solid ${attendanceColor}`,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: '26px', color: attendanceColor }}>
            {data.overall}%
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 200 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '15px', color: 'text.primary' }}>
            Overall Attendance
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '13px', color: 'text.secondary' }}>
            Combined across {data.records.length} semester{data.records.length > 1 ? 's' : ''}. This data is
            synced from the attendance module and is read-only.
          </Typography>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', color: isDark ? '#FFFFFF' : '#1E293B', marginBottom: '10px' }}>
        Semester-wise Attendance
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '10px', border: `1px solid ${isDark ? '#334155' : '#E2EBF6'}`, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ height: '58px' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>Semester</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>Present</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>Total Classes</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }}>Attendance %</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#CBD5E1' : '#0B3D91', letterSpacing: '0.05em', padding: '16px 18px', borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`, backgroundColor: isDark ? '#0F172A' : '#EEF3FB' }} width="30%">
                Progress
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.records.map((record, idx) => {
              const pct = Math.round((record.present / record.total) * 1000) / 10;
              const color = pct >= 85 ? '#16A34A' : pct >= 75 ? '#F59E0B' : '#DC2626';
              return (
                <TableRow
                  key={record.semesterNumber}
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
                  <TableCell sx={{ fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B', padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>{record.present}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B', padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>{record.total}</TableCell>
                  <TableCell sx={{ fontWeight: 800, color, padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>{pct}%</TableCell>
                  <TableCell sx={{ padding: '14px 18px', borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, pct)}
                          sx={{ height: 8, borderRadius: '4px', backgroundColor: isDark ? '#0F172A' : '#E2E8F0', '& .MuiLinearProgress-bar': { backgroundColor: color } }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
        <Box
          component="span"
          onClick={() => load(true)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: isDark ? '#38BDF8' : '#0B3D91',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <RefreshCw size={14} /> Sync Attendance Data
        </Box>
      </Box>
    </AppCard>
  );
};