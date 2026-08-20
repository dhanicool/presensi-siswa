import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  TrendingUp, 
  Award, 
  BarChart3, 
  PieChart as PieIcon, 
  Users, 
  CheckCircle, 
  Clock, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AnalyticsDashboard: React.FC = () => {
  const { attendanceRecords, students } = useAttendance();

  // Weekly Trend Data (Senin - Jumat)
  const weeklyData = [
    { day: 'Senin', tepatWaktu: 88, terlambat: 8, izinSakit: 3, alpa: 1 },
    { day: 'Selasa', tepatWaktu: 92, terlambat: 5, izinSakit: 2, alpa: 1 },
    { day: 'Rabu', tepatWaktu: 94, terlambat: 4, izinSakit: 2, alpa: 0 },
    { day: 'Kamis', tepatWaktu: 90, terlambat: 6, izinSakit: 3, alpa: 1 },
    { day: 'Jumat', tepatWaktu: 96, terlambat: 2, izinSakit: 2, alpa: 0 },
  ];

  // Monthly Comparison Data (Semester ini)
  const monthlyData = [
    { month: 'Mei', kehadiran: 93, terlambat: 5, alpa: 2 },
    { month: 'Juni', kehadiran: 91, terlambat: 7, alpa: 2 },
    { month: 'Juli', kehadiran: 95, terlambat: 4, alpa: 1 },
    { month: 'Agustus', kehadiran: 96, terlambat: 3, alpa: 1 },
  ];

  // Class Discipline Leaderboard
  const classRanking = [
    { className: 'XII-MIPA 1', score: 98.4, total: 32, onTime: 31, badge: 'Paling Disiplin 🏆' },
    { className: 'XI-IPS 1', score: 96.8, total: 30, onTime: 29, badge: 'Sangat Baik ⭐' },
    { className: 'XII-MIPA 2', score: 94.2, total: 32, onTime: 28, badge: 'Baik' },
    { className: 'X-1', score: 93.5, total: 34, onTime: 29, badge: 'Baik' },
    { className: 'XI-IPS 2', score: 91.0, total: 31, onTime: 26, badge: 'Cukup' },
    { className: 'X-2', score: 89.2, total: 33, onTime: 25, badge: 'Perlu Bimbingan' },
  ];

  const methodData = [
    { name: 'Scan Barcode Gun', value: 68, color: '#3b82f6' },
    { name: 'AI Face Biometrics', value: 28, color: '#06b6d4' },
    { name: 'Sistem Izin Online', value: 4, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-blue-400" />
          Dasbor Analitik & Tren Presensi Sekolah
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Visualisasi data analitik tren kehadiran mingguan, perbandingan bulanan, dan peringkat kedisiplinan kelas
        </p>
      </div>

      {/* Top 2 Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Trend (Area Chart) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Tren Kehadiran Mingguan (%)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Fluktuasi kehadiran tepat waktu vs keterlambatan per hari belajar
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTepat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTelat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="tepatWaktu" stroke="#10b981" fillOpacity={1} fill="url(#colorTepat)" name="Tepat Waktu (%)" />
                <Area type="monotone" dataKey="terlambat" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTelat)" name="Terlambat (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Method Breakdown */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Metode Validasi Digunakan
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Proporsi teknologi scan presensi
            </p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={methodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {methodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {methodData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <strong className="text-white font-mono">{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Monthly Comparison & Class Ranking Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Comparison Bar Chart */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Perbandingan Kehadiran Antar Bulan
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tingkat disiplin semester berjalan
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="kehadiran" fill="#3b82f6" name="Kehadiran (%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="terlambat" fill="#f59e0b" name="Terlambat (%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Discipline Ranking */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Peringkat Kedisiplinan Kelas
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Berdasarkan persentase hadir tepat waktu tertinggi
            </p>
          </div>

          <div className="space-y-2.5">
            {classRanking.map((rank, index) => (
              <div 
                key={rank.className} 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                    index === 0 ? 'bg-amber-500 text-black shadow-md' :
                    index === 1 ? 'bg-slate-300 text-black' :
                    index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{rank.className}</div>
                    <div className="text-[10px] text-slate-400">{rank.badge}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-cyan-400 font-mono">{rank.score}%</div>
                  <div className="text-[10px] text-slate-500">{rank.onTime}/{rank.total} Tepat Waktu</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
