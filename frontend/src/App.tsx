import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CourseCatalog } from './pages/CourseCatalog';
import { LearningRoom } from './pages/LearningRoom';
import { CoursesPage } from './pages/CoursesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { VideoSummarizerPage } from './pages/VideoSummarizerPage';
import { LoginPage } from './pages/LoginPage';
import { ToastProvider } from './context/ToastContext';
import { ClassesPage } from './pages/ClassesPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { MarksPage } from './pages/MarksPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { DeadlinesPage } from './pages/DeadlinesPage';
import { CertificatePage } from './pages/CertificatePage';
import { EventsPage } from './pages/EventsPage';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'student' | 'superadmin';
}

const AppContent: React.FC = () => {
  const location = useLocation();

  // Load initial user session from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (loggedInUser: User) => {
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/classes':
        return 'Class Directories';
      case '/assessments':
        return 'Curriculum Assessments';
      case '/submissions':
        return 'Submissions Hub';
      case '/marks':
        return 'Academic Grades Board';
      case '/materials':
        return 'Course Reference Materials';
      case '/deadlines':
        return 'Schedules & Deadlines';
      case '/certificate':
        return 'My Learning Certificates';
      case '/courses':
        return 'Courses Management';
      case '/categories':
        return 'Categories Management';
      case '/curriculum':
        return 'Curriculum Engineering';
      case '/summarizer':
        return 'AI Video Summarizer';
      case '/users':
        return 'User Accounts';
      case '/settings':
        return 'System settings';
      case '/catalog':
        return 'Student Catalog';
      case '/learning':
        return 'Student Learning Room';
      case '/events':
        return 'Events Management Hub';
      default:
        return 'XEBIA LMS';
    }
  };

  // If not logged in, force render LoginPage
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <MainLayout pageTitle={getPageTitle()} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={(user.role === 'admin' || user.role === 'superadmin') ? <Dashboard /> : <Navigate to="/catalog" replace />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/submissions" element={<SubmissionsPage />} />
        <Route path="/marks" element={<MarksPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/deadlines" element={<DeadlinesPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/curriculum" element={<CurriculumPage />} />
        <Route path="/summarizer" element={<VideoSummarizerPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/catalog" element={<CourseCatalog />} />
        <Route path="/learning" element={<LearningRoom />} />
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
