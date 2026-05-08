/** ==================== ATTENDANCE SYSTEM - JAVASCRIPT ==================== */

// ==================== STATE & INITIALIZATION ====================

/**
 * Current attendance session state
 */
const attendanceUI = {
  currentSession: null,
  selectedStudents: {},
  initialized: false
};

/**
 * Initialize the attendance system on page load
 */
document.addEventListener('DOMContentLoaded', function () {
  initializeAttendanceUI();
  setupEventListeners();
  loadTeachersToGrid();
  setDefaultDate();
  initializeStudentView();
});

/**
 * Set today's date as default in the date input
 */
function setDefaultDate() {
  const dateInput = document.getElementById('attendanceDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
}

/**
 * Initialize the UI and ensure data is available
 */
function initializeAttendanceUI() {
  // Check if ATTENDANCE_STATE is available from attendance_data.js
  if (typeof ATTENDANCE_STATE === 'undefined') {
    showNotification('⚠️ Attendance data not loaded', 'warning');
    return;
  }

  // Ensure state has necessary arrays
  if (!ATTENDANCE_STATE.attendanceRecord) {
    ATTENDANCE_STATE.attendanceRecord = [];
  }
  if (!ATTENDANCE_STATE.attendanceSessions) {
    ATTENDANCE_STATE.attendanceSessions = [];
  }

  attendanceUI.initialized = true;
}

/**
 * Setup all event listeners for the attendance system
 */
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.att-tab-btn').forEach(button => {
    button.addEventListener('click', function () {
      switchTab(this.dataset.tab);
    });
  });

  // Session form submission
  const sessionForm = document.getElementById('sessionForm');
  if (sessionForm) {
    sessionForm.addEventListener('submit', handleSessionSubmit);
  }

  // Report form submission
  const reportForm = document.getElementById('reportForm');
  if (reportForm) {
    reportForm.addEventListener('submit', handleReportSubmit);
  }

  // Quick action buttons
  const markAllBtn = document.getElementById('markAllPresentBtn');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', markAllPresent);
  }

  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetAttendance);
  }

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitAttendance);
  }

  // Close modal
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeModal);
  }

  // User profile dropdown
  const userNav = document.getElementById('userNav');
  if (userNav) {
    userNav.addEventListener('click', toggleUserMenu);
  }
}

// ==================== TAB SWITCHING ====================

/**
 * Switch between different tabs
 * @param {string} tabName - Name of the tab to switch to
 */
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.att-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active class from all buttons
  document.querySelectorAll('.att-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Mark button as active
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
}

// ==================== MARK ATTENDANCE (TEACHER) ====================

/**
 * Handle session form submission - Load students for marking attendance
 * @param {Event} e - Form submit event
 */
function handleSessionSubmit(e) {
  e.preventDefault();

  const classId = document.getElementById('selectClass').value;
  const teacherId = document.getElementById('selectTeacher').value;
  const date = document.getElementById('attendanceDate').value;

  if (!classId || !teacherId || !date) {
    showNotification('❌ Please fill all fields', 'error');
    return;
  }

  // Create session object
  attendanceUI.currentSession = {
    classId,
    teacherId,
    date,
    students: ATTENDANCE_STATE.studentProfiles
  };

  // Load teacher name
  const teacher = ATTENDANCE_STATE.TEACHERS.find(t => t.id === teacherId);
  const teacherName = teacher ? teacher.name : 'Unknown Teacher';

  // Display attendance grid
  displayAttendanceGrid(classId, teacherName, date);

  // Show the grid
  document.getElementById('attendanceGridContainer').style.display = 'block';

  showNotification('✅ Class loaded. Ready to mark attendance!', 'success');
}

/**
 * Display attendance marking interface for students
 * @param {string} classId - Class ID
 * @param {string} teacherName - Teacher name
 * @param {string} date - Attendance date
 */
