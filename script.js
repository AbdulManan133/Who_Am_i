// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const skillBars = document.querySelectorAll('.skill-progress');
const particlesContainer = document.getElementById('particles-container');

// Typing Animation
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Particle System
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, #6366f1, #8b5cf6);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
        `;

        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        // Animation properties
        particle.dx = (Math.random() - 0.5) * 2;
        particle.dy = (Math.random() - 0.5) * 2;
        particle.life = Math.random() * 100;
        particle.maxLife = 100;

        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    animate() {
        this.particles.forEach((particle, index) => {
            particle.life--;
            
            if (particle.life <= 0) {
                particle.remove();
                this.particles.splice(index, 1);
                this.createParticle();
                return;
            }

            // Update position
            const currentX = parseFloat(particle.style.left);
            const currentY = parseFloat(particle.style.top);
            
            particle.style.left = (currentX + particle.dx) + 'px';
            particle.style.top = (currentY + particle.dy) + 'px';

            // Update opacity
            const opacity = particle.life / particle.maxLife;
            particle.style.opacity = opacity * 0.6;

            // Boundary check
            if (currentX < 0 || currentX > window.innerWidth || 
                currentY < 0 || currentY > window.innerHeight) {
                particle.life = 0;
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const animation = element.getAttribute('data-animation');
            const delay = element.getAttribute('data-delay') || 0;
            
            // Apply animation with delay
            setTimeout(() => {
                if (animation) {
                    element.classList.add(animation);
                } else {
                    element.classList.add('animate');
                }
                
                // Animate skill bars
                if (element.classList.contains('skill-progress')) {
                    const width = element.getAttribute('data-width');
                    setTimeout(() => {
                        element.style.width = width;
                        element.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.4)';
                    }, 200);
                }
            }, parseInt(delay));
        }
    });
}, observerOptions);

// Smooth scrolling for navigation links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const navHeight = navbar.offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Mouse parallax effect
function initParallax() {
    const elements = document.querySelectorAll('.floating-icon');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        elements.forEach((element, index) => {
            const speed = (index + 1) * 0.02;
            const x = (mouseX - 0.5) * speed * 100;
            const y = (mouseY - 0.5) * speed * 100;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Navbar scroll effect
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Advanced scroll animations
function initScrollAnimations() {
    // Define different animation types for different elements
    const animationConfig = [
        { selector: '.section-header', animation: 'animate-slide-up-reveal', delay: 0 },
        { selector: '.text-block', animation: 'animate-slide-right', delay: 100 },
        { selector: '.skill-category:nth-child(odd)', animation: 'animate-liquid-morph', delay: 200 },
        { selector: '.skill-category:nth-child(even)', animation: 'animate-crystal-grow', delay: 300 },
        { selector: '.project-card:nth-child(1)', animation: 'animate-flip-in-y', delay: 100 },
        { selector: '.project-card:nth-child(2)', animation: 'animate-liquid-morph', delay: 200 },
        { selector: '.project-card:nth-child(3)', animation: 'animate-crystal-grow', delay: 300 },
        { selector: '.contact-card:nth-child(1)', animation: 'animate-morph-in', delay: 100 },
        { selector: '.contact-card:nth-child(2)', animation: 'animate-elastic', delay: 200 },
        { selector: '.contact-card:nth-child(3)', animation: 'animate-crystal-grow', delay: 300 },
        { selector: '.contact-card:nth-child(4)', animation: 'animate-liquid-morph', delay: 400 },
        { selector: '.focus-item:nth-child(1)', animation: 'animate-zoom-in', delay: 100 },
        { selector: '.focus-item:nth-child(2)', animation: 'animate-float-in', delay: 200 },
        { selector: '.focus-item:nth-child(3)', animation: 'animate-slide-up-reveal', delay: 300 },
        { selector: '.skill-progress', animation: 'animate-slide-right', delay: 500 }
    ];

    // Create intersection observer for each animation type
    animationConfig.forEach(config => {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach((element, index) => {
            observer.observe(element);
            element.setAttribute('data-animation', config.animation);
            element.setAttribute('data-delay', config.delay + (index * 100));
        });
    });
}

// Enhanced button effects with magnetic interaction
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn, .contact-link');
    
    buttons.forEach(button => {
        // Magnetic effect
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.1s ease-out';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.3s ease-out';
            this.style.transform = 'translate(0px, 0px) scale(1)';
        });
        
        // Add ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out forwards;
                pointer-events: none;
            `;
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Contact card interactions
function initContactCards() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
        });
    });
}

