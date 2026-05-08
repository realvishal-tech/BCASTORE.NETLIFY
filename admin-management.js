/** ==================== ADMIN MANAGEMENT JAVASCRIPT ==================== */

// ==================== STATE & DATA MANAGEMENT ====================

const MGMT_STATE = {
  teachers: [],
  subjects: [],
  semesters: [],
  currentEditItem: null,
  deleteTarget: null,
  filterQuery: ''
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeManagement();
  setupEventListeners();
  loadAllData();
  renderAllData();
});

// ==================== INITIALIZATION ====================

function initializeManagement() {
  console.log('⚙️ Admin Management Initialized');
  
  // Load from localStorage or use default data
  loadFromLocalStorage();
  
  // If no data exists, use default data from attendance_data.js
  if (MGMT_STATE.teachers.length === 0 && typeof ATTENDANCE_STATE !== 'undefined') {
    MGMT_STATE.teachers = JSON.parse(JSON.stringify(ATTENDANCE_STATE.TEACHERS || []));
  }
  
  if (MGMT_STATE.semesters.length === 0) {
    MGMT_STATE.semesters = [
      { id: 'sem-1', name: 'Semester I', number: 'I', year: '2024-2025', status: 'active' },
      { id: 'sem-2', name: 'Semester II', number: 'II', year: '2024-2025', status: 'active' },
      { id: 'sem-3', name: 'Semester III', number: 'III', year: '2024-2025', status: 'active' },
      { id: 'sem-4', name: 'Semester IV', number: 'IV', year: '2024-2025', status: 'active' },
      { id: 'sem-5', name: 'Semester V', number: 'V', year: '2024-2025', status: 'upcoming' },
      { id: 'sem-6', name: 'Semester VI', number: 'VI', year: '2024-2025', status: 'upcoming' }
    ];
  }
  
  if (MGMT_STATE.subjects.length === 0) {
    MGMT_STATE.subjects = [
      { id: 'subj-1', name: 'Data Structures', code: 'CS-301', semester: 'III', credits: 4, description: 'Study of data structures and algorithms' },
      { id: 'subj-2', name: 'Web Development', code: 'CS-302', semester: 'III', credits: 4, description: 'Frontend and backend web development' },
      { id: 'subj-3', name: 'Database Management', code: 'CS-303', semester: 'III', credits: 4, description: 'DBMS and SQL fundamentals' },
      { id: 'subj-4', name: 'Software Engineering', code: 'CS-304', semester: 'III', credits: 4, description: 'Software development lifecycle' }
    ];
  }
  
  // Save to localStorage
  saveToLocalStorage();
}

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.mgmt-menu-item').forEach(item => {
    item.addEventListener('click', switchTab);
  });
  
  // Add buttons
  document.getElementById('addTeacherBtn').addEventListener('click', openAddTeacherModal);
  document.getElementById('addSubjectBtn').addEventListener('click', openAddSubjectModal);
  document.getElementById('addSemesterBtn').addEventListener('click', openAddSemesterModal);
  
  // Form submissions
  document.getElementById('teacherForm').addEventListener('submit', handleSaveTeacher);
  document.getElementById('subjectForm').addEventListener('submit', handleSaveSubject);
  document.getElementById('semesterForm').addEventListener('submit', handleSaveSemester);
  
  // Search inputs
  document.getElementById('teacherSearchInput').addEventListener('input', (e) => filterAndRender('teachers', e.target.value));
  document.getElementById('subjectSearchInput').addEventListener('input', (e) => filterAndRender('subjects', e.target.value));
  document.getElementById('semesterSearchInput').addEventListener('input', (e) => filterAndRender('semesters', e.target.value));
  
  // Modal overlays
  document.querySelectorAll('.mgmt-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
      }
    });
  });
}

function loadAllData() {
  // Data already loaded in initialization
}

function renderAllData() {
  renderTeachers();
  renderSubjects();
  renderSemesters();
}

// ==================== TAB SWITCHING ====================

