import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Dashboard } from '../pages/Dashboard';
import { StudentsList } from '../pages/students/StudentsList';
import { StudentProfile } from '../pages/students/StudentProfile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<StudentsList />} />
              <Route path="/students/:studentId" element={<StudentProfile />} />
              <Route path="/students/:studentId/personal" element={<StudentProfile />} />
              <Route path="/students/:studentId/attendance" element={<StudentProfile />} />
              <Route path="/students/:studentId/academic" element={<StudentProfile />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
};