// Enhanced Project Card Interactions
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        // Add special glow effect on hover
        card.addEventListener('mouseenter', function() {
            this.classList.add('animate-neon-glow');
            
            // Add particle explosion effect
            createParticleExplosion(this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('animate-neon-glow');
        });
        
        // Add click effect
        card.addEventListener('click', function() {
            this.classList.add('animate-hologram');
            setTimeout(() => {
                this.classList.remove('animate-hologram');
            }, 3000);
        });
    });
}

// Create particle explosion effect
function createParticleExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        
        document.body.appendChild(particle);
        
        // Animate particle
        const angle = (i / 8) * Math.PI * 2;
        const distance = 100;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

// Skill item hover effects
function initSkillHovers() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const progressBar = this.querySelector('.skill-progress');
            progressBar.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.5)';
            progressBar.style.transform = 'scaleY(1.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            const progressBar = this.querySelector('.skill-progress');
            progressBar.style.boxShadow = 'none';
            progressBar.style.transform = 'scaleY(1)';
        });
    });
}

// Scroll progress indicator
function initScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollIndicator.style.width = `${scrollPercent}%`;
    });
}

// Add cursor trail effect (back to original blue style)
function initCursorTrail() {
    const trail = [];
    const maxTrailLength = 20;
    
    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        if (trail.length > maxTrailLength) {
            trail.shift();
        }
        
        // Remove old trail elements
        document.querySelectorAll('.cursor-dot').forEach(dot => {
            if (Date.now() - parseInt(dot.dataset.time) > 500) {
                dot.remove();
            }
        });
        
        // Create new trail dot
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        dot.dataset.time = Date.now();
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX - 2}px;
            top: ${e.clientY - 2}px;
            opacity: 0.6;
            animation: trailFade 0.5s ease-out forwards;
        `;
        document.body.appendChild(dot);
    });
}



// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize typing animation
    const typedElement = document.querySelector('.typed-text');
    if (typedElement) {
        const words = [
            'Expert Web Developer',
            'Automation Expert',
            'AI Trainer'
        ];
        new TypeWriter(typedElement, words, 2000);
    }

    // Initialize particle system
    if (particlesContainer) {
        new ParticleSystem(particlesContainer);
    }

    // Initialize all interactions
    initParallax();
    initScrollAnimations();
    initButtonEffects();
    initContactCards();
    initProjectCards();
    initSkillHovers();
    initScrollIndicator();
    initCursorTrail();

    // Event listeners
    window.addEventListener('scroll', handleNavbarScroll);
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
            closeMobileMenu();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Prevent scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Add loading animation completion
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Page visibility API for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Resize handler
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    closeMobileMenu();
    
    // Recalculate particle positions
    if (window.innerWidth > 768) {
        document.body.style.overflow = 'auto';
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll handler
window.addEventListener('scroll', throttle(handleNavbarScroll, 10));

// Add custom cursor effect
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Easter egg: Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length) {
        if (konamiCode.every((code, index) => code === konamiSequence[index])) {
            // Trigger special animation
            document.body.classList.add('konami-activated');
            
            // Show special message
            const message = document.createElement('div');
            message.innerHTML = '🤖 Ultron Protocol Activated! 🚀';
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 40px;
                border-radius: 15px;
                font-size: 1.5rem;
                font-weight: bold;
                z-index: 10000;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                animation: pulse 1s ease-in-out;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
                document.body.classList.remove('konami-activated');
                konamiCode = [];
            }, 3000);
        }
    }
});

// Add some extra CSS for the Konami code effect
const konamiStyles = document.createElement('style');
konamiStyles.textContent = `
    .konami-activated {
        animation: rainbow 2s ease-in-out infinite;
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(180deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(konamiStyles);
