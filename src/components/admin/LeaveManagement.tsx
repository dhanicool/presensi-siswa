import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { LeaveRequest, LeaveStatus } from '../../types';
import { 
  FileText, 
  Plus, 
  Check, 
  X, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Paperclip, 
  AlertCircle,
  Eye,
  User
} from 'lucide-react';
import { getTodayDateString, formatIndonesianDate } from '../../utils/crypto';

export const LeaveManagement: React.FC = () => {
  const { 
    leaveRequests, 
    students, 
    submitLeaveRequest, 
    approveLeaveRequest, 
    rejectLeaveRequest 
  } = useAttendance();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState<string | null>(null);

  // New Leave Form State
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    type: 'SAKIT' as 'SAKIT' | 'IZIN' | 'DISPENSASI',
    startDate: getTodayDateString(),
    endDate: getTodayDateString(),
    reason: '',
    attachmentUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === formData.studentId);
    if (!student || !formData.reason.trim()) {
      alert('Mohon pilih siswa dan isi alasan perizinan.');
      return;
    }

    submitLeaveRequest({
      studentId: student.id,
      nisn: student.nisn,
      studentName: student.name,
      className: student.className,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      attachmentUrl: formData.attachmentUrl,
    });

    setIsModalOpen(false);
    setFormData({
      studentId: students[0]?.id || '',
      type: 'SAKIT',
      startDate: getTodayDateString(),
      endDate: getTodayDateString(),
      reason: '',
      attachmentUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    });
  };

  const filteredRequests = leaveRequests.filter(req => {
    if (activeTab === 'ALL') return true;
    return req.status === activeTab;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Sistem Perizinan Siswa Online
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola pengajuan surat sakit, izin, dan dispensasi dengan persetujuan kesiswaan
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajukan Izin / Surat Baru
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab === 'ALL' && `Semua Permohonan (${leaveRequests.length})`}
            {tab === 'PENDING' && `Menunggu Approval (${leaveRequests.filter(r => r.status === 'PENDING').length})`}
            {tab === 'APPROVED' && `Disetujui (${leaveRequests.filter(r => r.status === 'APPROVED').length})`}
            {tab === 'REJECTED' && `Ditolak (${leaveRequests.filter(r => r.status === 'REJECTED').length})`}
          </button>
        ))}
      </div>

      {/* Leave List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                        req.type === 'SAKIT'
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                          : req.type === 'DISPENSASI'
                          ? 'bg-purple-950/80 text-purple-400 border border-purple-800/40'
                          : 'bg-blue-950/80 text-blue-400 border border-blue-800/40'
                      }`}>
                        {req.type}
                      </span>
                      <span className="text-xs text-blue-400 font-bold">{req.className}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{req.studentName}</h3>
                    <div className="text-[11px] text-slate-400 font-mono">NISN: {req.nisn}</div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    req.status === 'APPROVED'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                      : req.status === 'REJECTED'
                      ? 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                  }`}>
                    {req.status === 'APPROVED' ? 'Disetujui' : req.status === 'REJECTED' ? 'Ditolak' : 'Menunggu'}
                  </span>
                </div>

                {/* Body details */}
                <div className="py-3 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Periode: <strong>{req.startDate}</strong> s.d <strong>{req.endDate}</strong></span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Alasan Permohonan:</span>
                    {req.reason}
                  </div>

                  {/* Attachment Preview button */}
                  {req.attachmentUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewAttachmentUrl(req.attachmentUrl || null)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 underline pt-1"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      Lihat Surat Keterangan Dokter / Lampiran
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="text-[10px] text-slate-500">
                  Diajukan: {req.submittedAt}
                </div>

                {req.status === 'PENDING' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => rejectLeaveRequest(req.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/40 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Tolak
                    </button>
                    <button
                      onClick={() => approveLeaveRequest(req.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-md"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Setujui
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 font-medium">
                    Oleh: {req.approvedBy || 'Admin'}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
            Tidak ada permohonan izin pada tab ini.
          </div>
        )}
      </div>

      {/* Modal: Add Leave Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Form Pengajuan Izin / Sakit
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Pilih Siswa *
                </label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className} - {s.nisn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Jenis Izin *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'SAKIT' | 'IZIN' | 'DISPENSASI' })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="SAKIT">Sakit (Surat Dokter)</option>
                  <option value="IZIN">Izin Keperluan Keluarga</option>
                  <option value="DISPENSASI">Dispensasi Lomba / Tugas Sekolah</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Tanggal Selesai *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Alasan Lengkap *
                </label>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Jelaskan alasan izin / diagnosa sakit..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  URL Lampiran Surat Dokter / Foto
                </label>
                <input
                  type="text"
                  value={formData.attachmentUrl}
                  onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                  placeholder="URL Foto Surat..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
                >
                  Ajukan Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attachment Image Lightbox */}
      {previewAttachmentUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-4 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-white">Lampiran Surat Izin / Dokter</span>
              <button onClick={() => setPreviewAttachmentUrl(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewAttachmentUrl}
              alt="Lampiran Surat"
              className="w-full h-80 object-cover rounded-2xl border border-slate-800"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

    </div>
  );
};
