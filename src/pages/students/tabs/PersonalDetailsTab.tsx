import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Skeleton } from '@mui/material';
import { AppCard } from '../../../components/ui/AppCard';
import { PermissionBadge } from '../../../components/common/PermissionBadge';
import { ErrorState } from '../../../components/common/ErrorState';
import { staffApi } from '../../../api/staffApi';
import { PersonalDetails } from '../../../types';
import { useThemeContext } from '../../../context/ThemeContext';

interface PersonalDetailsTabProps {
  studentId: number;
}

const formatDate = (value: string): string => {
  if (!value || value === '-') return '-';
  const [y, m, d] = value.split('-');
  return `${d}-${m}-${y}`;
};

const fieldLabels: { key: keyof PersonalDetails; label: string }[] = [
  { key: 'name', label: 'Full Name' },
  { key: 'regNo', label: 'Register No' },
  { key: 'applicationNo', label: 'Application No' },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'gender', label: 'Gender' },
  { key: 'email', label: 'E-mail ID' },
  { key: 'mobile', label: 'Mobile Number' },
  { key: 'district', label: 'District' },
  { key: 'caste', label: 'Caste' },
  { key: 'aadhaar', label: 'Aadhaar No' },
  { key: 'batch', label: 'Batch' },
  { key: 'program', label: 'Program' },
  { key: 'department', label: 'Department' },
  { key: 'admissionDate', label: 'Date of Admission' },
];

export const PersonalDetailsTab: React.FC<PersonalDetailsTabProps> = ({ studentId }) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [details, setDetails] = useState<PersonalDetails | null>(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await staffApi.getPersonalDetails(studentId);
      setDetails(data);
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
    return (
      <AppCard>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Box key={i} sx={{ width: { xs: '100%', sm: '45%' } }}>
              <Skeleton width={120} height={18} />
              <Skeleton width="80%" height={26} />
            </Box>
          ))}
        </Box>
      </AppCard>
    );
  }

  if (error || !details) {
    return (
      <ErrorState
        title="Unable to load personal details"
        description="We could not fetch this student's personal details. Please try again."
        onRetry={load}
      />
    );
  }

  const display = (key: keyof PersonalDetails): string => {
    const value = details[key];
    if (key === 'dob' || key === 'admissionDate') {
      return formatDate(value as string);
    }
    if (key === 'mobile') {
      return value === '-' ? '-' : String(value).replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return String(value) || '-';
  };

  return (
    <AppCard>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '15px', letterSpacing: '0.05em', textTransform: 'uppercase', color: isDark ? '#FFFFFF' : '#1E293B' }}>
          Personal Details
        </Typography>
        <PermissionBadge variant="viewonly" />
      </Box>

      <Grid container spacing={3}>
        {fieldLabels.map((field) => (
          <Grid item xs={12} sm={6} lg={4} key={field.key}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: '12px', color: 'text.secondary', marginBottom: '4px' }}
            >
              {field.label}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                minHeight: 42,
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                border: `1px solid ${isDark ? '#334155' : '#E6ECF5'}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: '14px', color: 'text.primary' }}
              >
                {display(field.key)}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </AppCard>
  );
};