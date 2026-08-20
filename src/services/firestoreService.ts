import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  query,
  orderBy,
  limit,
  Unsubscribe
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { 
  Student, 
  AttendanceRecord, 
  LeaveRequest, 
  NotificationLog, 
  SchoolSettings 
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_SCHOOL_SETTINGS, 
  INITIAL_LEAVE_REQUESTS, 
  INITIAL_NOTIFICATIONS, 
  generateSampleAttendance 
} from '../data/initialData';

// Firestore Collection Names
export const COLLECTIONS = {
  STUDENTS: 'students',
  ATTENDANCE: 'attendance',
  LEAVES: 'leave_requests',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings'
};

const SETTINGS_DOC_ID = 'main_school_settings';

/**
 * Seed initial data to Firestore if collections are empty on first run
 */
export async function seedInitialFirestoreDataIfEmpty(): Promise<boolean> {
  if (!isFirebaseConfigured) return false;

  try {
    const studentsSnap = await getDocs(collection(db, COLLECTIONS.STUDENTS));
    if (studentsSnap.empty) {
      console.log('🌱 Seeding initial data to Firebase Firestore...');
      const batch = writeBatch(db);

      // Seed Students
      for (const student of INITIAL_STUDENTS) {
        const studentRef = doc(db, COLLECTIONS.STUDENTS, student.id);
        batch.set(studentRef, student);
      }

      // Seed Initial Settings
      const settingsRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID);
      batch.set(settingsRef, INITIAL_SCHOOL_SETTINGS);

      // Seed Sample Attendance
      const sampleAtt = generateSampleAttendance();
      for (const att of sampleAtt) {
        const attRef = doc(db, COLLECTIONS.ATTENDANCE, att.id);
        batch.set(attRef, att);
      }

      // Seed Sample Leaves
      for (const leave of INITIAL_LEAVE_REQUESTS) {
        const leaveRef = doc(db, COLLECTIONS.LEAVES, leave.id);
        batch.set(leaveRef, leave);
      }

      // Seed Sample Notifications
      for (const notif of INITIAL_NOTIFICATIONS) {
        const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id);
        batch.set(notifRef, notif);
      }

      await batch.commit();
      console.log('✅ Firestore initial data seeded successfully.');
      return true;
    }
  } catch (error) {
    console.warn('Could not seed Firestore initial data:', error);
  }
  return false;
}

// Real-time Listeners
export function subscribeToStudents(callback: (students: Student[]) => void): Unsubscribe | null {
  if (!isFirebaseConfigured) return null;
  try {
    const q = query(collection(db, COLLECTIONS.STUDENTS));
    return onSnapshot(q, (snapshot) => {
      const list: Student[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Student);
      });
      if (list.length > 0) {
        callback(list);
      }
    }, (err) => {
      console.warn('Firestore students listener error:', err);
    });
  } catch (e) {
    console.warn('Failed to subscribe to students:', e);
    return null;
  }
}

export function subscribeToAttendance(callback: (records: AttendanceRecord[]) => void): Unsubscribe | null {
  if (!isFirebaseConfigured) return null;
  try {
    const q = query(collection(db, COLLECTIONS.ATTENDANCE));
    return onSnapshot(q, (snapshot) => {
      const list: AttendanceRecord[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as AttendanceRecord);
      });
      if (list.length > 0) {
        // Sort newest first
        list.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
        callback(list);
      }
    }, (err) => {
      console.warn('Firestore attendance listener error:', err);
    });
  } catch (e) {
    console.warn('Failed to subscribe to attendance:', e);
    return null;
  }
}

export function subscribeToLeaves(callback: (leaves: LeaveRequest[]) => void): Unsubscribe | null {
  if (!isFirebaseConfigured) return null;
  try {
    const q = query(collection(db, COLLECTIONS.LEAVES));
    return onSnapshot(q, (snapshot) => {
      const list: LeaveRequest[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as LeaveRequest);
      });
      if (list.length > 0) {
        list.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
        callback(list);
      }
    }, (err) => {
      console.warn('Firestore leaves listener error:', err);
    });
  } catch (e) {
    console.warn('Failed to subscribe to leaves:', e);
    return null;
  }
}

export function subscribeToNotifications(callback: (notifications: NotificationLog[]) => void): Unsubscribe | null {
  if (!isFirebaseConfigured) return null;
  try {
    const q = query(collection(db, COLLECTIONS.NOTIFICATIONS));
    return onSnapshot(q, (snapshot) => {
      const list: NotificationLog[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as NotificationLog);
      });
      if (list.length > 0) {
        list.sort((a, b) => b.sentAt.localeCompare(a.sentAt));
        callback(list);
      }
    }, (err) => {
      console.warn('Firestore notifications listener error:', err);
    });
  } catch (e) {
    console.warn('Failed to subscribe to notifications:', e);
    return null;
  }
}

export function subscribeToSettings(callback: (settings: SchoolSettings) => void): Unsubscribe | null {
  if (!isFirebaseConfigured) return null;
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as SchoolSettings);
      }
    }, (err) => {
      console.warn('Firestore settings listener error:', err);
    });
  } catch (e) {
    console.warn('Failed to subscribe to settings:', e);
    return null;
  }
}

// Cloud Mutation Operations
export async function saveStudentToFirestore(student: Student): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const ref = doc(db, COLLECTIONS.STUDENTS, student.id);
    await setDoc(ref, student, { merge: true });
  } catch (err) {
    console.error('Error saving student to Firestore:', err);
  }
}

export async function deleteStudentFromFirestore(studentId: string): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS.STUDENTS, studentId));
  } catch (err) {
    console.error('Error deleting student from Firestore:', err);
  }
}

export async function saveAttendanceRecordToFirestore(record: AttendanceRecord): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const ref = doc(db, COLLECTIONS.ATTENDANCE, record.id);
    await setDoc(ref, record, { merge: true });
  } catch (err) {
    console.error('Error saving attendance record to Firestore:', err);
  }
}

export async function deleteAttendanceRecordFromFirestore(recordId: string): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS.ATTENDANCE, recordId));
  } catch (err) {
    console.error('Error deleting attendance record from Firestore:', err);
  }
}

export async function saveLeaveRequestToFirestore(leave: LeaveRequest): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const ref = doc(db, COLLECTIONS.LEAVES, leave.id);
    await setDoc(ref, leave, { merge: true });
  } catch (err) {
    console.error('Error saving leave request to Firestore:', err);
  }
}

export async function saveNotificationLogToFirestore(log: NotificationLog): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const ref = doc(db, COLLECTIONS.NOTIFICATIONS, log.id);
    await setDoc(ref, log, { merge: true });
  } catch (err) {
    console.error('Error saving notification log to Firestore:', err);
  }
}

export async function saveSettingsToFirestore(settings: SchoolSettings): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const ref = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID);
    await setDoc(ref, settings, { merge: true });
  } catch (err) {
    console.error('Error saving settings to Firestore:', err);
  }
}
