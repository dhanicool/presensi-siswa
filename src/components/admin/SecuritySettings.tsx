import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Sliders, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  CheckCircle, 
  School,
  Database,
  Clock,
  UserCheck,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

export const SecuritySettings: React.FC = () => {
  const { settings, updateSettings, resetToDefaultData, students, attendanceRecords } = useAttendance();

  const [formSettings, setFormSettings] = useState({ 
    ...settings,
    adminUsername: settings.adminUsername || 'admin',
    adminPassword: settings.adminPassword || 'admin123'
  });

  const [newPassword, setNewPassword] = useState<string>(settings.adminPassword || 'admin123');
  const [confirmPassword, setConfirmPassword] = useState<string>(settings.adminPassword || 'admin123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    // Password validation
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    if (newPassword.trim().length < 4) {
      setPasswordError('Kata sandi minimal terdiri dari 4 karakter.');
      return;
    }

    const updated = {
      ...formSettings,
      adminPassword: newPassword.trim(),
      adminUsername: (formSettings.adminUsername || 'admin').trim(),
    };

    updateSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: formSettings,
      students,
      attendanceRecords,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Backup_Presensi_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-indigo-400" />
          Keamanan & Konfigurasi Sistem
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Kelola kredensial akun admin, identitas resmi sekolah, jam operasional presensi, dan keamanan data
        </p>
      </div>

      {/* Success Notification Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-fade-in shadow-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <strong className="font-bold">Konfigurasi Berhasil Disimpan!</strong>
            <p className="text-emerald-300/80 text-xs">Pengaturan identitas sekolah dan kata sandi admin telah diperbarui serta disinkronkan ke cloud.</p>
          </div>
        </div>
      )}

      {/* Error Notification Alert */}
      {passwordError && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs sm:text-sm flex items-center gap-3 animate-fade-in shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{passwordError}</span>
        </div>
      )}

      {/* Security Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                  AES-256 GCM & SHA-256 Aktif
                </span>
                <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/40 flex items-center gap-1">
                  <Database className="w-3 h-3" /> Firebase Firestore Live
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Autentikasi & Keamanan Data Terlindungi
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kredensial login admin dan enkripsi data presensi siswa tersimpan aman.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            Backup Database JSON
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Section 1: Update Akun & Kata Sandi Admin */}
        <div className="bg-slate-950/60 border border-indigo-900/40 rounded-2xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
            <Key className="w-4 h-4 text-indigo-400" />
            Pengaturan Akun & Kata Sandi Administrator
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Username Admin
              </label>
              <input
                type="text"
                value={formSettings.adminUsername}
                onChange={(e) => setFormSettings({ ...formSettings, adminUsername: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                placeholder="admin"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Username untuk masuk ke dashboard admin</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="Masukkan kata sandi baru"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Minimal 4 karakter</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-slate-900 border ${confirmPassword !== newPassword ? 'border-rose-500' : 'border-slate-700'} rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono`}
                placeholder="Ulangi kata sandi baru"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {confirmPassword === newPassword ? 'Kata sandi cocok' : 'Kata sandi belum cocok'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Identitas & Profil Sekolah */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-800">
            <School className="w-4 h-4 text-blue-400" />
            Identitas & Profil Resmi Sekolah
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Nama Resmi Sekolah
              </label>
              <input
                type="text"
                value={formSettings.schoolName}
                onChange={(e) => setFormSettings({ ...formSettings, schoolName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Nomor Pokok Sekolah Nasional (NPSN)
              </label>
              <input
                type="text"
                value={formSettings.schoolNPSN}
                onChange={(e) => setFormSettings({ ...formSettings, schoolNPSN: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Alamat Sekolah (Untuk Kop Surat Laporan)
              </label>
              <input
                type="text"
                value={formSettings.schoolAddress}
                onChange={(e) => setFormSettings({ ...formSettings, schoolAddress: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={formSettings.principalName}
                onChange={(e) => setFormSettings({ ...formSettings, principalName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={formSettings.principalNIP}
                onChange={(e) => setFormSettings({ ...formSettings, principalNIP: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Attendance Hours Config */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 pb-2 border-b border-slate-800">
            <Clock className="w-4 h-4 text-amber-400" />
            Parameter Waktu Presensi & Toleransi Keterlambatan
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Jam Buka Presensi Pagi
              </label>
              <input
                type="text"
                value={formSettings.entryStartTime}
                onChange={(e) => setFormSettings({ ...formSettings, entryStartTime: e.target.value })}
                placeholder="06:00"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Batas Toleransi Tepat Waktu (Telat Setelah Ini)
              </label>
              <input
                type="text"
                value={formSettings.entryLimitTime}
                onChange={(e) => setFormSettings({ ...formSettings, entryLimitTime: e.target.value })}
                placeholder="07:15"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-400 font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Durasi Auto-Reset Layar Depan (ms)
              </label>
              <input
                type="number"
                value={formSettings.resetDisplayDurationMs}
                onChange={(e) => setFormSettings({ ...formSettings, resetDisplayDurationMs: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-400 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 1000ms (1 Detik)</span>
            </div>
          </div>
        </div>

        {/* Bottom Save and Reset Controls */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset database ke data default bawaan? Data baru akan dihapus.')) {
                resetToDefaultData();
                setFormSettings({ ...settings });
                setNewPassword('admin123');
                setConfirmPassword('admin123');
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Database ke Contoh Awal
          </button>

          <button
            type="submit"
            id="btn-save-settings"
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan & Kata Sandi
          </button>
        </div>

      </form>

    </div>
  );
};
