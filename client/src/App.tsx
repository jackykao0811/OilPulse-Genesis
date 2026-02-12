import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './core/hetu/auth/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import LoginPage from './LoginPage';
import SentinelPage from './pages/SentinelPage';
import ProfilePage from './pages/ProfilePage';
import AudiencePage from './pages/AudiencePage';
import Dashboard from './pages/Dashboard';
import EditorPage from './pages/EditorPage';
import { ClinicProvider } from './context/ClinicContext';
import ClinicLayout from './layouts/ClinicLayout';
import ClinicDashboard from './pages/doctor/ClinicDashboard';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import StatusPage from './pages/onboarding/StatusPage';
import VipPage from './pages/vip/VipPage';
import LandingPage from './views/LandingPage';
import ClinicIndex from './views/clinic/Index';
import SentinelIndex from './views/sentinel/Index';
import AcademyIndex from './views/academy/Index';

function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, hasClinicId, isAdmin } = useAuth();
  if (!user) return <>{children}</>;
  const path = location.pathname;
  const allowedWithoutClinic = ['/', '/onboarding', '/status', '/vip', '/sentinel', '/sentinel/run', '/academy'];
  if (!isAdmin && !hasClinicId && !allowedWithoutClinic.includes(path)) {
    return <Navigate to="/onboarding" replace />;
  }
  if ((hasClinicId || isAdmin) && path === '/onboarding') {
    return <Navigate to="/clinic" replace />;
  }
  return <>{children}</>;
}

const ZINC = '#a1a1aa';
const BG = '#09090b';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: BG, color: ZINC, fontFamily: '"Noto Serif TC", serif' }}
      >
        載入中...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <ProfileProvider>
      <BrowserRouter>
        <AuthRouteGuard>
          <div
            className="min-h-screen flex flex-col items-center justify-start pt-12 pb-12 px-6"
            style={{
              background: BG,
              color: ZINC,
              backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212, 175, 55, 0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(212, 175, 55, 0.06), transparent)',
            }}
          >
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/apply" element={<Navigate to="/clinic" replace />} />
            <Route path="/clinic" element={<ClinicIndex />} />
            <Route path="/sentinel" element={<SentinelIndex />} />
            <Route path="/sentinel/run" element={<SentinelPage />} />
            <Route path="/academy" element={<AcademyIndex />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/audience" element={<AudiencePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/clinic/app" element={<ClinicProvider><ClinicLayout /></ClinicProvider>}>
              <Route index element={<ClinicDashboard />} />
            </Route>
            <Route path="/vip" element={<VipPage />} />
          </Routes>
        </div>
        </AuthRouteGuard>
      </BrowserRouter>
    </ProfileProvider>
  );
}
