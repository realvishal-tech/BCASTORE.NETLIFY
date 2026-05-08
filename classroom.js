/* ===================================
   CLASSROOM.JS - Live Classes System
   Premium classroom management
   =================================== */

// State Management
const CLASSROOM_STATE = {
  user: null,
  currentLiveClass: null,
  selectedClass: null,
  currentFilter: '',
  currentSearch: ''
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  initializeClassroom();
  setupEventListeners();
  loadUserData();
  renderLiveClasses();
  renderUpcomingClasses();
  renderRecordedClasses();
  updateStats();
  
  // Simulate live student count updates
  setInterval(updateLiveStudentCounts, 5000);
  
  // Update countdowns every second
  setInterval(updateCountdowns, 1000);
});

// ===================================
// CORE FUNCTIONS
// ===================================

/**
 * Initialize classroom environment
 */
function initializeClassroom() {
  console.log('🎓 Classroom System Initialized');
  
  // Check if user is logged in
  const userName = localStorage.getItem('userName');
  if (userName) {
    CLASSROOM_STATE.user = { name: userName };
  }
}

/**
 * Load user data from localStorage
 */
function loadUserData() {
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  
  if (userName) {
    updateUserProfile(userName);
  }
}

/**
 * Update user profile in navigation
 */
function updateUserProfile(name) {
  const userProfileNav = document.getElementById('userProfileNav');
  if (userProfileNav) {
    userProfileNav.textContent = `👤 ${name}`;
  }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Modal Controls
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('joinModalClose')?.addEventListener('click', closeJoinModal);
  document.getElementById('modalOverlay')?.addEventListener('click', closeModal);
  document.getElementById('joinModalOverlay')?.addEventListener('click', closeJoinModal);
  
  // Live Class Actions
  document.getElementById('raiseHandBtn')?.addEventListener('click', raiseHand);
  document.getElementById('chatBtn')?.addEventListener('click', openChat);
  document.getElementById('leaveClassBtn')?.addEventListener('click', leaveClass);
  document.getElementById('downloadNotesBtn')?.addEventListener('click', downloadNotes);
  
  // Filter and Search
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    CLASSROOM_STATE.currentSearch = e.target.value;
    renderUpcomingClasses();
  });
  
  document.getElementById('subjectFilter')?.addEventListener('change', (e) => {
    CLASSROOM_STATE.currentFilter = e.target.value;
    renderUpcomingClasses();
  });
  
  // Join Form
  document.getElementById('joinForm')?.addEventListener('submit', handleJoinClass);
  
  // Mobile Navigation Toggle
  document.getElementById('navToggle')?.addEventListener('click', toggleMobileMenu);
}

// ===================================
// LIVE CLASSES RENDERING
// ===================================

/**
 * Render live classes in the Live Now section
 */
