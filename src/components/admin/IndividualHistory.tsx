import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  User, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  UserX, 
  Award, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  FileText,
  Printer
} from 'lucide-react';
import { formatIndonesianDate } from '../../utils/crypto';

export const IndividualHistory: React.FC = () => {
  const { students, attendanceRecords, settings } = useAttendance();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Records for this student
  const studentRecords = attendanceRecords
    .filter(r => r.studentId === activeStudent?.id || r.nisn === activeStudent?.nisn)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Compute student stats
  const totalHadir = studentRecords.filter(r => r.status === 'HADIR').length;
  const totalTerlambat = studentRecords.filter(r => r.status === 'TERLAMBAT').length;
  const totalIzin = studentRecords.filter(r => r.status === 'IZIN').length;
  const totalSakit = studentRecords.filter(r => r.status === 'SAKIT').length;
  const totalAlpa = studentRecords.filter(r => r.status === 'ALPA').length;
  const totalRecordedDays = studentRecords.length;
  const scorePercent = totalRecordedDays > 0 ? Math.round(((totalHadir + totalTerlambat) / totalRecordedDays) * 100) : 0;

  // Filter student list for selector
  const filteredStudentList = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nisn.includes(searchTerm) ||
    s.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Histori Kehadiran Per Individu Siswa
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Pilih siswa untuk melihat profil lengkap, persentase kedisiplinan, dan riwayat presensi harian
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Student Selector List */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-col h-[640px]">
          <div className="mb-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari siswa / NISN / kelas..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredStudentList.map((student) => {
              const isSelected = student.id === activeStudent?.id;
              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-blue-950/80 border-blue-500 shadow-md text-white'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold truncate">{student.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <span>{student.nisn}</span>
                      <span>•</span>
                      <span className="text-blue-400 font-bold">{student.className}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Student Card & History Table */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeStudent ? (
            <>
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <img
                      src={activeStudent.photoUrl}
                      alt={activeStudent.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {activeStudent.className}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">NISN: {activeStudent.nisn}</span>
                      </div>
                      <h3 className="text-xl font-black text-white mt-1">
                        {activeStudent.name}
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                        <span>Wali: <strong>{activeStudent.parentName}</strong></span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">{activeStudent.parentPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Discipline Score Badge */}
                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-center min-w-[110px]">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Skor Disiplin</div>
                    <div className="text-2xl font-black text-cyan-400 mt-0.5">{scorePercent}%</div>
                  </div>
                </div>

                {/* 4 Stats Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                  <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                    <div className="text-[10px] text-emerald-400 uppercase font-semibold">Tepat Waktu</div>
                    <div className="text-lg font-bold text-white mt-0.5">{totalHadir} Hari</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                    <div className="text-[10px] text-amber-400 uppercase font-semibold">Terlambat</div>
                    <div className="text-lg font-bold text-white mt-0.5">{totalTerlambat} Hari</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                    <div className="text-[10px] text-blue-400 uppercase font-semibold">Izin / Sakit</div>
                    <div className="text-lg font-bold text-white mt-0.5">{totalIzin + totalSakit} Hari</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                    <div className="text-[10px] text-rose-400 uppercase font-semibold">Alpa</div>
                    <div className="text-lg font-bold text-white mt-0.5">{totalAlpa} Hari</div>
                  </div>
                </div>
              </div>

              {/* History Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Riwayat Kehadiran Lengkap
                  </h4>
                  <span className="text-xs text-slate-400">Total: {studentRecords.length} Catatan</span>
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider sticky top-0 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Tanggal</th>
                        <th className="px-4 py-3">Jam Masuk</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Metode Scan</th>
                        <th className="px-4 py-3">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {studentRecords.length > 0 ? (
                        studentRecords.map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-2.5 font-medium text-slate-200">
                              {formatIndonesianDate(rec.date)}
                            </td>
                            <td className="px-4 py-2.5 font-mono font-bold text-cyan-400">
                              {rec.time} WIB
                            </td>
                            <td className="px-4 py-2.5">
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
                            <td className="px-4 py-2.5 text-slate-400">
                              {rec.verificationMethod === 'FACE_SCAN' ? 'Deteksi Wajah' : rec.verificationMethod === 'QR_BARCODE' ? 'Scan Barcode' : 'Manual'}
                            </td>
                            <td className="px-4 py-2.5 text-slate-400">
                              {rec.notes || '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                            Belum ada riwayat kehadiran tercatat untuk siswa ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
              Pilih siswa di sebelah kiri untuk melihat histori kehadiran.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
