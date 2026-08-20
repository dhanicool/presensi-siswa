import { Student, AttendanceRecord, LeaveRequest, NotificationLog, SchoolSettings } from '../types';
import { getTodayDateString } from '../utils/crypto';

export const INITIAL_SCHOOL_SETTINGS: SchoolSettings = {
  schoolName: 'SMA NEGERI 1 TELADAN NUSANTARA',
  schoolNPSN: '20108945',
  schoolAddress: 'Jl. Pemuda No. 45, Kebayoran Baru, Jakarta Selatan',
  principalName: 'Dr. H. Bambang Hartono, M.Pd.',
  principalNIP: '19750812 199903 1 004',
  academicYear: '2026/2027',
  semester: 'Ganjil',
  entryStartTime: '06:00',
  entryLimitTime: '07:15', // Toleransi tepat waktu s.d 07:15
  entryEndTime: '08:00',
  departureTime: '15:30',
  autoNotifyParentOnTime: true,
  autoNotifyParentLate: true,
  autoNotifyParentAlpha: true,
  alphaNotificationTriggerTime: '08:30',
  enableFaceRecognitionValidation: true,
  encryptionActive: true,
  resetDisplayDurationMs: 1000, // 1 detik auto-reset
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    nisn: '0089234501',
    nis: '24251001',
    name: 'Ahmad Fauzi Pratama',
    gender: 'L',
    className: 'XII-MIPA 1',
    major: 'MIPA',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    parentName: 'H. Suryanto Pratama',
    parentPhone: '081288990011',
    parentEmail: 'suryanto.pratama@gmail.com',
    address: 'Jl. Melati No. 12, Jakarta',
    faceRegistered: true,
    faceFeatureVector: [0.12, 0.45, 0.88, 0.23, 0.91, 0.54],
    qrCodeData: '0089234501',
    createdAt: '2026-07-10',
  },
  {
    id: 'std-2',
    nisn: '0089234502',
    nis: '24251002',
    name: 'Siti Nurhaliza Zahra',
    gender: 'P',
    className: 'XII-MIPA 1',
    major: 'MIPA',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    parentName: 'Dra. Hj. Maryati Zahra',
    parentPhone: '081377881122',
    parentEmail: 'maryati.zahra@yahoo.com',
    address: 'Jl. Anggrek Raya Blok B/4, Jakarta',
    faceRegistered: true,
    faceFeatureVector: [0.33, 0.67, 0.12, 0.89, 0.44, 0.76],
    qrCodeData: '0089234502',
    createdAt: '2026-07-10',
  },
  {
    id: 'std-3',
    nisn: '0089234503',
    nis: '24251003',
    name: 'Rian Bagus Pamungkas',
    gender: 'L',
    className: 'XII-MIPA 2',
    major: 'MIPA',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    parentName: 'Ir. Joko Pamungkas',
    parentPhone: '081566778899',
    parentEmail: 'joko.pamungkas@gmail.com',
    address: 'Komplek Griya Indah No. 55',
    faceRegistered: true,
    faceFeatureVector: [0.78, 0.22, 0.49, 0.15, 0.83, 0.31],
    qrCodeData: '0089234503',
    createdAt: '2026-07-11',
  },
  {
    id: 'std-4',
    nisn: '0089234504',
    nis: '24251004',
    name: 'Anisa Putri Rahmadani',
    gender: 'P',
    className: 'XI-IPS 1',
    major: 'IPS',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    parentName: 'Bambang Irawan, S.E.',
    parentPhone: '081299883344',
    parentEmail: 'bambang.irawan@corp.id',
    address: 'Jl. Cempaka Putih Timur No. 8',
    faceRegistered: true,
    faceFeatureVector: [0.55, 0.38, 0.72, 0.94, 0.21, 0.60],
    qrCodeData: '0089234504',
    createdAt: '2026-07-11',
  },
  {
    id: 'std-5',
    nisn: '0089234505',
    nis: '24251005',
    name: 'Daffa Rizky Ramadhan',
    gender: 'L',
    className: 'XI-IPS 2',
    major: 'IPS',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    parentName: 'Agus Triyono',
    parentPhone: '085711223344',
    parentEmail: 'agus.tri@gmail.com',
    address: 'Jl. Fatmawati No. 101',
    faceRegistered: true,
    faceFeatureVector: [0.91, 0.14, 0.63, 0.35, 0.52, 0.81],
    qrCodeData: '0089234505',
    createdAt: '2026-07-12',
  },
  {
    id: 'std-6',
    nisn: '0089234506',
    nis: '24251006',
    name: 'Chelsea Abigail Maharani',
    gender: 'P',
    className: 'X-1',
    major: 'Umum',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    parentName: 'Dr. Hendra Maharani, Sp.A',
    parentPhone: '081244556677',
    parentEmail: 'hendra.maharani@rs-medika.id',
    address: 'Pondok Indah Bukit Hijau VII/20',
    faceRegistered: true,
    faceFeatureVector: [0.24, 0.82, 0.37, 0.59, 0.93, 0.18],
    qrCodeData: '0089234506',
    createdAt: '2026-07-15',
  },
  {
    id: 'std-7',
    nisn: '0089234507',
    nis: '24251007',
    name: 'Fikri Haikal Al-Ghifari',
    gender: 'L',
    className: 'X-2',
    major: 'Umum',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    parentName: 'H. Ruslan Al-Ghifari',
    parentPhone: '081388009988',
    parentEmail: 'ruslan.ghifari@gmail.com',
    address: 'Jl. Tebet Barat Dalam Raya No. 4',
    faceRegistered: false,
    qrCodeData: '0089234507',
    createdAt: '2026-07-15',
  },
  {
    id: 'std-8',
    nisn: '0089234508',
    nis: '24251008',
    name: 'Nadia Salsabila Putri',
    gender: 'P',
    className: 'XII-MIPA 1',
    major: 'MIPA',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    parentName: 'M. Taufik Hidayat',
    parentPhone: '081211223399',
    parentEmail: 'taufik.hidayat@pertamina.com',
    address: 'Jl. Gandaria 1 No. 19',
    faceRegistered: true,
    faceFeatureVector: [0.65, 0.49, 0.81, 0.26, 0.74, 0.39],
    qrCodeData: '0089234508',
    createdAt: '2026-07-16',
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    studentId: 'std-7',
    nisn: '0089234507',
    studentName: 'Fikri Haikal Al-Ghifari',
    className: 'X-2',
    type: 'SAKIT',
    startDate: getTodayDateString(),
    endDate: getTodayDateString(),
    reason: 'Demam tinggi dan flu berat, istirahat dokter 1 hari',
    attachmentUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
    status: 'APPROVED',
    submittedAt: '2026-08-20 06:15:00',
    approvedBy: 'Admin Sekolah (BK)',
    approvedAt: '2026-08-20 06:45:00',
    adminNotes: 'Surat dokter terlampir valid.'
  },
  {
    id: 'leave-2',
    studentId: 'std-5',
    nisn: '0089234505',
    studentName: 'Daffa Rizky Ramadhan',
    className: 'XI-IPS 2',
    type: 'DISPENSASI',
    startDate: getTodayDateString(),
    endDate: getTodayDateString(),
    reason: 'Mewakili sekolah dalam Olimpiade Sains Nasional (OSN) Tingkat Kota',
    attachmentUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
    status: 'APPROVED',
    submittedAt: '2026-08-19 14:20:00',
    approvedBy: 'Wakasek Kesiswaan',
    approvedAt: '2026-08-19 15:00:00',
    adminNotes: 'Surat tugas dinas terverifikasi.'
  }
];

