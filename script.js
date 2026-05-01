// ===== MAIN INITIALIZATION =====
window.addEventListener('load', () => {
    initTypingEffect();
    initScrollProgress();
    initBackToTop();
    initNavbarScroll();
    initMobileMenu();
    initFAQ();
    initContactForm();
initMatrixMode();
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
        
        button.innerHTML = '<span>ENVOI EN COURS...</span><div class="spinner"></div>';
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
    
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// ===== MATRIX MODE =====
function initMatrixMode() {
    const canvas = document.getElementById('matrixCanvas');
    const toggleBtn = document.getElementById('matrixToggle');
    
    if (!canvas || !toggleBtn) return;
    
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let isActive = false;
    
<<<<<<< HEAD
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const chars = matrixChars.split('');
    
=======
    // Caractères pour l'effet Matrix (symboles, chiffres, lettres)
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const chars = matrixChars.split('');
    
    // Configuration
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
    const fontSize = 14;
    let columns = 0;
    let drops = [];
    
<<<<<<< HEAD
=======
    // Redimensionner le canvas
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    }
    
<<<<<<< HEAD
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
=======
    // Dessiner l'effet Matrix
    function drawMatrix() {
        // Fond semi-transparent pour effet de traînée
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Couleur verte Matrix
        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            // Caractère aléatoire
            const char = chars[Math.floor(Math.random() * chars.length)];
            
            // Dessiner le caractère
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            // Réinitialiser la goutte si elle sort de l'écran ou aléatoirement
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
<<<<<<< HEAD
=======
            // Faire descendre la goutte
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
            drops[i]++;
        }
    }
    
<<<<<<< HEAD
=======
    // Boucle d'animation
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
    function animate() {
        if (!isActive) return;
        drawMatrix();
        animationId = requestAnimationFrame(animate);
    }
    
<<<<<<< HEAD
=======
    // Activer/Désactiver le mode Matrix
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
    function toggleMatrix() {
        isActive = !isActive;
        
        if (isActive) {
<<<<<<< HEAD
=======
            // Activer
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
            canvas.classList.add('active');
            toggleBtn.classList.add('active');
            document.body.classList.add('matrix-active');
            resizeCanvas();
            animate();
        } else {
<<<<<<< HEAD
=======
            // Désactiver
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
            canvas.classList.remove('active');
            toggleBtn.classList.remove('active');
            document.body.classList.remove('matrix-active');
            
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            
<<<<<<< HEAD
=======
            // Nettoyer le canvas
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
<<<<<<< HEAD
=======
    // Événements
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMatrix();
    });
    
<<<<<<< HEAD
=======
    // Redimensionnement
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
    window.addEventListener('resize', () => {
        if (isActive) {
            resizeCanvas();
        }
    });
    
<<<<<<< HEAD
=======
    // Touche Échap pour désactiver
>>>>>>> fe83ffc247c44f45d97af55897074314072a4772
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isActive) {
            toggleMatrix();
        }
    });
}
