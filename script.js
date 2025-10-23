// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Simple initialization on window load
window.addEventListener('load', () => {
    console.log('Window loaded - initializing everything');
    
    // ALWAYS clear session storage for testing (remove this line later if you want)
    sessionStorage.removeItem('gameCompleted');
    console.log('Session storage cleared for fresh start');
    
    // Initialize game first
    setTimeout(() => {
        initTargetShootingGame();
    }, 200);
});

// Terminal Typing Challenge
function initTargetShootingGame() {
    console.log('Initializing terminal typing challenge...');
    
    const gameOverlay = document.getElementById('game-overlay');
    const terminalInput = document.getElementById('terminal-input');
    const challengeText = document.getElementById('challenge-text');
    const hintText = document.getElementById('hint-text');
    const skipBtn = document.getElementById('skip-game');
    
    // Check if elements exist
    if (!gameOverlay || !terminalInput || !challengeText || !hintText || !skipBtn) {
        console.error('Terminal elements not found');
        return;
    }
    
    console.log('All terminal elements found');
    
    const challenges = [
        'ACCESS PORTFOLIO',
        'UNLOCK PORTFOLIO',
        'ENTER PORTFOLIO',
        'OPEN PORTFOLIO',
        'SHOW PORTFOLIO'
    ];
    
    const currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    challengeText.textContent = currentChallenge;
    
    // Check if user has played before (session storage)
    if (sessionStorage.getItem('gameCompleted')) {
        console.log('Game already completed in this session, skipping...');
        endGame();
        return;
    }
    
    console.log('Showing terminal overlay...');
    
    // Hide custom cursor and particles during game
    const cursor = document.querySelector('.custom-cursor');
    const particles = document.querySelector('.cursor-particles');
    if (cursor) cursor.style.display = 'none';
    if (particles) particles.style.display = 'none';
    console.log('Custom cursor hidden for game');
    
    // Force show game overlay
    gameOverlay.style.display = 'flex';
    gameOverlay.style.visibility = 'visible';
    gameOverlay.style.opacity = '1';
    gameOverlay.classList.remove('hidden');
    
    // Focus on input (with mobile handling)
    setTimeout(() => {
        terminalInput.focus();
        
        // On mobile, ensure keyboard appears
        if (window.innerWidth <= 768) {
            terminalInput.click();
        }
    }, 300);
    
    console.log('Terminal overlay should now be visible');
    
    // Handle typing
    terminalInput.addEventListener('input', (e) => {
        const typed = e.target.value.toUpperCase();
        const target = currentChallenge;
        
        // Check if typed text matches the beginning of challenge
        if (target.startsWith(typed)) {
            hintText.textContent = '';
            hintText.style.color = '#4ec9b0';
            
            // Check if complete
            if (typed === target) {
                winGame();
            }
        } else {
            hintText.textContent = '❌ Incorrect! Keep typing...';
            hintText.style.color = '#f48771';
        }
    });
    
    // Win game
    function winGame() {
        terminalInput.disabled = true;
        hintText.textContent = '✓ Access granted! Loading portfolio...';
        hintText.style.color = '#4ec9b0';
        
        // Mark as completed in session
        sessionStorage.setItem('gameCompleted', 'true');
        
        // Fade out and enter portfolio
        setTimeout(() => {
            endGame();
        }, 1500);
    }
    
    // End game and show portfolio
    function endGame() {
        gameOverlay.classList.add('hidden');
        setTimeout(() => {
            gameOverlay.style.display = 'none';
            console.log('Game ended, showing portfolio');
            
            // Show custom cursor and particles after game
            let cursor = document.querySelector('.custom-cursor');
            let particles = document.querySelector('.cursor-particles');
            
            if (!cursor || !particles) {
                console.log('Custom cursor not found, initializing...');
                initCustomCursor();
            } else {
                cursor.style.display = 'block';
                particles.style.display = 'block';
                console.log('Custom cursor shown');
            }
        }, 500);
    }
    
    // Skip button (ESC key or click)
    skipBtn.addEventListener('click', () => {
        sessionStorage.setItem('gameCompleted', 'true');
        endGame();
    });
    
    // ESC key to skip
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            sessionStorage.setItem('gameCompleted', 'true');
            endGame();
            document.removeEventListener('keydown', escHandler);
        }
    });
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

