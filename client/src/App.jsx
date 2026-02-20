import React, { useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherListPage from './pages/TeacherListPage';
import TeacherProfilePage from './pages/TeacherProfilePage';
import DashboardPage from './pages/DashboardPage';
import PaymentPage from './pages/PaymentPage';
import SubscribePage from './pages/SubscribePage';
import ReferralPage from './pages/ReferralPage';
import BusinessPage from './pages/BusinessPage';
import HelpPage from './pages/HelpPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import TutorStudioPage from './pages/TutorStudioPage';
import ClassroomPage from './pages/ClassroomPage';
import MessagesPage from './pages/MessagesPage';
import OnboardingPage from './pages/OnboardingPage';
import PricingPage from './pages/PricingPage';
import LearnPage from './pages/LearnPage';
import LessonsPage from './pages/LessonsPage';
import StatesIndexPage from './pages/state/StatesIndexPage';
import StateDetailPage from './pages/state/StateDetailPage';

const PageWrapper = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="page-enter min-h-screen">
      {children}
    </div>
  );
};

const AppShell = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/classroom/');

  return (
    <>
      <Header />
      <PageWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/teachers" element={<TeacherListPage />} />
          <Route path="/teachers/:id" element={<TeacherProfilePage />} />

          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/for-schools" element={<BusinessPage />} />
          <Route path="/state" element={<StatesIndexPage />} />
          <Route path="/state/:code" element={<StateDetailPage />} />
          <Route path="/state/:code/:subject" element={<StateDetailPage />} />

          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/lessons" element={<ProtectedRoute><LessonsPage /></ProtectedRoute>} />
          <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/subscribe" element={<ProtectedRoute><SubscribePage /></ProtectedRoute>} />
          <Route path="/referral" element={<ProtectedRoute><ReferralPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          <Route path="/tutor/studio" element={<ProtectedRoute><TutorStudioPage /></ProtectedRoute>} />
          <Route path="/classroom/:roomId" element={<ProtectedRoute><ClassroomPage /></ProtectedRoute>} />
        </Routes>
      </PageWrapper>
      {!hideFooter && <Footer />}
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </div>
  </ThemeProvider>
);

export default App;
