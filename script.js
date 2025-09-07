// Application State
let currentUser = null;
let currentRole = null;
let attendanceMarked = false;
let tasks = [
    {
        id: 1,
        title: "Mathematics Assignment",
        description: "Complete exercises 4.1-4.3",
        dueTime: "Due: 5:00 PM",
        status: "Due Today",
        priority: "high",
        completed: false
    },
    {
        id: 2,
        title: "Physics Lab Report", 
        description: "Write up experiment results",
        dueTime: "Due Tomorrow, 2:00 PM",
        status: "Tomorrow",
        priority: "medium",
        completed: false
    }
];

// Utility Functions
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function updateNavigation(activePageId) {
    // Update navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the correct nav item
    document.querySelectorAll(`[data-page="${activePageId}"]`).forEach(item => {
        item.classList.add('active');
    });
}

function animateProgressRing(percentage) {
    const circumference = 2 * Math.PI * 35; // radius = 35
    const offset = circumference - (percentage / 100) * circumference;
    return `${offset} ${circumference}`;
}

// Event Handlers
function handleRoleSelection(role) {
    currentRole = role;
    const loginTitle = document.getElementById('login-title');
    
    switch (role) {
        case 'student':
            loginTitle.textContent = 'Student Login';
            break;
        case 'teacher':
            loginTitle.textContent = 'Teacher Login';
            break;
        case 'admin':
            loginTitle.textContent = 'Administrator Login';
            break;
        default:
            loginTitle.textContent = 'Login';
    }
    
    showScreen('login-screen');
}

function handleLogin(event) {
    event.preventDefault();
    
    const institutionId = document.getElementById('institutionId').value;
    const password = document.getElementById('password').value;
    
    if (!institutionId || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login success
    currentUser = {
        id: institutionId,
        role: currentRole,
        name: institutionId === 'STU001' ? 'Alex Johnson' : 'User'
    };
    
    // Navigate to appropriate dashboard
    if (currentRole === 'student') {
        showScreen('student-dashboard');
        updateNavigation('student-dashboard');
    } else {
        // For teacher/admin, we'll just show student dashboard for demo
        showScreen('student-dashboard');
        updateNavigation('student-dashboard');
    }
}

function handleNavigation(pageId) {
    showScreen(pageId);
    updateNavigation(pageId);
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        `;
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        `;
    }
}

