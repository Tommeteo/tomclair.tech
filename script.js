// ===== MOBILE LOADING SCREEN =====
function initMobileLoading() {
    // Skip loading screen completely - initialize immediately
    initAllContent();
}

function initAllContent() {
    initNavbarScroll();
    initMobileMenu();
    initFAQ();
    initContactForm();
    initScrollEffects();
    initAnimations();
}

// ===== NAVBAR SCROLL =====
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.background = 'rgba(10, 14, 39, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(10, 14, 39, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
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
    
    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
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

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const button = form.querySelector('button');
        const originalHTML = button.innerHTML;
        
        // Récupérer les données du formulaire
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Créer le mailto link direct vers tom16112008@gmail.com
        const mailtoSubject = encodeURIComponent(`[Jarvis Site] ${subject}`);
        const mailtoBody = encodeURIComponent(
            `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nEnvoyé depuis le site tomclair.tech`
        );
        const mailtoLink = `mailto:tom16112008@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        
        // Feedback visuel
        button.innerHTML = '<i class="fa-solid fa-envelope"></i> <span>Ouverture du client email...</span>';
        button.style.background = 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)';
        button.disabled = true;
        
        // Ouvrir le client email
        setTimeout(() => {
            window.location.href = mailtoLink;
            
            // Feedback de confirmation
            setTimeout(() => {
                button.innerHTML = '<i class="fa-solid fa-check"></i> <span>Email prêt à envoyer!</span>';
                button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                
                // Réinitialiser le formulaire
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.background = '';
                    button.disabled = false;
                    form.reset();
                }, 2000);
            }, 1000);
        }, 500);
    });
}


// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Smooth scroll for navigation links
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
        });
    });
    
    // Reveal animations on scroll
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
    
    // Observe elements for animation
    document.querySelectorAll('.text-block, .feature-card, .step-card, .tech-item, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Hero orb animations
    const orbCore = document.querySelector('.orb-core');
    if (orbCore) {
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            orbCore.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000);
    }
    
    // Floating animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        stat.style.animation = 'float 3s ease-in-out infinite';
        stat.style.animationDelay = Math.random() * 2 + 's';
    });
    
    // Download button functionality with 10-second delay
    const downloadBtn = document.querySelector('.btn-primary[href*="JARVIS_Setup_v3.5.exe"]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const originalHTML = this.innerHTML;
            const originalBg = this.style.background;
            let timeLeft = 10;
            
            // Disable button during countdown
            this.disabled = true;
            this.style.cursor = 'not-allowed';
            
            // Start countdown
            const updateCountdown = () => {
                this.innerHTML = `<i class="fa-solid fa-clock"></i> <span>Téléchargement dans ${timeLeft}s...</span>`;
                this.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    
                    // Start actual download
                    this.innerHTML = '<i class="fa-solid fa-download"></i> <span>Téléchargement en cours...</span>';
                    this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    
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
                    
                    // Show completion
                    setTimeout(() => {
                        this.innerHTML = '<i class="fa-solid fa-check"></i> <span>Téléchargé !</span>';
                        this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                        
                        // Reset button after completion
                        setTimeout(() => {
                            this.innerHTML = originalHTML;
                            this.style.background = originalBg;
                            this.disabled = false;
                            this.style.cursor = 'pointer';
                        }, 3000);
                    }, 1500);
                } else {
                    timeLeft--;
                }
            };
            
            // Start countdown immediately
            updateCountdown();
            const countdownInterval = setInterval(updateCountdown, 1000);
        });
    }
}

// ===== MAIN INITIALIZATION =====
window.addEventListener('load', () => {
    initMobileLoading();
});

// ===== RESIZE HANDLER =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Re-initialize on resize for responsive behavior
        if (window.innerWidth > 768) {
            const loadingScreen = document.getElementById('mobileLoading');
            if (loadingScreen && loadingScreen.style.display === 'flex') {
                loadingScreen.style.display = 'none';
                initAllContent();
            }
        }
    }, 250);
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== CONSOLE LOGO =====
console.log('%c Jarvis Assistant %c tomclair.tech', 
    'color: #0066ff; font-size: 20px; font-weight: bold;', 
    'color: #00d4ff; font-size: 16px;');
