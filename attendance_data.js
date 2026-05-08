/* ===================================
   ATTENDANCE DATA & MANAGEMENT
   Attendance tracking system
   =================================== */

// Attendance State
const ATTENDANCE_STATE = {
  currentClass: null,
  attendanceRecord: [],
  teachers: [],
  studentProfiles: [],
  attendanceSessions: []
};

// ===================================
// TEACHER DATA
// ===================================

const TEACHERS = {
  'prof-001': {
    id: 'prof-001',
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh@bca.edu',
    department: 'Computer Science',
    subjects: ['Data Structures', 'Algorithms'],
    phone: '+91-9876543210',
    qualification: 'M.Tech (CSE)',
    experience: '12 years',
    avatar: '👨‍🏫'
  },
  'prof-002': {
    id: 'prof-002',
    name: 'Prof. Priya Singh',
    email: 'priya@bca.edu',
    department: 'Computer Science',
    subjects: ['Web Development', 'Database Management'],
    phone: '+91-9876543211',
    qualification: 'M.Tech (IT)',
    experience: '8 years',
    avatar: '👩‍🏫'
  },
  'prof-003': {
    id: 'prof-003',
    name: 'Prof. Anil Verma',
    email: 'anil@bca.edu',
    department: 'Computer Science',
    subjects: ['Database Management', 'SQL'],
    phone: '+91-9876543212',
    qualification: 'M.Tech (Database Systems)',
    experience: '10 years',
    avatar: '👨‍🏫'
  },
  'prof-004': {
    id: 'prof-004',
    name: 'Prof. Deepak Sharma',
    email: 'deepak@bca.edu',
    department: 'Computer Science',
    subjects: ['Object Oriented Programming', 'Design Patterns'],
    phone: '+91-9876543213',
    qualification: 'Ph.D (CS)',
    experience: '15 years',
    avatar: '👨‍🏫'
  },
  'prof-005': {
    id: 'prof-005',
    name: 'Prof. Neeta Gupta',
    email: 'neeta@bca.edu',
    department: 'Computer Science',
    subjects: ['Computer Architecture', 'Operating Systems'],
    phone: '+91-9876543214',
    qualification: 'M.Tech (Computer Architecture)',
    experience: '9 years',
    avatar: '👩‍🏫'
  }
};

// ===================================
// STUDENT PROFILES
// ===================================

const STUDENT_PROFILES = [
  {
    id: 'std-001',
    name: 'Aman Kumar',
    email: 'aman@student.edu',
    rollNumber: '001',
    semester: 'III',
    batch: '2022-2025',
    phone: '+91-8765432101',
    dateOfBirth: '2004-05-15',
    gender: 'Male',
    address: 'Delhi, India',
    avatar: '👨‍🎓'
  },
  {
    id: 'std-002',
    name: 'Priya Patel',
    email: 'priya@student.edu',
    rollNumber: '002',
    semester: 'III',
    batch: '2022-2025',
    phone: '+91-8765432102',
    dateOfBirth: '2004-07-20',
    gender: 'Female',
    address: 'Mumbai, India',
    avatar: '👩‍🎓'
  },
  {
    id: 'std-003',
    name: 'Rahul Singh',
    email: 'rahul@student.edu',
    rollNumber: '003',
    semester: 'III',
    batch: '2022-2025',
    phone: '+91-8765432103',
    dateOfBirth: '2004-03-10',
    gender: 'Male',
    address: 'Bangalore, India',
    avatar: '👨‍🎓'
  },
  {
    id: 'std-004',
    name: 'Neha Gupta',
    email: 'neha@student.edu',
    rollNumber: '004',
    semester: 'III',
    batch: '2022-2025',
    phone: '+91-8765432104',
    dateOfBirth: '2004-09-25',
    gender: 'Female',
    address: 'Hyderabad, India',
    avatar: '👩‍🎓'
  },
  {
    id: 'std-005',
    name: 'Vikram Patel',
    email: 'vikram@student.edu',
    rollNumber: '005',
    semester: 'III',
    batch: '2022-2025',
    phone: '+91-8765432105',
    dateOfBirth: '2004-01-14',
    gender: 'Male',
    address: 'Pune, India',
    avatar: '👨‍🎓'
  },
  {
    id: 'std-006',
    name: 'Anjali Sharma',
    email: 'anjali@student.edu',
    rollNumber: '006',
    semester: 'III',
    batch: '2022-2025',
    phone: '+91-8765432106',
    dateOfBirth: '2004-11-08',
    gender: 'Female',
    address: 'Chennai, India',
    avatar: '👩‍🎓'
  }
];

