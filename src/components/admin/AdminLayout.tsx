import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { AdminTab } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  Smile, 
  CalendarRange, 
  UserCheck, 
  FileText, 
  PhoneCall, 
  TrendingUp, 
  ShieldCheck, 
  Sliders, 
  LogOut, 
  QrCode, 
  School, 
  Clock, 
  Menu, 
  X, 
  ChevronRight,
  Bell
} from 'lucide-react';
import { formatIndonesianDate, formatTime } from '../../utils/crypto';

// Subcomponents
import { DashboardOverview } from './DashboardOverview';
import { StudentManagement } from './StudentManagement';
import { FaceRecognitionValidator } from './FaceRecognitionValidator';
import { MonthlyRecap } from './MonthlyRecap';
import { IndividualHistory } from './IndividualHistory';
import { LeaveManagement } from './LeaveManagement';
import { ParentNotifications } from './ParentNotifications';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { SecuritySettings } from './SecuritySettings';
import { CloudDeployGuideModal } from './CloudDeployGuideModal';
import { Cloud } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { 
    adminActiveTab, 
    setAdminActiveTab, 
    setCurrentView, 
    logoutAdmin, 
    adminUsername, 
    settings,
    leaveRequests,
    todayRecords,
    getTodayStats,
    isCloudSyncActive
  } = useAttendance();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);
  const [liveClock, setLiveClock] = useState<string>(formatTime(new Date()));
  const [liveDate, setLiveDate] = useState<string>(formatIndonesianDate(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(formatTime(new Date()));
      setLiveDate(formatIndonesianDate(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingLeavesCount = leaveRequests.filter(r => r.status === 'PENDING').length;
  const stats = getTodayStats();

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'students', label: 'Data & Insert Siswa', icon: Users },
    { id: 'face_scan', label: 'Validasi Wajah (AI)', icon: Smile },
    { id: 'recap', label: 'Rekapitulasi Bulanan', icon: CalendarRange },
    { id: 'individual_history', label: 'Histori Per Siswa', icon: UserCheck },
    { id: 'leave_system', label: 'Sistem Perizinan', icon: FileText, badge: pendingLeavesCount },
    { id: 'notifications', label: 'Notifikasi Ortu', icon: PhoneCall },
    { id: 'analytics', label: 'Analitik & Tren', icon: TrendingUp },
    { id: 'security', label: 'Keamanan & Sistem', icon: ShieldCheck },
  ];

  const renderActiveTabContent = () => {
    switch (adminActiveTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'students':
        return <StudentManagement />;
      case 'face_scan':
        return <FaceRecognitionValidator />;
      case 'recap':
        return <MonthlyRecap />;
      case 'individual_history':
        return <IndividualHistory />;
      case 'leave_system':
        return <LeaveManagement />;
      case 'notifications':
        return <ParentNotifications />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'security':
        return <SecuritySettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* SIDEBAR (Desktop & Mobile Drawer)                                         */}
      {/* ========================================================================= */}
      
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header: School Logo & Title */}
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-blue-400/30 shrink-0">
                <School className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider truncate">
                  Admin Panel
                </div>
                <div className="text-sm font-extrabold text-white truncate">
                  {settings.schoolName}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-230px)]">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Menu Navigasi Sekolah
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminActiveTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    setAdminActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {/* Quick Switch to Kiosk Scan */}
          <button
            id="sidebar-btn-open-kiosk"
            onClick={() => setCurrentView('STUDENT_SCAN')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/50 text-blue-300 text-xs font-bold transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Layar Presensi Siswa
          </button>

          {/* Admin User Info & Logout */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {adminUsername.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{adminUsername}</div>
                <div className="text-[10px] text-emerald-400 font-mono">Online • Guru Piket</div>
              </div>
            </div>

            <button
              id="admin-btn-logout"
              onClick={logoutAdmin}
              className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-900/60 transition-colors"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN ADMIN CONTENT AREA                                                   */}
      {/* ========================================================================= */}

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                Sistem Presensi Siswa Terpadu
              </span>
              <h1 className="text-lg font-bold text-white tracking-tight">
                {navItems.find(i => i.id === adminActiveTab)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          {/* Header Real-Time Metrics & Clock */}
          <div className="flex items-center gap-3">
            {/* Cloud & Deploy Status Button */}
            <button
              id="admin-btn-cloud-guide"
              onClick={() => setIsDeployModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all hover:border-cyan-500/50 shadow-sm"
              title="Panduan GitHub, Vercel & Firebase"
            >
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Cloud & Deploy</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            </button>

            <div className="hidden md:flex items-center gap-3 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400">Kehadiran Hari Ini:</span>
              <strong className="text-emerald-400 font-mono">{stats.presentCount}/{stats.totalStudents} ({stats.attendanceRate}%)</strong>
            </div>

            <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-right">
              <div className="text-[10px] text-slate-400 hidden sm:block">{liveDate}</div>
              <div className="text-sm font-bold font-mono text-cyan-400">{liveClock} <span className="text-[10px] text-slate-500">WIB</span></div>
            </div>
          </div>
        </header>

        {/* Tab Content Container */}
        <main className="p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {renderActiveTabContent()}
        </main>

        {/* Cloud Deploy Guide Modal */}
        <CloudDeployGuideModal 
          isOpen={isDeployModalOpen} 
          onClose={() => setIsDeployModalOpen(false)} 
        />

        {/* Admin Footer */}
        <footer className="px-6 py-4 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} {settings.schoolName} — Sistem Informasi Presensi Real-Time
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Versi 3.4.0 (Enterprise Cloud)</span>
            <span>•</span>
            <span className="text-emerald-400">Status Server: Normal</span>
          </div>
        </footer>

      </div>

    </div>
  );
};
