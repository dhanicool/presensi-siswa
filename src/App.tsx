import React from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { PortalLanding } from './components/portal/PortalLanding';
import { StudentKioskScan } from './components/kiosk/StudentKioskScan';
import { AdminLogin } from './components/auth/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

const MainAppRouter: React.FC = () => {
  const { currentView, isAdminLoggedIn } = useAttendance();

  switch (currentView) {
    case 'PORTAL':
      return <PortalLanding />;
    case 'STUDENT_SCAN':
      return <StudentKioskScan />;
    case 'ADMIN_LOGIN':
      return isAdminLoggedIn ? <AdminLayout /> : <AdminLogin />;
    case 'ADMIN_DASHBOARD':
      return <AdminLayout />;
    default:
      return <PortalLanding />;
  }
};

export default function App() {
  return (
    <AttendanceProvider>
      <MainAppRouter />
    </AttendanceProvider>
  );
}