function markAttendance() {
    if (!attendanceMarked) {
        attendanceMarked = true;
        const button = document.getElementById('mark-attendance');
        button.textContent = 'Attendance Marked ✓';
        button.disabled = true;
        button.style.opacity = '0.6';
        
        // Show success animation or notification
        showNotification('Attendance marked successfully!', 'success');
    }
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === parseInt(taskId));
    if (task) {
        task.completed = !task.completed;
        
        // Update UI
        const taskElement = document.querySelector(`[data-task="${taskId}"]`);
        const taskCard = taskElement.closest('.activity-card');
        const taskTitle = taskCard.querySelector('h3');
        const completeButton = taskCard.querySelector('.btn-ghost');
        const checkIcon = taskElement.querySelector('svg');
        
        if (task.completed) {
            taskCard.style.opacity = '0.6';
            taskTitle.style.textDecoration = 'line-through';
            completeButton.textContent = 'Completed';
            completeButton.disabled = true;
            checkIcon.innerHTML = `
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            `;
            checkIcon.classList.remove('text-muted-foreground');
            checkIcon.classList.add('text-success');
            
            showNotification('Task completed! +50 XP', 'success');
        } else {
            taskCard.style.opacity = '1';
            taskTitle.style.textDecoration = 'none';
            completeButton.textContent = 'Mark Complete';
            completeButton.disabled = false;
            checkIcon.innerHTML = `
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
            `;
            checkIcon.classList.remove('text-success');
            checkIcon.classList.add('text-muted-foreground');
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    // Set colors based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = 'hsl(var(--success) / 0.9)';
            notification.style.color = 'hsl(var(--success-foreground))';
            break;
        case 'error':
            notification.style.backgroundColor = 'hsl(var(--destructive) / 0.9)';
            notification.style.color = 'hsl(var(--destructive-foreground))';
            break;
        default:
            notification.style.backgroundColor = 'hsl(var(--primary) / 0.9)';
            notification.style.color = 'hsl(var(--primary-foreground))';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function logout() {
    currentUser = null;
    currentRole = null;
    attendanceMarked = false;
    
    // Reset form
    document.getElementById('login-form').reset();
    
    // Show role selection
    showScreen('role-selection');
    
    showNotification('Logged out successfully', 'info');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Role selection buttons
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            handleRoleSelection(role);
        });
    });
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Back to roles button
    const backButton = document.getElementById('back-to-roles');
    if (backButton) {
        backButton.addEventListener('click', function() {
            showScreen('role-selection');
        });
    }
    
    // Password toggle
    const togglePasswordBtn = document.getElementById('toggle-password');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePassword);
    }
    
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                handleNavigation(pageId);
            }
        });
    });
    
    // Mark attendance button
    const markAttendanceBtn = document.getElementById('mark-attendance');
    if (markAttendanceBtn) {
        markAttendanceBtn.addEventListener('click', markAttendance);
    }
    
    // Task toggle buttons
    document.querySelectorAll('.task-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-task');
            toggleTask(taskId);
        });
    });
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Complete task buttons
    document.querySelectorAll('.btn-ghost').forEach(button => {
        if (button.textContent.includes('Mark Complete')) {
            button.addEventListener('click', function() {
                const taskCard = this.closest('.activity-card');
                const toggleButton = taskCard.querySelector('.task-toggle');
                const taskId = toggleButton.getAttribute('data-task');
                toggleTask(taskId);
            });
        }
    });
    
    // Initialize app
    showScreen('role-selection');
    
    // Add some demo animations
    setTimeout(() => {
        // Animate progress rings
        const progressRings = document.querySelectorAll('circle[stroke-dasharray]');
        progressRings.forEach(ring => {
            ring.style.strokeDasharray = animateProgressRing(87);
        });
    }, 1000);
});

// Keyboard Navigation
document.addEventListener('keydown', function(event) {
    // Handle escape key to go back
    if (event.key === 'Escape') {
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen) {
            const screenId = currentScreen.id;
            
            if (screenId === 'login-screen') {
                showScreen('role-selection');
            } else if (screenId !== 'role-selection') {
                showScreen('student-dashboard');
                updateNavigation('student-dashboard');
            }
        }
    }
    
    // Handle enter key on role cards
    if (event.key === 'Enter' && event.target.classList.contains('role-card')) {
        event.target.click();
    }
});

// Add touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(event) {
    touchEndY = event.changedTouches[0].screenY;
    
    // Simple swipe detection for navigation
    const swipeDistance = touchStartY - touchEndY;
    const minSwipeDistance = 50;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
        // You could add swipe navigation here if needed
        // console.log(swipeDistance > 0 ? 'Swipe up' : 'Swipe down');
    }
});

// Add some demo data and interactions
function addDemoInteractions() {
    // Simulate real-time updates
    setInterval(() => {
        // Update time-based elements
        const timeElements = document.querySelectorAll('[data-time]');
        timeElements.forEach(element => {
            const now = new Date();
            element.textContent = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        });
    }, 60000); // Update every minute
    
    // Add some random notifications for demo
    setTimeout(() => {
        if (currentUser && currentRole === 'student') {
            showNotification('New assignment available in Physics!', 'info');
        }
    }, 30000);
}

// Initialize demo interactions
setTimeout(addDemoInteractions, 2000);

// Performance optimization: Lazy load animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe animated elements
setTimeout(() => {
    document.querySelectorAll('.animate-slide-up, .animate-scale-in').forEach(el => {
        observer.observe(el);
    });
}, 100);