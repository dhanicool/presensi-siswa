import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  Student, 
  AttendanceRecord, 
  LeaveRequest, 
  NotificationLog, 
  SchoolSettings, 
  AppView, 
  AdminTab,
  AttendanceStatus 
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_SCHOOL_SETTINGS, 
  INITIAL_LEAVE_REQUESTS, 
  INITIAL_NOTIFICATIONS, 
  generateSampleAttendance 
} from '../data/initialData';
import { getTodayDateString, formatTime } from '../utils/crypto';
import { soundFx } from '../utils/audio';
import { isFirebaseConfigured, activeProjectId } from '../lib/firebase';
import {
  seedInitialFirestoreDataIfEmpty,
  subscribeToStudents,
  subscribeToAttendance,
  subscribeToLeaves,
  subscribeToNotifications,
  subscribeToSettings,
  saveStudentToFirestore,
  deleteStudentFromFirestore,
  saveAttendanceRecordToFirestore,
  deleteAttendanceRecordFromFirestore,
  saveLeaveRequestToFirestore,
  saveNotificationLogToFirestore,
  saveSettingsToFirestore,
} from '../services/firestoreService';

export interface LiveScanResult {
  student: Student;
  record: AttendanceRecord;
  notificationSent: boolean;
  messageText: string;
  isDuplicate: boolean;
}

interface AttendanceContextType {
  // Navigation State
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  adminActiveTab: AdminTab;
  setAdminActiveTab: (tab: AdminTab) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
  adminUsername: string;
  loginAdmin: (username: string) => void;
  logoutAdmin: () => void;

  // Cloud & Firebase Sync
  isCloudSyncActive: boolean;
  firebaseProjectId: string;

