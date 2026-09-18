import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Tabs, Tab, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { GraduationCap, BookX, Pencil } from 'lucide-react';
import { AppCard } from '../../../components/ui/AppCard';
import { PermissionBadge } from '../../../components/common/PermissionBadge';
import { PageSkeleton } from '../../../components/common/PageSkeleton';
import { ErrorState } from '../../../components/common/ErrorState';
import { staffApi } from '../../../api/staffApi';
import { AcademicSummary as AcademicSummaryType } from '../../../types';
import { GpaSection } from '../../../components/academic/GpaSection';
import { ArrearsSection } from '../../../components/academic/ArrearsSection';
import { EditCgpaModal, EditCgpaModalProps } from '../../../components/academic/modals';
import { useApp } from '../../../context/AppContext';
import { useThemeContext } from '../../../context/ThemeContext';
import { useSearchParams } from 'react-router-dom';

type TabKey = 'gpa' | 'arrears';

interface AcademicPerformanceTabProps {
  studentId: number;
}

export const AcademicPerformanceTab: React.FC<AcademicPerformanceTabProps> = ({ studentId }) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const muiTheme = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up('md'));
  const { showSnackbar } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: TabKey = tabParam === 'arrears' ? tabParam : 'gpa';

  const [summary, setSummary] = useState<AcademicSummaryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      const data = await staffApi.getAcademicSummary(studentId);
      setSummary(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    loadSummary();
  }, [studentId, loadSummary]);

  const handleTabChange = (_e: React.SyntheticEvent, value: TabKey) => {
    setSearchParams({ tab: value });
  };

  const refreshSummary = () => {
    void loadSummary();
  };

  const [cgpaModalOpen, setCgpaModalOpen] = useState(false);
  const [cgpaSaving, setCgpaSaving] = useState(false);

  const handleCgpaSubmit: EditCgpaModalProps['onSubmit'] = async (cgpa: number) => {
    setCgpaSaving(true);
    try {
      const existing = await staffApi.getCgpa(studentId);
      if (existing.length > 0) {
        await staffApi.updateCgpa(existing[0].cgpaId, { cgpa });
      } else {
        await staffApi.addCgpa(studentId, { cgpa });
      }
      setCgpaModalOpen(false);
      refreshSummary();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Operation failed.', 'error');
    } finally {
      setCgpaSaving(false);
    }
  };

  if (loading && !summary) {
    return <PageSkeleton variant="table" />;
  }

  if (error || !summary) {
    return (
      <ErrorState
        title="Unable to load academic summary"
        description="We could not fetch the academic performance details for this student."
        onRetry={() => {
          setLoading(true);
          setError(false);
          loadSummary();
        }}
      />
    );
  }

  const summaryCells = [
    { label: 'Latest GPA', value: summary.latestGpa > 0 ? summary.latestGpa.toFixed(2) : '-', color: '#0284C7', editable: false },
    { label: 'CGPA', value: summary.latestCgpa != null ? summary.latestCgpa.toFixed(2) : '-', color: '#7C3AED', editable: true },
    { label: 'Active Arrears', value: String(summary.activeArrears), color: '#DC2626', editable: false },
    { label: 'Cleared Arrears', value: String(summary.clearedArrears), color: '#16A34A', editable: false },
  ];

  const tabItems = [
    { key: 'gpa' as TabKey, label: 'GPA', icon: GraduationCap },
    { key: 'arrears' as TabKey, label: 'Arrears', icon: BookX },
  ];

  return (
    <Box>
      <AppCard sx={{ marginBottom: '16px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, marginBottom: '16px' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '15px', letterSpacing: '0.05em', textTransform: 'uppercase', color: isDark ? '#FFFFFF' : '#1E293B' }}>
              Academic Performance
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '13px', color: isDark ? '#8B949E' : '#667085' }}>
              Manage GPA and arrear records on behalf of the student.
            </Typography>
          </Box>
          <PermissionBadge variant="editable" />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {summaryCells.map((cell) => (
            <Box
              key={cell.label}
              sx={{
                flex: '1 1 140px',
                borderRadius: '12px',
                padding: '14px',
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                border: `1px solid ${isDark ? '#334155' : '#E6ECF5'}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', color: 'text.secondary' }}>
                  {cell.label}
                </Typography>
                {cell.editable && (
                  <IconButton
                    size="small"
                    onClick={() => setCgpaModalOpen(true)}
                    title="Edit CGPA"
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '8px',
                      color: '#7C3AED',
                      transition: 'all 180ms ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(124, 58, 237, 0.12)',
                        transform: 'scale(1.12)',
                      },
                    }}
                  >
                    <Pencil size={14} />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: cell.color, marginTop: '2px' }}>
                {cell.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </AppCard>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: isDesktop ? 'row' : 'column' }}>
        <Tabs
          orientation={isDesktop ? 'vertical' : 'horizontal'}
          variant={isDesktop ? 'standard' : 'scrollable'}
          scrollButtons="auto"
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            ...(isDesktop
              ? {
                  minHeight: 180,
                  marginRight: '8px',
                  '& .MuiTab-root': {
                    alignItems: 'flex-start',
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'none',
                    minHeight: 48,
                    justifyContent: 'flex-start',
                    borderRadius: '10px',
                    marginBottom: '4px',
                    '&.Mui-selected': {
                      color: isDark ? '#38BDF8' : '#0B3D91',
                      backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(11, 61, 145, 0.08)',
                    },
                  },
                  '& .MuiTabs-indicator': { display: 'none' },
                }
              : {
                  borderBottom: `1px solid ${isDark ? '#334155' : '#E6ECF5'}`,
                  marginBottom: '2px',
                  width: '100%',
                  '& .MuiTab-root': {
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&.Mui-selected': {
                      color: isDark ? '#38BDF8' : '#0B3D91',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: isDark ? '#38BDF8' : '#0B3D91',
                  },
                }),
            flexShrink: 0,
          }}
        >
          {tabItems.map((item) => {
            const Icon = item.icon;
            return (
              <Tab
                key={item.key}
                value={item.key}
                label={item.label}
                icon={<Icon size={18} />}
                iconPosition="start"
                sx={isDesktop ? { width: 150 } : {}}
              />
            );
          })}
        </Tabs>

        <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%' }}>
          {activeTab === 'gpa' && <GpaSection studentId={studentId} onChanged={refreshSummary} />}
          {activeTab === 'arrears' && <ArrearsSection studentId={studentId} onChanged={refreshSummary} />}
        </Box>
      </Box>

      <EditCgpaModal
        open={cgpaModalOpen}
        onClose={() => setCgpaModalOpen(false)}
        initialValue={summary.latestCgpa != null ? summary.latestCgpa : null}
        saving={cgpaSaving}
        onSubmit={handleCgpaSubmit}
      />
    </Box>
  );
};