function displayAttendanceGrid(classId, teacherName, date) {
  // Update session info
  document.getElementById('sessionTitle').textContent = `${classId.toUpperCase()} - Attendance`;
  document.getElementById('teacherDisplay').textContent = teacherName;
  document.getElementById('dateDisplay').textContent = new Date(date).toLocaleDateString();
  document.getElementById('studentCount').textContent = ATTENDANCE_STATE.studentProfiles.length;

  // Build attendance table
  const tbody = document.getElementById('attendanceTableBody');
  tbody.innerHTML = '';

  ATTENDANCE_STATE.studentProfiles.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.rollNumber || `STU-${index + 1}`}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #ec4899); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem;">
            ${student.name.charAt(0)}
          </div>
          <span>${student.name}</span>
        </div>
      </td>
      <td>${student.semester || '--'}</td>
      <td>
        <select class="status-select" data-student-id="${student.id}" onchange="updateAttendanceStatus(this)">
          <option value="">-- Select --</option>
          <option value="present">✅ Present</option>
          <option value="absent">❌ Absent</option>
          <option value="late">⏱️ Late</option>
          <option value="leave">📋 Leave</option>
        </select>
      </td>
      <td>
        <input type="time" class="status-select" style="width: 120px;" data-student-id="${student.id}" placeholder="HH:MM">
      </td>
      <td>
        <input type="text" class="status-select" style="width: 100%; background: rgba(15, 23, 42, 0.5); border: 1px solid #475569; color: #f1f5f9; padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.9rem;" placeholder="Optional remarks" data-student-id="${student.id}">
      </td>
    `;
    tbody.appendChild(row);
  });

  // Reset counts
  updateAttendanceSummary();
}

/**
 * Update attendance status when selection changes
 * @param {HTMLElement} selectElement - The select element that changed
 */
function updateAttendanceStatus(selectElement) {
  const studentId = selectElement.dataset.studentId;
  const status = selectElement.value;

  if (!attendanceUI.selectedStudents[studentId]) {
    attendanceUI.selectedStudents[studentId] = {};
  }

  attendanceUI.selectedStudents[studentId].status = status;

  // Update the select element styling
  selectElement.classList.remove('present', 'absent', 'late', 'leave');
  if (status) {
    selectElement.classList.add(status);
  }

  // Update summary
  updateAttendanceSummary();
}

/**
 * Update attendance summary counts
 */
function updateAttendanceSummary() {
  let present = 0, absent = 0, late = 0;

  Object.values(attendanceUI.selectedStudents).forEach(student => {
    if (student.status === 'present') present++;
    else if (student.status === 'absent') absent++;
    else if (student.status === 'late') late++;
  });

  const total = ATTENDANCE_STATE.studentProfiles.length;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

  document.querySelector('.present-count').textContent = present;
  document.querySelector('.absent-count').textContent = absent;
  document.querySelector('.late-count').textContent = late;
  document.querySelector('.percentage').textContent = percentage + '%';
}

/**
 * Mark all students as present
 */
function markAllPresent() {
  ATTENDANCE_STATE.studentProfiles.forEach(student => {
    attendanceUI.selectedStudents[student.id] = {
      status: 'present'
    };

    // Update UI
    const select = document.querySelector(`select[data-student-id="${student.id}"]`);
    if (select) {
      select.value = 'present';
      select.classList.remove('absent', 'late', 'leave');
      select.classList.add('present');
    }
  });

  updateAttendanceSummary();
  showNotification('✅ All students marked as present', 'success');
}

/**
 * Reset all attendance marks
 */
function resetAttendance() {
  attendanceUI.selectedStudents = {};

  // Reset all selects
  document.querySelectorAll('.att-table select.status-select').forEach(select => {
    select.value = '';
    select.classList.remove('present', 'absent', 'late', 'leave');
  });

  updateAttendanceSummary();
  showNotification('🔄 Attendance marks reset', 'warning');
}

/**
 * Submit and save attendance records
 */
function submitAttendance() {
  if (!attendanceUI.currentSession) {
    showNotification('❌ No active session', 'error');
    return;
  }

  let recordsAdded = 0;

  // Create attendance records
  ATTENDANCE_STATE.studentProfiles.forEach(student => {
    const studentAttendance = attendanceUI.selectedStudents[student.id];

    if (studentAttendance && studentAttendance.status) {
      const record = {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        studentId: student.id,
        sessionId: attendanceUI.currentSession.classId,
        status: studentAttendance.status,
        checkInTime: new Date().toLocaleTimeString(),
        remarks: '',
        markedAt: new Date().toISOString(),
        markedBy: attendanceUI.currentSession.teacherId
      };

      ATTENDANCE_STATE.attendanceRecord.push(record);
      recordsAdded++;
    }
  });

  if (recordsAdded === 0) {
    showNotification('⚠️ Please mark at least one student', 'warning');
    return;
  }

  // Show success modal
  openModal();
  document.getElementById('successMessage').textContent = 
    `✅ Attendance submitted successfully! ${recordsAdded} record(s) saved.`;

  // Reset form
  setTimeout(() => {
    document.getElementById('sessionForm').reset();
    document.getElementById('attendanceGridContainer').style.display = 'none';
    attendanceUI.selectedStudents = {};
    attendanceUI.currentSession = null;
    setDefaultDate();
  }, 2000);
}

// ==================== VIEW REPORTS ====================

/**
 * Handle report form submission
 * @param {Event} e - Form submit event
 */
function handleReportSubmit(e) {
  e.preventDefault();

  const reportClass = document.getElementById('reportClass').value;
  const reportPeriod = document.getElementById('reportPeriod').value;

  // Filter records based on selection
  let filteredRecords = ATTENDANCE_STATE.attendanceRecord;

  if (reportClass) {
    filteredRecords = filteredRecords.filter(r => r.sessionId === reportClass);
  }

  // Generate report data
  const reportData = generateAttendanceReportData(filteredRecords);

  // Display report
  displayAttendanceReport(reportData);
}

/**
 * Generate attendance report data
 * @param {Array} records - Attendance records to process
 * @returns {Object} Processed report data
 */
function generateAttendanceReportData(records) {
  const reportData = {
    totalSessions: new Set(records.map(r => r.sessionId)).size,
    studentSummary: {},
    classAverage: 0,
    highestStudent: null,
    lowestStudent: null
  };

  // Calculate per-student summary
  ATTENDANCE_STATE.studentProfiles.forEach(student => {
    const studentRecords = records.filter(r => r.studentId === student.id);
    const totalAttended = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const totalSessions = Math.max(studentRecords.length, 1);
    const percentage = ((totalAttended / totalSessions) * 100).toFixed(1);

    reportData.studentSummary[student.id] = {
      rollNumber: student.rollNumber,
      name: student.name,
      totalClasses: totalSessions,
      attended: totalAttended,
      percentage: parseFloat(percentage),
      status: percentage >= 75 ? '✅ Good' : percentage >= 60 ? '⚠️ Warning' : '❌ Poor'
    };

    // Track highest and lowest
    if (!reportData.highestStudent || percentage > reportData.highestStudent.percentage) {
      reportData.highestStudent = { name: student.name, percentage };
    }
    if (!reportData.lowestStudent || percentage < reportData.lowestStudent.percentage) {
      reportData.lowestStudent = { name: student.name, percentage };
    }
  });

  // Calculate class average
  const percentages = Object.values(reportData.studentSummary).map(s => s.percentage);
  reportData.classAverage = percentages.length > 0 
    ? (percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(1)
    : 0;

  return reportData;
}

/**
 * Display the generated report
 * @param {Object} reportData - Report data to display
 */
function displayAttendanceReport(reportData) {
  // Update summary stats
  document.getElementById('totalSessions').textContent = reportData.totalSessions;
  document.getElementById('classAverage').textContent = reportData.classAverage + '%';
  document.getElementById('highestAttendance').textContent = 
    reportData.highestStudent ? `${reportData.highestStudent.name} (${reportData.highestStudent.percentage}%)` : '--';
  document.getElementById('lowestAttendance').textContent = 
    reportData.lowestStudent ? `${reportData.lowestStudent.name} (${reportData.lowestStudent.percentage}%)` : '--';

  // Update report table
  const tbody = document.getElementById('reportTableBody');
  tbody.innerHTML = '';

  Object.values(reportData.studentSummary).forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.rollNumber}</td>
      <td>${student.name}</td>
      <td>${student.totalClasses}</td>
      <td>${student.attended}</td>
      <td>
        <strong style="color: ${parseFloat(student.percentage) >= 75 ? '#10b981' : parseFloat(student.percentage) >= 60 ? '#f59e0b' : '#ef4444'}">
          ${student.percentage}%
        </strong>
      </td>
      <td>
        <span class="status-badge ${student.status.includes('Good') ? 'status-present' : student.status.includes('Warning') ? 'status-late' : 'status-absent'}">
          ${student.status}
        </span>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Show report section
  document.getElementById('reportResults').style.display = 'block';
  showNotification('📊 Report generated successfully!', 'success');
}

// ==================== STUDENT ATTENDANCE VIEW ====================

/**
 * Initialize student attendance view with mock student data
 */
function initializeStudentView() {
  // Simulate logged-in student (in real app, this would come from auth)
  const mockStudentId = ATTENDANCE_STATE.studentProfiles[0]?.id || 'student-1';
  const mockStudent = ATTENDANCE_STATE.studentProfiles.find(s => s.id === mockStudentId);

  if (mockStudent) {
    displayStudentAttendance(mockStudent);
  }
}

/**
 * Display student's attendance information
 * @param {Object} student - Student object
 */
function displayStudentAttendance(student) {
  // Update student info
  document.getElementById('myName').textContent = student.name;
  document.getElementById('myRoll').textContent = student.rollNumber || '--';
  document.getElementById('mySem').textContent = student.semester || '--';

  // Get student's attendance records
  const studentRecords = ATTENDANCE_STATE.attendanceRecord.filter(r => r.studentId === student.id);
  
  // Calculate statistics
  const present = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const absent = studentRecords.filter(r => r.status === 'absent').length;
  const total = Math.max(present + absent, 1);
  const percentage = ((present / total) * 100).toFixed(1);

  // Update stats
  document.getElementById('myAttendancePercent').textContent = percentage + '%';
  document.getElementById('myPresent').textContent = present;
  document.getElementById('myAbsent').textContent = absent;
  document.getElementById('myStatus').textContent = 
    percentage >= 75 ? '✅ Good Standing' : percentage >= 60 ? '⚠️ Need Improvement' : '❌ Needs Action';

  // Display attendance history
  const historyTbody = document.getElementById('myAttendanceHistory');
  historyTbody.innerHTML = '';

  if (studentRecords.length === 0) {
    historyTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No attendance records yet</td></tr>';
  } else {
    // Show last 10 records
    studentRecords.slice(-10).reverse().forEach(record => {
      const row = document.createElement('tr');
      const date = new Date(record.markedAt).toLocaleDateString();
      const statusBadge = `<span class="status-badge status-${record.status}">${record.status.toUpperCase()}</span>`;

      row.innerHTML = `
        <td>${date}</td>
        <td>${record.sessionId.toUpperCase()}</td>
        <td>${getTeacherName(record.markedBy) || '--'}</td>
        <td>${statusBadge}</td>
        <td>${record.remarks || '--'}</td>
      `;
      historyTbody.appendChild(row);
    });
  }
}

/**
 * Get teacher name by ID
 * @param {string} teacherId - Teacher ID
 * @returns {string} Teacher name
 */
function getTeacherName(teacherId) {
  const teacher = ATTENDANCE_STATE.TEACHERS.find(t => t.id === teacherId);
  return teacher ? teacher.name : null;
}

// ==================== TEACHER PROFILES ====================

/**
 * Load and display all teachers in the grid
 */
function loadTeachersToGrid() {
  const grid = document.getElementById('teachersGrid');
  if (!grid) return;

  grid.innerHTML = '';

  ATTENDANCE_STATE.TEACHERS.forEach(teacher => {
    const card = document.createElement('div');
    card.className = 'teacher-card';
    card.innerHTML = `
      <div class="teacher-avatar">${teacher.name.charAt(0)}${teacher.name.split(' ')[1]?.charAt(0) || ''}</div>
      <div class="teacher-name">${teacher.name}</div>
      
      <div class="teacher-info">
        <div class="teacher-info-item">
          <span class="teacher-info-label">Department:</span>
          <span>${teacher.dept || 'N/A'}</span>
        </div>
        <div class="teacher-info-item">
          <span class="teacher-info-label">Email:</span>
          <span style="word-break: break-all;">${teacher.email || 'N/A'}</span>
        </div>
        <div class="teacher-info-item">
          <span class="teacher-info-label">Phone:</span>
          <span>${teacher.phone || 'N/A'}</span>
        </div>
        <div class="teacher-info-item">
          <span class="teacher-info-label">Experience:</span>
          <span>${teacher.experience || 'N/A'} years</span>
        </div>
      </div>

      <div>
        <div style="color: #cbd5e1; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem;">Teaching:</div>
        <div class="teacher-subjects">
          ${(teacher.subjects || []).map(subject => 
            `<span class="subject-badge">${subject}</span>`
          ).join('')}
        </div>
      </div>

      <div>
        <div style="color: #cbd5e1; font-weight: 600; margin-bottom: 0.5rem; margin-top: 0.5rem; font-size: 0.9rem;">Qualifications:</div>
        <div style="font-size: 0.9rem; color: #94a3b8;">
          ${teacher.qualification || 'N/A'}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ==================== MODALS & NOTIFICATIONS ====================