  // Students State
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'qrCodeData'>) => Student;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentByNisnOrQr: (identifier: string) => Student | undefined;

  // Attendance State
  attendanceRecords: AttendanceRecord[];
  todayRecords: AttendanceRecord[];
  recordAttendance: (
    identifier: string, 
    method?: 'QR_BARCODE' | 'FACE_SCAN' | 'MANUAL_ADMIN',
    faceScore?: number
  ) => { success: boolean; message: string; record?: AttendanceRecord; student?: Student };
  deleteAttendanceRecord: (id: string) => void;

  // Kiosk Scan Live State (Reset after 1 sec)
  latestScan: LiveScanResult | null;
  scanFeedbackError: string | null;
  clearLatestScan: () => void;

  // Leave Requests
  leaveRequests: LeaveRequest[];
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => void;
  approveLeaveRequest: (id: string, notes?: string) => void;
  rejectLeaveRequest: (id: string, notes?: string) => void;

  // Notifications
  notificationLogs: NotificationLog[];
  sendBroadcastMessage: (targetClass: string, message: string, channel: 'WHATSAPP' | 'SMS') => number;
  triggerAlphaWarningForAbsentStudents: () => number;

  // Settings & Security
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  resetToDefaultData: () => void;

  // Stats
  getTodayStats: () => {
    totalStudents: number;
    presentCount: number;
    onTimeCount: number;
    lateCount: number;
    leaveCount: number;
    sickCount: number;
    alphaCount: number;
    attendanceRate: number;
  };
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'sipresensi_students_v1',
  ATTENDANCE: 'sipresensi_attendance_v1',
  LEAVES: 'sipresensi_leaves_v1',
  NOTIFICATIONS: 'sipresensi_notifications_v1',
  SETTINGS: 'sipresensi_settings_v1',
  ADMIN_AUTH: 'sipresensi_admin_auth_v1'
};

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('PORTAL');
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTab>('overview');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('Administrator');
  const [isCloudSyncActive, setIsCloudSyncActive] = useState<boolean>(isFirebaseConfigured);

  // Core Data
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : generateSampleAttendance();
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_SETTINGS;
  });

  // Kiosk Live Scan Display State (with 1-second auto-reset)
  const [latestScan, setLatestScan] = useState<LiveScanResult | null>(null);
  const [scanFeedbackError, setScanFeedbackError] = useState<string | null>(null);

  // Initialize Firebase Firestore sync & real-time subscriptions
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let unsubs: (() => void)[] = [];

    const initFirebase = async () => {
      try {
        await seedInitialFirestoreDataIfEmpty();
        setIsCloudSyncActive(true);

        const unsubStudents = subscribeToStudents((cloudStudents) => {
          if (cloudStudents && cloudStudents.length > 0) {
            setStudents(cloudStudents);
          }
        });
        if (unsubStudents) unsubs.push(unsubStudents);

        const unsubAtt = subscribeToAttendance((cloudAttendance) => {
          if (cloudAttendance && cloudAttendance.length > 0) {
            setAttendanceRecords(cloudAttendance);
          }
        });
        if (unsubAtt) unsubs.push(unsubAtt);

        const unsubLeaves = subscribeToLeaves((cloudLeaves) => {
          if (cloudLeaves && cloudLeaves.length > 0) {
            setLeaveRequests(cloudLeaves);
          }
        });
        if (unsubLeaves) unsubs.push(unsubLeaves);

        const unsubNotifs = subscribeToNotifications((cloudNotifs) => {
          if (cloudNotifs && cloudNotifs.length > 0) {
            setNotificationLogs(cloudNotifs);
          }
        });
        if (unsubNotifs) unsubs.push(unsubNotifs);

        const unsubSettings = subscribeToSettings((cloudSettings) => {
          if (cloudSettings) {
            setSettings(cloudSettings);
          }
        });
        if (unsubSettings) unsubs.push(unsubSettings);
      } catch (err) {
        console.warn('Firebase initialization note:', err);
      }
    };

    initFirebase();

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  // Local persistence effects as offline fallback
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Clear live scan state helper
  const clearLatestScan = useCallback(() => {
    setLatestScan(null);
    setScanFeedbackError(null);
  }, []);

  // Filter today's records
  const today = getTodayDateString();
  const todayRecords = attendanceRecords.filter(r => r.date === today);

  const loginAdmin = (username: string) => {
    setIsAdminLoggedIn(true);
    setAdminUsername(username || 'Administrator');
    setCurrentView('ADMIN_DASHBOARD');
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('PORTAL');
  };

  const getStudentByNisnOrQr = useCallback((identifier: string): Student | undefined => {
    const cleanId = identifier.trim().toLowerCase();
    return students.find(
      s => s.nisn.toLowerCase() === cleanId || 
           s.qrCodeData.toLowerCase() === cleanId || 
           s.nis.toLowerCase() === cleanId ||
           s.id.toLowerCase() === cleanId
    );
  }, [students]);

  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'qrCodeData'>): Student => {
    const newId = `std-${Date.now()}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
      qrCodeData: studentData.nisn,
      createdAt: getTodayDateString(),
    };
    setStudents(prev => [newStudent, ...prev]);
    saveStudentToFirestore(newStudent);
    return newStudent;
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...data } : s);
      const student = updated.find(s => s.id === id);
      if (student) {
        saveStudentToFirestore(student);
      }
      return updated;
    });
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    deleteStudentFromFirestore(id);
  };

  const deleteAttendanceRecord = (id: string) => {
    setAttendanceRecords(prev => prev.filter(r => r.id !== id));
    deleteAttendanceRecordFromFirestore(id);
  };

  // Process QR / Barcode / Face Scan attendance recording
  const recordAttendance = useCallback((
    identifier: string, 
    method: 'QR_BARCODE' | 'FACE_SCAN' | 'MANUAL_ADMIN' = 'QR_BARCODE',
    faceScore?: number
  ) => {
    const student = getStudentByNisnOrQr(identifier);
    const currentDate = getTodayDateString();
    const currentTime = formatTime(new Date());

    if (!student) {
      soundFx.playErrorBeep();
      setScanFeedbackError(`Data siswa dengan NISN / Barcode "${identifier}" tidak ditemukan dalam database.`);
      
      setTimeout(() => {
        setScanFeedbackError(null);
      }, 2000);

      return { success: false, message: 'Data siswa tidak ditemukan' };
    }

    // Check if already checked in today
    const existing = attendanceRecords.find(r => r.studentId === student.id && r.date === currentDate);
    if (existing) {
      soundFx.playErrorBeep();
      setScanFeedbackError(`${student.name} sudah melakukan presensi hari ini pada pukul ${existing.time} WIB.`);

      setTimeout(() => {
        setScanFeedbackError(null);
      }, 2000);

      return { success: false, message: 'Siswa sudah presensi hari ini', student, record: existing };
    }

    // Determine status (HADIR on-time vs TERLAMBAT)
    const [currentHour, currentMin] = currentTime.split(':').map(Number);
    const [limitHour, limitMin] = settings.entryLimitTime.split(':').map(Number);
    
    const isLate = (currentHour * 60 + currentMin) > (limitHour * 60 + limitMin);
    const status: AttendanceStatus = isLate ? 'TERLAMBAT' : 'HADIR';

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentId: student.id,
      nisn: student.nisn,
      studentName: student.name,
      className: student.className,
      date: currentDate,
      time: currentTime,
      status: status,
      verificationMethod: method,
      faceConfidence: faceScore || (method === 'FACE_SCAN' ? 98.9 : undefined),
      notes: isLate ? `Terlambat ${Math.max(1, (currentHour * 60 + currentMin) - (limitHour * 60 + limitMin))} menit` : undefined,
      notifiedParent: true,
      notifiedAt: `${currentDate} ${currentTime}`,
      deviceInfo: method === 'FACE_SCAN' ? 'AI Biometric Scanner' : 'Alat Scan Barcode Gate 1'
    };

    // Prepare Notification to Parent
    const notifMessage = status === 'HADIR'
      ? `[PRESENSI BERHASIL] Yth. Bpk/Ibu ${student.parentName}, ananda ${student.name} (${student.className}) telah hadir di sekolah tepat waktu pada pukul ${currentTime} WIB. Terima kasih.`
      : `[PEMBERITAHUAN TERLAMBAT] Yth. Bpk/Ibu ${student.parentName}, ananda ${student.name} (${student.className}) hadir di sekolah pada pukul ${currentTime} WIB (Terlambat). Mohon bimbingan waktu istirahat di rumah.`;

    const newNotification: NotificationLog = {
      id: `notif-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      nisn: student.nisn,
      parentPhone: student.parentPhone,
      parentName: student.parentName,
      messageType: status === 'HADIR' ? 'ON_TIME_ARRIVAL' : 'LATE_ARRIVAL',
      channel: 'WHATSAPP',
      messageText: notifMessage,
      status: 'DELIVERED',
      sentAt: `${currentDate} ${currentTime}`
    };

    // Save Attendance & Notification locally and in Firestore
    setAttendanceRecords(prev => [newRecord, ...prev]);
    setNotificationLogs(prev => [newNotification, ...prev]);
    saveAttendanceRecordToFirestore(newRecord);
    saveNotificationLogToFirestore(newNotification);

    // Audio & Speech Feedback
    soundFx.playSuccessChime();
    soundFx.speakIndonesianGreeting(student.name, isLate);

    // Set Live Scan State for Front Display
    setLatestScan({
      student,
      record: newRecord,
      notificationSent: true,
      messageText: notifMessage,
      isDuplicate: false,
    });
    setScanFeedbackError(null);

    // CRITICAL USER REQUIREMENT:
    // Reset display after 1 second
    const resetTime = settings.resetDisplayDurationMs || 1000;
    setTimeout(() => {
      setLatestScan(null);
    }, resetTime);

    return { 
      success: true, 
      message: isLate ? 'Presensi Tercatat (Terlambat)' : 'Presensi Berhasil (Tepat Waktu)', 
      record: newRecord, 
      student 
    };
  }, [getStudentByNisnOrQr, attendanceRecords, settings]);

  // Leave management
  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newLeave: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      status: 'PENDING',
      submittedAt: `${getTodayDateString()} ${formatTime(new Date())}`
    };
    setLeaveRequests(prev => [newLeave, ...prev]);
    saveLeaveRequestToFirestore(newLeave);
  };

  const approveLeaveRequest = (id: string, notes?: string) => {
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === id) {
        const updated: LeaveRequest = {
          ...req,
          status: 'APPROVED',
          approvedBy: 'Admin Kesiswaan',
          approvedAt: `${getTodayDateString()} ${formatTime(new Date())}`,
          adminNotes: notes || 'Permohonan izin disetujui'
        };
        saveLeaveRequestToFirestore(updated);

        // If for today, also create/sync attendance status
        const todayStr = getTodayDateString();
        if (req.startDate <= todayStr && req.endDate >= todayStr) {
          const student = students.find(s => s.id === req.studentId || s.nisn === req.nisn);
          if (student) {
            const attStatus: AttendanceStatus = req.type === 'SAKIT' ? 'SAKIT' : 'IZIN';
            const attRecord: AttendanceRecord = {
              id: `att-leave-${Date.now()}`,
              studentId: req.studentId,
              nisn: req.nisn,
              studentName: req.studentName,
              className: req.className,
              date: todayStr,
              time: '07:00:00',
              status: attStatus,
              verificationMethod: 'MANUAL_ADMIN',
              notes: `Surat izin/sakit disetujui (${req.reason})`,
              notifiedParent: true,
              notifiedAt: `${todayStr} ${formatTime(new Date())}`,
              deviceInfo: 'Sistem Izin Online'
            };
            setAttendanceRecords(curr => [attRecord, ...curr.filter(r => !(r.studentId === req.studentId && r.date === todayStr))]);
            saveAttendanceRecordToFirestore(attRecord);
          }
        }
        return updated;
      }
      return req;
    }));
  };

  const rejectLeaveRequest = (id: string, notes?: string) => {
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === id) {
        const updated: LeaveRequest = {
          ...req,
          status: 'REJECTED',
          approvedBy: 'Admin Kesiswaan',
          approvedAt: `${getTodayDateString()} ${formatTime(new Date())}`,
          adminNotes: notes || 'Permohonan tidak memenuhi kriteria'
        };
        saveLeaveRequestToFirestore(updated);
        return updated;
      }
      return req;
    }));
  };

  // Broadcast messaging
  const sendBroadcastMessage = (targetClass: string, message: string, channel: 'WHATSAPP' | 'SMS'): number => {
    const targetStudents = students.filter(s => targetClass === 'ALL' || s.className === targetClass);
    const now = `${getTodayDateString()} ${formatTime(new Date())}`;

    const newLogs: NotificationLog[] = targetStudents.map(student => ({
      id: `broadcast-${Date.now()}-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      nisn: student.nisn,
      parentPhone: student.parentPhone,
      parentName: student.parentName,
      messageType: 'BROADCAST_REPORT',
      channel: channel,
      messageText: `[PENGUMUMAN SEKOLAH] Yth. Bpk/Ibu ${student.parentName} (Wali dari ${student.name}): ${message}`,
      status: 'DELIVERED',
      sentAt: now
    }));

    setNotificationLogs(prev => [...newLogs, ...prev]);
    newLogs.forEach(log => saveNotificationLogToFirestore(log));
    return targetStudents.length;
  };

  // Real-time Alpha / Absent notification trigger
  const triggerAlphaWarningForAbsentStudents = (): number => {
    const todayStr = getTodayDateString();
    const checkedInStudentIds = new Set(
      attendanceRecords.filter(r => r.date === todayStr).map(r => r.studentId)
    );

    const absentStudents = students.filter(s => !checkedInStudentIds.has(s.id));
    const now = `${todayStr} ${formatTime(new Date())}`;

    const newLogs: NotificationLog[] = absentStudents.map(student => ({
      id: `alpha-${Date.now()}-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      nisn: student.nisn,
      parentPhone: student.parentPhone,
      parentName: student.parentName,
      messageType: 'ALPHA_WARNING',
      channel: 'WHATSAPP',
      messageText: `[PERINGATAN KETIDAKHADIRAN] Yth. Bpk/Ibu ${student.parentName}, hingga saat ini pukul ${formatTime(new Date())} WIB ananda ${student.name} (${student.className}) belum tercatat hadir di ${settings.schoolName} tanpa keterangan. Mohon segera konfirmasi wali kelas.`,
      status: 'DELIVERED',
      sentAt: now
    }));

    const alphaRecords: AttendanceRecord[] = absentStudents.map(student => ({
      id: `att-alpha-${Date.now()}-${student.id}`,
      studentId: student.id,
      nisn: student.nisn,
      studentName: student.name,
      className: student.className,
      date: todayStr,
      time: formatTime(new Date()),
      status: 'ALPA',
      verificationMethod: 'MANUAL_ADMIN',
      notes: 'Tanpa Keterangan (Sistem Otomatis)',
      notifiedParent: true,
      notifiedAt: now,
      deviceInfo: 'Auto Alpha Cron Monitor'
    }));

    setNotificationLogs(prev => [...newLogs, ...prev]);
    setAttendanceRecords(prev => [...alphaRecords, ...prev]);

    newLogs.forEach(log => saveNotificationLogToFirestore(log));
    alphaRecords.forEach(rec => saveAttendanceRecordToFirestore(rec));

    return absentStudents.length;
  };

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettingsToFirestore(updated);
      return updated;
    });
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.LEAVES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);

    setStudents(INITIAL_STUDENTS);
    setAttendanceRecords(generateSampleAttendance());
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setNotificationLogs(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SCHOOL_SETTINGS);

    if (isFirebaseConfigured) {
      seedInitialFirestoreDataIfEmpty();
    }
  };

  const getTodayStats = useCallback(() => {
    const todayStr = getTodayDateString();
    const todayRecs = attendanceRecords.filter(r => r.date === todayStr);

    const presentCount = todayRecs.filter(r => r.status === 'HADIR' || r.status === 'TERLAMBAT').length;
    const onTimeCount = todayRecs.filter(r => r.status === 'HADIR').length;
    const lateCount = todayRecs.filter(r => r.status === 'TERLAMBAT').length;
    const leaveCount = todayRecs.filter(r => r.status === 'IZIN').length;
    const sickCount = todayRecs.filter(r => r.status === 'SAKIT').length;
    
    const recordedIds = new Set(todayRecs.map(r => r.studentId));
    const unrecordedCount = students.filter(s => !recordedIds.has(s.id)).length;
    const explicitAlphaCount = todayRecs.filter(r => r.status === 'ALPA').length;
    const totalAlpha = unrecordedCount + explicitAlphaCount;

    const totalStudents = students.length;
    const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    return {
      totalStudents,
      presentCount,
      onTimeCount,
      lateCount,
      leaveCount,
      sickCount,
      alphaCount: totalAlpha,
      attendanceRate
    };
  }, [attendanceRecords, students]);

  return (
    <AttendanceContext.Provider
      value={{
        currentView,
        setCurrentView,
        adminActiveTab,
        setAdminActiveTab,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        adminUsername,
        loginAdmin,
        logoutAdmin,
        isCloudSyncActive,
        firebaseProjectId: activeProjectId,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentByNisnOrQr,
        attendanceRecords,
        todayRecords,
        recordAttendance,
        deleteAttendanceRecord,
        latestScan,
        scanFeedbackError,
        clearLatestScan,
        leaveRequests,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        notificationLogs,
        sendBroadcastMessage,
        triggerAlphaWarningForAbsentStudents,
        settings,
        updateSettings,
        resetToDefaultData,
        getTodayStats,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

