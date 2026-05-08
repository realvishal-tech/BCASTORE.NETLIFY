/* ===================================
   CLASSROOM DATA
   Mock Data for Live Classes System
   =================================== */

const CLASSROOM_DATA = {
  liveClasses: [
    {
      id: 'live-001',
      title: 'Data Structures - Advanced Concepts',
      subject: 'data-structures',
      teacher: 'Prof. Rajesh Kumar',
      teacherAvatar: '👨‍🏫',
      topic: 'Understanding Binary Search Trees and AVL Trees',
      description: 'Deep dive into balanced binary search trees, rotations, and their applications in real-world scenarios.',
      startTime: new Date(Date.now() - 5 * 60000), // Started 5 mins ago
      endTime: new Date(Date.now() + 55 * 60000), // Ends in 55 mins
      studentsJoined: 34,
      googleMeetLink: 'https://meet.google.com/abc-defg-hij', // Update with real link
      notesUrl: '#',
      status: 'live'
    }
  ],

  upcomingClasses: [
    {
      id: 'upcoming-001',
      title: 'Web Development - React Hooks',
      subject: 'web-development',
      teacher: 'Prof. Priya Singh',
      teacherAvatar: '👩‍🏫',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      duration: 60,
      googleMeetLink: 'https://meet.google.com/xyz-wxyz-abc',
      notesUrl: '#',
      description: 'Master React Hooks including useState, useEffect, useContext, and custom hooks'
    },
    {
      id: 'upcoming-002',
      title: 'Database Management - SQL Optimization',
      subject: 'database',
      teacher: 'Prof. Anil Verma',
      teacherAvatar: '👨‍🏫',
      startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
      duration: 60,
      googleMeetLink: 'https://meet.google.com/pqr-stuv-xyz',
      notesUrl: '#',
      description: 'Learn query optimization techniques and indexing strategies for better performance'
    },
    {
      id: 'upcoming-003',
      title: 'Object Oriented Programming - Design Patterns',
      subject: 'oops',
      teacher: 'Prof. Deepak Sharma',
      teacherAvatar: '👨‍🏫',
      startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      endTime: new Date(Date.now() + 7 * 60 * 60 * 1000),
      duration: 60,
      googleMeetLink: 'https://meet.google.com/lmn-opqr-stu',
      notesUrl: '#',
      description: 'Explore common design patterns: Singleton, Factory, Observer, and Strategy'
    },
    {
      id: 'upcoming-004',
      title: 'Computer Architecture - Memory Hierarchy',
      subject: 'architecture',
      teacher: 'Prof. Neeta Gupta',
      teacherAvatar: '👩‍🏫',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
      duration: 90,
      googleMeetLink: 'https://meet.google.com/abc-lmno-pqr',
      notesUrl: '#',
      description: 'Understanding cache memory, RAM, and memory optimization techniques'
    },
    {
      id: 'upcoming-005',
      title: 'Web Development - Advanced CSS',
      subject: 'web-development',
      teacher: 'Prof. Priya Singh',
      teacherAvatar: '👩‍🏫',
      startTime: new Date(Date.now() + 30 * 60 * 60 * 1000), // 30 hours from now
      endTime: new Date(Date.now() + 31 * 60 * 60 * 1000),
      duration: 60,
      googleMeetLink: 'https://meet.google.com/def-ghij-klm',
      notesUrl: '#',
      description: 'Master CSS Grid, Flexbox, animations, and responsive design techniques'
    },
    {
      id: 'upcoming-006',
      title: 'Data Structures - Graphs and Algorithms',
      subject: 'data-structures',
      teacher: 'Prof. Rajesh Kumar',
      teacherAvatar: '👨‍🏫',
      startTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days from now
      endTime: new Date(Date.now() + 49 * 60 * 60 * 1000),
      duration: 90,
      googleMeetLink: 'https://meet.google.com/nop-qrst-uvw',
      notesUrl: '#',
      description: 'Graph theory, BFS, DFS, shortest path algorithms, and their applications'
    }
  ],

  recordedClasses: [
    {
      id: 'recorded-001',
      title: 'Data Structures - Linked Lists Fundamentals',
      subject: 'data-structures',
      teacher: 'Prof. Rajesh Kumar',
      thumbnail: '📺',
      duration: 58,
      uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      notesUrl: '#',
      views: 245,
      description: 'Complete guide to linked lists including insertion, deletion, and traversal'
    },
    {
      id: 'recorded-002',
      title: 'Web Development - HTML5 and SEO',
      subject: 'web-development',
      teacher: 'Prof. Priya Singh',
      thumbnail: '🎥',
      duration: 62,
      uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      notesUrl: '#',
      views: 189,
      description: 'Learn semantic HTML5 tags and best practices for search engine optimization'
    },
    {
      id: 'recorded-003',
      title: 'Database Management - Relational Models',
      subject: 'database',
      teacher: 'Prof. Anil Verma',
      thumbnail: '💾',
      duration: 71,
      uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      notesUrl: '#',
      views: 312,
      description: 'Understanding normalization forms and designing efficient database schemas'
    },
    {
      id: 'recorded-004',
      title: 'Object Oriented Programming - Inheritance and Polymorphism',
      subject: 'oops',
      teacher: 'Prof. Deepak Sharma',
      thumbnail: '🔷',
      duration: 65,
      uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      notesUrl: '#',
      views: 278,
      description: 'Master inheritance hierarchies and polymorphic behavior in OOP'
    },
    {
      id: 'recorded-005',
      title: 'Computer Architecture - CPU Design',
      subject: 'architecture',
      teacher: 'Prof. Neeta Gupta',
      thumbnail: '🖥️',
      duration: 79,
      uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      notesUrl: '#',
      views: 156,
      description: 'Explore CPU instruction set, pipeline architecture, and microprocessor design'
    },
    {
      id: 'recorded-006',
      title: 'Data Structures - Stacks and Queues',
      subject: 'data-structures',
      teacher: 'Prof. Rajesh Kumar',
      thumbnail: '📚',
      duration: 55,
      uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      notesUrl: '#',
      views: 421,
      description: 'Comprehensive tutorial on stack and queue data structures with real-world applications'
    }
  ],

  subjects: [
    { id: 'data-structures', name: 'Data Structures', icon: '📊' },
    { id: 'web-development', name: 'Web Development', icon: '🌐' },
    { id: 'database', name: 'Database Management', icon: '🗄️' },
    { id: 'oops', name: 'Object Oriented Programming', icon: '🔷' },
    { id: 'architecture', name: 'Computer Architecture', icon: '🖥️' }
  ]
};

