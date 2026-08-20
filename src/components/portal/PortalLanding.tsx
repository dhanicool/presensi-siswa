import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  QrCode, 
  ShieldCheck, 
  Clock, 
  School, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  Database,
  LockKeyhole
} from 'lucide-react';
import { formatIndonesianDate, formatTime } from '../../utils/crypto';

export const PortalLanding: React.FC = () => {
  const { setCurrentView, settings, getTodayStats } = useAttendance();
  const [currentTime, setCurrentTime] = useState<string>(formatTime(new Date()));
  const [currentDate, setCurrentDate] = useState<string>(formatIndonesianDate(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
      setCurrentDate(formatIndonesianDate(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = getTodayStats();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/30">
            <School className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Sistem Terpadu
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Database Real-Time Aktif
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {settings.schoolName}
            </h1>
          </div>
        </div>

        {/* Realtime Live Clock */}
        <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl shadow-inner">
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">{currentDate}</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400 tracking-wider">
            {currentTime} <span className="text-xs text-slate-400">WIB</span>
          </div>
        </div>
      </header>

      {/* Main Dual-Gateway Portal */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Portal Presensi Pintar & Manajemen Kehadiran
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Pilih Akses Masuk Portal
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Silakan pilih modul presensi untuk scan kartu siswa atau masuk ke halaman manajemen untuk administrator sekolah.
          </p>
        </div>

        {/* The 2 Main Login Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
          
          {/* 1. SISWA QR SCAN PORTAL */}
          <div
            id="portal-btn-student"
            onClick={() => setCurrentView('STUDENT_SCAN')}
            className="group relative bg-gradient-to-b from-slate-900 to-slate-900/90 hover:from-slate-800/90 hover:to-slate-900 border border-blue-500/30 hover:border-blue-500 p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                <QrCode className="w-7 h-7" />
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                  Kiosk Siswa
                </span>
                <span className="text-xs text-slate-400">Scan Barcode / Face</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                Halaman Presensi Siswa
              </h3>
              
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Pindai QR code kartu pelajar atau gunakan alat scan barcode barcode gun. Dilengkapi tampilan otomatis nama, NISN, tanggal, dan jam dengan reset 1 detik serta suara konfirmasi.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Alat Scan Gun USB
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Kamera AI Wajah
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Notif WA Ortu
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-blue-400 font-semibold text-sm group-hover:text-blue-300">
              <span>Buka Layar Presensi Siswa</span>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>

          {/* 2. ADMIN LOGIN PORTAL */}
          <div
            id="portal-btn-admin"
            onClick={() => setCurrentView('ADMIN_LOGIN')}
            className="group relative bg-gradient-to-b from-slate-900 to-slate-900/90 hover:from-slate-800/90 hover:to-slate-900 border border-slate-700 hover:border-indigo-500 p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                  Akses Terlindungi
                </span>
                <span className="text-xs text-slate-400">Captcha 60 Detik</span>
              </div>

              <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                Halaman Khusus Admin
              </h3>

              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Masuk ke dashboard manajemen sekolah untuk insert data siswa, rekapitulasi bulanan, ekspor Excel & PDF, manajemen perizinan, analitik tren, dan audit notifikasi WhatsApp.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  <LockKeyhole className="w-3 h-3 text-indigo-400" />
                  Captcha Dinamis 1 Menit
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  <Database className="w-3 h-3 text-indigo-400" />
                  Ekspor PDF & Excel
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  <Users className="w-3 h-3 text-indigo-400" />
                  Approval Izin
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-indigo-400 font-semibold text-sm group-hover:text-indigo-300">
              <span>Masuk Portal Administrator</span>
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center transition-all">
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>

        </div>

        {/* Live Attendance Snapshot Strip */}
        <div className="mt-10 bg-slate-900/60 border border-slate-800 rounded-xl p-4 max-w-4xl mx-auto w-full grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-2">
            <div className="text-xs text-slate-400 font-medium">Total Siswa Terdaftar</div>
            <div className="text-xl font-bold text-white mt-0.5">{stats.totalStudents} Siswa</div>
          </div>
          <div className="p-2 border-l border-slate-800">
            <div className="text-xs text-emerald-400 font-medium">Hadir Tepat Waktu</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{stats.onTimeCount} Siswa</div>
          </div>
          <div className="p-2 border-l border-slate-800">
            <div className="text-xs text-amber-400 font-medium">Terlambat</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">{stats.lateCount} Siswa</div>
          </div>
          <div className="p-2 border-l border-slate-800">
            <div className="text-xs text-blue-400 font-medium">Tingkat Kehadiran</div>
            <div className="text-xl font-bold text-cyan-400 mt-0.5">{stats.attendanceRate}%</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} {settings.schoolName} — SiPresensi Pintar QR & Face Biometrics
        </div>
        <div className="flex items-center gap-3">
          <span>Batas Masuk: {settings.entryLimitTime} WIB</span>
          <span>•</span>
          <span className="text-slate-400">Enkripsi Data SHA-256 Aktif</span>
        </div>
      </footer>
    </div>
  );
};