/**
 * Open success modal
 */
function openModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, warning)
 */
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  if (!notification) return;

  notification.textContent = message;
  notification.className = `notification show ${type}`;

  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

/**
 * Toggle user navigation menu
 */
function toggleUserMenu() {
  const userNav = document.getElementById('userNav');
  // Simple toggle - in production would show dropdown menu
  if (userNav) {
    userNav.style.opacity = '0.6';
    setTimeout(() => {
      userNav.style.opacity = '1';
    }, 200);
  }
}

// ==================== EXPORT FUNCTIONS ====================

/**
 * Export attendance report as CSV
 */
function exportAsCSV() {
  const table = document.querySelector('.att-table');
  if (!table) {
    showNotification('❌ No report to export', 'error');
    return;
  }

  let csv = [];
  const rows = table.querySelectorAll('tr');

  rows.forEach(row => {
    const cols = row.querySelectorAll('td, th');
    let csvRow = [];
    cols.forEach(col => {
      csvRow.push(`"${col.innerText}"`);
    });
    csv.push(csvRow.join(','));
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `attendance-report-${new Date().toISOString().split('T')[0]}.csv`);
  link.click();

  showNotification('✅ Report exported as CSV', 'success');
}

/**
 * Print attendance report
 */
function printReport() {
  window.print();
  showNotification('🖨️ Opening print dialog...', 'success');
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format date to readable string
 * @param {string|Date} dateStr - Date string or object
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  if (!dateStr) return '--';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format time to readable string
 * @param {string} timeStr - Time string
 * @returns {string} Formatted time
 */
function formatTime(timeStr) {
  if (!timeStr) return '--';
  const date = new Date(`2000-01-01T${timeStr}`);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== KEYBOARD SHORTCUTS ====================

document.addEventListener('keydown', function (e) {
  // Alt+A: Mark all present
  if (e.altKey && e.key === 'a') {
    e.preventDefault();
    document.getElementById('markAllPresentBtn')?.click();
  }

  // Alt+R: Reset attendance
  if (e.altKey && e.key === 'r') {
    e.preventDefault();
    document.getElementById('resetBtn')?.click();
  }

  // Alt+S: Submit attendance
  if (e.altKey && e.key === 's') {
    e.preventDefault();
    document.getElementById('submitBtn')?.click();
  }

  // Escape: Close modal
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ==================== LOCAL STORAGE HELPERS ====================

/**
 * Save session to local storage
 */
function saveSessionToStorage() {
  if (attendanceUI.currentSession) {
    localStorage.setItem('att-session', JSON.stringify(attendanceUI.currentSession));
  }
}

/**
 * Load session from local storage
 */
function loadSessionFromStorage() {
  const stored = localStorage.getItem('att-session');
  if (stored) {
    try {
      attendanceUI.currentSession = JSON.parse(stored);
    } catch (e) {
    }
  }
}

/**
 * Clear session from local storage
 */
function clearSessionStorage() {
  localStorage.removeItem('att-session');
}

// Save session periodically
setInterval(saveSessionToStorage, 5000);

// ==================== RESPONSIVE BEHAVIOR ====================

/**
 * Handle responsive navigation toggle
 */
const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', function () {
    const navMenu = document.querySelector('.nav-menu');
    navMenu?.classList.toggle('active');
  });
}

/**
 * Close mobile menu when a link is clicked
 */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelector('.nav-menu')?.classList.remove('active');
  });
});

// ==================== CONSOLE HELPERS (FOR DEVELOPMENT) ====================

/**
 * Development helper: Print current session state
 */
function debugSession() {
  console.log('Current Session:', attendanceUI.currentSession);
  console.log('Selected Students:', attendanceUI.selectedStudents);
  console.log('All Records:', ATTENDANCE_STATE.attendanceRecord);
}

// Make available in console
window.debugSession = debugSession;
window.attendanceUI = attendanceUI;
window.showNotification = showNotification;
