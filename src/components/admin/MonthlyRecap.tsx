import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  FileSpreadsheet, 
  FileText, 
  Filter, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  UserX, 
  Download,
  Search,
  School
} from 'lucide-react';
import { exportRecapToPdf, exportRecapToExcel } from '../../utils/export';
import { formatIndonesianDate } from '../../utils/crypto';

export const MonthlyRecap: React.FC = () => {
  const { attendanceRecords, students, settings } = useAttendance();

  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const months = [
    { value: 1, name: 'Januari' },
    { value: 2, name: 'Februari' },
    { value: 3, name: 'Maret' },
    { value: 4, name: 'April' },
    { value: 5, name: 'Mei' },
    { value: 6, name: 'Juni' },
    { value: 7, name: 'Juli' },
    { value: 8, name: 'Agustus' },
    { value: 9, name: 'September' },
    { value: 10, name: 'Oktober' },
    { value: 11, name: 'November' },
    { value: 12, name: 'Desember' }
  ];

  const currentMonthName = months.find(m => m.value === selectedMonth)?.name || 'Bulan';

  // Filter records by month & year & class
  const filteredRecords = attendanceRecords.filter((rec) => {
    const recDate = new Date(rec.date);
    const recMonth = recDate.getMonth() + 1;
    const recYear = recDate.getFullYear();

    const matchMonth = recMonth === selectedMonth && recYear === selectedYear;
    const matchClass = selectedClass === 'ALL' || rec.className === selectedClass;
    const matchSearch = rec.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        rec.nisn.includes(searchTerm);

    return matchMonth && matchClass && matchSearch;
  });

  // Calculate Metrics
  const totalHadir = filteredRecords.filter(r => r.status === 'HADIR').length;
  const totalTerlambat = filteredRecords.filter(r => r.status === 'TERLAMBAT').length;
  const totalIzin = filteredRecords.filter(r => r.status === 'IZIN').length;
  const totalSakit = filteredRecords.filter(r => r.status === 'SAKIT').length;
  const totalAlpa = filteredRecords.filter(r => r.status === 'ALPA').length;
  const totalEntries = filteredRecords.length;
  const attendanceRate = totalEntries > 0 ? Math.round(((totalHadir + totalTerlambat) / totalEntries) * 100) : 0;

  const uniqueClasses = Array.from(new Set(students.map(s => s.className)));

  // Handlers for Exports
  const handleExportPdf = () => {
    exportRecapToPdf(
      filteredRecords,
      students,
      settings,
      currentMonthName,
      selectedYear,
      selectedClass
    );
  };

  const handleExportExcel = () => {
    exportRecapToExcel(
      filteredRecords,
      students,
      settings,
      currentMonthName,
      selectedYear,
      selectedClass
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar with Export Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Rekapitulasi Kehadiran Bulanan
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Laporan lengkap presensi per periode yang siap diunduh dalam format Excel atau PDF
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            id="btn-export-excel"
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Unduh Excel (.xlsx)
          </button>

          <button
            id="btn-export-pdf"
            onClick={handleExportPdf}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Unduh PDF Resmi
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-blue-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-xs text-white focus:outline-none"
            >
              {months.map(m => (
                <option key={m.value} value={m.value} className="bg-slate-900">{m.name}</option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs text-white focus:outline-none"
            >
              <option value={2026} className="bg-slate-900">2026</option>
              <option value={2025} className="bg-slate-900">2025</option>
            </select>
          </div>

          {/* Class Filter */}
          <div className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900">Semua Kelas</option>
              {uniqueClasses.map(c => (
                <option key={c} value={c} className="bg-slate-900">{c}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Search Field */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama / NISN..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Monthly Summary Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Entri</div>
          <div className="text-xl font-black text-white mt-1">{totalEntries}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-[11px] text-emerald-400 font-semibold uppercase">Hadir Tepat Waktu</div>
          <div className="text-xl font-black text-emerald-400 mt-1">{totalHadir}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-[11px] text-amber-400 font-semibold uppercase">Terlambat</div>
          <div className="text-xl font-black text-amber-400 mt-1">{totalTerlambat}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-[11px] text-blue-400 font-semibold uppercase">Izin / Sakit</div>
          <div className="text-xl font-black text-blue-400 mt-1">{totalIzin + totalSakit}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-[11px] text-rose-400 font-semibold uppercase">Alpa</div>
          <div className="text-xl font-black text-rose-400 mt-1">{totalAlpa}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-[11px] text-cyan-400 font-semibold uppercase">Tingkat Disiplin</div>
          <div className="text-xl font-black text-cyan-400 mt-1">{attendanceRate}%</div>
        </div>
      </div>

      {/* Recap Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Menampilkan rekap presensi periode <strong>{currentMonthName} {selectedYear}</strong></span>
          <span>Kelas: <strong className="text-white">{selectedClass === 'ALL' ? 'Semua Kelas' : selectedClass}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Jam</th>
                <th className="px-4 py-3.5">NISN</th>
                <th className="px-4 py-3.5">Nama Siswa</th>
                <th className="px-4 py-3.5">Kelas</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Validasi</th>
                <th className="px-4 py-3.5">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-300">
                      {rec.date}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-cyan-400">
                      {rec.time}
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
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                    <td className="px-4 py-3 text-slate-400">
                      {rec.verificationMethod === 'FACE_SCAN' ? 'Deteksi Wajah' : rec.verificationMethod === 'QR_BARCODE' ? 'Scan Barcode' : 'Manual'}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {rec.notes || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    Tidak ada data presensi pada periode {currentMonthName} {selectedYear}.
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
