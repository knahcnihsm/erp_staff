import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { BookX, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { staffApi } from '../../api/staffApi';
import { ActiveArrearRow } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { PageSkeleton } from '../../components/common/PageSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { useThemeContext } from '../../context/ThemeContext';

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

export const ActiveArrears: React.FC = () => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rows, setRows] = useState<ActiveArrearRow[]>([]);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await staffApi.getActiveArrears();
      setRows(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalArrears = rows.reduce((sum, row) => sum + row.activeArrears, 0);

  return (
    <Box>
      <PageHeader
        title="Active Arrears"
        subtitle="Students with currently pending arrears."
      />

      {loading ? (
        <PageSkeleton variant="table" />
      ) : error ? (
        <ErrorState
          title="Unable to load active arrears"
          description="We could not fetch the list of students with active arrears."
          onRetry={load}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={BookX}
          title="No active arrears found."
          description="There are no students with pending arrears right now."
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
              Students with Active Arrears
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#93C5FD' : '#0B3D91' }}
            >
              {rows.length} student{rows.length > 1 ? 's' : ''} · {totalArrears} active arrear
              {totalArrears > 1 ? 's' : ''}
            </Typography>
          </Box>

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
                  <TableCell sx={thStyle(isDark)}>Active Arrears</TableCell>
                  <TableCell sx={thStyle(isDark)}>Subjects</TableCell>
                  <TableCell align="right" sx={thStyle(isDark)}>
                    View
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.studentId}>
                    <TableCell sx={tdStyle(isDark)}>{row.regNo}</TableCell>
                    <TableCell sx={tdStyle(isDark)}>{row.name}</TableCell>
                    <TableCell sx={tdStyle(isDark)}>Semester {row.semester}</TableCell>
                    <TableCell sx={tdStyle(isDark)}>
                      <Chip
                        label={row.activeArrears}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '13px',
                          color: isDark ? '#FCA5A5' : '#B91C1C',
                          backgroundColor: isDark ? 'rgba(220, 38, 38, 0.15)' : '#FEE2E2',
                          border: `1px solid ${isDark ? '#7F1D1D' : '#FECACA'}`,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={tdStyle(isDark)}>
                      {row.subjects.length > 0 ? row.subjects.join(', ') : '—'}
                    </TableCell>
                    <TableCell align="right" sx={tdStyle(isDark)}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/students/${row.studentId}/academic`)}
                        aria-label={`View ${row.name}`}
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
                        <Eye size={17} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};