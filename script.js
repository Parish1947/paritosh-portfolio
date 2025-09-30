// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initNavigation();
    initSmoothScrolling();
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

    // Hide cursor on mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        trail.style.display = 'none';
        glow.style.display = 'none';
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
