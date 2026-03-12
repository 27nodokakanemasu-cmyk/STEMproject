// ========================================
// Global State & Configuration
// ========================================
const state = {
    currentTime: new Date(),
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    tasks: JSON.parse(localStorage.getItem('studyTasks')) || [],
    uploadedFiles: [],
    timerInterval: null,
    timerSeconds: 0,
    timerRunning: false,
    memoryCards: [],
    flippedCards: [],
    matchedPairs: 0
};

// DOM Elements Cache
const elements = {};

// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    initSkySystem();
    initNavigation();
    initBaumkuchen();
    initCalendar();
    initTasks();
    initUpload();
    initGames();
    initScrollEffects();
    
    // Update time every second
    setInterval(updateTimeDisplay, 1000);
    setInterval(updateCelestialPosition, 60000);
});

function cacheElements() {
    elements.celestial = document.getElementById('celestial');
    elements.sunRays = document.getElementById('sunRays');
    elements.stars = document.getElementById('stars');
    elements.clouds = document.getElementById('clouds');
    elements.timeGreeting = document.getElementById('timeGreeting');
    elements.timerDisplay = document.getElementById('timerDisplay');
    elements.calendarGrid = document.getElementById('calendarGrid');
    elements.currentMonth = document.getElementById('currentMonth');
    elements.taskList = document.getElementById('taskList');
    elements.taskInput = document.getElementById('taskInput');
    elements.uploadArea = document.getElementById('uploadArea');
    elements.fileInput = document.getElementById('fileInput');
    elements.uploadedFiles = document.getElementById('uploadedFiles');
    elements.gameModal = document.getElementById('gameModal');
    elements.gameContainer = document.getElementById('gameContainer');
    elements.temperature = document.getElementById('temperature');
    elements.weatherDesc = document.getElementById('weatherDesc');
}

// ========================================
// Sky System (Time-based Background)
// ========================================
function initSkySystem() {
    generateStars();
    generateClouds();
    updateSkyTheme();
    updateCelestialPosition();
    updateTimeDisplay();
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
}

function getSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
}

function updateSkyTheme() {
    const timeOfDay = getTimeOfDay();
    const season = getSeason();
    const root = document.documentElement;
    
    const themes = {
        dawn: {
            skyTop: '#FFB6A3',
            skyBottom: '#FFDAB9',
            isNight: false
        },
        morning: {
            skyTop: '#87CEEB',
            skyBottom: '#E0F4FF',
            isNight: false
        },
        afternoon: {
            skyTop: '#5DA5DA',
            skyBottom: '#B0E0E6',
            isNight: false
        },
        evening: {
            skyTop: '#FF6B6B',
            skyBottom: '#FFE66D',
            isNight: false
        },
        night: {
            skyTop: '#0D1B2A',
            skyBottom: '#1B263B',
            isNight: true
        }
    };
    
    // Season adjustments
    const seasonAdjustments = {
        spring: { saturation: 1.1 },
        summer: { saturation: 1.2, brightness: 1.1 },
        autumn: { saturation: 0.9, warmth: 1.1 },
        winter: { saturation: 0.8, brightness: 0.9 }
    };
    
    const theme = themes[timeOfDay];
    
    root.style.setProperty('--sky-top', theme.skyTop);
    root.style.setProperty('--sky-bottom', theme.skyBottom);
    
    // Toggle celestial body
    if (theme.isNight) {
        elements.celestial.classList.remove('sun');
        elements.celestial.classList.add('moon');
        elements.stars.classList.add('visible');
    } else {
        elements.celestial.classList.remove('moon');
        elements.celestial.classList.add('sun');
        elements.stars.classList.remove('visible');
    }
}

function updateCelestialPosition() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // Calculate position (0 at midnight, peaks at noon for sun)
    const dayProgress = totalMinutes / 1440; // 0 to 1 throughout the day
    
    // Arc motion across the sky
    const angle = dayProgress * Math.PI;
    const x = 50 - Math.cos(angle) * 40; // Horizontal position
    const y = 100 - Math.sin(angle) * 80; // Vertical position
    
    elements.celestial.style.left = `${x}%`;
    elements.celestial.style.top = `${y}%`;
}

function generateStars() {
    const container = elements.stars;
    container.innerHTML = '';
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        container.appendChild(star);
    }
}

