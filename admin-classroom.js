/* ===================================
   ADMIN CLASSROOM.JS - Admin Panel
   Dashboard initialization and management
   =================================== */

// Admin State
const ADMIN_STATE = {
  isAuthenticated: false,
  currentAdmin: null,
  selectedClass: null,
  classes: [],
  deleteTarget: null
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuthentication();
  initializeAdmin();
  setupAdminEventListeners();
});

/**
 * Check if admin is authenticated
 */
function checkAdminAuthentication() {
  const adminToken = localStorage.getItem('adminToken');
  const adminEmail = localStorage.getItem('adminEmail');
  
  if (!adminToken || !adminEmail) {
    window.location.href = 'admin-login.html';
    return;
  }
  
  ADMIN_STATE.isAuthenticated = true;
  ADMIN_STATE.currentAdmin = { email: adminEmail };
}

/**
 * Initialize admin panel
 */
function initializeAdmin() {
  
  // Load all data
  loadAllData();
  
  // Render initial sections
  renderLiveClasses();
  renderUpcomingClasses();
  renderRecordedClasses();
  renderTeachers();
  renderStudents();
  updateAnalyticsCards();
}

/**
 * Load all data
 */
function loadAllData() {
  ADMIN_STATE.classes = [
    ...CLASSROOM_DATA.liveClasses,
    ...CLASSROOM_DATA.upcomingClasses,
    ...CLASSROOM_DATA.recordedClasses
  ];
}

/**
 * Setup all event listeners
 */
function setupAdminEventListeners() {
  // Sidebar Navigation
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      switchSection(section);
      
      // Update active state
      document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Add Class Buttons
  document.getElementById('addLiveClassBtn')?.addEventListener('click', openAddClassModal);
  document.getElementById('addUpcomingClassBtn')?.addEventListener('click', openAddClassModal);
  document.getElementById('addRecordedClassBtn')?.addEventListener('click', openAddRecordingModal);
  document.getElementById('addTeacherBtn')?.addEventListener('click', openAddTeacherModal);

  // Form Handling
  document.getElementById('classForm')?.addEventListener('submit', handleSaveClass);
  document.getElementById('cancelClassBtn')?.addEventListener('click', closeClassModal);

  // Modal Overlays
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function() {
      this.closest('.modal').classList.remove('active');
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.modal').classList.remove('active');
    });
  });

  // Delete Confirmation
  document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => {
    document.getElementById('deleteModal').classList.remove('active');
  });

  document.getElementById('confirmDeleteBtn')?.addEventListener('click', confirmDelete);

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
}

// ===================================
// SECTION SWITCHING
// ===================================

/**
 * Switch between admin sections
 */
function switchSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(section => {
    section.classList.remove('active');
  });

  // Show selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
}

// ===================================
// LIVE CLASSES MANAGEMENT
// ===================================

/**
 * Render live classes table
 */