// ===================================
// ATTENDANCE SESSION STRUCTURE
// ===================================

/**
 * Create new attendance session
 */
function createAttendanceSession(classId, teacherId, subject, date) {
  return {
    id: `session-${Date.now()}`,
    classId: classId,
    teacherId: teacherId,
    subject: subject,
    date: new Date(date),
    startTime: new Date(),
    endTime: null,
    status: 'active', // active, completed
    students: [],
    totalPresent: 0,
    totalAbsent: 0,
    totalLatecomers: 0,
    notes: ''
  };
}

/**
 * Create attendance record for student
 */
function createAttendanceRecord(studentId, sessionId, status = 'present') {
  return {
    id: `attendance-${Date.now()}`,
    studentId: studentId,
    sessionId: sessionId,
    status: status, // present, absent, late, leave
    checkInTime: status === 'present' ? new Date() : null,
    remarks: '',
    markedAt: new Date(),
    markedBy: null // Teacher ID
  };
}

// ===================================
// ATTENDANCE UTILS
// ===================================

/**
 * Mark attendance for student
 */
function markAttendance(sessionId, studentId, status = 'present', remarks = '') {
  const record = createAttendanceRecord(studentId, sessionId, status);
  record.remarks = remarks;
  
  ATTENDANCE_STATE.attendanceRecord.push(record);
  
  // Update session stats
  const session = ATTENDANCE_STATE.attendanceSessions.find(s => s.id === sessionId);
  if (session) {
    if (status === 'present') session.totalPresent++;
    else if (status === 'absent') session.totalAbsent++;
    else if (status === 'late') session.totalLatecomers++;
    
    // Add to students if not already
    if (!session.students.find(s => s.id === studentId)) {
      const student = STUDENT_PROFILES.find(s => s.id === studentId);
      session.students.push({
        ...student,
        status: status,
        checkInTime: new Date(),
        remarks: remarks
      });
    }
  }
  
  return record;
}

/**
 * Get attendance for student in session
 */
function getStudentAttendance(studentId, sessionId) {
  return ATTENDANCE_STATE.attendanceRecord.find(
    r => r.studentId === studentId && r.sessionId === sessionId
  );
}

/**
 * Get session attendance report
 */
function getSessionAttendanceReport(sessionId) {
  const session = ATTENDANCE_STATE.attendanceSessions.find(s => s.id === sessionId);
  if (!session) return null;
  
  const report = {
    sessionId: sessionId,
    classId: session.classId,
    teacher: TEACHERS[session.teacherId],
    subject: session.subject,
    date: session.date,
    totalStudents: session.students.length,
    present: session.totalPresent,
    absent: session.totalAbsent,
    late: session.totalLatecomers,
    attendancePercentage: session.students.length > 0 
      ? ((session.totalPresent / session.students.length) * 100).toFixed(2)
      : 0
  };
  
  return report;
}

/**
 * Get student attendance history
 */
function getStudentAttendanceHistory(studentId, limit = 10) {
  const records = ATTENDANCE_STATE.attendanceRecord
    .filter(r => r.studentId === studentId)
    .sort((a, b) => b.markedAt - a.markedAt)
    .slice(0, limit);
  
  return records.map(record => {
    const session = ATTENDANCE_STATE.attendanceSessions.find(s => s.id === record.sessionId);
    return {
      ...record,
      session: session
    };
  });
}