function generateClouds() {
    const container = elements.clouds;
    container.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = `${Math.random() * 200 + 100}px`;
        cloud.style.height = `${Math.random() * 60 + 40}px`;
        cloud.style.top = `${Math.random() * 40 + 10}%`;
        cloud.style.animationDuration = `${Math.random() * 60 + 120}s`;
        cloud.style.animationDelay = `${Math.random() * -120}s`;
        container.appendChild(cloud);
    }
}

function updateTimeDisplay() {
    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = getTimeOfDay();
    
    const greetings = {
        dawn: 'Good Early Morning',
        morning: 'Good Morning',
        afternoon: 'Good Afternoon',
        evening: 'Good Evening',
        night: 'Good Night'
    };
    
    elements.timeGreeting.textContent = greetings[timeOfDay];
}

// ========================================
// Navigation
// ========================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ========================================
// Baumkuchen Widget
// ========================================
function initBaumkuchen() {
    initTimer();
    updateWeather();
}

// Timer Functions
function initTimer() {
    document.getElementById('timerStart').addEventListener('click', startTimer);
    document.getElementById('timerPause').addEventListener('click', pauseTimer);
    document.getElementById('timerReset').addEventListener('click', resetTimer);
    
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes);
            state.timerSeconds = minutes * 60;
            updateTimerDisplay();
        });
    });
}

function startTimer() {
    if (state.timerRunning) return;
    
    state.timerRunning = true;
    document.getElementById('timerStart').textContent = 'Running';
    
    state.timerInterval = setInterval(() => {
        if (state.timerSeconds > 0) {
            state.timerSeconds--;
            updateTimerDisplay();
        } else {
            pauseTimer();
            alert('Timer finished! Take a break!');
        }
    }, 1000);
}

function pauseTimer() {
    state.timerRunning = false;
    clearInterval(state.timerInterval);
    document.getElementById('timerStart').textContent = 'Start';
}

function resetTimer() {
    pauseTimer();
    state.timerSeconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const hours = Math.floor(state.timerSeconds / 3600);
    const minutes = Math.floor((state.timerSeconds % 3600) / 60);
    const seconds = state.timerSeconds % 60;
    
    elements.timerDisplay.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Weather Display (Simulated based on time)
function updateWeather() {
    const hour = new Date().getHours();
    const conditions = [
        { temp: 22, desc: 'Sunny', icon: 'sun' },
        { temp: 18, desc: 'Partly Cloudy', icon: 'cloud-sun' },
        { temp: 15, desc: 'Cloudy', icon: 'cloud' },
        { temp: 12, desc: 'Light Rain', icon: 'rain' }
    ];
    
    // Simulate weather based on time
    const weatherIndex = Math.floor((hour / 6)) % conditions.length;
    const weather = conditions[weatherIndex];
    
    elements.temperature.textContent = `${weather.temp}°C`;
    elements.weatherDesc.textContent = weather.desc;
}

// ========================================
// Calendar System
// ========================================
function initCalendar() {
    renderCalendar();
    
    document.getElementById('prevMonth').addEventListener('click', () => {
        state.currentMonth--;
        if (state.currentMonth < 0) {
            state.currentMonth = 11;
            state.currentYear--;
        }
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        state.currentMonth++;
        if (state.currentMonth > 11) {
            state.currentMonth = 0;
            state.currentYear++;
        }
        renderCalendar();
    });
}

function renderCalendar() {
    const year = state.currentYear;
    const month = state.currentMonth;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    elements.currentMonth.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    
    let html = '';
    
    // Day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        html += `<div class="cal-day-header">${day}</div>`;
    });
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="cal-day other-month">${daysInPrevMonth - i}</div>`;
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = isCurrentMonth && day === today.getDate();
        const hasTask = state.tasks.some(t => {
            const taskDate = new Date(t.date);
            return taskDate.getDate() === day && 
                   taskDate.getMonth() === month && 
                   taskDate.getFullYear() === year;
        });
        
        html += `<div class="cal-day${isToday ? ' today' : ''}${hasTask ? ' has-task' : ''}" 
                     data-date="${year}-${month + 1}-${day}">${day}</div>`;
    }
    
    // Next month days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
        html += `<div class="cal-day other-month">${i}</div>`;
    }
    
    elements.calendarGrid.innerHTML = html;
    
    // Add click handlers
    document.querySelectorAll('.cal-day:not(.other-month)').forEach(day => {
        day.addEventListener('click', () => {
            const dateStr = day.dataset.date;
            showTasksForDate(dateStr);
        });
    });
}

function showTasksForDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateTasks = state.tasks.filter(t => {
        const taskDate = new Date(t.date);
        return taskDate.getDate() === day && 
               taskDate.getMonth() === month - 1 && 
               taskDate.getFullYear() === year;
    });
    
    // Could show a modal with tasks for that date
    console.log('Tasks for', dateStr, ':', dateTasks);
}

// ========================================
// Task Management
// ========================================
function initTasks() {
    renderTasks();
    
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    
    elements.taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
}

function addTask() {
    const text = elements.taskInput.value.trim();
    const priority = document.getElementById('taskPriority').value;
    
    if (!text) return;
    
    const task = {
        id: Date.now(),
        text,
        priority,
        completed: false,
        date: new Date().toISOString()
    };
    
    state.tasks.push(task);
    saveTasks();
    renderTasks();
    
    elements.taskInput.value = '';
}

function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('studyTasks', JSON.stringify(state.tasks));
}

function renderTasks() {
    const today = new Date().toDateString();
    
    const todayTasks = state.tasks.filter(t => {
        const taskDate = new Date(t.date).toDateString();
        return taskDate === today;
    });
    
    elements.taskList.innerHTML = todayTasks.map(task => `
        <li class="task-item priority-${task.priority}${task.completed ? ' completed' : ''}">
            <input type="checkbox" class="task-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="task-delete" onclick="deleteTask(${task.id})">×</button>
        </li>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions global for onclick handlers
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