function renderLiveClasses() {
  const container = document.getElementById('liveClassContainer');
  const liveClasses = CLASSROOM_DATA.liveClasses.filter(
    c => getClassStatus(c.startTime, c.endTime) === 'live'
  );
  
  if (liveClasses.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No live classes at the moment</h3>
        <p>Check back soon or view upcoming classes below</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = liveClasses.map(cls => createLiveClassCard(cls)).join('');
  
  // Add event listeners to live class cards
  liveClasses.forEach(cls => {
    document.getElementById(`live-join-${cls.id}`)?.addEventListener('click', () => {
      showJoinModal(cls);
    });
  });
}

/**
 * Create live class card HTML
 */
function createLiveClassCard(cls) {
  const timeElapsed = formatTime(cls.startTime);
  const duration = Math.round((cls.endTime - cls.startTime) / (1000 * 60));
  
  return `
    <div class="live-class-card">
      <div class="live-class-content">
        <div class="live-badge">
          <span class="live-pulse"></span>
          LIVE NOW
        </div>
        
        <h3 class="live-class-title">${cls.title}</h3>
        
        <div class="live-class-info">
          <div class="live-info-item">
            <span class="live-info-icon">👨‍🏫</span>
            <span>${cls.teacher}</span>
          </div>
          <div class="live-info-item">
            <span class="live-info-icon">📚</span>
            <span>${cls.subject.replace('-', ' ').toUpperCase()}</span>
          </div>
          <div class="live-info-item">
            <span class="live-info-icon">⏱️</span>
            <span>Started ${timeElapsed}</span>
          </div>
          <div class="live-info-item">
            <span class="live-info-icon">⏳</span>
            <span>${duration} minutes duration</span>
          </div>
        </div>
        
        <div class="live-class-topic">
          <strong>Today's Topic:</strong> ${cls.topic}
        </div>
        
        <div class="live-class-timer">
          ⏰ Class ends in <span class="time-remaining-${cls.id}">${Math.round((cls.endTime - new Date()) / (1000 * 60))}m</span>
        </div>
      </div>
      
      <div class="live-class-sidebar">
        <div class="live-count">
          <span class="live-info-icon">👥</span>
          <div>
            <div class="live-count-number students-count-${cls.id}">${cls.studentsJoined}</div>
            <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.25rem;">Students Online</p>
          </div>
        </div>
        
        <button class="live-action-button" id="live-join-${cls.id}">
          🎯 Join Live Class
        </button>
      </div>
    </div>
  `;
}

/**
 * Update live class student counts (simulated)
 */
function updateLiveStudentCounts() {
  CLASSROOM_DATA.liveClasses.forEach(cls => {
    const countEl = document.querySelector(`.students-count-${cls.id}`);
    if (countEl) {
      cls.studentsJoined = getRandomStudentCount(cls.studentsJoined);
      countEl.textContent = cls.studentsJoined;
    }
  });
}

/**
 * Update countdown timers
 */
function updateCountdowns() {
  CLASSROOM_DATA.liveClasses.forEach(cls => {
    const timerEl = document.querySelector(`.time-remaining-${cls.id}`);
    if (timerEl) {
      const remaining = Math.round((cls.endTime - new Date()) / (1000 * 60));
      timerEl.textContent = Math.max(0, remaining) + 'm';
    }
  });
  
  // Update upcoming class countdowns
  const upcomingCountdowns = document.querySelectorAll('.countdown-timer');
  upcomingCountdowns.forEach(el => {
    const classId = el.dataset.classId;
    const cls = CLASSROOM_DATA.upcomingClasses.find(c => c.id === classId);
    if (cls) {
      el.textContent = formatTimeRemaining(cls.startTime);
    }
  });
}

// ===================================
// UPCOMING CLASSES RENDERING
// ===================================

/**
 * Render upcoming classes grid
 */
function renderUpcomingClasses() {
  const container = document.getElementById('upcomingClassesContainer');
  
  let upcomingClasses = CLASSROOM_DATA.upcomingClasses.filter(
    c => getClassStatus(c.startTime, c.endTime) === 'scheduled'
  );
  
  // Apply filters
  upcomingClasses = filterClassesBySubject(upcomingClasses, CLASSROOM_STATE.currentFilter);
  upcomingClasses = searchClasses(upcomingClasses, CLASSROOM_STATE.currentSearch);
  
  // Sort by start time
  upcomingClasses.sort((a, b) => a.startTime - b.startTime);
  
  if (upcomingClasses.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⏰</div>
        <h3>${CLASSROOM_STATE.currentSearch ? 'No classes found' : 'No upcoming classes scheduled'}</h3>
        <p>${CLASSROOM_STATE.currentSearch ? 'Try adjusting your search filters' : 'Check back soon for new class schedules'}</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = upcomingClasses.map(cls => createUpcomingClassCard(cls)).join('');
  
  // Add event listeners
  upcomingClasses.forEach(cls => {
    document.getElementById(`join-${cls.id}`)?.addEventListener('click', () => {
      showJoinModal(cls);
    });
    document.getElementById(`notify-${cls.id}`)?.addEventListener('click', () => {
      setReminder(cls);
    });
  });
}

/**
 * Create upcoming class card HTML
 */
function createUpcomingClassCard(cls) {
  const date = formatDate(cls.startTime);
  const time = formatTime(cls.startTime);
  
  return `
    <div class="upcoming-class-card">
      <div class="card-subject">${cls.subject.replace('-', ' ')}</div>
      
      <h3 class="card-title">${cls.title}</h3>
      
      <div class="card-details">
        <div class="card-detail-item">
          <span class="card-detail-icon">👨‍🏫</span>
          <span>${cls.teacher}</span>
        </div>
        <div class="card-detail-item">
          <span class="card-detail-icon">📅</span>
          <span>${date}</span>
        </div>
        <div class="card-detail-item">
          <span class="card-detail-icon">🕐</span>
          <span>${time}</span>
        </div>
        <div class="card-detail-item">
          <span class="card-detail-icon">⏱️</span>
          <span>${formatDuration(cls.duration)}</span>
        </div>
      </div>
      
      <div class="card-countdown">
        ⏰ <span class="countdown-timer" data-class-id="${cls.id}">${formatTimeRemaining(cls.startTime)}</span>
      </div>
      
      <div class="card-action">
        <button class="card-btn card-join-btn" id="join-${cls.id}">
          🎯 Join Class
        </button>
        <button class="card-btn card-notify-btn" id="notify-${cls.id}">
          🔔 Remind
        </button>
      </div>
    </div>
  `;
}

// ===================================
// RECORDED CLASSES RENDERING
// ===================================

/**
 * Render recorded classes grid
 */
function renderRecordedClasses() {
  const container = document.getElementById('recordedClassesContainer');
  
  const recordedClasses = CLASSROOM_DATA.recordedClasses
    .sort((a, b) => b.uploadDate - a.uploadDate);
  
  if (recordedClasses.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎥</div>
        <h3>No recorded classes available</h3>
      </div>
    `;
    return;
  }
  
  container.innerHTML = recordedClasses.map(cls => createRecordedClassCard(cls)).join('');
  
  // Add event listeners
  recordedClasses.forEach(cls => {
    document.getElementById(`watch-${cls.id}`)?.addEventListener('click', () => {
      playRecordedClass(cls);
    });
    document.getElementById(`notes-${cls.id}`)?.addEventListener('click', () => {
      downloadRecordedNotes(cls);
    });
  });
}

/**
 * Create recorded class card HTML
 */
function createRecordedClassCard(cls) {
  return `
    <div class="recorded-class-card">
      <div class="recorded-thumbnail">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1;stop-opacity:0.15' /%3E%3Cstop offset='100%25' style='stop-color:%238b5cf6;stop-opacity:0.15' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1280' height='720' fill='%230f172a' /%3E%3Crect width='1280' height='720' fill='url(%23grad)' /%3E%3C/svg%3E" alt="${cls.title}" class="thumbnail-img"/>
        <div class="play-button">▶️</div>
      </div>
      
      <div class="recorded-info">
        <h3 class="recorded-title">${cls.title}</h3>
        
        <div class="recorded-meta">
          <span>${cls.teacher}</span>
          <span>${formatRelativeTime(cls.uploadDate)}</span>
        </div>
        
        <div class="recorded-actions">
          <button class="recorded-btn recorded-watch" id="watch-${cls.id}">
            ▶️ Watch
          </button>
          <button class="recorded-btn recorded-notes" id="notes-${cls.id}">
            📄 Notes
          </button>
        </div>
      </div>
    </div>
  `;
}

// ===================================
// MODAL FUNCTIONS
// ===================================

/**
 * Show join class modal
 */
function showJoinModal(cls) {
  CLASSROOM_STATE.selectedClass = cls;
  
  const modal = document.getElementById('joinModal');
  const studentName = localStorage.getItem('userName');
  const studentEmail = localStorage.getItem('userEmail');
  
  // Pre-fill form if user data exists
  if (studentName) {
    document.getElementById('studentName').value = studentName;
  }
  if (studentEmail) {
    document.getElementById('studentEmail').value = studentEmail;
  }
  
  modal.classList.add('active');
}

/**
 * Close join modal
 */
function closeJoinModal() {
  document.getElementById('joinModal').classList.remove('active');
}

/**
 * Handle join class form submission
 */
function handleJoinClass(e) {
  e.preventDefault();
  
  const name = document.getElementById('studentName').value.trim();
  const email = document.getElementById('studentEmail').value.trim();
  const roll = document.getElementById('studentRoll').value.trim();
  
  if (!name || !email) {
    showNotification('Please fill in all required fields', 'warning');
    return;
  }
  
  // Save student data
  localStorage.setItem('userName', name);
  localStorage.setItem('userEmail', email);
  if (roll) localStorage.setItem('studentRoll', roll);
  
  // Store join data for Firebase later
  const joinData = {
    studentName: name,
    studentEmail: email,
    studentRoll: roll,
    classId: CLASSROOM_STATE.selectedClass.id,
    joinTime: new Date(),
    className: CLASSROOM_STATE.selectedClass.title
  };
  
  // Close modal
  closeJoinModal();
  
  // Open live class
  openLiveClass(CLASSROOM_STATE.selectedClass);
  
  showNotification(`Welcome ${name}! You've joined the class`, 'success');
}

/**
 * Open live class modal with Google Meet
 */
function openLiveClass(cls) {
  CLASSROOM_STATE.currentLiveClass = cls;
  
  // Update modal content
  document.getElementById('modalClassTitle').textContent = cls.title;
  document.getElementById('modalTeacherName').textContent = cls.teacher;
  document.getElementById('modalSubject').textContent = cls.subject.replace('-', ' ').toUpperCase();
  document.getElementById('modalTopic').textContent = cls.topic;
  document.getElementById('modalStudentsJoined').textContent = cls.studentsJoined;
  
  const duration = Math.round((cls.endTime - cls.startTime) / (1000 * 60));
  document.getElementById('modalDuration').textContent = formatDuration(duration);
  
  // Embed Google Meet
  const meetContainer = document.getElementById('meetContainer');
  const shareLink = cls.googleMeetLink || '#';
  
  // Create embedded meet (in production, use official Google Meet embed)
  meetContainer.innerHTML = `
    <iframe 
      allow="camera; microphone; display-capture"
      src="https://meet.google.com/meeting-placeholder"
      style="width: 100%; height: 100%; border: none;"
      title="Google Meet"
    ></iframe>
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; background: rgba(0,0,0,0.3); z-index: 1000; cursor: pointer;" id="meetRedirect">
      <div style="text-align: center; color: white;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
        <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">Google Meet</p>
        <p style="font-size: 0.9rem; margin-bottom: 1.5rem; color: #cbd5e1;">Click to open in Google Meet</p>
        <button style="
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
        ">
          Open Google Meet →
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('meetRedirect')?.addEventListener('click', () => {
    window.open(shareLink, '_blank', 'width=1200,height=700');
  });
  
  // Show modal
  document.getElementById('liveClassModal').classList.add('active');
}

/**
 * Close live class modal
 */
function closeModal() {
  document.getElementById('liveClassModal').classList.remove('active');
  CLASSROOM_STATE.currentLiveClass = null;
}

// ===================================
// CLASS ACTIONS
// ===================================

/**
 * Raise hand in class
 */
function raiseHand() {
  const btn = document.getElementById('raiseHandBtn');
  const isRaised = btn.classList.contains('hand-raised');
  
  if (isRaised) {
    btn.classList.remove('hand-raised');
    btn.textContent = '✋ Raise Hand';
    showNotification('Hand lowered', 'info');
  } else {
    btn.classList.add('hand-raised');
    btn.style.background = 'rgba(239, 68, 68, 0.2)';
    btn.style.borderColor = '#ef4444';
    btn.style.color = '#ef4444';
    btn.textContent = '🖐️ Hand Raised';
    showNotification('Your hand is raised! Teacher will call you shortly', 'success');
  }
}

/**
 * Open chat interface
 */
function openChat() {
  showNotification(
    '💬 Chat opened! You can now ask questions and interact with classmates',
    'info'
  );
}

/**
 * Leave class
 */
function leaveClass() {
  if (confirm('Are you sure you want to leave this class? You\'ll be marked absent if you leave early.')) {
    closeModal();
    showNotification('You have left the class', 'info');
  }
}

/**
 * Download class notes
 */
function downloadNotes() {
  const cls = CLASSROOM_STATE.currentLiveClass;
  if (!cls || !cls.notesUrl || cls.notesUrl === '#') {
    showNotification('Notes will be available after class ends', 'warning');
    return;
  }
  
  window.open(cls.notesUrl, '_blank');
  showNotification('Notes downloaded successfully', 'success');
}

/**
 * Play recorded class
 */
function playRecordedClass(cls) {
  const videoUrl = cls.videoUrl;
  
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.id = 'videoModal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content" style="max-width: 900px; padding: 0;">
      <button style="position: absolute; top: 1rem; right: 1rem; z-index: 1102; width: 40px; height: 40px; background: rgba(100, 116, 139, 0.1); border: 1px solid rgba(100, 116, 139, 0.2); color: #f1f5f9; font-size: 1.5rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;" onclick="this.closest('.modal').remove()">
        &times;
      </button>
      <iframe 
        width="100%" 
        height="500" 
        src="${videoUrl}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
        style="display: block;"
      ></iframe>
      <div style="padding: 1.5rem;">
        <h2 style="color: #f1f5f9; margin-bottom: 0.5rem;">${cls.title}</h2>
        <p style="color: #cbd5e1; margin-bottom: 1rem;">${cls.description}</p>
        <div style="display: flex; gap: 1rem;">
          <a href="${cls.notesUrl}" target="_blank" style="
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
          ">
            📄 Download Notes
          </a>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

/**
 * Download recorded class notes
 */
function downloadRecordedNotes(cls) {
  if (!cls.notesUrl || cls.notesUrl === '#') {
    showNotification('Notes not available for this recording', 'warning');
    return;
  }
  
  window.open(cls.notesUrl, '_blank');
  showNotification('Notes downloaded successfully', 'success');
}

/**
 * Set reminder for upcoming class
 */
function setReminder(cls) {
  const name = cls.title;
  localStorage.setItem(`reminder-${cls.id}`, 'true');
  
  showNotification(`✅ Reminder set for "${name}"`, 'success');
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Update statistics
 */
function updateStats() {
  const now = new Date();
  
  // Active classes
  const activeClasses = CLASSROOM_DATA.liveClasses.filter(
    c => c.startTime <= now && c.endTime >= now
  ).length;
  document.getElementById('classCount').textContent = activeClasses;
  
  // Total students in live classes
  const totalStudents = CLASSROOM_DATA.liveClasses.reduce((sum, c) => sum + c.studentsJoined, 0);
  document.getElementById('activeStudents').textContent = totalStudents;
  
  // Completed classes
  const completedClasses = CLASSROOM_DATA.recordedClasses.length;
  document.getElementById('completedClasses').textContent = completedClasses;
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const messageEl = document.getElementById('notificationMessage');
  
  notification.className = `notification show ${type}`;
  messageEl.textContent = message;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 4000);
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
  const navMenu = document.querySelector('.nav-menu');
  navMenu?.classList.toggle('active');
}

// ===================================
// FIREBASE INTEGRATION (Ready for Setup)
// ===================================

/**
 * Initialize Firebase (when credentials are ready)
 */
function initializeFirebase() {
  // Add Firebase config when ready
  const firebaseConfig = {
    // Your Firebase config here
  };
  
  // This will handle:
  // 1. Real-time live class data
  // 2. Student enrollment tracking
  // 3. Attendance logging
  // 4. Notes storage
  // 5. Recording upload/retrieval
}

/**
 * Save class enrollment to Firebase
 */
function saveClassEnrollment(studentData, classId) {
  // Firebase write logic here
  console.log('Enrollment saved:', studentData, classId);
}

/**
 * Log attendance to Firebase
 */
function logAttendance(studentData, classId, joinTime, leaveTime) {
  // Firebase write logic here
  console.log('Attendance logged:', studentData, classId, joinTime, leaveTime);
}

console.log('✅ Classroom System Ready | Live Classes: ' + CLASSROOM_DATA.liveClasses.length + ' | Upcoming: ' + CLASSROOM_DATA.upcomingClasses.length + ' | Recorded: ' + CLASSROOM_DATA.recordedClasses.length);
