import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { Student, Gender } from '../../types';
import { 
  UserPlus, 
  Search, 
  Filter, 
  QrCode, 
  Edit3, 
  Trash2, 
  Phone, 
  ShieldCheck, 
  FileSpreadsheet, 
  Plus, 
  X, 
  Check, 
  Camera,
  Printer
} from 'lucide-react';
import { StudentCardModal } from '../common/StudentCardModal';
import { generateSvgQrCode } from '../../utils/crypto';

export const StudentManagement: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, settings } = useAttendance();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [filterGender, setFilterGender] = useState<string>('ALL');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State for Insert Data Siswa
  const [formData, setFormData] = useState({
    nisn: '',
    nis: '',
    name: '',
    gender: 'L' as Gender,
    className: 'XII-MIPA 1',
    major: 'MIPA',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    faceRegistered: true,
  });

  const resetForm = () => {
    setFormData({
      nisn: '',
      nis: '',
      name: '',
      gender: 'L',
      className: 'XII-MIPA 1',
      major: 'MIPA',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      faceRegistered: true,
    });
    setEditingStudent(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nisn || !formData.name || !formData.parentPhone) {
      alert('NISN, Nama Siswa, dan No WhatsApp Orang Tua wajib diisi.');
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nisn: student.nisn,
      nis: student.nis,
      name: student.name,
      gender: student.gender,
      className: student.className,
      major: student.major,
      photoUrl: student.photoUrl,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail || '',
      address: student.address,
      faceRegistered: student.faceRegistered,
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus data siswa ${name}? Data presensi terkait akan tetap tersimpan.`)) {
      deleteStudent(id);
    }
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.nisn.includes(searchTerm) ||
                        s.nis.includes(searchTerm);
    const matchClass = filterClass === 'ALL' || s.className === filterClass;
    const matchGender = filterGender === 'ALL' || s.gender === filterGender;
    return matchSearch && matchClass && matchGender;
  });

  const uniqueClasses = Array.from(new Set(students.map(s => s.className)));

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Data & Manajemen Siswa
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola data siswa, generate kartu QR code, dan registrasi biometrik wajah
          </p>
        </div>

        <button
          id="btn-open-insert-student-modal"
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Insert Data Siswa Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan Nama, NISN, atau NIS..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Kelas</option>
            {uniqueClasses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Gender</option>
            <option value="L">Laki-Laki (L)</option>
            <option value="P">Perempuan (P)</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Foto</th>
                <th className="px-4 py-3.5">NISN / NIS</th>
                <th className="px-4 py-3.5">Nama Lengkap</th>
                <th className="px-4 py-3.5">Kelas & Jurusan</th>
                <th className="px-4 py-3.5">No. WA Orang Tua</th>
                <th className="px-4 py-3.5">Status Wajah</th>
                <th className="px-4 py-3.5 text-center">Kartu QR</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Photo */}
                    <td className="px-4 py-3">
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    </td>

                    {/* NISN / NIS */}
                    <td className="px-4 py-3 font-mono">
                      <div className="font-bold text-cyan-300">{student.nisn}</div>
                      <div className="text-[10px] text-slate-500">NIS: {student.nis}</div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-white text-sm">{student.name}</div>
                      <div className="text-[11px] text-slate-400">
                        Wali: {student.parentName} ({student.gender === 'L' ? 'Laki-Laki' : 'Perempuan'})
                      </div>
                    </td>

                    {/* Class */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                        {student.className}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{student.major}</div>
                    </td>

                    {/* Parent Phone */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                        <Phone className="w-3 h-3" />
                        <span>{student.parentPhone}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[130px]">{student.address}</div>
                    </td>

                    {/* Face Recognition */}
                    <td className="px-4 py-3">
                      {student.faceRegistered ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                          <ShieldCheck className="w-3 h-3" />
                          Terdaftar
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                          Belum Ada
                        </span>
                      )}
                    </td>

                    {/* QR Code Action */}
                    <td className="px-4 py-3 text-center">
                      <button
                        id={`btn-view-card-${student.nisn}`}
                        onClick={() => setSelectedStudentForCard(student)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                        title="Lihat & Cetak Kartu Pelajar"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition-colors"
                          title="Edit Siswa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student.id, student.name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    Tidak ada siswa yang sesuai pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insert / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <span>{editingStudent ? 'Edit Data Siswa' : 'Insert Data Siswa Baru'}</span>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* NISN */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    NISN (Nomor Induk Siswa Nasional) *
                  </label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="Contoh: 0089234509"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* NIS */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    NIS Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="Contoh: 24251009"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Nama Lengkap */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Muhammad Bintang Pratama"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Kelas */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Kelas
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="X-1">X-1 (Umum)</option>
                    <option value="X-2">X-2 (Umum)</option>
                    <option value="XI-MIPA 1">XI-MIPA 1</option>
                    <option value="XI-IPS 1">XI-IPS 1</option>
                    <option value="XI-IPS 2">XI-IPS 2</option>
                    <option value="XII-MIPA 1">XII-MIPA 1</option>
                    <option value="XII-MIPA 2">XII-MIPA 2</option>
                    <option value="XII-IPS 1">XII-IPS 1</option>
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                {/* Nama Orang Tua */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Nama Orang Tua / Wali *
                  </label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Contoh: Ir. Hendri Pratama"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* No WhatsApp Ortu */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    No. WhatsApp Wali (Notifikasi Otomatis) *
                  </label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Foto Siswa URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    URL Foto Profil Siswa
                  </label>
                  <input
                    type="text"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    placeholder="URL Foto..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Alamat */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Alamat Domisili Siswa
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Alamat lengkap..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Registrasi Biometrik Wajah Checkbox */}
                <div className="sm:col-span-2 flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <input
                    type="checkbox"
                    id="chk-face-reg"
                    checked={formData.faceRegistered}
                    onChange={(e) => setFormData({ ...formData, faceRegistered: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500"
                  />
                  <label htmlFor="chk-face-reg" className="text-xs text-slate-300 cursor-pointer">
                    Aktifkan Fitur Validasi Deteksi Wajah untuk Siswa ini
                  </label>
                </div>

              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-submit-student"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md"
                >
                  <Check className="w-4 h-4" />
                  {editingStudent ? 'Simpan Perubahan' : 'Simpan Data Siswa'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Printable Digital Card Modal */}
      {selectedStudentForCard && (
        <StudentCardModal
          student={selectedStudentForCard}
          settings={settings}
          onClose={() => setSelectedStudentForCard(null)}
        />
      )}

    </div>
  );
};