/* ===================================
   UTILITY FUNCTIONS
   =================================== */

/**
 * Format time remaining for countdown
 */
function formatTimeRemaining(date) {
  const now = new Date();
  const diff = date - now;
  
  if (diff <= 0) return 'Class started';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `Starts in ${hours}h ${minutes}m`;
  }
  return `Starts in ${minutes}m`;
}

/**
 * Format date in readable format
 */
function formatDate(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format time in HH:MM format
 */
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format duration in MM:SS format
 */
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

/**
 * Format relative time (e.g., "2 days ago")
 */
function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  }
  return 'Just now';
}

/**
 * Get student count with live updates
 */
function getRandomStudentCount(baseCount) {
  // Simulate realistic student count fluctuations (±10%)
  const variation = Math.floor(baseCount * 0.1 * Math.random() * (Math.random() > 0.5 ? 1 : -1));
  return Math.max(1, baseCount + variation);
}

/**
 * Get class status
 */
function getClassStatus(startTime, endTime) {
  const now = new Date();
  if (now < startTime) return 'scheduled';
  if (now >= startTime && now <= endTime) return 'live';
  return 'completed';
}

/**
 * Filter classes by subject
 */
function filterClassesBySubject(classes, subject) {
  if (!subject) return classes;
  return classes.filter(c => c.subject === subject);
}

/**
 * Search classes by keyword
 */
function searchClasses(classes, keyword) {
  if (!keyword) return classes;
  const lower = keyword.toLowerCase();
  return classes.filter(c =>
    c.title.toLowerCase().includes(lower) ||
    c.teacher.toLowerCase().includes(lower) ||
    c.description.toLowerCase().includes(lower)
  );
}
