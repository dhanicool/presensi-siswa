import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  School, 
  Save, 
  CheckCircle, 
  Building, 
  UserCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  FileBadge,
  Sparkles,
  RefreshCw,
  Database
} from 'lucide-react';
import { activeProjectId } from '../../lib/firebase';

export const SchoolSettingsView: React.FC = () => {
  const { settings, updateSettings, isCloudSyncActive } = useAttendance();

  const [formSettings, setFormSettings] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleResetDefault = () => {
    const defaultData = {
      ...formSettings,
      schoolName: 'SMA NEGERI 1 TELADAN NUSANTARA',
      schoolNPSN: '20108945',
      schoolAddress: 'Jl. Pemuda No. 45, Kebayoran Baru, Jakarta Selatan',
      principalName: 'Dr. H. Bambang Hartono, M.Pd.',
      principalNIP: '19750812 199903 1 004',
      academicYear: '2026/2027',
      semester: 'Ganjil' as const,
      entryStartTime: '06:00',
      entryLimitTime: '07:15',
      entryEndTime: '08:00',
      departureTime: '15:30',
    };
    setFormSettings(defaultData);
    updateSettings(defaultData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-800/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-blue-400/30 shrink-0">
              <School className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                  Konfigurasi Lembaga
                </span>
                {isCloudSyncActive && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40 flex items-center gap-1">
                    <Database className="w-3 h-3" /> Firestore Live Sync
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Pengaturan Identitas & Profil Sekolah
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola nama resmi sekolah, NPSN, identitas kepala sekolah, tahun akademik, dan batas jam presensi.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetDefault}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            Set Standar SMAN 1 Teladan Nusantara
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-xs animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <strong className="font-bold">Pengaturan Berhasil Disimpan!</strong>
            <p className="text-emerald-400/80">Identitas sekolah telah diperbarui di aplikasi dan disinkronkan secara otomatis ke Firebase Firestore.</p>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Profil Sekolah Utama */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building className="w-4 h-4 text-blue-400" />
            Identitas Resmi Satuan Pendidikan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Nama Resmi Sekolah <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formSettings.schoolName}
                  onChange={(e) => setFormSettings({ ...formSettings, schoolName: e.target.value })}
                  placeholder="Contoh: SMA NEGERI 1 TELADAN NUSANTARA"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
                <School className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Nama ini akan ditampilkan pada kop surat laporan PDF, judul kiosk presensi, portal awal, dan pesan WhatsApp wali murid.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                NPSN (Nomor Pokok Sekolah Nasional) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formSettings.schoolNPSN}
                  onChange={(e) => setFormSettings({ ...formSettings, schoolNPSN: e.target.value })}
                  placeholder="20108945"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-blue-500"
                  required
                />
                <FileBadge className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Tahun Ajaran & Semester
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formSettings.academicYear}
                  onChange={(e) => setFormSettings({ ...formSettings, academicYear: e.target.value })}
                  placeholder="2026/2027"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  required
                />
                <select
                  value={formSettings.semester}
                  onChange={(e) => setFormSettings({ ...formSettings, semester: e.target.value as 'Ganjil' | 'Genap' })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Alamat Lengkap Sekolah (Untuk Kop Laporan Resmi) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formSettings.schoolAddress}
                  onChange={(e) => setFormSettings({ ...formSettings, schoolAddress: e.target.value })}
                  placeholder="Jl. Pemuda No. 45, Kebayoran Baru, Jakarta Selatan"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pimpinan Sekolah */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            Kepala Sekolah & Penandatangan Laporan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Nama Lengkap & Gelar Kepala Sekolah
              </label>
              <input
                type="text"
                value={formSettings.principalName}
                onChange={(e) => setFormSettings({ ...formSettings, principalName: e.target.value })}
                placeholder="Dr. H. Bambang Hartono, M.Pd."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={formSettings.principalNIP}
                onChange={(e) => setFormSettings({ ...formSettings, principalNIP: e.target.value })}
                placeholder="19750812 199903 1 004"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Waktu Operasional Presensi */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Clock className="w-4 h-4 text-emerald-400" />
            Jadwal Batas Jam Presensi & Keterlambatan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mulai Presensi Masuk
              </label>
              <input
                type="time"
                value={formSettings.entryStartTime}
                onChange={(e) => setFormSettings({ ...formSettings, entryStartTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                required
              />
              <span className="text-[10px] text-slate-500">Kiosk mulai dibuka</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">
                Batas Toleransi Tepat Waktu
              </label>
              <input
                type="time"
                value={formSettings.entryLimitTime}
                onChange={(e) => setFormSettings({ ...formSettings, entryLimitTime: e.target.value })}
                className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                required
              />
              <span className="text-[10px] text-amber-400/80">Lewat jam ini = Terlambat</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Batas Akhir Presensi Masuk
              </label>
              <input
                type="time"
                value={formSettings.entryEndTime}
                onChange={(e) => setFormSettings({ ...formSettings, entryEndTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                required
              />
              <span className="text-[10px] text-slate-500">Kiosk ditutup</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jam Pulang Sekolah
              </label>
              <input
                type="time"
                value={formSettings.departureTime}
                onChange={(e) => setFormSettings({ ...formSettings, departureTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-blue-500"
                required
              />
              <span className="text-[10px] text-slate-500">Selesai KBM</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            id="btn-save-school-settings"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan Identitas Sekolah
          </button>
        </div>
      </form>
    </div>
  );
};
