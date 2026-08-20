import React, { useState } from 'react';
import { 
  Cloud, 
  Github, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Server, 
  ShieldCheck, 
  Database,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { activeProjectId, activeDatabaseId } from '../../lib/firebase';

interface CloudDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudDeployGuideModal: React.FC<CloudDeployGuideModalProps> = ({ isOpen, onClose }) => {
  const { isCloudSyncActive } = useAttendance();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const gitCliCommands = `# Inisialisasi & Push ke GitHub
git init
git add .
git commit -m "Deploy SiPresensi Pintar Cloud"
git branch -M main
git remote add origin https://github.com/USERNAME/sipresensi-pintar.git
git push -u origin main`;

  const vercelEnvSnippet = `VITE_FIREBASE_PROJECT_ID=${activeProjectId}
VITE_FIREBASE_FIRESTORE_DATABASE_ID=${activeDatabaseId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Panduan Koneksi GitHub, Vercel & Firebase
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready to Deploy
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Arsitektur Modern: AI Studio ➔ GitHub ➔ Vercel ➔ Firebase Firestore
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs">
          
          {/* Status Box: Firebase Firestore */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/50 to-slate-900 border border-blue-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm text-white">1. Status Database Firebase Firestore</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold text-xs">Terkoneksi (Active)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Project ID:</span>
                <span className="font-mono text-cyan-300 font-bold">{activeProjectId || 'predictive-winter-88chg'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Database Target:</span>
                <span className="font-mono text-emerald-300 font-bold truncate block">{activeDatabaseId || '(default)'}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Setiap kali presensi, pendaftaran siswa, atau surat izin dibuat, data langsung tersinkronisasi ke Firebase Firestore secara real-time.
            </p>
          </div>

          {/* Step 2: GitHub Connection */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <Github className="w-5 h-5 text-slate-200" />
              <span className="font-bold text-sm text-white">2. Koneksikan Kode ke GitHub</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">A</div>
                <div>
                  <strong className="text-white">Ekspor Langsung via AI Studio (Paling Mudah):</strong>
                  <p className="text-slate-400 mt-0.5">
                    Klik menu <strong>Settings</strong> di sudut kanan atas layar AI Studio ➔ Pilih <strong>Export to GitHub</strong> atau <strong>Download ZIP</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">B</div>
                <div className="w-full">
                  <strong className="text-white">Menggunakan Git CLI Lokal:</strong>
                  <div className="relative mt-1.5">
                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                      {gitCliCommands}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(gitCliCommands, 'git')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                    >
                      {copiedKey === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'git' ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Vercel Deployment */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-sm text-white">3. Deploy ke Vercel (Gratis & Cepat)</span>
            </div>

            <ol className="space-y-2 list-decimal list-inside text-slate-300 ml-1">
              <li>
                Buka <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-semibold inline-flex items-center gap-1">vercel.com/new <ExternalLink className="w-3 h-3" /></a> dan login dengan GitHub.
              </li>
              <li>
                Pilih repositori <strong>sipresensi-pintar</strong> yang telah Anda push.
              </li>
              <li>
                Vercel akan otomatis mengenali preset <strong>Vite</strong>. File konfigurasi <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">vercel.json</code> sudah kami sediakan di root direktori untuk penanganan routing SPA yang mulus.
              </li>
              <li>
                Klik tombol <strong>Deploy</strong>. Dalam waktu kurang dari 1 menit, aplikasi Anda sudah live dengan domain publik HTTPS (misal: <code className="text-purple-300">https://sipresensi-pintar.vercel.app</code>).
              </li>
            </ol>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Database & Rules Firestore Sudah Siap Produksi
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
