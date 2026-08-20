import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  PhoneCall, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Radio, 
  Users, 
  Search,
  Filter,
  Sparkles
} from 'lucide-react';

export const ParentNotifications: React.FC = () => {
  const { 
    notificationLogs, 
    students, 
    sendBroadcastMessage, 
    triggerAlphaWarningForAbsentStudents,
    settings 
  } = useAttendance();

  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    const count = sendBroadcastMessage(selectedClass, broadcastMessage, channel);
    setToastSuccess(`Pesan broadcast berhasil dikirim ke ${count} orang tua siswa via ${channel}.`);
    setBroadcastMessage('');
    setTimeout(() => setToastSuccess(null), 4000);
  };

  const handleTriggerAlpha = () => {
    const count = triggerAlphaWarningForAbsentStudents();
    setToastSuccess(`Berhasil mengirimkan ${count} pesan peringatan otomatis ke orang tua siswa yang belum hadir.`);
    setTimeout(() => setToastSuccess(null), 4000);
  };

  const uniqueClasses = Array.from(new Set(students.map(s => s.className)));

  const filteredLogs = notificationLogs.filter(log => {
    const matchType = filterType === 'ALL' || log.messageType === filterType;
    const matchSearch = log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.parentPhone.includes(searchTerm) ||
                        log.messageText.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <PhoneCall className="w-7 h-7 text-emerald-400" />
            Gateway Notifikasi Orang Tua (WhatsApp / SMS)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pengiriman pesan otomatis kehadiran tepat waktu, peringatan terlambat, alert alpa, dan siaran pengumuman
          </p>
        </div>

        <button
          onClick={handleTriggerAlpha}
          className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 transition-colors shadow-md"
        >
          <Send className="w-4 h-4 text-rose-400" />
          Kirim Peringatan Alpa Massal
        </button>
      </div>

      {toastSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-fade-in shadow-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastSuccess}</span>
        </div>
      )}

      {/* Broadcast Composer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          Kirim Pesan Siaran / Broadcast ke Orang Tua Siswa
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Kirim informasi pengumuman sekolah, undangan rapat wali murid, atau laporan kedisiplinan berkala
        </p>

        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Target Penerima
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">Semua Kelas ({students.length} Wali Murid)</option>
                {uniqueClasses.map(c => (
                  <option key={c} value={c}>Kelas {c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Kanal Pengiriman
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('WHATSAPP')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 ${
                    channel === 'WHATSAPP'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  WhatsApp API
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 ${
                    channel === 'SMS'
                      ? 'bg-blue-950/80 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 text-blue-400" />
                  SMS Gateway
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Isi Pesan Laporan / Pengumuman
            </label>
            <textarea
              rows={3}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Contoh: Diberitahukan kepada seluruh wali murid bahwa besok Jumat kegiatan belajar mengajar dimulai pukul 06.30 WIB untuk senam bersama..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sistem akan menambahkan salam dan nama siswa secara otomatis.
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-colors"
            >
              <Send className="w-4 h-4" />
              Kirim Pesan Sekarang
            </button>
          </div>
        </form>
      </div>

      {/* Log Table of Sent Notifications */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Log Riwayat Notifikasi Terkirim ({notificationLogs.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar seluruh pesan yang otomatis terkirim saat scan presensi dan peringatan kehadiran
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">Semua Tipe Pesan</option>
              <option value="ON_TIME_ARRIVAL">Hadir Tepat Waktu</option>
              <option value="LATE_ARRIVAL">Keterlambatan</option>
              <option value="ALPHA_WARNING">Peringatan Alpa</option>
              <option value="BROADCAST_REPORT">Siaran Broadcast</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari penerima / pesan..."
                className="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Waktu Kirim</th>
                <th className="px-4 py-3">Penerima (Wali)</th>
                <th className="px-4 py-3">Siswa</th>
                <th className="px-4 py-3">Kanal & Tipe</th>
                <th className="px-4 py-3">Isi Pesan Terkirim</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.sentAt}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{log.parentName}</div>
                      <div className="text-[10px] font-mono text-emerald-400">{log.parentPhone}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-200">
                      {log.studentName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.messageType === 'ON_TIME_ARRIVAL'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                          : log.messageType === 'LATE_ARRIVAL'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                          : log.messageType === 'ALPHA_WARNING'
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                          : 'bg-blue-950/80 text-blue-400 border border-blue-800/40'
                      }`}>
                        {log.channel} • {log.messageType === 'ON_TIME_ARRIVAL' ? 'Tepat Waktu' : log.messageType === 'LATE_ARRIVAL' ? 'Terlambat' : log.messageType === 'ALPHA_WARNING' ? 'Alpa' : 'Siaran'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-sm truncate text-[11px]">
                      {log.messageText}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                        <CheckCircle className="w-3 h-3" />
                        {log.status === 'DELIVERED' ? 'Tersampaikan' : 'Terkirim'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Belum ada log notifikasi yang sesuai.
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
