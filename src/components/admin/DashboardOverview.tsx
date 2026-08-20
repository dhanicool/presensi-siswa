import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  UserX, 
  Send, 
  QrCode, 
  FileSpreadsheet, 
  FileText, 
  TrendingUp, 
  Sparkles, 
  Smile, 
  PhoneCall, 
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { formatIndonesianDate } from '../../utils/crypto';

export const DashboardOverview: React.FC = () => {
  const { 
    students, 
    todayRecords, 
    getTodayStats, 
    triggerAlphaWarningForAbsentStudents, 
    setCurrentView,
    setAdminActiveTab,
    settings 
  } = useAttendance();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [alphaTriggerSuccess, setAlphaTriggerSuccess] = useState<string | null>(null);

  const stats = getTodayStats();

  // Hourly Arrival Distribution Data for Recharts
  const hourlyData = [
    { hour: '06:00-06:30', count: todayRecords.filter(r => r.time >= '06:00' && r.time < '06:30').length },
    { hour: '06:30-07:00', count: todayRecords.filter(r => r.time >= '06:30' && r.time < '07:00').length },
    { hour: '07:00-07:15', count: todayRecords.filter(r => r.time >= '07:00' && r.time <= '07:15').length },
    { hour: '07:16-07:45 (Telat)', count: todayRecords.filter(r => r.time > '07:15' && r.time <= '07:45').length },
    { hour: '> 07:45', count: todayRecords.filter(r => r.time > '07:45').length },
  ];

  const pieData = [
    { name: 'Tepat Waktu', value: stats.onTimeCount, color: '#10b981' },
    { name: 'Terlambat', value: stats.lateCount, color: '#f59e0b' },
    { name: 'Izin / Sakit', value: stats.leaveCount + stats.sickCount, color: '#3b82f6' },
    { name: 'Alpa / Belum Hadir', value: stats.alphaCount, color: '#ef4444' },
  ];

  // Trigger automated WhatsApp alpha warning to absent parents
  const handleTriggerAlphaAlert = () => {
    const count = triggerAlphaWarningForAbsentStudents();
    setAlphaTriggerSuccess(`Berhasil mengirimkan ${count} notifikasi peringatan ketidakhadiran ke nomor WhatsApp orang tua.`);
    setTimeout(() => {
      setAlphaTriggerSuccess(null);
    }, 4000);
  };

  // Filtered today's records
  const filteredRecords = todayRecords.filter((rec) => {
    const matchSearch = rec.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        rec.nisn.includes(searchTerm);
    const matchClass = filterClass === 'ALL' || rec.className === filterClass;
    const matchStatus = filterStatus === 'ALL' || rec.status === filterStatus;
    return matchSearch && matchClass && matchStatus;
  });

  const uniqueClasses = Array.from(new Set(students.map(s => s.className)));

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome Bar */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-800/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Ringkasan Kehadiran Hari Ini — {formatIndonesianDate(new Date())}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard Manajemen Presensi Terpadu
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Pantau kehadiran siswa secara real-time, pantau notifikasi WhatsApp otomatis ke orang tua, dan kelola validasi biometrik wajah.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            id="btn-quick-open-kiosk"
            onClick={() => setCurrentView('STUDENT_SCAN')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <QrCode className="w-4 h-4" />
            Buka Kiosk Scan Siswa
          </button>

          <button
            id="btn-trigger-alpha-alert"
            onClick={handleTriggerAlphaAlert}
            className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all"
            title="Kirim notifikasi otomatis ke semua siswa yang belum absen"
          >
            <Send className="w-4 h-4 text-rose-400" />
            Alert Otomatis Alpa ({stats.alphaCount})
          </button>
        </div>
      </div>

      {/* Success Alert for Alpha Broadcast */}
      {alphaTriggerSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-fade-in shadow-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{alphaTriggerSuccess}</span>
        </div>
      )}

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Siswa */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Siswa</span>
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats.totalStudents}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">Terdaftar di sistem</div>
        </div>

        {/* Hadir Tepat Waktu */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase">Tepat Waktu</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.onTimeCount}</div>
          <div className="text-[11px] text-emerald-500/80 mt-1">Hadir s.d {settings.entryLimitTime} WIB</div>
        </div>

        {/* Terlambat */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase">Terlambat</span>
            <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.lateCount}</div>
          <div className="text-[11px] text-amber-500/80 mt-1">Notif WA ortu terkirim</div>
        </div>

        {/* Izin & Sakit */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-semibold uppercase">Izin / Sakit</span>
            <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-400">{stats.leaveCount + stats.sickCount}</div>
          <div className="text-[11px] text-blue-400/80 mt-1">Surat terverifikasi</div>
        </div>

        {/* Alpa / Tanpa Keterangan */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase">Alpa / Belum Scan</span>
            <div className="p-2 rounded-lg bg-rose-950/60 text-rose-400">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400">{stats.alphaCount}</div>
          <div className="text-[11px] text-rose-400/80 mt-1">Perlu pemantauan</div>
        </div>

      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hourly Arrival Chart */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Distribusi Jam Kedatangan Siswa Pagi Ini
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Frekuensi waktu scan barcode siswa sebelum dan sesudah batas {settings.entryLimitTime} WIB
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Jumlah Siswa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ratio Pie Chart */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Proporsi Status Hari Ini
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rasio kehadiran: {stats.attendanceRate}%
            </p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Real-Time Live Feed Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Feed Presensi Real-Time Hari Ini
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Menampilkan entri presensi yang masuk melalui scan barcode dan deteksi wajah
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama / NISN..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Kelas</option>
              {uniqueClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="HADIR">Hadir</option>
              <option value="TERLAMBAT">Terlambat</option>
              <option value="IZIN">Izin</option>
              <option value="SAKIT">Sakit</option>
              <option value="ALPA">Alpa</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Jam Masuk</th>
                <th className="px-4 py-3">NISN</th>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Metode Validasi</th>
                <th className="px-4 py-3">Notifikasi Ortu</th>
                <th className="px-4 py-3 text-right">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-cyan-400">
                      {rec.time} WIB
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      {rec.nisn}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      {rec.studentName}
                    </td>
                    <td className="px-4 py-3 text-blue-400">
                      {rec.className}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'HADIR'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                          : rec.status === 'TERLAMBAT'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-700/50'
                          : rec.status === 'ALPA'
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-700/50'
                          : 'bg-blue-950/80 text-blue-400 border border-blue-700/50'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        {rec.verificationMethod === 'FACE_SCAN' ? (
                          <>
                            <Smile className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Wajah ({rec.faceConfidence || 98}%)</span>
                          </>
                        ) : rec.verificationMethod === 'QR_BARCODE' ? (
                          <>
                            <QrCode className="w-3.5 h-3.5 text-blue-400" />
                            <span>Scan Barcode Gun</span>
                          </>
                        ) : (
                          <span>Manual Sistem</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {rec.notifiedParent ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                          <PhoneCall className="w-3 h-3" />
                          WA Terkirim
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 truncate max-w-[150px]">
                      {rec.notes || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data presensi yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