export function generateSampleAttendance(): AttendanceRecord[] {
  const today = getTodayDateString();
  const d = new Date();
  
  // Records for today
  const records: AttendanceRecord[] = [
    {
      id: 'att-today-1',
      studentId: 'std-1',
      nisn: '0089234501',
      studentName: 'Ahmad Fauzi Pratama',
      className: 'XII-MIPA 1',
      date: today,
      time: '06:48:12',
      status: 'HADIR',
      verificationMethod: 'QR_BARCODE',
      faceConfidence: 98.4,
      notifiedParent: true,
      notifiedAt: `${today} 06:48:15`,
      deviceInfo: 'Scanner Gate 01'
    },
    {
      id: 'att-today-2',
      studentId: 'std-2',
      nisn: '0089234502',
      studentName: 'Siti Nurhaliza Zahra',
      className: 'XII-MIPA 1',
      date: today,
      time: '06:55:40',
      status: 'HADIR',
      verificationMethod: 'QR_BARCODE',
      faceConfidence: 99.1,
      notifiedParent: true,
      notifiedAt: `${today} 06:55:42`,
      deviceInfo: 'Scanner Gate 01'
    },
    {
      id: 'att-today-3',
      studentId: 'std-3',
      nisn: '0089234503',
      studentName: 'Rian Bagus Pamungkas',
      className: 'XII-MIPA 2',
      date: today,
      time: '07:22:05',
      status: 'TERLAMBAT',
      verificationMethod: 'QR_BARCODE',
      faceConfidence: 96.5,
      notes: 'Terlambat 7 menit (Macet jalan raya)',
      notifiedParent: true,
      notifiedAt: `${today} 07:22:08`,
      deviceInfo: 'Scanner Gate 02'
    },
    {
      id: 'att-today-4',
      studentId: 'std-4',
      nisn: '0089234504',
      studentName: 'Anisa Putri Rahmadani',
      className: 'XI-IPS 1',
      date: today,
      time: '07:04:19',
      status: 'HADIR',
      verificationMethod: 'FACE_SCAN',
      faceConfidence: 99.7,
      notifiedParent: true,
      notifiedAt: `${today} 07:04:22`,
      deviceInfo: 'AI Camera Kiosk 01'
    },
    {
      id: 'att-today-5',
      studentId: 'std-7',
      nisn: '0089234507',
      studentName: 'Fikri Haikal Al-Ghifari',
      className: 'X-2',
      date: today,
      time: '07:00:00',
      status: 'SAKIT',
      verificationMethod: 'MANUAL_ADMIN',
      notes: 'Izin Sakit terverifikasi surat dokter',
      notifiedParent: true,
      notifiedAt: `${today} 06:45:00`,
      deviceInfo: 'Sistem Izin Online'
    },
    {
      id: 'att-today-6',
      studentId: 'std-5',
      nisn: '0089234505',
      studentName: 'Daffa Rizky Ramadhan',
      className: 'XI-IPS 2',
      date: today,
      time: '07:00:00',
      status: 'IZIN',
      verificationMethod: 'MANUAL_ADMIN',
      notes: 'Dispensasi OSN Kota',
      notifiedParent: true,
      notifiedAt: `${today} 07:00:00`,
      deviceInfo: 'Sistem Izin Online'
    }
  ];

  // Generate records for previous days in this month
  for (let i = 1; i <= 14; i++) {
    const prevDate = new Date(d);
    prevDate.setDate(d.getDate() - i);
    // Skip weekends
    if (prevDate.getDay() === 0 || prevDate.getDay() === 6) continue;

    const dateStr = prevDate.toISOString().split('T')[0];

    INITIAL_STUDENTS.forEach((student, idx) => {
      // Deterministic variations
      const roll = (idx * 17 + i * 23) % 100;
      let status: 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPA' = 'HADIR';
      let hour = 6;
      let minute = 40 + (roll % 30);

      if (roll > 92) {
        status = 'ALPA';
      } else if (roll > 85) {
        status = 'SAKIT';
      } else if (roll > 78) {
        status = 'IZIN';
      } else if (roll > 60) {
        status = 'TERLAMBAT';
        hour = 7;
        minute = 16 + (roll % 20);
      }

      if (status === 'ALPA') return; // no check-in record or record marked ALPA

      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${(roll % 50).toString().padStart(2, '0')}`;

      records.push({
        id: `att-hist-${dateStr}-${student.id}`,
        studentId: student.id,
        nisn: student.nisn,
        studentName: student.name,
        className: student.className,
        date: dateStr,
        time: timeStr,
        status: status,
        verificationMethod: idx % 3 === 0 ? 'FACE_SCAN' : 'QR_BARCODE',
        faceConfidence: 95 + (roll % 5),
        notifiedParent: true,
        notifiedAt: `${dateStr} ${timeStr}`,
        deviceInfo: 'Scanner Gate 01'
      });
    });
  }

  return records;
}

export const INITIAL_NOTIFICATIONS: NotificationLog[] = [
  {
    id: 'notif-1',
    studentId: 'std-1',
    studentName: 'Ahmad Fauzi Pratama',
    nisn: '0089234501',
    parentPhone: '081288990011',
    parentName: 'H. Suryanto Pratama',
    messageType: 'ON_TIME_ARRIVAL',
    channel: 'WHATSAPP',
    messageText: 'Yth. Bpk/Ibu H. Suryanto Pratama, ananda Ahmad Fauzi Pratama (XII-MIPA 1) telah hadir di SMA Negeri 1 Teladan tepat waktu pada pukul 06:48:12 WIB.',
    status: 'DELIVERED',
    sentAt: '2026-08-20 06:48:15'
  },
  {
    id: 'notif-2',
    studentId: 'std-2',
    studentName: 'Siti Nurhaliza Zahra',
    nisn: '0089234502',
    parentPhone: '081377881122',
    parentName: 'Dra. Hj. Maryati Zahra',
    messageType: 'ON_TIME_ARRIVAL',
    channel: 'WHATSAPP',
    messageText: 'Yth. Bpk/Ibu Dra. Hj. Maryati Zahra, ananda Siti Nurhaliza Zahra (XII-MIPA 1) telah hadir di sekolah tepat waktu pada pukul 06:55:40 WIB.',
    status: 'DELIVERED',
    sentAt: '2026-08-20 06:55:42'
  },
  {
    id: 'notif-3',
    studentId: 'std-3',
    studentName: 'Rian Bagus Pamungkas',
    nisn: '0089234503',
    parentPhone: '081566778899',
    parentName: 'Ir. Joko Pamungkas',
    messageType: 'LATE_ARRIVAL',
    channel: 'WHATSAPP',
    messageText: 'PEMBERITAHUAN KETERLAMBATAN: Yth. Ir. Joko Pamungkas, ananda Rian Bagus Pamungkas tercatat tiba di sekolah pada pukul 07:22:05 WIB (Terlambat 7 menit). Mohon perhatian untuk kedisiplinan waktu.',
    status: 'DELIVERED',
    sentAt: '2026-08-20 07:22:08'
  },
  {
    id: 'notif-4',
    studentId: 'std-6',
    studentName: 'Chelsea Abigail Maharani',
    nisn: '0089234506',
    parentPhone: '081244556677',
    parentName: 'Dr. Hendra Maharani, Sp.A',
    messageType: 'ALPHA_WARNING',
    channel: 'WHATSAPP',
    messageText: 'PERINGATAN KEHADIRAN: Yth. Dr. Hendra Maharani, Sp.A, hingga pukul 08:30 WIB ananda Chelsea Abigail Maharani (X-1) belum melakukan presensi dan tanpa keterangan di SMA Negeri 1 Teladan. Harap segera konfirmasi pihak sekolah.',
    status: 'SENT',
    sentAt: '2026-08-20 08:30:00'
  }
];
