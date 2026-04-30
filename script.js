// ===== MAIN INITIALIZATION =====
window.addEventListener('load', () => {
    initFAQ();
    initContactForm();
    initTypingEffect();
    initScrollProgress();
    initBackToTop();
    initNavbarScroll();
    initMobileMenu();
});

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;
    
    const texts = [
        "Bienvenue sur Jarvis - Votre assistant intelligent",
        "Automatisez votre quotidien avec l'IA",
        "Une technologie de pointe à votre service"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.innerHTML = currentText.substring(0, charIndex - 1) + '<span class="typing-cursor">|</span>';
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.innerHTML = currentText.substring(0, charIndex + 1) + '<span class="typing-cursor">|</span>';
            charIndex++;
            typingSpeed = 80;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Active link update on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ===== FAQ LOGIC =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
}

// ===== CONTACT FORM LOGIC =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const button = form.querySelector('button');
        const originalText = button.innerHTML;
        
        // Change button text
        button.innerHTML = `
            <span>ENVOI EN COURS...</span>
            <div class="spinner"></div>
        `;
        button.disabled = true;
        
        const formData = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                button.innerHTML = "✓ MESSAGE ENVOYÉ !";
                button.style.background = "#10b981";
                form.reset();
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = "";
                    button.disabled = false;
                }, 3000);
            } else {
                throw new Error("Server error");
            }
        } catch (error) {
            button.innerHTML = "ERREUR - RÉESSAYEZ";
            button.style.background = "#ff5f56";
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = "";
                button.disabled = false;
            }, 3000);
        }
    });
}

// ===== REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            el.classList.add('active');
        }
    });
};
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== NEURAL BACKGROUND ANIMATION =====
const canvas = document.getElementById('neuralBg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function initNeuralBg() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5
            });
        }
    }
    
    function animateNeuralBg() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 210, 255, 0.6)';
            ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 210, 255, ${0.1 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(animateNeuralBg);
    }
    
    window.addEventListener('resize', initNeuralBg);
    initNeuralBg();
    animateNeuralBg();
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu if open
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.querySelector('.nav-links');
        if (navToggle && navLinks) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// ===== MOBILE MENU =====
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}
