import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { AttendanceRecord, Student, SchoolSettings } from '../types';
import { formatIndonesianDate } from './crypto';

// Extend jsPDF interface to avoid TypeScript errors with autotable plugin
interface ExtendedJsPDF extends jsPDF {
  lastAutoTable?: {
    finalY?: number;
  };
}

export function exportRecapToExcel(
  records: AttendanceRecord[],
  students: Student[],
  settings: SchoolSettings,
  monthName: string,
  year: number,
  selectedClass: string
) {
  const wb = XLSX.utils.book_new();

  // 1. Sheet: Rekap Detail
  const rows = records.map((rec, index) => ({
    'No': index + 1,
    'Tanggal': rec.date,
    'Jam Masuk': rec.time,
    'NISN': rec.nisn,
    'Nama Siswa': rec.studentName,
    'Kelas': rec.className,
    'Status Kehadiran': rec.status,
    'Metode Verifikasi': rec.verificationMethod === 'FACE_SCAN' ? 'Deteksi Wajah' : rec.verificationMethod === 'QR_BARCODE' ? 'Scan Barcode' : 'Manual Admin',
    'Akurasi Wajah': rec.faceConfidence ? `${rec.faceConfidence}%` : '-',
    'Keterangan': rec.notes || '-',
    'Notifikasi Ortu': rec.notifiedParent ? 'Terkirim' : 'Belum'
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 12 }, // Tanggal
    { wch: 12 }, // Jam
    { wch: 15 }, // NISN
    { wch: 25 }, // Nama
    { wch: 12 }, // Kelas
    { wch: 15 }, // Status
    { wch: 18 }, // Metode
    { wch: 14 }, // Akurasi
    { wch: 25 }, // Keterangan
    { wch: 15 }, // Notifikasi
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Rekap Presensi Harian');

  // 2. Sheet: Ringkasan Per Siswa
  const studentSummaries = students
    .filter(s => selectedClass === 'ALL' || s.className === selectedClass)
    .map((student, idx) => {
      const studentRecs = records.filter(r => r.studentId === student.id || r.nisn === student.nisn);
      const hadir = studentRecs.filter(r => r.status === 'HADIR').length;
      const terlambat = studentRecs.filter(r => r.status === 'TERLAMBAT').length;
      const izin = studentRecs.filter(r => r.status === 'IZIN').length;
      const sakit = studentRecs.filter(r => r.status === 'SAKIT').length;
      const alpa = studentRecs.filter(r => r.status === 'ALPA').length;
      const totalRecorded = hadir + terlambat + izin + sakit + alpa;
      const persentase = totalRecorded > 0 ? `${Math.round(((hadir + terlambat) / totalRecorded) * 100)}%` : '0%';

      return {
        'No': idx + 1,
        'NISN': student.nisn,
        'Nama Siswa': student.name,
        'Kelas': student.className,
        'Hadir (Tepat Waktu)': hadir,
        'Terlambat': terlambat,
        'Izin': izin,
        'Sakit': sakit,
        'Alpa / Tanpa Keterangan': alpa,
        'Total Hari': totalRecorded,
        'Tingkat Kehadiran': persentase,
        'No WA Wali': student.parentPhone
      };
    });

  const wsSummary = XLSX.utils.json_to_sheet(studentSummaries);
  wsSummary['!cols'] = [
    { wch: 5 },
    { wch: 15 },
    { wch: 25 },
    { wch: 12 },
    { wch: 20 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 22 },
    { wch: 12 },
    { wch: 18 },
    { wch: 16 }
  ];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Bulanan');

  const fileName = `Rekap_Presensi_${selectedClass.replace(/\s+/g, '_')}_${monthName}_${year}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportRecapToPdf(
  records: AttendanceRecord[],
  students: Student[],
  settings: SchoolSettings,
  monthName: string,
  year: number,
  selectedClass: string
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  }) as ExtendedJsPDF;

  const pageWidth = doc.internal.pageSize.getWidth();

  // KOP SURAT SEKOLAH
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(settings.schoolName.toUpperCase(), pageWidth / 2, 14, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`NPSN: ${settings.schoolNPSN} | ${settings.schoolAddress}`, pageWidth / 2, 20, { align: 'center' });
  doc.text(`Tahun Ajaran: ${settings.academicYear} - Semester ${settings.semester}`, pageWidth / 2, 25, { align: 'center' });

  // Divider Line
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.8);
  doc.line(14, 28, pageWidth - 14, 28);
  doc.setLineWidth(0.2);
  doc.line(14, 29, pageWidth - 14, 29);

  // Title of Document
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 138);
  doc.text(`LAPORAN REKAPITULASI KEHADIRAN SISWA BULAN ${monthName.toUpperCase()} ${year}`, pageWidth / 2, 36, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Filter Kelas: ${selectedClass === 'ALL' ? 'Semua Kelas' : selectedClass} | Dicetak pada: ${formatIndonesianDate(new Date())}`, 14, 42);

  // Calculate Summary metrics
  const totalHadir = records.filter(r => r.status === 'HADIR').length;
  const totalTerlambat = records.filter(r => r.status === 'TERLAMBAT').length;
  const totalIzin = records.filter(r => r.status === 'IZIN').length;
  const totalSakit = records.filter(r => r.status === 'SAKIT').length;
  const totalAlpa = records.filter(r => r.status === 'ALPA').length;
  const totalCount = records.length;

  const tableBody = records.slice(0, 45).map((rec, index) => [
    index + 1,
    rec.date,
    rec.time,
    rec.nisn,
    rec.studentName,
    rec.className,
    rec.status,
    rec.verificationMethod === 'FACE_SCAN' ? 'Wajah (AI)' : rec.verificationMethod === 'QR_BARCODE' ? 'QR Code' : 'Manual',
    rec.notes || '-'
  ]);

  // Render Table
  (doc as unknown as { autoTable: (options: Record<string, unknown>) => void }).autoTable({
    startY: 46,
    head: [['No', 'Tanggal', 'Jam', 'NISN', 'Nama Siswa', 'Kelas', 'Status', 'Metode', 'Keterangan']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 22 },
      2: { halign: 'center', cellWidth: 18 },
      3: { halign: 'center', cellWidth: 26 },
      4: { cellWidth: 60 },
      5: { halign: 'center', cellWidth: 24 },
      6: { halign: 'center', cellWidth: 24 },
      7: { halign: 'center', cellWidth: 25 },
      8: { cellWidth: 'auto' }
    },
    didParseCell: function(data: { section: string; column: { index: number }; cell: { text: string[]; styles: { textColor: number[]; fontStyle: string } } }) {
      if (data.section === 'body' && data.column.index === 6) {
        const text = data.cell.text[0];
        if (text === 'HADIR') {
          data.cell.styles.textColor = [16, 185, 129];
          data.cell.styles.fontStyle = 'bold';
        } else if (text === 'TERLAMBAT') {
          data.cell.styles.textColor = [217, 119, 6];
          data.cell.styles.fontStyle = 'bold';
        } else if (text === 'ALPA') {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [59, 130, 246];
        }
      }
    }
  });

  const finalY = doc.lastAutoTable?.finalY || 140;

  // Bottom Signature & Summary Card
  if (finalY < 165) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);

    // Summary box
    doc.setFillColor(248, 250, 252);
    doc.rect(14, finalY + 6, 120, 22, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, finalY + 6, 120, 22, 'S');

    doc.setFont('helvetica', 'bold');
    doc.text('Ringkasan Statistik Kehadiran:', 18, finalY + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Entri: ${totalCount} | Hadir: ${totalHadir} | Terlambat: ${totalTerlambat} | Izin/Sakit: ${totalIzin + totalSakit} | Alpa: ${totalAlpa}`, 18, finalY + 18);
    const rate = totalCount > 0 ? Math.round(((totalHadir + totalTerlambat) / totalCount) * 100) : 0;
    doc.text(`Persentase Kedisiplinan: ${rate}% (Tingkat kehadiran tercatat)`, 18, finalY + 24);

    // Signature Area
    const signX = pageWidth - 70;
    doc.text(`Jakarta, ${formatIndonesianDate(new Date())}`, signX, finalY + 10);
    doc.text('Kepala Sekolah,', signX, finalY + 15);
    doc.setFont('helvetica', 'bold');
    doc.text(settings.principalName, signX, finalY + 34);
    doc.setFont('helvetica', 'normal');
    doc.text(`NIP. ${settings.principalNIP}`, signX, finalY + 38);
  }

  const fileName = `Laporan_Presensi_${selectedClass.replace(/\s+/g, '_')}_${monthName}_${year}.pdf`;
  doc.save(fileName);
}
