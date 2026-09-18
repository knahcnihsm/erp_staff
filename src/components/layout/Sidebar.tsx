import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { LayoutDashboard, Users, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext';

export const Sidebar: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  const navItemStyle = (isActive: boolean) => ({
    borderRadius: '8px',
    marginBottom: '6px',
    padding: '8px 12px',
    backgroundColor: isActive
      ? isDark
        ? 'rgba(56, 189, 248, 0.18)'
        : 'rgba(255, 255, 255, 0.95)'
      : 'transparent',
    color: isActive
      ? isDark
        ? '#38BDF8'
        : '#0B3D91'
      : isDark
        ? '#CBD5E1'
        : '#FFFFFF',
    transition: 'all 180ms ease-in-out',
    '&:hover': {
      backgroundColor: isActive
        ? isDark
          ? 'rgba(56, 189, 248, 0.25)'
          : 'rgba(255, 255, 255, 0.98)'
        : isDark
          ? '#334155'
          : 'rgba(255, 255, 255, 0.12)',
    },
  });

  const handleNavigation = (path: string) => {
    onNavigate?.();
    navigate(path);
  };

  const navItems = [
    { path: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard, active: location.pathname === '/dashboard' },
    { path: '/students', label: 'STUDENTS', icon: Users, active: location.pathname.startsWith('/students') },
    { path: '/academic-records', label: 'ACADEMIC RECORDS', icon: BookOpen, active: location.pathname.startsWith('/academic-records') },
  ];

  return (
    <Box
      component="aside"
      sx={{
        width: '240px',
        minWidth: '240px',
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: '64px',
        background: isDark
          ? '#0F172A'
          : 'linear-gradient(180deg, #0A2D6E 0%, #0B3D91 55%, #1565C0 100%)',
        display: 'flex',
        flexDirection: 'column',
        color: '#FFFFFF',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
        borderRight: isDark ? '1px solid #334155' : 'none',
        overflow: 'hidden',
        zIndex: 1000,
      }}
    >
      {/* Navigation Menu */}
      <Box sx={{ padding: '8px 8px', flex: '0 0 auto' }}>
        <List disablePadding>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <ListItemButton
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={navItemStyle(item.active)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: '30px',
                    color: item.active
                      ? (isDark ? '#38BDF8' : '#0B3D91')
                      : (isDark ? '#CBD5E1' : '#FFFFFF'),
                  }}
                >
                  <Icon size={17} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: 'inherit',
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Bottom Campus Building Illustration & Version Container */}
      <Box
        sx={{
          flex: 1,
          minHeight: '200px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
          backgroundImage: isDark
            ? `linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.35) 40%, rgba(15, 23, 42, 0.85) 100%), url('/images/dark-logo.png')`
            : `linear-gradient(180deg, rgba(11, 61, 145, 0.1) 0%, rgba(11, 61, 145, 0.35) 40%, rgba(11, 61, 145, 0.85) 100%), url('/images/light-logo.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 200ms ease-in-out',
        }}
      >
        <Box sx={{ padding: '16px', marginTop: 'auto' }}>
          <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '13px', color: '#FFFFFF', lineHeight: 1.3 }}>
            Academic ERP Systems
          </Typography>
          <Typography variant="caption" sx={{ color: '#93C5FD', fontSize: '12px', fontWeight: 500 }}>
            Version 2.4.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};