// ========================================
// File Upload
// ========================================
function initUpload() {
    elements.uploadArea.addEventListener('click', () => elements.fileInput.click());
    
    elements.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.add('dragover');
    });
    
    elements.uploadArea.addEventListener('dragleave', () => {
        elements.uploadArea.classList.remove('dragover');
    });
    
    elements.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    elements.fileInput.addEventListener('change', () => {
        handleFiles(elements.fileInput.files);
    });
}

function handleFiles(files) {
    Array.from(files).forEach(file => {
        const fileData = {
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type
        };
        
        state.uploadedFiles.push(fileData);
        renderUploadedFiles();
    });
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function renderUploadedFiles() {
    elements.uploadedFiles.innerHTML = state.uploadedFiles.map((file, index) => `
        <div class="file-item">
            <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span class="file-name">${escapeHtml(file.name)}</span>
            <span class="file-size">${file.size}</span>
        </div>
    `).join('');
}

// ========================================
// Mini Games
// ========================================
function initGames() {
    document.getElementById('memoryGame').addEventListener('click', () => openGame('memory'));
    document.getElementById('typingGame').addEventListener('click', () => openGame('typing'));
    document.getElementById('quizGame').addEventListener('click', () => openGame('quiz'));
    
    document.getElementById('closeModal').addEventListener('click', closeGame);
    
    elements.gameModal.addEventListener('click', (e) => {
        if (e.target === elements.gameModal) closeGame();
    });
}

function openGame(type) {
    elements.gameModal.classList.add('active');
    
    switch(type) {
        case 'memory':
            initMemoryGame();
            break;
        case 'typing':
            initTypingGame();
            break;
        case 'quiz':
            initQuizGame();
            break;
    }
}

function closeGame() {
    elements.gameModal.classList.remove('active');
    elements.gameContainer.innerHTML = '';
}

// Memory Game
function initMemoryGame() {
    const emojis = ['🌸', '🍀', '🌙', '☀️', '🌈', '🎵', '📚', '✏️'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    
    state.memoryCards = cards;
    state.flippedCards = [];
    state.matchedPairs = 0;
    
    elements.gameContainer.innerHTML = `
        <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--wine-dark); margin-bottom: 20px;">Memory Match</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Find all matching pairs!</p>
        <div class="memory-grid" id="memoryGrid"></div>
    `;
    
    const grid = document.getElementById('memoryGrid');
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        card.addEventListener('click', () => flipCard(card));
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (state.flippedCards.length >= 2) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    state.flippedCards.push(card);
    
    if (state.flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = state.flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        state.matchedPairs++;
        
        if (state.matchedPairs === 8) {
            setTimeout(() => alert('Congratulations! You won!'), 300);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '?';
        card2.textContent = '?';
    }
    
    state.flippedCards = [];
}

// Typing Game
function initTypingGame() {
    const texts = [
        "The quick brown fox jumps over the lazy dog.",
        "Practice makes perfect when learning to code.",
        "Web development is both art and science.",
        "Coffee helps programmers stay awake at night.",
        "Every expert was once a beginner."
    ];
    
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    let startTime = null;
    let timer = null;
    
    elements.gameContainer.innerHTML = `
        <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--wine-dark); margin-bottom: 20px;">Speed Typing</h3>
        <div class="typing-area">
            <div class="typing-text" id="typingText">${randomText}</div>
            <textarea class="typing-input" id="typingInput" rows="3" placeholder="Start typing here..."></textarea>
            <div class="typing-stats">
                <div class="stat">
                    <div class="stat-label">WPM</div>
                    <div class="stat-value" id="wpmValue">0</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Accuracy</div>
                    <div class="stat-value" id="accuracyValue">100%</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Time</div>
                    <div class="stat-value" id="timeValue">0s</div>
                </div>
            </div>
        </div>
    `;
    
    const input = document.getElementById('typingInput');
    const wpmDisplay = document.getElementById('wpmValue');
    const accuracyDisplay = document.getElementById('accuracyValue');
    const timeDisplay = document.getElementById('timeValue');
    
    input.addEventListener('input', () => {
        if (!startTime) {
            startTime = Date.now();
            timer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                timeDisplay.textContent = `${elapsed}s`;
            }, 1000);
        }
        
        const typed = input.value;
        const original = randomText.substring(0, typed.length);
        let correct = 0;
        
        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === randomText[i]) correct++;
        }
        
        const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
        accuracyDisplay.textContent = `${accuracy}%`;
        
        const words = typed.split(' ').length;
        const minutes = (Date.now() - startTime) / 60000;
        const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
        wpmDisplay.textContent = wpm;
        
        if (typed === randomText) {
            clearInterval(timer);
            alert(`Great job! You completed with ${wpm} WPM and ${accuracy}% accuracy!`);
        }
    });
}

