import React from 'react';
import { Student, SchoolSettings } from '../../types';
import { generateSvgQrCode, generateBarcodeSvg, formatIndonesianDate } from '../../utils/crypto';
import { X, Printer, Download, School, ShieldCheck } from 'lucide-react';

interface StudentCardModalProps {
  student: Student | null;
  settings: SchoolSettings;
  onClose: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({
  student,
  settings,
  onClose,
}) => {
  if (!student) return null;

  const qrDataUrl = generateSvgQrCode(student.nisn, 160);
  const barcodeDataUrl = generateBarcodeSvg(student.nisn, 220, 50);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <School className="w-5 h-5 text-blue-400" />
            <span>Kartu Pelajar & Barcode Presensi</span>
          </div>
          <button
            id="btn-close-card-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-950/60">
          
          {/* Card Wrapper (Standard ID-1 / CR80 Ratio 85.6mm x 53.98mm) */}
          <div 
            id="printable-student-card"
            className="w-full max-w-[380px] bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border-2 border-blue-500/40 rounded-2xl p-5 shadow-2xl text-slate-100 relative overflow-hidden print:border-black print:text-black print:bg-white"
          >
            {/* Top decorative chip */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none" />

            {/* School Header on Card */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-700/80 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-md">
                SMA
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-black tracking-tight uppercase text-white truncate">
                  {settings.schoolName}
                </h4>
                <div className="text-[9px] text-slate-400 font-mono">
                  KARTU IDENTITAS SISWA DIGITAL
                </div>
              </div>
            </div>

            {/* Middle Section: Photo & Identity */}
            <div className="flex gap-4 items-center">
              {/* Photo */}
              <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-blue-400/50 bg-slate-800 shrink-0 shadow-md">
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bio */}
              <div className="flex-1 text-left space-y-1">
                <div>
                  <div className="text-[9px] uppercase font-semibold text-slate-400">Nama Siswa</div>
                  <div className="text-sm font-black text-white leading-tight">{student.name}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <div className="text-[9px] uppercase font-semibold text-slate-400">NISN</div>
                    <div className="text-xs font-mono font-bold text-cyan-300">{student.nisn}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-semibold text-slate-400">Kelas</div>
                    <div className="text-xs font-bold text-blue-300">{student.className}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[9px] uppercase font-semibold text-slate-400">Wali Murid</div>
                  <div className="text-[11px] text-slate-300">{student.parentName}</div>
                </div>
              </div>
            </div>

            {/* Bottom Section: QR Code & Barcode */}
            <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between gap-3 bg-slate-950/70 p-2.5 rounded-xl">
              <div className="flex-1">
                <img
                  src={barcodeDataUrl}
                  alt={`Barcode ${student.nisn}`}
                  className="w-full h-10 object-contain bg-white p-1 rounded"
                />
              </div>
              <div className="w-12 h-12 bg-white p-1 rounded shrink-0 flex items-center justify-center">
                <img
                  src={qrDataUrl}
                  alt={`QR ${student.nisn}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Security watermark */}
            <div className="mt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
              <span>TA: {settings.academicYear}</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> Terverifikasi
              </span>
            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
          <button
            id="btn-print-student-card"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/30"
          >
            <Printer className="w-4 h-4" />
            Cetak Kartu Pelajar
          </button>
        </div>

      </div>
    </div>
  );
};
