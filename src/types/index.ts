export type AttendanceStatus = 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPA';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type Gender = 'L' | 'P';

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  name: string;
  gender: Gender;
  className: string;
  major: string;
  photoUrl: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address: string;
  faceRegistered: boolean;
  faceFeatureVector?: number[];
  qrCodeData: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  nisn: string;
  studentName: string;
  className: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  status: AttendanceStatus;
  verificationMethod: 'QR_BARCODE' | 'FACE_SCAN' | 'MANUAL_ADMIN';
  faceConfidence?: number;
  notes?: string;
  notifiedParent: boolean;
  notifiedAt?: string;
  deviceInfo?: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  nisn: string;
  studentName: string;
  className: string;
  type: 'SAKIT' | 'IZIN' | 'DISPENSASI';
  startDate: string;
  endDate: string;
  reason: string;
  attachmentUrl?: string;
  status: LeaveStatus;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  adminNotes?: string;
}

export interface NotificationLog {
  id: string;
  studentId: string;
  studentName: string;
  nisn: string;
  parentPhone: string;
  parentName: string;
  messageType: 'ON_TIME_ARRIVAL' | 'LATE_ARRIVAL' | 'ALPHA_WARNING' | 'LEAVE_APPROVAL' | 'BROADCAST_REPORT';
  channel: 'WHATSAPP' | 'SMS';
  messageText: string;
  status: 'DELIVERED' | 'SENT' | 'FAILED';
  sentAt: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolNPSN: string;
  schoolAddress: string;
  principalName: string;
  principalNIP: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  entryStartTime: string; // e.g. "06:30"
  entryLimitTime: string; // e.g. "07:15" (Late after this)
  entryEndTime: string; // e.g. "08:00"
  departureTime: string; // e.g. "15:00"
  autoNotifyParentOnTime: boolean;
  autoNotifyParentLate: boolean;
  autoNotifyParentAlpha: boolean;
  alphaNotificationTriggerTime: string; // e.g. "08:30"
  enableFaceRecognitionValidation: boolean;
  encryptionActive: boolean;
  resetDisplayDurationMs: number; // 1000ms as requested
}

export interface CaptchaData {
  code: string;
  timestamp: number;
  expiresInSeconds: number;
}

export type AppView = 'PORTAL' | 'STUDENT_SCAN' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD';

export type AdminTab = 
  | 'overview'
  | 'students'
  | 'face_scan'
  | 'recap'
  | 'individual_history'
  | 'leave_system'
  | 'notifications'
  | 'analytics'
  | 'security'
  | 'settings';