function renderLiveClasses() {
  const tbody = document.getElementById('liveClassesTbody');
  const liveClasses = CLASSROOM_DATA.liveClasses;

  if (liveClasses.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2rem;">No live classes at the moment</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = liveClasses.map(cls => `
    <tr>
      <td>${cls.title}</td>
      <td>${cls.teacher}</td>
      <td>${cls.subject.replace('-', ' ').toUpperCase()}</td>
      <td>${cls.studentsJoined}</td>
      <td>${Math.max(0, Math.round((cls.endTime - new Date()) / (1000 * 60)))} mins</td>
      <td><span class="table-status status-live">LIVE</span></td>
      <td>
        <div class="table-actions">
          <button class="table-btn" onclick="editClass('${cls.id}')">✏️</button>
          <button class="table-btn danger" onclick="deleteClass('${cls.id}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Render upcoming classes table
 */
function renderUpcomingClasses() {
  const tbody = document.getElementById('upcomingClassesTbody');
  const upcomingClasses = CLASSROOM_DATA.upcomingClasses;

  if (upcomingClasses.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2rem;">No upcoming classes scheduled</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = upcomingClasses.map(cls => `
    <tr>
      <td>${cls.title}</td>
      <td>${cls.teacher}</td>
      <td>${cls.subject.replace('-', ' ').toUpperCase()}</td>
      <td>${formatDate(cls.startTime)}</td>
      <td>${formatTime(cls.startTime)}</td>
      <td><span class="table-status status-upcoming">UPCOMING</span></td>
      <td>
        <div class="table-actions">
          <button class="table-btn" onclick="editClass('${cls.id}')">✏️</button>
          <button class="table-btn danger" onclick="deleteClass('${cls.id}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Render recorded classes
 */
function renderRecordedClasses() {
  const container = document.getElementById('recordedClassesGrid');
  const recordedClasses = CLASSROOM_DATA.recordedClasses;

  if (recordedClasses.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; grid-column: 1/-1; color: #cbd5e1;">
        <p>No recorded classes yet</p>
      </div>
    `;
    return;
  }

  container.innerHTML = recordedClasses.map(cls => `
    <div class="recorded-item">
      <div class="recorded-thumbnail" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);"></div>
      <div class="recorded-info">
        <h3>${cls.title}</h3>
        <p>👨‍🏫 ${cls.teacher}</p>
        <p style="margin-top: 0.5rem; font-size: 0.8rem;">📌 ${formatRelativeTime(cls.uploadDate)}</p>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
          <button class="table-btn" onclick="editRecording('${cls.id}')" style="flex: 1;">✏️ Edit</button>
          <button class="table-btn danger" onclick="deleteClass('${cls.id}')" style="flex: 1;">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===================================
// MODAL FUNCTIONS
// ===================================

/**
 * Open add/edit class modal
 */
function openAddClassModal() {
  document.getElementById('modalTitle').textContent = 'Add New Class';
  document.getElementById('classForm').reset();
  document.getElementById('classForm').dataset.mode = 'create';
  document.getElementById('classModal').classList.add('active');
}

/**
 * Open add recording modal
 */
function openAddRecordingModal() {
  document.getElementById('modalTitle').textContent = 'Upload Recording';
  document.getElementById('classForm').reset();
  document.getElementById('classForm').dataset.mode = 'recording';
  document.getElementById('classModal').classList.add('active');
}

/**
 * Edit class
 */
function editClass(classId) {
  ADMIN_STATE.selectedClass = classId;
  const cls = ADMIN_STATE.classes.find(c => c.id === classId);
  
  if (!cls) {
    showAdminNotification('Class not found', 'error');
    return;
  }

  document.getElementById('modalTitle').textContent = 'Edit Class';
  
  // Populate form
  document.getElementById('classTitle').value = cls.title;
  document.getElementById('classSubject').value = cls.subject;
  document.getElementById('classTeacher').value = cls.teacher;
  document.getElementById('classTeacherEmail').value = cls.teacherEmail || '';
  document.getElementById('classDescription').value = cls.description || '';
  document.getElementById('classTopic').value = cls.topic || '';
  
  if (cls.startTime) {
    document.getElementById('classStartTime').value = cls.startTime.toISOString().slice(0, 16);
  }
  if (cls.endTime) {
    document.getElementById('classEndTime').value = cls.endTime.toISOString().slice(0, 16);
  }
  
  document.getElementById('classMeetLink').value = cls.googleMeetLink || '';
  document.getElementById('classNotesUrl').value = cls.notesUrl || '';
  
  document.getElementById('classForm').dataset.mode = 'edit';
  document.getElementById('classForm').dataset.classId = classId;
  document.getElementById('classModal').classList.add('active');
}

/**
 * Edit recording
 */
function editRecording(recordingId) {
  // Implementation for editing recordings
  showAdminNotification('Recording edit feature coming soon', 'info');
}

/**
 * Close class modal
 */
function closeClassModal() {
  document.getElementById('classModal').classList.remove('active');
  document.getElementById('classForm').reset();
}

/**
 * Handle save class
 */
function handleSaveClass(e) {
  e.preventDefault();

  const mode = e.target.dataset.mode;
  const classId = e.target.dataset.classId;

  const classData = {
    id: classId || `class-${Date.now()}`,
    title: document.getElementById('classTitle').value,
    subject: document.getElementById('classSubject').value,
    teacher: document.getElementById('classTeacher').value,
    teacherEmail: document.getElementById('classTeacherEmail').value,
    description: document.getElementById('classDescription').value,
    topic: document.getElementById('classTopic').value,
    startTime: new Date(document.getElementById('classStartTime').value),
    endTime: new Date(document.getElementById('classEndTime').value),
    googleMeetLink: document.getElementById('classMeetLink').value,
    notesUrl: document.getElementById('classNotesUrl').value,
    studentsJoined: 0
  };

  // Validate
  if (!classData.title || !classData.subject || !classData.teacher) {
    showAdminNotification('Please fill in all required fields', 'error');
    return;
  }

  if (mode === 'create') {
    // Add to appropriate array based on scheduled time
    const now = new Date();
    if (classData.startTime > now) {
      CLASSROOM_DATA.upcomingClasses.push(classData);
    } else {
      CLASSROOM_DATA.liveClasses.push(classData);
    }
    
    showAdminNotification('✅ Class created successfully!', 'success');
  } else if (mode === 'edit') {
    // Update existing class
    const classIndex = CLASSROOM_DATA.upcomingClasses.findIndex(c => c.id === classId);
    if (classIndex !== -1) {
      CLASSROOM_DATA.upcomingClasses[classIndex] = classData;
    } else {
      const liveIndex = CLASSROOM_DATA.liveClasses.findIndex(c => c.id === classId);
      if (liveIndex !== -1) {
        CLASSROOM_DATA.liveClasses[liveIndex] = classData;
      }
    }
    
    showAdminNotification('✅ Class updated successfully!', 'success');
  }

  // Refresh displays
  renderLiveClasses();
  renderUpcomingClasses();
  closeClassModal();

  // In production, this would save to Firebase
  saveClassToFirebase(classData, mode);
}

/**
 * Delete class
 */
function deleteClass(classId) {
  ADMIN_STATE.deleteTarget = classId;
  const cls = ADMIN_STATE.classes.find(c => c.id === classId);
  
  const message = document.getElementById('deleteMessage');
  message.textContent = `Are you sure you want to delete "${cls?.title}"? This action cannot be undone.`;
  
  document.getElementById('deleteModal').classList.add('active');
}

/**
 * Confirm delete
 */
function confirmDelete() {
  const classId = ADMIN_STATE.deleteTarget;
  
  // Remove from arrays
  CLASSROOM_DATA.liveClasses = CLASSROOM_DATA.liveClasses.filter(c => c.id !== classId);
  CLASSROOM_DATA.upcomingClasses = CLASSROOM_DATA.upcomingClasses.filter(c => c.id !== classId);
  CLASSROOM_DATA.recordedClasses = CLASSROOM_DATA.recordedClasses.filter(c => c.id !== classId);
  
  showAdminNotification('✅ Class deleted successfully!', 'success');
  
  // Refresh displays
  renderLiveClasses();
  renderUpcomingClasses();
  renderRecordedClasses();
  
  document.getElementById('deleteModal').classList.remove('active');
  
  // In production, delete from Firebase
  deleteClassFromFirebase(classId);
}

// ===================================
// TEACHERS MANAGEMENT
// ===================================

/**
 * Render teachers table
 */
function renderTeachers() {
  const tbody = document.getElementById('teachersTableBody');
  
  // Mock teachers data
  const teachers = [
    { id: 1, name: 'Prof. Rajesh Kumar', dept: 'Computer Science', email: 'rajesh@bca.edu', classes: 5 },
    { id: 2, name: 'Prof. Priya Singh', dept: 'Computer Science', email: 'priya@bca.edu', classes: 6 },
    { id: 3, name: 'Prof. Anil Verma', dept: 'Computer Science', email: 'anil@bca.edu', classes: 4 },
    { id: 4, name: 'Prof. Deepak Sharma', dept: 'Computer Science', email: 'deepak@bca.edu', classes: 7 }
  ];

  tbody.innerHTML = teachers.map(teacher => `
    <tr>
      <td>${teacher.name}</td>
      <td>${teacher.dept}</td>
      <td>${teacher.email}</td>
      <td>${teacher.classes}</td>
      <td>
        <div class="table-actions">
          <button class="table-btn">✏️</button>
          <button class="table-btn danger">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Open add teacher modal
 */
function openAddTeacherModal() {
  showAdminNotification('Add teacher feature coming soon', 'info');
}

// ===================================
// STUDENTS MANAGEMENT
// ===================================

/**
 * Render students table
 */
function renderStudents() {
  const tbody = document.getElementById('studentsTableBody');
  
  // Mock students data
  const students = [
    { id: 1, name: 'Aman Kumar', roll: '001', email: 'aman@student.edu', classesJoined: 3, attendance: 92 },
    { id: 2, name: 'Priya Patel', roll: '002', email: 'priya@student.edu', classesJoined: 5, attendance: 98 },
    { id: 3, name: 'Rahul Singh', roll: '003', email: 'rahul@student.edu', classesJoined: 2, attendance: 85 },
    { id: 4, name: 'Neha Gupta', roll: '004', email: 'neha@student.edu', classesJoined: 4, attendance: 95 }
  ];

  document.getElementById('totalStudents').textContent = students.length;
  document.getElementById('activeStudents').textContent = Math.floor(students.length * 0.75);
  document.getElementById('attendanceRate').textContent = Math.round(
    students.reduce((sum, s) => sum + s.attendance, 0) / students.length
  ) + '%';

  tbody.innerHTML = students.map(student => `
    <tr>
      <td>${student.name}</td>
      <td>${student.roll}</td>
      <td>${student.email}</td>
      <td>${student.classesJoined}</td>
      <td>
        <span style="color: #22c55e; font-weight: 600;">${student.attendance}%</span>
      </td>
      <td>
        <div class="table-actions">
          <button class="table-btn">📊</button>
          <button class="table-btn">✏️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===================================
// ANALYTICS
// ===================================

/**
 * Update analytics cards
 */
function updateAnalyticsCards() {
  const totalSessions = CLASSROOM_DATA.liveClasses.length + 
                       CLASSROOM_DATA.upcomingClasses.length + 
                       CLASSROOM_DATA.recordedClasses.length;
  
  const totalStudents = CLASSROOM_DATA.liveClasses.reduce((sum, c) => sum + c.studentsJoined, 0);

  document.getElementById('totalSessions').textContent = totalSessions;
  document.getElementById('totalEnrolled').textContent = totalStudents;
  document.getElementById('avgDuration').textContent = '45 min';
  document.getElementById('completionRate').textContent = '95%';
}

// ===================================
// FIREBASE INTEGRATION (Ready for Setup)
// ===================================

/**
 * Save class to Firebase
 */
async function saveClassToFirebase(classData, mode) {
  // Firebase implementation will go here
  
  // Example:
  // try {
  //   if (mode === 'create') {
  //     await db.collection('classes').add(classData);
  //   } else {
  //     await db.collection('classes').doc(classData.id).update(classData);
  //   }
  // } catch (error) {
  //   showAdminNotification('Error saving to database', 'error');
  // }
}

/**
 * Delete class from Firebase
 */
async function deleteClassFromFirebase(classId) {
  // Firebase implementation will go here
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Show admin notification
 */
function showAdminNotification(message, type = 'success') {
  const notification = document.getElementById('adminNotification');
  const messageEl = document.getElementById('adminNotificationMessage');

  notification.className = `admin-notification show ${type}`;
  messageEl.textContent = message;

  setTimeout(() => {
    notification.classList.remove('show');
  }, 4000);
}

/**
 * Handle logout
 */
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    window.location.href = 'admin-login.html';
  }
}
