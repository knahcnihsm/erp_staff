import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  InputAdornment,
  Popover,
  IconButton,
} from '@mui/material';
import { Search, Eye, Users, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { staffApi } from '../../api/staffApi';
import { StudentSummary } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { PageSkeleton } from '../../components/common/PageSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { useThemeContext } from '../../context/ThemeContext';

const ROWS_PER_PAGE = 10;

const searchBarStyle = (isDark: boolean) => ({
  '& .MuiOutlinedInput-root': {
    height: '48px',
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
    '& input': {
      fontSize: '14px',
      fontWeight: 600,
      color: isDark ? '#E2E8F0' : '#1E293B',
    },
  },
  '& .MuiInputAdornment-root': {
    color: isDark ? '#64748B' : '#94A3B8',
  },
});

const cardHeadStyle = (isDark: boolean) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap',
  padding: '28px 28px 0',
  marginBottom: '24px',
});

export const StudentsList: React.FC = () => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [allStudents, setAllStudents] = useState<StudentSummary[]>([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [year, setYear] = useState('ALL');
  const [section, setSection] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(0);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await staffApi.getStudents();
      setAllStudents(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deptOptions = useMemo(
    () => Array.from(new Set(allStudents.map((s) => s.department))).sort(),
    [allStudents]
  );

  const filtered = useMemo(() => {
    let result = allStudents;
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.regNo.toLowerCase().includes(q)
      );
    }
    if (department !== 'ALL') {
      result = result.filter((s) => s.department === department);
    }
    if (year !== 'ALL') {
      result = result.filter((s) => s.year === Number(year));
    }
    if (section !== 'ALL') {
      result = result.filter((s) => s.section === section);
    }
    if (status !== 'ALL') {
      result = result.filter((s) => s.status === status);
    }
    return result;
  }, [allStudents, search, department, year, section, status]);

  const hasActiveFilters = department !== 'ALL' || year !== 'ALL' || section !== 'ALL' || status !== 'ALL';

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * ROWS_PER_PAGE;
  const pageRows = filtered.slice(pageStart, pageStart + ROWS_PER_PAGE);

  useEffect(() => {
    setPage(0);
  }, [search, department, year, section, status]);

  const filterInputStyle = (isDark: boolean) => ({
    '& .MuiOutlinedInput-root': {
      height: '48px',
      borderRadius: '10px',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
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
    },
    '& .MuiSelect-select': {
      fontSize: '13px',
      fontWeight: 700,
      color: isDark ? '#E2E8F0' : '#1E293B',
    },
  });

  const clearFilters = () => {
    setDepartment('ALL');
    setYear('ALL');
    setSection('ALL');
    setStatus('ALL');
  };

  const thStyle = {
    fontWeight: 700,
    fontSize: '13px',
    color: isDark ? '#CBD5E1' : '#0B3D91',
    letterSpacing: '0.05em',
    lineHeight: 1.3,
    padding: '16px 18px',
    whiteSpace: 'nowrap',
    borderBottom: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`,
    backgroundColor: isDark ? '#0F172A' : '#EEF3FB',
  };

  const tdStyle = {
    fontSize: '14px',
    color: isDark ? '#F1F5F9' : '#1E293B',
    padding: '14px 18px',
    borderBottom: `1px solid ${isDark ? '#1E293B' : '#EEF3FB'}`,
  };

  const rowStyle = (index: number) => ({
    backgroundColor: index % 2 === 0 ? (isDark ? '#1E293B' : '#FAFCFF') : isDark ? '#182232' : '#FFFFFF',
    transition: 'background-color 150ms ease-in-out',
    '&:hover': {
      backgroundColor: isDark ? '#334155' : '#EEF5FF',
    },
    '&:last-child td, &:last-child th': { border: 0 },
  });

  if (loading) {
    return <PageSkeleton variant="table" />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load students"
        description="We could not fetch student records. Please try again."
        onRetry={load}
      />
    );
  }

  return (
    <Box>
      <PageHeader
        title="Students"
        subtitle="View all admitted students and access their academic records."
      />

      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: `1px solid ${isDark ? '#334155' : '#E2EBF6'}`,
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          boxShadow: isDark
            ? '0 8px 30px rgba(0, 0, 0, 0.4)'
            : '0 4px 24px rgba(15, 23, 42, 0.07)',
          padding: '0 0 24px',
        }}
      >
        <Box sx={cardHeadStyle(isDark)}>
          <Box>
            <TypographyTitle isDark={isDark}>Student Admission List</TypographyTitle>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                color: isDark ? '#94A3B8' : '#64748B',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              Showing {filtered.length} Records
            </Box>
          </Box>

          <Button
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            variant="outlined"
            startIcon={<SlidersHorizontal size={17} />}
            sx={{
              height: '46px',
              minWidth: '150px',
              borderRadius: '10px',
              border: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`,
              color: isDark ? '#38BDF8' : '#0B3D91',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              '&:hover': {
                borderColor: isDark ? '#38BDF8' : '#0B3D91',
                backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(11, 61, 145, 0.06)',
              },
            }}
          >
            Filter
          </Button>
          <Popover
            open={Boolean(filterAnchor)}
            anchorEl={filterAnchor}
            onClose={() => setFilterAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                borderRadius: '14px',
                padding: '18px',
                width: 300,
                border: `1px solid ${isDark ? '#334155' : '#E2EBF6'}`,
                backgroundImage: 'none',
                boxShadow: isDark
                  ? '0 12px 40px rgba(0, 0, 0, 0.6)'
                  : '0 12px 40px rgba(15, 23, 42, 0.12)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <TypographyTitle isDark={isDark} variant="small">
                Filter Students
              </TypographyTitle>
              <IconButton size="small" onClick={() => setFilterAnchor(null)} sx={{ color: isDark ? '#94A3B8' : '#667085' }}>
                <X size={16} />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <TextField
                select
                size="small"
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                sx={filterInputStyle(isDark)}
              >
                <MenuItem value="ALL">All Departments</MenuItem>
                {deptOptions.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ display: 'flex', gap: '12px' }}>
                <TextField
                  select
                  size="small"
                  label="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  sx={{ flex: 1, ...filterInputStyle(isDark) }}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="1">Year 1</MenuItem>
                  <MenuItem value="2">Year 2</MenuItem>
                  <MenuItem value="3">Year 3</MenuItem>
                </TextField>
                <TextField
                  select
                  size="small"
                  label="Section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  sx={{ flex: 1, ...filterInputStyle(isDark) }}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                </TextField>
              </Box>
              <TextField
                select
                size="small"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={filterInputStyle(isDark)}
              >
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="ARCHIVED">Archived</MenuItem>
              </TextField>
              <Button
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                variant="text"
                fullWidth
                sx={{
                  marginTop: '6px',
                  color: isDark ? '#38BDF8' : '#0B3D91',
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          </Popover>
        </Box>

        <Box sx={{ padding: '0 28px 20px' }}>
          <TextField
            size="medium"
            placeholder="Search by register no or student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={searchBarStyle(isDark)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={19} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students found"
            description="No students match the current search or filters. Try adjusting your criteria."
          />
        ) : (
          <>
            <TableContainer sx={{ borderTop: `1px solid ${isDark ? '#334155' : '#E2EBF6'}` }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ height: '58px' }}>
                    <TableCell sx={thStyle}>Register No</TableCell>
                    <TableCell sx={thStyle}>Student Name</TableCell>
                    <TableCell sx={thStyle}>Department</TableCell>
                    <TableCell sx={thStyle}>Year / Section</TableCell>
                    <TableCell sx={thStyle}>Status</TableCell>
                    <TableCell align="right" sx={thStyle}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pageRows.map((student, idx) => (
                    <TableRow key={student.studentId} sx={rowStyle(idx)}>
                      <TableCell sx={{ ...tdStyle, fontWeight: 700, color: isDark ? '#38BDF8' : '#0B3D91' }}>
                        {student.regNo}
                      </TableCell>
                      <TableCell sx={{ ...tdStyle, fontWeight: 600 }}>{student.name}</TableCell>
                      <TableCell sx={{ ...tdStyle, fontWeight: 500, fontSize: '13px' }}>
                        {student.deptShort}
                      </TableCell>
                      <TableCell sx={{ ...tdStyle, fontWeight: 500, fontSize: '13px' }}>
                        Year {student.year} · {student.section}
                      </TableCell>
                      <TableCell sx={tdStyle}>
                        <Chip
                          label={student.status}
                          size="small"
                          sx={{
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '11px',
                            letterSpacing: '0.03em',
                            backgroundColor: student.status === 'ACTIVE' ? '#DCFCE7' : '#F1F5F9',
                            color: student.status === 'ACTIVE' ? '#15803D' : '#64748B',
                            border: `1px solid ${student.status === 'ACTIVE' ? '#86EFAC' : '#E2E8F0'}`,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={tdStyle}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/students/${student.studentId}`)}
                          aria-label={`View ${student.name}`}
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

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '20px 28px 0',
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isDark ? '#94A3B8' : '#64748B',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Showing {pageStart + 1} - {Math.min(pageStart + ROWS_PER_PAGE, filtered.length)} of {filtered.length} students
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage === 0}
                  startIcon={<ChevronLeft size={16} />}
                  sx={{
                    height: '38px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    color: isDark ? '#38BDF8' : '#0B3D91',
                    border: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`,
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    '&:hover': {
                      borderColor: isDark ? '#38BDF8' : '#0B3D91',
                      backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(11, 61, 145, 0.06)',
                    },
                  }}
                >
                  Previous
                </Button>
                <TypographyPill>
                  {safePage + 1} / {totalPages}
                </TypographyPill>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={safePage >= totalPages - 1}
                  endIcon={<ChevronRight size={16} />}
                  sx={{
                    height: '38px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    color: isDark ? '#38BDF8' : '#0B3D91',
                    border: `1px solid ${isDark ? '#334155' : '#D6E4F0'}`,
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    '&:hover': {
                      borderColor: isDark ? '#38BDF8' : '#0B3D91',
                      backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(11, 61, 145, 0.06)',
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

const TypographyTitle: React.FC<{ isDark: boolean; children: React.ReactNode; variant?: 'small' }> = ({
  isDark,
  children,
  variant,
}) => {
  return (
    <Box
      sx={{
        fontWeight: 700,
        fontSize: variant === 'small' ? '15px' : '20px',
        lineHeight: 1.3,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: isDark ? '#FFFFFF' : '#1E293B',
      }}
    >
      {children}
    </Box>
  );
};

const TypographyPill: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  return (
    <Box
      sx={{
        minWidth: '56px',
        height: '38px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        fontWeight: 800,
        fontSize: '13px',
        letterSpacing: '0.04em',
        color: '#FFFFFF',
        background: isDark ? '#38BDF8' : '#0B3D91',
        padding: '0 12px',
      }}
    >
      {children}
    </Box>
  );
};