function switchTab(e) {
  e.preventDefault();
  
  // Get tab name
  const tabName = this.dataset.tab;
  
  // Hide all tabs
  document.querySelectorAll('.mgmt-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active from all menu items
  document.querySelectorAll('.mgmt-menu-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(tabName + '-tab').classList.add('active');
  
  // Mark menu item as active
  this.classList.add('active');
}

// ==================== TEACHERS MANAGEMENT ====================

function renderTeachers() {
  const container = document.getElementById('teachersListContainer');
  
  if (MGMT_STATE.teachers.length === 0) {
    container.innerHTML = `
      <div class="mgmt-empty">
        <div class="mgmt-empty-icon">👨‍🏫</div>
        <h3>No teachers found</h3>
        <p>Add a new teacher to get started</p>
        <button class="btn btn-primary" onclick="openAddTeacherModal()">+ Add Teacher</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = MGMT_STATE.teachers.map(teacher => `
    <div class="mgmt-item">
      <div class="mgmt-item-info">
        <div class="mgmt-item-title">${teacher.name}</div>
        <div class="mgmt-item-detail">
          <span><span class="mgmt-item-detail-label">📍 Department:</span> ${teacher.dept || 'N/A'}</span>
          <span><span class="mgmt-item-detail-label">📧 Email:</span> ${teacher.email || 'N/A'}</span>
          <span><span class="mgmt-item-detail-label">⏰ Experience:</span> ${teacher.experience || 0} years</span>
        </div>
        <div class="mgmt-item-detail" style="margin-top: 0.5rem;">
          <span><span class="mgmt-item-detail-label">📚 Subjects:</span></span>
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.25rem;">
          ${(teacher.subjects || []).map(subject => 
            `<span style="display: inline-block; background: rgba(99, 102, 241, 0.15); color: var(--accent-primary); padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500;">${subject}</span>`
          ).join('')}
        </div>
      </div>
      <div class="mgmt-item-actions">
        <button class="mgmt-item-btn edit" onclick="editTeacher('${teacher.id}')">✏️ Edit</button>
        <button class="mgmt-item-btn delete" onclick="deleteTeacher('${teacher.id}')">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

function openAddTeacherModal() {
  MGMT_STATE.currentEditItem = null;
  document.getElementById('teacherModalTitle').textContent = 'Add New Teacher';
  document.getElementById('teacherForm').reset();
  document.getElementById('teacherModal').classList.add('active');
}

function editTeacher(id) {
  const teacher = MGMT_STATE.teachers.find(t => t.id === id);
  if (!teacher) return;
  
  MGMT_STATE.currentEditItem = teacher;
  document.getElementById('teacherModalTitle').textContent = 'Edit Teacher';
  
  // Fill form
  document.getElementById('teacherName').value = teacher.name || '';
  document.getElementById('teacherDept').value = teacher.dept || '';
  document.getElementById('teacherEmail').value = teacher.email || '';
  document.getElementById('teacherPhone').value = teacher.phone || '';
  document.getElementById('teacherExperience').value = teacher.experience || '';
  document.getElementById('teacherQualification').value = teacher.qualification || '';
  document.getElementById('teacherSubjects').value = (teacher.subjects || []).join(', ');
  
  document.getElementById('teacherModal').classList.add('active');
}

function handleSaveTeacher(e) {
  e.preventDefault();
  
  const name = document.getElementById('teacherName').value.trim();
  const dept = document.getElementById('teacherDept').value.trim();
  const email = document.getElementById('teacherEmail').value.trim();
  const phone = document.getElementById('teacherPhone').value.trim();
  const experience = parseInt(document.getElementById('teacherExperience').value) || 0;
  const qualification = document.getElementById('teacherQualification').value.trim();
  const subjectsStr = document.getElementById('teacherSubjects').value.trim();
  const subjects = subjectsStr ? subjectsStr.split(',').map(s => s.trim()) : [];
  
  if (!name || !dept || !email) {
    showNotification('❌ Please fill all required fields', 'error');
    return;
  }
  
  if (MGMT_STATE.currentEditItem) {
    // Edit existing
    const index = MGMT_STATE.teachers.findIndex(t => t.id === MGMT_STATE.currentEditItem.id);
    MGMT_STATE.teachers[index] = {
      id: MGMT_STATE.teachers[index].id,
      name,
      dept,
      email,
      phone,
      experience,
      qualification,
      subjects,
      avatar: name.charAt(0)
    };
    showNotification('✅ Teacher updated successfully!', 'success');
  } else {
    // Add new
    const newTeacher = {
      id: 'prof-' + Date.now(),
      name,
      dept,
      email,
      phone,
      experience,
      qualification,
      subjects,
      avatar: name.charAt(0)
    };
    MGMT_STATE.teachers.push(newTeacher);
    showNotification('✅ Teacher added successfully!', 'success');
  }
  
  saveToLocalStorage();
  renderTeachers();
  closeTeacherModal();
}

function deleteTeacher(id) {
  const teacher = MGMT_STATE.teachers.find(t => t.id === id);
  if (!teacher) return;
  
  MGMT_STATE.deleteTarget = { type: 'teacher', id, name: teacher.name };
  document.getElementById('deleteItemName').textContent = teacher.name;
  document.getElementById('confirmDeleteModal').classList.add('active');
}

function closeTeacherModal() {
  document.getElementById('teacherModal').classList.remove('active');
  MGMT_STATE.currentEditItem = null;
}

// ==================== SUBJECTS MANAGEMENT ====================

function renderSubjects() {
  const container = document.getElementById('subjectsListContainer');
  
  if (MGMT_STATE.subjects.length === 0) {
    container.innerHTML = `
      <div class="mgmt-empty">
        <div class="mgmt-empty-icon">📚</div>
        <h3>No subjects found</h3>
        <p>Add a new subject to get started</p>
        <button class="btn btn-primary" onclick="openAddSubjectModal()">+ Add Subject</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = MGMT_STATE.subjects.map(subject => `
    <div class="mgmt-item">
      <div class="mgmt-item-info">
        <div class="mgmt-item-title">${subject.name}</div>
        <div class="mgmt-item-detail">
          <span><span class="mgmt-item-detail-label">🔢 Code:</span> ${subject.code || 'N/A'}</span>
          <span><span class="mgmt-item-detail-label">📅 Semester:</span> ${subject.semester || 'N/A'}</span>
          <span><span class="mgmt-item-detail-label">⭐ Credits:</span> ${subject.credits || 0}</span>
        </div>
        ${subject.description ? `<div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">📝 ${subject.description}</div>` : ''}
      </div>
      <div class="mgmt-item-actions">
        <button class="mgmt-item-btn edit" onclick="editSubject('${subject.id}')">✏️ Edit</button>
        <button class="mgmt-item-btn delete" onclick="deleteSubject('${subject.id}')">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

function openAddSubjectModal() {
  MGMT_STATE.currentEditItem = null;
  document.getElementById('subjectModalTitle').textContent = 'Add New Subject';
  document.getElementById('subjectForm').reset();
  document.getElementById('subjectModal').classList.add('active');
}

function editSubject(id) {
  const subject = MGMT_STATE.subjects.find(s => s.id === id);
  if (!subject) return;
  
  MGMT_STATE.currentEditItem = subject;
  document.getElementById('subjectModalTitle').textContent = 'Edit Subject';
  
  // Fill form
  document.getElementById('subjectName').value = subject.name || '';
  document.getElementById('subjectCode').value = subject.code || '';
  document.getElementById('subjectSemester').value = subject.semester || '';
  document.getElementById('subjectCredits').value = subject.credits || 4;
  document.getElementById('subjectDescription').value = subject.description || '';
  
  document.getElementById('subjectModal').classList.add('active');
}

function handleSaveSubject(e) {
  e.preventDefault();
  
  const name = document.getElementById('subjectName').value.trim();
  const code = document.getElementById('subjectCode').value.trim();
  const semester = document.getElementById('subjectSemester').value.trim();
  const credits = parseInt(document.getElementById('subjectCredits').value) || 4;
  const description = document.getElementById('subjectDescription').value.trim();
  
  if (!name || !code) {
    showNotification('❌ Please fill all required fields', 'error');
    return;
  }
  
  if (MGMT_STATE.currentEditItem) {
    // Edit existing
    const index = MGMT_STATE.subjects.findIndex(s => s.id === MGMT_STATE.currentEditItem.id);
    MGMT_STATE.subjects[index] = {
      id: MGMT_STATE.subjects[index].id,
      name,
      code,
      semester,
      credits,
      description
    };
    showNotification('✅ Subject updated successfully!', 'success');
  } else {
    // Add new
    const newSubject = {
      id: 'subj-' + Date.now(),
      name,
      code,
      semester,
      credits,
      description
    };
    MGMT_STATE.subjects.push(newSubject);
    showNotification('✅ Subject added successfully!', 'success');
  }
  
  saveToLocalStorage();
  renderSubjects();
  closeSubjectModal();
}

function deleteSubject(id) {
  const subject = MGMT_STATE.subjects.find(s => s.id === id);
  if (!subject) return;
  
  MGMT_STATE.deleteTarget = { type: 'subject', id, name: subject.name };
  document.getElementById('deleteItemName').textContent = subject.name;
  document.getElementById('confirmDeleteModal').classList.add('active');
}

function closeSubjectModal() {
  document.getElementById('subjectModal').classList.remove('active');
  MGMT_STATE.currentEditItem = null;
}

// ==================== SEMESTERS MANAGEMENT ====================

function renderSemesters() {
  const container = document.getElementById('semestersListContainer');
  
  if (MGMT_STATE.semesters.length === 0) {
    container.innerHTML = `
      <div class="mgmt-empty">
        <div class="mgmt-empty-icon">📅</div>
        <h3>No semesters found</h3>
        <p>Add a new semester to get started</p>
        <button class="btn btn-primary" onclick="openAddSemesterModal()">+ Add Semester</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = MGMT_STATE.semesters.map(semester => `
    <div class="mgmt-item">
      <div class="mgmt-item-info">
        <div class="mgmt-item-title">${semester.name}</div>
        <div class="mgmt-item-detail">
          <span><span class="mgmt-item-detail-label">📚 Number:</span> ${semester.number}</span>
          <span><span class="mgmt-item-detail-label">📆 Year:</span> ${semester.year || 'N/A'}</span>
          <span><span class="mgmt-item-detail-label">📊 Status:</span> 
            <span style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 20px; background: ${semester.status === 'active' ? 'rgba(16,185,129,0.2); color: #10b981' : semester.status === 'completed' ? 'rgba(107,114,128,0.2); color: #6b7280' : 'rgba(245,158,11,0.2); color: #f59e0b'}; font-size: 0.85rem; font-weight: 500;">${semester.status}</span>
          </span>
        </div>
        ${semester.startDate ? `<div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">📍 ${formatDate(semester.startDate)} to ${formatDate(semester.endDate)}</div>` : ''}
      </div>
      <div class="mgmt-item-actions">
        <button class="mgmt-item-btn edit" onclick="editSemester('${semester.id}')">✏️ Edit</button>
        <button class="mgmt-item-btn delete" onclick="deleteSemester('${semester.id}')">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

function openAddSemesterModal() {
  MGMT_STATE.currentEditItem = null;
  document.getElementById('semesterModalTitle').textContent = 'Add New Semester';
  document.getElementById('semesterForm').reset();
  document.getElementById('semesterModal').classList.add('active');
}

function editSemester(id) {
  const semester = MGMT_STATE.semesters.find(s => s.id === id);
  if (!semester) return;
  
  MGMT_STATE.currentEditItem = semester;
  document.getElementById('semesterModalTitle').textContent = 'Edit Semester';
  
  // Fill form
  document.getElementById('semesterName').value = semester.name || '';
  document.getElementById('semesterNumber').value = semester.number || '';
  document.getElementById('semesterStartDate').value = semester.startDate || '';
  document.getElementById('semesterEndDate').value = semester.endDate || '';
  document.getElementById('semesterYear').value = semester.year || '';
  document.getElementById('semesterStatus').value = semester.status || 'active';
  
  document.getElementById('semesterModal').classList.add('active');
}

function handleSaveSemester(e) {
  e.preventDefault();
  
  const name = document.getElementById('semesterName').value.trim();
  const number = document.getElementById('semesterNumber').value.trim();
  const year = document.getElementById('semesterYear').value.trim();
  const startDate = document.getElementById('semesterStartDate').value;
  const endDate = document.getElementById('semesterEndDate').value;
  const status = document.getElementById('semesterStatus').value;
  
  if (!name || !number) {
    showNotification('❌ Please fill all required fields', 'error');
    return;
  }
  
  if (MGMT_STATE.currentEditItem) {
    // Edit existing
    const index = MGMT_STATE.semesters.findIndex(s => s.id === MGMT_STATE.currentEditItem.id);
    MGMT_STATE.semesters[index] = {
      id: MGMT_STATE.semesters[index].id,
      name,
      number,
      year,
      startDate,
      endDate,
      status
    };
    showNotification('✅ Semester updated successfully!', 'success');
  } else {
    // Add new
    const newSemester = {
      id: 'sem-' + Date.now(),
      name,
      number,
      year,
      startDate,
      endDate,
      status
    };
    MGMT_STATE.semesters.push(newSemester);
    showNotification('✅ Semester added successfully!', 'success');
  }
  
  saveToLocalStorage();
  renderSemesters();
  closeSemesterModal();
}

function deleteSemester(id) {
  const semester = MGMT_STATE.semesters.find(s => s.id === id);
  if (!semester) return;
  
  MGMT_STATE.deleteTarget = { type: 'semester', id, name: semester.name };
  document.getElementById('deleteItemName').textContent = semester.name;
  document.getElementById('confirmDeleteModal').classList.add('active');
}

function closeSemesterModal() {
  document.getElementById('semesterModal').classList.remove('active');
  MGMT_STATE.currentEditItem = null;
}

// ==================== GENERAL FUNCTIONS ====================

function filterAndRender(type, query) {
  // Simple filter - re-render based on type
  if (type === 'teachers') {
    renderTeachers();
  } else if (type === 'subjects') {
    renderSubjects();
  } else if (type === 'semesters') {
    renderSemesters();
  }
}

function confirmDelete() {
  if (!MGMT_STATE.deleteTarget) return;
  
  const { type, id } = MGMT_STATE.deleteTarget;
  
  if (type === 'teacher') {
    MGMT_STATE.teachers = MGMT_STATE.teachers.filter(t => t.id !== id);
    renderTeachers();
  } else if (type === 'subject') {
    MGMT_STATE.subjects = MGMT_STATE.subjects.filter(s => s.id !== id);
    renderSubjects();
  } else if (type === 'semester') {
    MGMT_STATE.semesters = MGMT_STATE.semesters.filter(s => s.id !== id);
    renderSemesters();
  }
  
  saveToLocalStorage();
  document.getElementById('confirmDeleteModal').classList.remove('active');
  showNotification('✅ Item deleted successfully!', 'success');
  MGMT_STATE.deleteTarget = null;
}

function cancelDelete() {
  document.getElementById('confirmDeleteModal').classList.remove('active');
  MGMT_STATE.deleteTarget = null;
}

// ==================== STORAGE FUNCTIONS ====================

function saveToLocalStorage() {
  localStorage.setItem('mgmt_teachers', JSON.stringify(MGMT_STATE.teachers));
  localStorage.setItem('mgmt_subjects', JSON.stringify(MGMT_STATE.subjects));
  localStorage.setItem('mgmt_semesters', JSON.stringify(MGMT_STATE.semesters));
}

function loadFromLocalStorage() {
  const savedTeachers = localStorage.getItem('mgmt_teachers');
  const savedSubjects = localStorage.getItem('mgmt_subjects');
  const savedSemesters = localStorage.getItem('mgmt_semesters');
  
  if (savedTeachers) MGMT_STATE.teachers = JSON.parse(savedTeachers);
  if (savedSubjects) MGMT_STATE.subjects = JSON.parse(savedSubjects);
  if (savedSemesters) MGMT_STATE.semesters = JSON.parse(savedSemesters);
}

// ==================== UTILITY FUNCTIONS ====================

function showNotification(message, type = 'success') {
  const notif = document.getElementById('mgmtNotification');
  notif.textContent = message;
  notif.className = 'mgmt-notification show ' + type;
  
  setTimeout(() => {
    notif.classList.remove('show');
  }, 3000);
}

function formatDate(dateStr) {
  if (!dateStr) return '--';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ==================== EXPORT DATA FUNCTION ====================

function exportData() {
  const data = {
    teachers: MGMT_STATE.teachers,
    subjects: MGMT_STATE.subjects,
    semesters: MGMT_STATE.semesters,
    exportedAt: new Date().toISOString()
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `admin-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('✅ Data exported successfully!', 'success');
}

// ==================== CONSOLE HELPERS ====================

window.exportData = exportData;
window.debugMgmt = () => console.log('Management State:', MGMT_STATE);
