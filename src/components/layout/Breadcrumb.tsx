import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { ChevronRight, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/dashboard') return [{ label: 'Dashboard', path: '/dashboard' }];
    if (path.startsWith('/students')) {
      const parts = path.split('/').filter(Boolean);
      if (parts.length >= 2) {
        return [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Students', path: '/students' },
          { label: 'Student Profile', path: undefined as string | undefined },
        ];
      }
      return [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Students', path: '/students' },
      ];
    }
    return [{ label: 'Dashboard', path: '/dashboard' }];
  };

  const crumbs = getBreadcrumbs();

  return (
    <Box sx={{ paddingBottom: '12px', marginTop: '4px' }}>
      <Breadcrumbs
        separator={<ChevronRight size={14} color={isDark ? '#8B949E' : '#98A2B3'} style={{ margin: '0 10px' }} />}
      >
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', color: isDark ? '#8B949E' : '#667085', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <Home size={14} style={{ marginRight: '6px' }} /> ERP Portal
        </Link>
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return isLast ? (
            <Typography key={idx} sx={{ color: isDark ? '#38BDF8' : '#0D47A1', fontWeight: 500, fontSize: '14px' }}>
              {crumb.label}
            </Typography>
          ) : (
            <Link
              key={idx}
              underline="hover"
              sx={{ color: isDark ? '#8B949E' : '#667085', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
              onClick={() => crumb.path && navigate(crumb.path)}
            >
              {crumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};