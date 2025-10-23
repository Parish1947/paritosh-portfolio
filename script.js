// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Simple initialization on window load
window.addEventListener('load', () => {
    console.log('Window loaded - initializing everything');
    
    // Clear session storage if URL has resetgame parameter
    if (window.location.search.includes('resetgame')) {
        sessionStorage.removeItem('gameCompleted');
        console.log('Session storage cleared');
    }
    
    // Initialize game first
    setTimeout(() => {
        initTargetShootingGame();
    }, 200);
});

// Target Shooting Game
function initTargetShootingGame() {
    console.log('Initializing target shooting game...');
    
    const gameOverlay = document.getElementById('game-overlay');
    const gameArea = document.getElementById('game-area');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const skipBtn = document.getElementById('skip-game');
    
    // Check if elements exist
    if (!gameOverlay || !gameArea || !scoreElement || !timerElement || !skipBtn) {
        console.error('Game elements not found:', {
            gameOverlay: !!gameOverlay,
            gameArea: !!gameArea,
            scoreElement: !!scoreElement,
            timerElement: !!timerElement,
            skipBtn: !!skipBtn
        });
        return;
    }
    
    console.log('All game elements found');
    
    let score = 0;
    let timeLeft = 15;
    let gameActive = true;
    let targetsNeeded = 5;
    let targetInterval;
    let timerInterval;
    
    // Check if user has played before (session storage)
    if (sessionStorage.getItem('gameCompleted')) {
        console.log('Game already completed in this session, skipping...');
        endGame();
        return;
    }
    
    console.log('Showing game overlay...');
    
    // Force show game overlay
    gameOverlay.style.display = 'flex';
    gameOverlay.style.visibility = 'visible';
    gameOverlay.style.opacity = '1';
    gameOverlay.classList.remove('hidden');
    
    console.log('Game overlay should now be visible');
    
    // Start the game
    function startGame() {
        spawnTarget();
        targetInterval = setInterval(spawnTarget, 1500); // Spawn target every 1.5s
        
        // Start timer
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `${timeLeft}s`;
            
            if (timeLeft <= 0) {
                // Time's up - let them in anyway
                winGame();
            }
        }, 1000);
    }
    
    // Spawn a target at random position
    function spawnTarget() {
        if (!gameActive) return;
        
        const target = document.createElement('div');
        target.className = 'target';
        
        // Random position within game area
        const gameRect = gameArea.getBoundingClientRect();
        const maxX = gameRect.width - 80; // 80px = target width + padding
        const maxY = gameRect.height - 80;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        target.style.left = `${randomX}px`;
        target.style.top = `${randomY}px`;
        
        // Click handler
        target.addEventListener('click', (e) => {
            hitTarget(target, e);
        });
        
        gameArea.appendChild(target);
        
        // Remove target after 3 seconds if not hit
        setTimeout(() => {
            if (target.parentElement) {
                target.remove();
            }
        }, 3000);
    }
    
    // Hit target
    function hitTarget(target, event) {
        if (!gameActive) return;
        
        score++;
        scoreElement.textContent = score;
        
        // Add hit class for animation
        target.classList.add('hit');
        
        // Create hit effect
        const hitEffect = document.createElement('div');
        hitEffect.className = 'hit-effect';
        hitEffect.style.left = `${event.clientX - gameArea.getBoundingClientRect().left - 50}px`;
        hitEffect.style.top = `${event.clientY - gameArea.getBoundingClientRect().top - 50}px`;
        gameArea.appendChild(hitEffect);
        
        // Remove hit effect after animation
        setTimeout(() => hitEffect.remove(), 500);
        
        // Remove target
        setTimeout(() => target.remove(), 300);
        
        // Check win condition
        if (score >= targetsNeeded) {
            winGame();
        }
    }
    
    // Win game
    function winGame() {
        gameActive = false;
        clearInterval(targetInterval);
        clearInterval(timerInterval);
        
        // Show success message
        gameArea.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                gap: 20px;
            ">
                <div style="font-size: 4rem;">🎯</div>
                <div style="font-size: 2rem; color: #fafafa; font-weight: 700;">EXCELLENT SHOT!</div>
                <div style="font-size: 1.2rem; color: #b8b8b8;">Score: ${score} | Time: ${15 - timeLeft}s</div>
                <div style="font-size: 1rem; color: #808080;">Entering portfolio...</div>
            </div>
        `;
        
        // Mark as completed in session
        sessionStorage.setItem('gameCompleted', 'true');
        
        // Fade out and enter portfolio
        setTimeout(() => {
            endGame();
        }, 2000);
    }
    
    // End game and show portfolio
    function endGame() {
        gameOverlay.classList.add('hidden');
        setTimeout(() => {
            gameOverlay.style.display = 'none';
            console.log('Game ended, portfolio visible');
        }, 500);
    }
    
    // Skip button
    skipBtn.addEventListener('click', () => {
        gameActive = false;
        clearInterval(targetInterval);
        clearInterval(timerInterval);
        sessionStorage.setItem('gameCompleted', 'true');
        endGame();
    });
    
    // Start the game
    startGame();
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set initial icon state
    if (savedTheme === 'light') {
        sunIcon.classList.add('active');
        moonIcon.classList.remove('active');
    } else {
        moonIcon.classList.add('active');
        sunIcon.classList.remove('active');
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icons with animation
        if (newTheme === 'light') {
            sunIcon.classList.add('active');
            moonIcon.classList.remove('active');
        } else {
            moonIcon.classList.add('active');
            sunIcon.classList.remove('active');
        }
        
        // Add click animation
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
}

// Skills Progress Bars Animation
function initSkillsProgressBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCard = entry.target;
                const skillFill = skillCard.querySelector('.skill-fill');
                const skillPercent = skillCard.querySelector('.skill-percent');
                const progress = skillFill.getAttribute('data-width');
                
                // Animate the progress bar
                gsap.to(skillFill, { 
                    width: progress + '%', 
                    duration: 1.5, 
                    ease: 'power2.out', 
                    delay: 0.2 
                });
                
                // Animate the percentage counter
                gsap.fromTo(skillPercent, 
                    { textContent: '0%' }, 
                    { 
                        textContent: progress + '%', 
                        duration: 1.5, 
                        ease: 'power2.out', 
                        delay: 0.2, 
                        snap: { textContent: 1 } 
                    }
                );
                
                // Add hover effect
                skillCard.addEventListener('mouseenter', () => {
                    gsap.to(skillCard, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
                });
                
                skillCard.addEventListener('mouseleave', () => {
                    gsap.to(skillCard, { scale: 1, duration: 0.3, ease: 'power2.out' });
                });
                
                observer.unobserve(skillCard);
            }
        });
    }, { threshold: 0.5 });
    
    skillCards.forEach(card => observer.observe(card));
}

// Project Filter & Search System
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('project-search');
    
    let currentFilter = 'all';
    let currentSearch = '';
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.getAttribute('data-filter');
            filterProjects();
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        filterProjects();
    });
    
    function filterProjects() {
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const tech = card.getAttribute('data-tech').toLowerCase();
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            const matchesSearch = currentSearch === '' || 
                title.includes(currentSearch) || 
                description.includes(currentSearch) || 
                tech.includes(currentSearch);
            
            if (matchesFilter && matchesSearch) {
                card.classList.remove('hidden', 'filtered-out');
                gsap.fromTo(card, 
                    { opacity: 0, scale: 0.8, y: 20 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                );
            } else {
                card.classList.add('hidden');
                setTimeout(() => {
                    if (card.classList.contains('hidden')) {
                        card.classList.add('filtered-out');
                    }
                }, 300);
            }
        });
    }
}

// Dynamic Statistics Counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                
                gsap.fromTo(target, 
                    { textContent: 0 },
                    { 
                        textContent: finalValue,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { textContent: 1 },
                        onUpdate: function() {
                            target.textContent = Math.round(target.textContent);
                        }
                    }
                );
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Particle Background System
function initParticleSystem() {
    const container = document.getElementById('particles-container');
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random particle type
        const particleType = Math.floor(Math.random() * 3) + 1;
        particle.classList.add(`particle-${particleType}`);
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        container.appendChild(particle);
        particles.push(particle);
    }
    
    // Animate particles
    function animateParticles() {
        particles.forEach((particle, index) => {
            const speed = 0.5 + Math.random() * 0.5;
            const direction = Math.random() * Math.PI * 2;
            
            gsap.to(particle, {
                x: Math.cos(direction) * 100,
                y: Math.sin(direction) * 100,
                duration: 20 + Math.random() * 30,
                ease: 'none',
                repeat: -1,
                delay: index * 0.1
            });
            
            // Fade in/out animation
            gsap.to(particle, {
                opacity: 0.3 + Math.random() * 0.7,
                duration: 2 + Math.random() * 3,
                ease: 'power2.inOut',
                repeat: -1,
                yoyo: true,
                delay: index * 0.2
            });
        });
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        particles.forEach((particle, index) => {
            const rect = particle.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(mouseX - (rect.left + rect.width/2), 2) + 
                Math.pow(mouseY - (rect.top + rect.height/2), 2)
            );
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                gsap.to(particle, {
                    scale: 1 + force * 0.5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(particle, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });
    
    animateParticles();
}

// Interactive Timeline
function initInteractiveTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item.querySelector('.timeline-details'), {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item.querySelector('.timeline-details'), {
                opacity: 0,
                y: 10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Interactive Contact Form
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('.submit-btn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            submitBtn.querySelector('.btn-text').textContent = 'Message Sent!';
            
            // Reset form
            form.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = 'Send Message';
            }, 3000);
        }, 2000);
    });
    
    // Form validation with visual feedback
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.style.borderColor = '#f44336';
                gsap.to(input, { x: -5, duration: 0.1, yoyo: true, repeat: 1 });
            } else {
                input.style.borderColor = '#4CAF50';
            }
        });
        
        input.addEventListener('focus', () => {
            input.style.borderColor = '#667eea';
        });
    });
}

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        gsap.to(progressBar, {
            width: scrollPercent + '%',
            duration: 0.1,
            ease: 'none'
        });
    });
}

// Section Indicators
function initSectionIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    const sections = document.querySelectorAll('section');
    
    // Update active indicator on scroll
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
            if (indicator.getAttribute('data-section') === currentSection) {
                indicator.classList.add('active');
            }
        });
    });
    
    // Smooth scroll to section
    indicators.forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = indicator.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                gsap.to(window, {
                    duration: 1.2,
                    scrollTo: { y: targetElement, offsetY: 80 },
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

// Sound Effects (Optional)
function initSoundEffects() {
    const soundEnabled = localStorage.getItem('soundEnabled') === 'true';
    
    // Create audio context for sound effects
    let audioContext;
    
    function createSound(frequency, duration, type = 'sine') {
        if (!soundEnabled || !audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    // Initialize audio context on first user interaction
    document.addEventListener('click', () => {
        if (!audioContext && soundEnabled) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }, { once: true });
    
    // Add sound effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, .btn, .filter-btn, .theme-toggle, .hamburger-menu');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
            if (soundEnabled) {
                createSound(800, 0.1);
            }
        });
    });
    
    // Theme toggle sound
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (soundEnabled) {
                createSound(600, 0.2, 'square');
            }
        });
    }
}

// Custom Cursor Effects - Artistic
function initCustomCursor() {
    if (window.innerWidth <= 768) return; // Disable on mobile
    
    console.log('Initializing custom cursor');
    
    // Add class to hide default cursor
    document.body.classList.add('custom-cursor-active');
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let glowX = 0, glowY = 0;
    
    // Smooth animation loop
    function animateCursor() {
        // Trail follows cursor with delay
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        trail.style.left = trailX - 4 + 'px';
        trail.style.top = trailY - 4 + 'px';
        
        // Glow follows with more delay
        glowX += (mouseX - glowX) * 0.05;
        glowY += (mouseY - glowY) * 0.05;
        glow.style.left = glowX - 20 + 'px';
        glow.style.top = glowY - 20 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX - 10 + 'px';
        cursor.style.top = mouseY - 10 + 'px';
    });
    
    // Interactive elements with artistic effects
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .contact-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2) rotate(45deg)';
            cursor.style.background = 'radial-gradient(circle, rgba(118, 75, 162, 0.9) 0%, rgba(102, 126, 234, 0.7) 100%)';
            cursor.style.boxShadow = '0 0 30px rgba(118, 75, 162, 0.8)';
            
            glow.style.transform = 'scale(1.5)';
            glow.style.background = 'radial-gradient(circle, rgba(118, 75, 162, 0.2) 0%, transparent 70%)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1) rotate(0deg)';
            cursor.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.6) 100%)';
            cursor.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
            
            glow.style.transform = 'scale(1)';
            glow.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)';
        });
    });
    
    // Special effects for different element types
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2.5) rotate(90deg)';
            cursor.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(102, 126, 234, 0.8) 100%)';
        });
    });
    
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.8) rotate(-45deg)';
            cursor.style.background = 'radial-gradient(circle, rgba(118, 75, 162, 0.9) 0%, rgba(102, 126, 234, 0.7) 100%)';
        });
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initAnimations();
    initNavigation();
    initSmoothScrolling();
    initSkillsProgressBars();
    initProjectFilter();
    initStatsCounter();
    initParticleSystem();
    initInteractiveTimeline();
    initContactForm();
    initScrollProgress();
    initSectionIndicators();
    initSoundEffects();
    initCustomCursor();
});

// Hero Section Animations
function initAnimations() {
    // Hero title animation - redesigned
    gsap.timeline()
        .fromTo('.hero-name', {
            opacity: 0,
            y: 100,
            scale: 0.8
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out'
        })
        .fromTo('.hero-role', {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6')
        .fromTo('.hero-description', {
            opacity: 0,
            y: 30
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4')
        .fromTo('.hero-buttons', {
            opacity: 0,
            y: 30
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4');

    // Parallax effect for hero background
    gsap.to('.hero-image', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    // Simplified section reveal animations for better performance
    gsap.utils.toArray('section').forEach((section, index) => {
        if (index === 0) return; // Skip hero section
        
        gsap.fromTo(section, 
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Simplified stats animation
    gsap.fromTo('.stat-number', 
        { scale: 0.8, opacity: 0 },
        {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.about-stats',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Simplified timeline animation
    gsap.fromTo('.timeline-item', 
        { 
            opacity: 0,
            y: 30
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Simplified project cards animation
    gsap.fromTo('.project-card', 
        { 
            opacity: 0,
            y: 30
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Enhanced skills animation with aesthetic effects
    gsap.fromTo('.skill-item', 
        { 
            opacity: 0,
            scale: 0.6,
            y: 30,
            rotationX: 15
        },
        {
            opacity: 1,
            scale: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: 'back.out(1.2)',
            stagger: {
                amount: 0.6,
                from: 'random'
            },
            scrollTrigger: {
                trigger: '.skills-list',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Removed floating animations for better performance
    // Add subtle hover micro-interactions only
    gsap.utils.toArray('.skill-item').forEach((item) => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Simplified achievement cards animation
    gsap.fromTo('.achievement-card', 
        { 
            opacity: 0,
            y: 30
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.achievements-grid',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Simplified contact items animation
    gsap.fromTo('.contact-item', 
        { 
            opacity: 0,
            y: 30
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.contact-info',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Removed floating animation for better performance

    // Simplified section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title, 
            { 
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Removed continuous rotation animation for better performance
}

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    // Mobile hamburger menu toggle
    if (hamburgerMenu && navMenu) {
        // Ensure hamburger menu is visible on mobile
        if (window.innerWidth <= 768) {
            hamburgerMenu.style.display = 'flex';
            hamburgerMenu.style.visibility = 'visible';
            hamburgerMenu.style.opacity = '1';
        }
        
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when clicking on nav links
    navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Navbar background on scroll
    ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        toggleClass: {className: 'scrolled', targets: navbar}
    });

    // Update active link on scroll
    ScrollTrigger.batch('section', {
        onEnter: (elements) => {
            const currentSection = elements[0];
            const sectionId = currentSection.getAttribute('id');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Smooth scrolling for all links
function initSmoothScrolling() {
    // Smooth scroll for all anchor links (navigation and buttons)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            console.log('Clicked link:', targetId, 'Target element:', target); // Debug log
            
            if (target) {
                // Try GSAP ScrollTo first
                try {
                gsap.to(window, {
                        duration: 1.2,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                        ease: 'power3.inOut',
                        onComplete: () => {
                            console.log('Scroll completed to:', targetId);
                        }
                    });
                } catch (error) {
                    // Fallback to native smooth scroll
                    console.log('Using fallback smooth scroll');
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else {
                console.error('Target element not found for:', targetId);
            }
        });
    });
}

// Optimized mouse cursor effects with throttling
let mouseTimeout;
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
                duration: 0.2,
            ease: 'power2.out'
        });
        }, 16); // ~60fps throttling
    }
});

// Optimized Intersection Observer for performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Unobserve after animation to reduce overhead
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Only observe elements that need it
document.querySelectorAll('.project-card, .achievement-card, .timeline-item').forEach(el => {
    observer.observe(el);
});

// Enhanced custom cursor with aesthetic effects
document.addEventListener('DOMContentLoaded', () => {
    // Create main cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    `;
    document.body.appendChild(cursor);

    // Create cursor trail
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(trail);

    // Create glow effect
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
        position: fixed;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9997;
        transition: all 0.5s ease;
    `;
    document.body.appendChild(glow);

    // Mouse movement tracking
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;

        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        trail.style.left = trailX - 20 + 'px';
        trail.style.top = trailY - 20 + 'px';
        
        glow.style.left = mouseX - 50 + 'px';
        glow.style.top = mouseY - 50 + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Enhanced cursor effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .skill-item, .project-card, .achievement-card, .contact-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'rgba(255, 255, 255, 0.9)';
            cursor.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.8)';
            trail.style.transform = 'scale(1.2)';
            trail.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)';
            glow.style.transform = 'scale(1.3)';
            glow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(255, 255, 255, 0.8)';
            cursor.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
            trail.style.transform = 'scale(1)';
            trail.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)';
            glow.style.transform = 'scale(1)';
            glow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)';
        });
    });

    // Special cursor effects for different element types
    const buttons = document.querySelectorAll('.btn, button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            cursor.style.borderRadius = '4px';
            cursor.style.transform = 'scale(1.2) rotate(45deg)';
        });
        button.addEventListener('mouseleave', () => {
            cursor.style.borderRadius = '50%';
            cursor.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    const links = document.querySelectorAll('a, .nav-link');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.borderRadius = '2px';
            cursor.style.transform = 'scale(1.3)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.borderRadius = '50%';
            cursor.style.transform = 'scale(1)';
        });
    });

    const cards = document.querySelectorAll('.project-card, .achievement-card, .timeline-content');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'rgba(255, 255, 255, 0.3)';
            cursor.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.6)';
        });
        card.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(255, 255, 255, 0.8)';
            cursor.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
        });
    });

    // Hide cursor on mobile and add touch interactions
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        trail.style.display = 'none';
        glow.style.display = 'none';
        
        // Add mobile touch interactions
        const touchElements = document.querySelectorAll('.project-card, .achievement-card, .timeline-content, .contact-item, .skill-item');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
                element.style.transition = 'transform 0.1s ease';
            });
            
            element.addEventListener('touchend', () => {
                element.style.transform = 'scale(1)';
                element.style.transition = 'transform 0.3s ease';
            });
        });
    }
});

// Performance optimization
ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    ignoreMobileResize: true,
    syncInterval: 16
});

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(0.1);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