// Particle Background System - DISABLED for better cursor performance
function initParticleSystem() {
    console.log('Particle system disabled for optimal cursor performance');
    return; // Disabled entirely
    
    const container = document.getElementById('particles-container');
    const particles = [];
    const particleCount = 30; // Reduced from 50 to 30 for better performance
    
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
    
    // Mouse interaction - THROTTLED for performance
    let mouseX = 0;
    let mouseY = 0;
    let isThrottled = false;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Throttle mouse interaction to every 100ms instead of every frame
        if (isThrottled) return;
        isThrottled = true;
        
        setTimeout(() => {
            isThrottled = false;
            
            // Only check particles in hero section
            const heroSection = document.querySelector('.hero');
            if (!heroSection) return;
            
            const heroRect = heroSection.getBoundingClientRect();
            if (mouseY < heroRect.top || mouseY > heroRect.bottom) return;
            
            particles.forEach((particle) => {
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
        }, 100);
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

// Custom Cursor - GPU Accelerated with Transform
function initCustomCursor() {
    // Disable on mobile
    if (window.innerWidth <= 768) {
        console.log('Mobile device - custom cursor disabled');
        return;
    }
    
    // Check if already initialized
    if (document.querySelector('.custom-cursor')) {
        console.log('Custom cursor already exists');
        return;
    }
    
    console.log('Creating GPU-accelerated custom cursor...');
    
    // Create main cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        background: #fafafa;
        border: 2px solid #3a3a3a;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
        will-change: transform;
        transform: translate3d(0, 0, 0);
    `;
    document.body.appendChild(cursor);
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'cursor-particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
    `;
    document.body.appendChild(particleContainer);
    
    console.log('GPU-accelerated cursor created');
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    const style = document.createElement('style');
    style.textContent = `
        body * { cursor: none !important; }
        @media (max-width: 768px) {
            body, body * { cursor: auto !important; }
        }
        .cursor-particle {
            position: fixed;
            top: 0;
            left: 0;
            width: 6px;
            height: 6px;
            background: rgba(250, 250, 250, 0.7);
            border-radius: 50%;
            pointer-events: none;
            will-change: transform, opacity;
            animation: particleFade 0.6s ease-out forwards;
        }
        @keyframes particleFade {
            0% { 
                opacity: 1; 
                transform: translate3d(-50%, -50%, 0) scale(1);
            }
            100% { 
                opacity: 0; 
                transform: translate3d(-50%, -50%, 0) scale(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Track mouse position - NO interpolation for instant response
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isHovering = false;
    
    // Update mouse position and cursor instantly using transform
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Use transform3d for GPU acceleration - INSTANT update
        cursor.style.transform = `translate3d(${mouseX - 10}px, ${mouseY - 10}px, 0)`;
    }, { passive: true });
    
    // Particle trail system - simplified
    let particleTimer = 0;
    const particleInterval = 3; // Create particle every 3 frames for less overhead
    let frameCount = 0;
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        
        // Randomize particle slightly
        const offsetX = (Math.random() - 0.5) * 8;
        const offsetY = (Math.random() - 0.5) * 8;
        particle.style.transform = `translate3d(${x + offsetX}px, ${y + offsetY}px, 0)`;
        
        particleContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 600);
    }
    
    // Particle creation loop - separate from cursor movement
    function animateParticles() {
        frameCount++;
        if (frameCount >= particleInterval) {
            createParticle(mouseX, mouseY);
            frameCount = 0;
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
    
    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .achievement-card, .contact-item, .nav-link');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            cursor.style.width = '28px';
            cursor.style.height = '28px';
            cursor.style.background = '#3a3a3a';
            cursor.style.borderColor = '#fafafa';
            cursor.style.boxShadow = '0 0 20px rgba(58, 58, 58, 0.8)';
            cursor.style.transition = 'width 0.2s ease, height 0.2s ease, background 0.2s ease, border-color 0.2s ease';
        });
        
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.background = '#fafafa';
            cursor.style.borderColor = '#3a3a3a';
            cursor.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.6)';
        });
    });
    
    console.log('GPU-accelerated cursor initialized! 🚀');
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

// Hero Section Animations - Simplified for performance
function initAnimations() {
    // Simple fade-in for hero elements (no heavy transforms)
    gsap.timeline()
        .fromTo('.hero-name', {
            opacity: 0
        }, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        })
        .fromTo('.hero-role', {
            opacity: 0
        }, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4')
        .fromTo('.hero-description', {
            opacity: 0
        }, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.3')
        .fromTo('.hero-buttons', {
            opacity: 0
        }, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.3');

    // Parallax removed for better cursor performance

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

        // Close menu when clicking on nav links - INSTANT
    navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close menu instantly
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }, { passive: true }); // Passive for better performance
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
    // Instant, fast scroll for all anchor links (navigation and buttons)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation(); // Stop event bubbling for instant response
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Immediate GSAP scroll - no delay
                requestAnimationFrame(() => {
                    try {
                gsap.to(window, {
                            duration: 0.4,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                            ease: 'power2.out',
                            immediateRender: true // Start immediately
                        });
                    } catch (error) {
                        // Instant fallback
                        target.scrollIntoView({
                            behavior: 'auto',
                            block: 'start'
                        });
                    }
                });
            }
        }, { passive: false }); // Not passive so preventDefault works
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
// Duplicate cursor code removed - using initCustomCursor() function instead

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
