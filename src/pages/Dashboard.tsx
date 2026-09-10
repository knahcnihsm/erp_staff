import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Avatar } from '@mui/material';
import { Users, BookX, GraduationCap, Award, RefreshCw } from 'lucide-react';
import { AppCard } from '../components/ui/AppCard';
import { PageHeader } from '../components/common/PageHeader';
import { PageSkeleton } from '../components/common/PageSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { staffApi } from '../api/staffApi';
import { DashboardSummary } from '../types';
import { useThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const typeConfig = {
  GPA: { icon: GraduationCap, color: '#0284C7' },
  CGPA: { icon: Award, color: '#7C3AED' },
  Arrear: { icon: BookX, color: '#DC2626' },
} as const;

const timeAgo = (iso: string): string => {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
};

export const Dashboard: React.FC = () => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await staffApi.getDashboardSummary();
      setSummary(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <PageSkeleton variant="dashboard" />;
  }

  if (error || !summary) {
    return <ErrorState title="Unable to load dashboard" description="We could not fetch the student summary. Please try again." onRetry={load} />;
  }

  const cards = [
    {
      label: 'Total Students',
      value: summary.totalStudents,
      sub: `${summary.activeStudents} active`,
      icon: Users,
      color: '#0B3D91',
      bg: isDark ? 'rgba(56, 189, 248, 0.12)' : '#F0F9FF',
    },
    {
      label: 'Active Arrears',
      value: summary.activeArrears,
      sub: 'currently pending',
      icon: BookX,
      color: '#DC2626',
      bg: isDark ? 'rgba(220, 38, 38, 0.12)' : '#FEF2F2',
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back — here is an overview of student academics."
      />

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <AppCard
              key={card.label}
              sx={{ flex: '1 1 240px', minWidth: 240, cursor: 'pointer' }}
              onClick={() => (card.label === 'Total Students' ? navigate('/students') : undefined)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: card.bg,
                  }}
                >
                  <Icon style={{ width: 28, height: 28, color: card.color }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      fontSize: '12px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: isDark ? '#94A3B8' : '#64748B',
                    }}
                  >
                    {card.label}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      fontSize: '34px',
                      lineHeight: 1.1,
                      color: isDark ? '#38BDF8' : '#0B3D91',
                    }}
                  >
                    {card.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontSize: '12px', color: isDark ? '#8B949E' : '#667085' }}
                  >
                    {card.sub}
                  </Typography>
                </Box>
              </Box>
            </AppCard>
          );
        })}
      </Box>

      <AppCard sx={{ marginTop: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '18px', letterSpacing: '0.05em', textTransform: 'uppercase', color: isDark ? '#FFFFFF' : '#1E293B' }}>
            Recent Academic Updates
          </Typography>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '12px',
              fontWeight: 600,
              color: isDark ? '#38BDF8' : '#0B3D91',
            }}
          >
            <RefreshCw size={14} /> Live
          </Box>
        </Box>

        <Box sx={{ marginTop: '16px' }}>
          {summary.recentUpdates.length === 0 && (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
              No recent academic activity.
            </Typography>
          )}
          {summary.recentUpdates.map((update, idx) => {
            const cfg = typeConfig[update.type];
            const Icon = cfg.icon;
            return (
              <React.Fragment key={update.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    padding: '10px 4px',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' },
                    borderRadius: '10px',
                  }}
                  onClick={() => navigate(`/students/${update.studentId}`)}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: cfg.color,
                      fontSize: '15px',
                      fontWeight: 700,
                    }}
                  >
                    <Icon size={18} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '14px' }}>
                      {update.studentName}{' '}
                      <Box component="span" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        · {update.regNo}
                      </Box>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, fontSize: '13px', color: 'text.secondary' }}
                    >
                      {update.description}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: '12px',
                      color: 'text.secondary',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {timeAgo(update.updatedAt)}
                  </Typography>
                </Box>
                {idx < summary.recentUpdates.length - 1 && (
                  <Divider sx={{ borderColor: isDark ? '#334155' : '#E6ECF5' }} />
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </AppCard>
    </Box>
  );
};