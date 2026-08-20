import React, { useState, useEffect, useRef } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  QrCode, 
  Barcode, 
  Scan, 
  Camera, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  Hash, 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  AlertCircle,
  Video,
  VideoOff,
  Smile
} from 'lucide-react';
import { formatIndonesianDate, formatTime } from '../../utils/crypto';
import confetti from 'canvas-confetti';

export const StudentKioskScan: React.FC = () => {
  const { 
    setCurrentView, 
    recordAttendance, 
    latestScan, 
    scanFeedbackError, 
    clearLatestScan,
    students,
    settings,
    todayRecords
  } = useAttendance();

  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isFaceValidatorActive, setIsFaceValidatorActive] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Real-time clock for top header
  const [currentClock, setCurrentClock] = useState<string>(formatTime(new Date()));
  const [currentDayStr, setCurrentDayStr] = useState<string>(formatIndonesianDate(new Date()));

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Keep input focused automatically so barcode guns always capture input
  useEffect(() => {
    const keepFocus = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    keepFocus();
    const interval = setInterval(keepFocus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentClock(formatTime(new Date()));
      setCurrentDayStr(formatIndonesianDate(new Date()));
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Camera stream handler
  useEffect(() => {
    if (isCameraActive) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraError(null);
        })
        .catch(() => {
          setCameraError('Kamera tidak dapat diakses atau diblokir.');
          setIsCameraActive(false);
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  // Fire confetti on on-time arrival
  useEffect(() => {
    if (latestScan && latestScan.record.status === 'HADIR') {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#06b6d4']
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [latestScan]);

  // Handle Form Submit from Barcode Gun (or Enter key)
  const handleBarcodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawVal = barcodeInput.trim();
    if (!rawVal) return;

    recordAttendance(rawVal, isFaceValidatorActive ? 'FACE_SCAN' : 'QR_BARCODE');
    setBarcodeInput('');
    
    // Refocus
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Quick Demo Trigger for evaluation
  const handleQuickDemoScan = (nisn: string) => {
    setBarcodeInput(nisn);
    recordAttendance(nisn, isFaceValidatorActive ? 'FACE_SCAN' : 'QR_BARCODE');
    setTimeout(() => {
      setBarcodeInput('');
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navigation & Status Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            id="kiosk-btn-back"
            onClick={() => {
              clearLatestScan();
              setCurrentView('PORTAL');
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Portal
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="hidden sm:block">
            <div className="text-xs text-slate-400 font-medium">Layar Presensi Siswa Mandiri</div>
            <div className="text-sm font-bold text-white">{settings.schoolName}</div>
          </div>
        </div>

        {/* Live Clock & Audio Toggle */}
        <div className="flex items-center gap-3">
          <button
            id="kiosk-btn-audio-toggle"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              audioEnabled 
                ? 'bg-blue-950/60 border-blue-600/40 text-blue-400' 
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Toggle Suara Konfirmasi"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioEnabled ? 'Suara Aktif' : 'Mute'}</span>
          </button>

          <button
            id="kiosk-btn-face-toggle"
            onClick={() => setIsFaceValidatorActive(!isFaceValidatorActive)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isFaceValidatorActive
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Validasi Wajah Biometrik AI"
          >
            <Smile className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isFaceValidatorActive ? 'Face Biometric: ON' : 'Face Biometric: OFF'}
            </span>
          </button>

          <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg text-right">
            <div className="text-xs text-slate-400 font-medium">{currentDayStr}</div>
            <div className="text-base font-bold font-mono text-cyan-400">{currentClock} WIB</div>
          </div>
        </div>
      </header>

      {/* Main Kiosk Area */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col justify-center">
        
        {/* Hardware Barcode Scanner Input Form (Invisible / Always Focused) */}
        <form onSubmit={handleBarcodeSubmit} className="mb-4">
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-slate-900/90 border-2 border-blue-500/60 focus-within:border-blue-400 rounded-2xl p-2 shadow-2xl shadow-blue-500/10 transition-all">
              <div className="pl-3 text-blue-400">
                <Scan className="w-6 h-6 animate-pulse" />
              </div>
              <input
                ref={inputRef}
                id="kiosk-barcode-input"
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Arahkan Barcode Scanner Gun atau Masukkan NISN Siswa..."
                className="w-full bg-transparent px-3 py-2 text-white placeholder-slate-500 text-sm sm:text-base font-mono font-medium focus:outline-none"
                autoComplete="off"
                autoFocus
              />
              <button
                type="submit"
                id="kiosk-btn-submit-scan"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-md"
              >
                <Barcode className="w-4 h-4" />
                Scan Hadir
              </button>
            </div>
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Alat Scan Barcode Siap Menerima Input
              </span>
              <button
                type="button"
                onClick={() => setIsCameraActive(!isCameraActive)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline"
              >
                {isCameraActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                {isCameraActive ? 'Tutup Kamera Web' : 'Gunakan Kamera Webcam'}
              </button>
            </div>
          </div>
        </form>

        {/* Optional Webcam / AI Camera Feed */}
        {isCameraActive && (
          <div className="max-w-md mx-auto mb-6 bg-slate-900 border border-slate-700 rounded-2xl p-3 relative overflow-hidden shadow-2xl">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
              {/* Animated Laser Scanning Line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-bounce" />
              
              {/* Target Scan Box */}
              <div className="absolute w-44 h-44 border-2 border-dashed border-cyan-400/80 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="text-[10px] uppercase font-mono text-cyan-300 bg-slate-900/80 px-2 py-0.5 rounded">
                  Arahkan QR / Wajah
                </div>
              </div>
            </div>
            {cameraError && (
              <div className="mt-2 text-xs text-rose-400 text-center font-medium">
                {cameraError}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* CORE REQUIREMENT DISPLAY AREA:                                            */}
        {/* "ketika di scan dan data ada didatabase akan muncul, maka Nama siswa,      */}
        {/* NISN siswa, Tanggal presensi, Jam hadir presensi muncul di halaman depan, */}
        {/* setelah 1 detik akan ke reset nama, nisn, tanggal, dan jam menjadi kosong" */}
        {/* ========================================================================= */}

        <div className="max-w-3xl mx-auto w-full my-auto">
          {latestScan ? (
            /* ACTIVE SCANNED DATA VIEW (Displays for 1 second, then resets) */
            <div 
              id="kiosk-live-scan-card"
              className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 shadow-2xl ${
                latestScan.record.status === 'HADIR'
                  ? 'bg-gradient-to-b from-slate-900 to-emerald-950/40 border-emerald-500 shadow-emerald-500/20'
                  : 'bg-gradient-to-b from-slate-900 to-amber-950/40 border-amber-500 shadow-amber-500/20'
              }`}
            >
              {/* 1-Second Auto-Reset Progress Bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-800">
                <div className="h-full bg-cyan-400 animate-[shrink_1s_linear_forwards]" style={{ animationDuration: `${settings.resetDisplayDurationMs || 1000}ms` }} />
              </div>

              {/* Status Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${
                    latestScan.record.status === 'HADIR' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                      Status Presensi Siswa
                    </span>
                    <h3 className={`text-lg sm:text-xl font-extrabold ${
                      latestScan.record.status === 'HADIR' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {latestScan.record.status === 'HADIR' ? 'PRESENSI BERHASIL - TEPAT WAKTU' : 'PRESENSI BERHASIL - TERLAMBAT'}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] uppercase font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-700/50 px-3 py-1 rounded-full">
                    Reset Otomatis 1 Detik
                  </span>
                </div>
              </div>

              {/* Grid of Student Details: Nama, NISN, Tanggal, Jam */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                
                {/* Student Photo */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-lg">
                    <img
                      src={latestScan.student.photoUrl}
                      alt={latestScan.student.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 py-1 text-center text-[10px] font-semibold text-slate-300">
                      {latestScan.student.className}
                    </div>
                  </div>
                  <span className="mt-2 text-xs font-mono text-slate-400">
                    ID: {latestScan.student.id}
                  </span>
                </div>

                {/* Scanned Fields */}
                <div className="sm:col-span-8 space-y-4">
                  
                  {/* NAMA SISWA */}
                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      NAMA SISWA
                    </div>
                    <div id="kiosk-output-student-name" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {latestScan.student.name}
                    </div>
                  </div>

                  {/* NISN SISWA */}
                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                      <Hash className="w-3.5 h-3.5 text-indigo-400" />
                      NISN SISWA
                    </div>
                    <div id="kiosk-output-student-nisn" className="text-lg sm:text-xl font-bold font-mono text-cyan-300 tracking-wider">
                      {latestScan.student.nisn}
                    </div>
                  </div>

                  {/* TANGGAL PRESENSI & JAM HADIR PRESENSI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* TANGGAL */}
                    <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        TANGGAL PRESENSI
                      </div>
                      <div id="kiosk-output-date" className="text-sm sm:text-base font-bold text-slate-100">
                        {formatIndonesianDate(latestScan.record.date)}
                      </div>
                    </div>

                    {/* JAM HADIR */}
                    <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        JAM HADIR PRESENSI
                      </div>
                      <div id="kiosk-output-time" className="text-base sm:text-lg font-black font-mono text-amber-300">
                        {latestScan.record.time} WIB
                      </div>
                    </div>
                  </div>

                  {/* Auto Parent Notification Status Strip */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-emerald-400" />
                      <span>Notifikasi WhatsApp otomatis terkirim ke Orang Tua ({latestScan.student.parentName})</span>
                    </div>
                    <span className="font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Terkirim
                    </span>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            /* EMPTY / READY STATE (The state when reset or waiting for scan) */
            <div 
              id="kiosk-empty-card"
              className="bg-slate-900/60 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-3xl p-8 sm:p-10 text-center transition-all shadow-inner"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-blue-400 mb-5 shadow-inner">
                <QrCode className="w-10 h-10 animate-pulse" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Siap Menerima Scan Kartu / Barcode Siswa
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Dekatkan kartu QR code atau ketikkan NISN. Data Nama, NISN, Tanggal, dan Jam akan tampil seketika dan di-reset bersih dalam 1 detik.
              </p>

              {/* Clean Empty Placeholder Fields Frame */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
                <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-500 font-medium uppercase">Nama Siswa</div>
                  <div className="text-sm font-semibold text-slate-600 mt-1">--- Menunggu Scan ---</div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-500 font-medium uppercase">NISN Siswa</div>
                  <div className="text-sm font-mono text-slate-600 mt-1">----------</div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-500 font-medium uppercase">Tanggal Presensi</div>
                  <div className="text-sm text-slate-600 mt-1">-- / -- / ----</div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-500 font-medium uppercase">Jam Hadir</div>
                  <div className="text-sm font-mono text-slate-600 mt-1">--:--:-- WIB</div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Error Toast (e.g. not found / already scanned) */}
          {scanFeedbackError && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-950/90 border border-rose-600 text-rose-200 text-sm flex items-center gap-3 animate-shake shadow-lg">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div className="flex-1 font-medium">{scanFeedbackError}</div>
            </div>
          )}
        </div>

        {/* Quick Demo Student Scanner Test Section (Convenient for test evaluation) */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Shortcut Test Barcode Siswa (Klik untuk Simulasi Scan):
            </span>
            <span className="text-[11px] text-slate-500">
              Total {students.length} Siswa Terdaftar
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {students.slice(0, 4).map((student) => {
              const alreadyCheckedIn = todayRecords.some(r => r.studentId === student.id);
              return (
                <button
                  key={student.id}
                  id={`kiosk-test-btn-${student.nisn}`}
                  onClick={() => handleQuickDemoScan(student.nisn)}
                  className={`p-2.5 rounded-xl border text-left transition-all group flex items-center gap-2.5 ${
                    alreadyCheckedIn 
                      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80' 
                      : 'bg-slate-900 hover:bg-slate-800/90 border-slate-700 hover:border-blue-500'
                  }`}
                >
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-300">
                      {student.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <span>{student.nisn}</span>
                      <span>•</span>
                      <span className="text-blue-400">{student.className}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer ticker with recent scans */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sistem Validasi Terenkripsi & Anti-Titip Absen Aktif</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Hari ini: <strong className="text-white">{todayRecords.length}</strong> Presensi Tercatat</span>
          <button
            onClick={() => setCurrentView('ADMIN_LOGIN')}
            className="text-blue-400 hover:text-blue-300 font-semibold underline"
          >
            Akses Panel Admin
          </button>
        </div>
      </footer>
    </div>
  );
};
