import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CourseCatalog } from './pages/CourseCatalog';
import { LearningRoom } from './pages/LearningRoom';
import { AuthoringStudio } from './pages/AuthoringStudio';
import { ToastProvider } from './context/ToastContext';

const AppContent: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/catalog':
        return 'Course Catalog';
      case '/learning':
        return 'Learning Room';
      case '/studio':
        return 'Authoring Studio';
      default:
        return 'XEBIA LMS';
    }
  };

  return (
    <MainLayout pageTitle={getPageTitle()}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/catalog" element={<CourseCatalog />} />
        <Route path="/learning" element={<LearningRoom />} />
        <Route path="/studio" element={<AuthoringStudio />} />
      </Routes>
    </MainLayout>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};
export default App;