/**
 * Calculate student attendance percentage
 */
function getStudentAttendancePercentage(studentId, classId = null) {
  let records = ATTENDANCE_STATE.attendanceRecord.filter(r => r.studentId === studentId);
  
  if (classId) {
    const sessionIds = ATTENDANCE_STATE.attendanceSessions
      .filter(s => s.classId === classId)
      .map(s => s.id);
    records = records.filter(r => sessionIds.includes(r.sessionId));
  }
  
  if (records.length === 0) return 0;
  
  const presentCount = records.filter(r => r.status === 'present').length;
  return ((presentCount / records.length) * 100).toFixed(2);
}

/**
 * Get teacher attendance reports
 */
function getTeacherAttendanceReports(teacherId) {
  return ATTENDANCE_STATE.attendanceSessions
    .filter(s => s.teacherId === teacherId)
    .map(session => getSessionAttendanceReport(session.id));
}

/**
 * Get attendance for date range
 */
function getAttendanceByDateRange(startDate, endDate, studentId = null) {
  let records = ATTENDANCE_STATE.attendanceRecord.filter(record => {
    const session = ATTENDANCE_STATE.attendanceSessions.find(s => s.id === record.sessionId);
    return session && session.date >= startDate && session.date <= endDate;
  });
  
  if (studentId) {
    records = records.filter(r => r.studentId === studentId);
  }
  
  return records;
}

/**
 * Export attendance report
 */
function generateAttendanceReport(classId, format = 'json') {
  const sessions = ATTENDANCE_STATE.attendanceSessions.filter(s => s.classId === classId);
  
  const report = {
    classId: classId,
    generatedAt: new Date(),
    totalSessions: sessions.length,
    sessions: sessions.map(s => getSessionAttendanceReport(s.id)),
    studentSummary: STUDENT_PROFILES.map(student => ({
      ...student,
      totalClasses: sessions.length,
      attended: ATTENDANCE_STATE.attendanceRecord
        .filter(r => r.studentId === student.id && 
                     sessions.find(s => s.id === r.sessionId) &&
                     r.status === 'present').length,
      percentage: getStudentAttendancePercentage(student.id, classId)
    }))
  };
  
  if (format === 'csv') {
    return convertReportToCsv(report);
  }
  
  return report;
}

/**
 * Convert report to CSV
 */
function convertReportToCsv(report) {
  let csv = 'Roll No,Student Name,Email,Total Classes,Attended,Attendance %\n';
  
  report.studentSummary.forEach(student => {
    csv += `${student.rollNumber},${student.name},${student.email},${student.totalClasses},${student.attended},${student.percentage}%\n`;
  });
  
  return csv;
}

// ===================================
// BULK OPERATIONS
// ===================================

/**
 * Mark all students present for session
 */
function markAllPresent(sessionId) {
  const session = ATTENDANCE_STATE.attendanceSessions.find(s => s.id === sessionId);
  if (!session) return;
  
  STUDENT_PROFILES.forEach(student => {
    if (!getStudentAttendance(student.id, sessionId)) {
      markAttendance(sessionId, student.id, 'present');
    }
  });
}

/**
 * Mark multiple students
 */
function markMultipleStudents(sessionId, studentIds, status) {
  studentIds.forEach(studentId => {
    if (!getStudentAttendance(studentId, sessionId)) {
      markAttendance(sessionId, studentId, status);
    }
  });
}

// Initialize with sample data
ATTENDANCE_STATE.teachers = Object.values(TEACHERS);
ATTENDANCE_STATE.studentProfiles = STUDENT_PROFILES;

console.log('✅ Attendance System Ready | Teachers: ' + Object.keys(TEACHERS).length + ' | Students: ' + STUDENT_PROFILES.length);