// Quiz Game
function initQuizGame() {
    const questions = [
        {
            q: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
            answer: 0
        },
        {
            q: "Which CSS property is used for changing text color?",
            options: ["text-color", "font-color", "color", "text-style"],
            answer: 2
        },
        {
            q: "What symbol is used for ID selectors in CSS?",
            options: [".", "#", "@", "*"],
            answer: 1
        },
        {
            q: "Which JavaScript method adds an element to the end of an array?",
            options: ["push()", "pop()", "shift()", "unshift()"],
            answer: 0
        },
        {
            q: "What does CSS stand for?",
            options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
            answer: 1
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    
    function showQuestion() {
        const q = questions[currentQuestion];
        
        elements.gameContainer.innerHTML = `
            <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--wine-dark); margin-bottom: 20px;">Quick Quiz</h3>
            <div class="quiz-area">
                <div class="quiz-question">${currentQuestion + 1}. ${q.q}</div>
                <div class="quiz-options">
                    ${q.options.map((opt, i) => `
                        <button class="quiz-option" data-index="${i}">${opt}</button>
                    `).join('')}
                </div>
                <div style="margin-top: 20px; color: var(--text-muted);">
                    Score: ${score}/${questions.length}
                </div>
            </div>
        `;
        
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
        });
    }
    
    function handleAnswer(selected) {
        const q = questions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        options[q.answer].classList.add('correct');
        
        if (selected !== q.answer) {
            options[selected].classList.add('wrong');
        } else {
            score++;
        }
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                showQuestion();
            } else {
                elements.gameContainer.innerHTML = `
                    <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--wine-dark); margin-bottom: 20px;">Quiz Complete!</h3>
                    <p style="font-size: 1.5rem; color: var(--wine-medium);">Your Score: ${score}/${questions.length}</p>
                    <button class="play-btn" style="margin-top: 20px;" onclick="initQuizGame()">Play Again</button>
                `;
            }
        }, 1000);
    }
    
    showQuestion();
}

// Make initQuizGame global for replay button
window.initQuizGame = initQuizGame;

// ========================================
// Scroll Effects
// ========================================
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Intersection Observer for animations
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
    
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}
