import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Skeleton,
} from '@mui/material';
import { ArrowLeft, User, CalendarCheck, BookOpen } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { staffApi } from '../../api/staffApi';
import { StudentSummary } from '../../types';
import { ErrorState } from '../../components/common/ErrorState';
import { useThemeContext } from '../../context/ThemeContext';
import { PersonalDetailsTab } from './tabs/PersonalDetailsTab';
import { AttendanceTab } from './tabs/AttendanceTab';
import { AcademicPerformanceTab } from './tabs/AcademicPerformanceTab';

export const StudentProfile: React.FC = () => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const { pathname } = useLocation();
  const id = Number(studentId);

  const [student, setStudent] = useState<StudentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await staffApi.getStudentSummary(id);
      if (!data) {
        throw new Error('Student not found');
      }
      setStudent(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const tabValue = pathname.endsWith('/attendance')
    ? 1
    : pathname.endsWith('/academic')
      ? 2
      : 0;

  const handleTabChange = (_e: React.SyntheticEvent, value: number) => {
    const base = `/students/${id}`;
    const target = value === 0 ? `${base}/personal` : value === 1 ? `${base}/attendance` : `${base}/academic`;
    navigate(target);
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={150} sx={{ borderRadius: '16px', marginBottom: 2 }} />
        <Skeleton variant="rounded" height={420} sx={{ borderRadius: '16px' }} />
      </Box>
    );
  }

  if (error || !student) {
    return (
      <ErrorState
        title="Student not found"
        description="We could not load this student's profile. It may have been removed."
        onRetry={load}
      />
    );
  }

  const initials = student.name
    .split(' ')
    .filter((part) => part.length > 0 && /^[a-zA-Z]/.test(part))
    .slice(0, 2)
    .map((part: string) => part[0].toUpperCase())
    .join('');

  return (
    <Box>
      <Button
        startIcon={<ArrowLeft size={16} />}
        onClick={() => navigate('/students')}
        sx={{ marginBottom: '12px', fontWeight: 600, textTransform: 'none' }}
      >
        Back to Students
      </Button>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          padding: '22px',
          marginBottom: '16px',
          border: `1px solid ${isDark ? '#334155' : '#E6ECF5'}`,
          background: isDark
            ? 'linear-gradient(120deg, #1E293B 0%, #0F172A 100%)'
            : 'linear-gradient(120deg, #FFFFFF 0%, #F0F9FF 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              fontSize: '26px',
              fontWeight: 800,
              background: isDark
                ? 'linear-gradient(135deg, #0284C7, #38BDF8)'
                : 'linear-gradient(135deg, #0B3D91, #38BDF8)',
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 220 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {student.name}
              </Typography>
              <Chip
                label={student.status}
                size="small"
                sx={{
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '11px',
                  backgroundColor: student.status === 'ACTIVE' ? '#DCFCE7' : '#F1F5F9',
                  color: student.status === 'ACTIVE' ? '#15803D' : '#64748B',
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', marginTop: '4px' }}>
              {student.regNo} · {student.deptShort}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '13px' }}>
              Year {student.year} · Semester {student.semester} ·{' '}
              {student.section ? `Section ${student.section}` : 'Section -'} · {student.department}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: `1px solid ${isDark ? '#334155' : '#E6ECF5'}`,
          marginBottom: '18px',
          '& .MuiTab-root': { fontWeight: 700, fontSize: '14px', textTransform: 'none' },
          '& .MuiTab-root.Mui-selected': {
            color: isDark ? '#38BDF8' : '#0B3D91',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: isDark ? '#38BDF8' : '#0B3D91',
          },
        }}
      >
        <Tab icon={<User size={18} />} iconPosition="start" label="Personal Details" />
        <Tab icon={<CalendarCheck size={18} />} iconPosition="start" label="Attendance" />
        <Tab icon={<BookOpen size={18} />} iconPosition="start" label="Academic Performance" />
      </Tabs>

      {tabValue === 0 && <PersonalDetailsTab studentId={id} />}
      {tabValue === 1 && <AttendanceTab studentId={id} />}
      {tabValue === 2 && <AcademicPerformanceTab studentId={id} />}
    </Box>
  );
};