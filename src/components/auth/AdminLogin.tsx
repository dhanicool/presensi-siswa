import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  RotateCw, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  Sparkles,
  School
} from 'lucide-react';
import { generateCaptchaCode, drawCaptchaOnCanvas } from '../../utils/crypto';

export const AdminLogin: React.FC = () => {
  const { setCurrentView, loginAdmin, settings } = useAttendance();

  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin123');
  const [captchaInput, setCaptchaInput] = useState<string>('');
  
  // Dynamic Captcha (Changes every 60 seconds / 1 minute)
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a new captcha code and draw on canvas
  const refreshCaptcha = useCallback(() => {
    const newCode = generateCaptchaCode(5);
    setCaptchaCode(newCode);
    setSecondsRemaining(60);
    setCaptchaInput('');
    setErrorMsg(null);

    if (canvasRef.current) {
      drawCaptchaOnCanvas(canvasRef.current, newCode);
    }
  }, []);

  // Initialize captcha on mount
  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  // Redraw when canvas or code is ready
  useEffect(() => {
    if (canvasRef.current && captchaCode) {
      drawCaptchaOnCanvas(canvasRef.current, captchaCode);
    }
  }, [captchaCode]);

  // 60-Second Dynamic Interval Timer for Captcha Refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          refreshCaptcha();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshCaptcha]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    // Validate Captcha
    if (!captchaInput.trim()) {
      setErrorMsg('Silakan masukkan kode Captcha.');
      setIsSubmitting(false);
      return;
    }

    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMsg('Kode Captcha tidak sesuai. Silakan coba lagi.');
      refreshCaptcha();
      setIsSubmitting(false);
      return;
    }

    // Validate Credentials against system settings
    const validUsername = (settings.adminUsername || 'admin').trim();
    const validPassword = (settings.adminPassword || 'admin123').trim();

    if (username.trim() !== validUsername || password.trim() !== validPassword) {
      setErrorMsg('Username atau Password salah. Silakan periksa kembali kredensial Anda.');
      refreshCaptcha();
      setIsSubmitting(false);
      return;
    }

    // Successful login
    setTimeout(() => {
      loginAdmin(username);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <button
          id="admin-login-btn-back"
          onClick={() => setCurrentView('PORTAL')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Portal
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <School className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200 hidden sm:inline">
            {settings.schoolName}
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-3 shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Portal Keamanan Admin
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Masukkan kredensial dan validasi Captcha dinamis (berubah tiap 1 menit).
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Username Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-input-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username..."
                  className="w-full bg-slate-950/90 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-input-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full bg-slate-950/90 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Dynamic Captcha Section (Auto-refreshes every 60s) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Verifikasi Keamanan Captcha
                </label>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  Berganti: {secondsRemaining}s
                </span>
              </div>

              {/* Captcha Canvas Image Box + Refresh Button */}
              <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-700 rounded-xl p-2">
                <div className="flex-1 flex items-center justify-center bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                  <canvas
                    ref={canvasRef}
                    width={180}
                    height={48}
                    className="h-10 w-auto select-none"
                  />
                </div>
                
                <button
                  type="button"
                  id="admin-btn-refresh-captcha"
                  onClick={refreshCaptcha}
                  className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Generate Captcha Baru"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Captcha Input Box */}
              <div className="mt-2.5">
                <input
                  id="admin-input-captcha"
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Ketik 5 karakter di atas..."
                  className="w-full bg-slate-950/90 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-center font-mono font-bold uppercase tracking-widest text-cyan-300 placeholder-slate-500 focus:outline-none transition-all"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            {/* Quick Demo Helper Hint */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-[11px] text-slate-400 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-300">Akun Pengujian Demo:</span>
                <div>Username: <code className="text-cyan-300 font-mono">admin</code> | Password: <code className="text-cyan-300 font-mono">admin123</code></div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="admin-btn-login-submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <KeyRound className="w-4 h-4" />
              {isSubmitting ? 'Memverifikasi Akses...' : 'Masuk ke Dashboard Admin'}
            </button>

          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500">
        Keamanan Berbasis Enkripsi Data Multi-Layer & Sesi Terproteksi
      </footer>
    </div>
  );
};
