// ===== MOBILE LOADING SCREEN =====
function initMobileLoading() {
    // Only show loading screen on mobile
    if (window.innerWidth > 768) {
        initRevealAnimation();
        return;
    }
    
    const loadingScreen = document.getElementById('mobileLoading');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const timerElement = document.getElementById('loadingTimer');
    
    if (!loadingScreen) return;
    
    let timeLeft = 10;
    let progress = 0;
    
    const messages = [
        "Initialisation...",
        "Chargement des composants...",
        "Configuration de Jarvis...",
        "Préparation de l'interface...",
        "Finalisation..."
    ];
    
    const updateProgress = () => {
        progress += 10;
        progressBar.style.width = progress + '%';
        progressText.textContent = messages[Math.floor(progress / 20)];
    };
    
    const updateTimer = () => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            clearInterval(progressInterval);
            
            // Hide loading screen
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                // Initialize all content immediately
                initAllContent();
            }, 500);
        }
    };
    
    // Start timers
    const timerInterval = setInterval(updateTimer, 1000);
    const progressInterval = setInterval(updateProgress, 1000);
    
    // Initial progress
    updateProgress();
}

function initAllContent() {
    initTypingEffect();
    initScrollProgress();
    initBackToTop();
    initNavbarScroll();
    initMobileMenu();
    initFAQ();
    initContactForm();
    initDownloadButton();
    
    // Force all elements to be visible on mobile
    const allElements = document.querySelectorAll('.reveal, .hero-content, .features-grid, .install-grid, .tech-grid, .faq-container, .contact-form, .section-header, .feature-card, .install-card, .tech-card, .faq-item, .trouble-item');
    allElements.forEach(element => {
        element.classList.add('active');
    });
}

// ===== MAIN INITIALIZATION =====
window.addEventListener('load', () => {
    initMobileLoading();
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
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
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

// ===== FAQ FUNCTIONALITY =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
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
        
        button.innerHTML = '<span>ENVOI EN COURS...</span>';
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

// ===== MOBILE MENU =====
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}


// ===== REVEAL ANIMATION =====
function initRevealAnimation() {
    // Skip reveal animations on mobile for instant display and fast updates
    if (window.innerWidth <= 768) {
        // Force immediate display on mobile
        const allElements = document.querySelectorAll('.reveal, .hero-content, .features-grid, .install-grid, .tech-grid, .faq-container, .contact-form, .section-header, .feature-card, .install-card, .tech-card, .faq-item, .trouble-item');
        allElements.forEach(element => {
            element.classList.add('active');
        });
        return;
    }
    
    // Desktop: Keep animations for better UX
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    
    // Reveal hero content immediately on desktop
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) heroContent.classList.add('active');
    }, 100);
    
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
}

// ===== NEURAL BACKGROUND ANIMATION =====
const neuralCanvas = document.getElementById('neuralBg');
if (neuralCanvas) {
    const ctx = neuralCanvas.getContext('2d');
    
    let particles = [];
    
    function initNeuralBg() {
        neuralCanvas.width = window.innerWidth;
        neuralCanvas.height = window.innerHeight;
        particles = [];
        const particleCount = Math.min(100, Math.floor((neuralCanvas.width * neuralCanvas.height) / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * neuralCanvas.width,
                y: Math.random() * neuralCanvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5
            });
        }
    }
    
    function animateNeuralBg() {
        ctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
        
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > neuralCanvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > neuralCanvas.height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 210, 255, 0.6)';
            ctx.fill();
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = 'rgba(0, 210, 255, ' + (0.1 * (1 - dist / 150)) + ')';
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

// ===== COPY CODE FUNCTIONALITY =====
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code');
    const textArea = document.createElement('textarea');
    textArea.value = code.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Visual feedback
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-check"></i>';
    button.style.color = '#10b981';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.color = '';
    }, 2000);
}

// ===== DOWNLOAD BUTTON FUNCTIONALITY =====
function initDownloadButton() {
    const downloadBtn = document.querySelector('.btn-download');
    if (!downloadBtn) return;
    
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create download link
        const downloadUrl = 'JARVIS_Setup_v3.5.exe';
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'JARVIS_Setup_v3.5.exe';
        link.target = '_blank';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Visual feedback
        const originalHTML = this.innerHTML;
        this.innerHTML = '<span>Téléchargement en cours...</span><i class="fa-solid fa-spinner fa-spin"></i>';
        this.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        
        setTimeout(() => {
            this.innerHTML = '<span>✓ Téléchargé!</span><i class="fa-solid fa-check"></i>';
            this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.background = '';
            }, 2000);
        }, 1500);
    });
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
