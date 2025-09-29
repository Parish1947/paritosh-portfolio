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
    // Hero title animation
    gsap.timeline()
        .to('.title-line', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        })
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4')
        .to('.hero-buttons', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4');

    // Removed parallax effect for better performance

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

    // Add subtle floating animation to skills
    gsap.utils.toArray('.skill-item').forEach((item, index) => {
        gsap.to(item, {
            y: -3,
            duration: 2 + (index * 0.1),
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1,
            delay: index * 0.1
        });

        // Add hover micro-interactions
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.05,
                rotation: Math.random() * 4 - 2, // Random rotation between -2 and 2 degrees
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                rotation: 0,
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

// Add custom cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(0, 122, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);

    // Hide cursor on mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
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
