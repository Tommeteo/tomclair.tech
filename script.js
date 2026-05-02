// ===== MOBILE LOADING SCREEN =====
function initMobileLoading() {
    // Initialize all content directly - no email capture
    initAllContent();
}

function showEmailCapturePage() {
    // Hide all content and show email capture
    document.body.innerHTML = `
        <div class="email-capture-container">
            <div class="email-capture-content">
                <div class="email-capture-logo">
                    <span class="logo-text">tomclair</span><span class="logo-dot">.tech</span>
                </div>
                <div class="email-capture-title">Jarvis</div>
                <div class="email-capture-subtitle">Votre Assistant Intelligent</div>
                
                <div class="email-capture-message">
                    <h2>� Restez connecté aux nouveautés!</h2>
                    <p>Inscrivez-vous pour recevoir les dernières mises à jour de Jarvis directement sur votre mobile.</p>
                    <p>Soyez le premier à découvrir les nouvelles fonctionnalités!</p>
                </div>
                
                <div class="email-capture-form">
                    <h3>� Inscrivez votre email</h3>
                    <form id="emailCaptureForm">
                        <div class="form-group">
                            <input type="email" id="userEmail" placeholder="votre@email.com" required>
                        </div>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="agreeTerms" required>
                                <span class="checkmark"></span>
                                J'accepte de recevoir les nouveautés Jarvis
                            </label>
                        </div>
                        <button type="submit" class="submit-btn">
                            <i class="fa-solid fa-paper-plane"></i>
                            <span>S'inscrire aux nouveautés</span>
                        </button>
                    </form>
                </div>
                
                <div class="email-capture-benefits">
                    <h3>✨ Ce que vous recevrez:</h3>
                    <ul>
                        <li>📱 Notifications push des mises à jour</li>
                        <li>🎉 Alertes des nouvelles fonctionnalités</li>
                        <li>⚡ Informations sur les améliorations</li>
                        <li>🔧 Accès prioritaire aux nouveautés</li>
                    </ul>
                </div>
                
                <div class="skip-option">
                    <button id="skipBtn" class="skip-btn">
                        <i class="fa-solid fa-arrow-right"></i>
                        Continuer sans s'inscrire
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Initialize email capture
    initEmailCapture();
    
    // Add email capture styles
    addEmailCaptureStyles();
}

function initEmailCapture() {
    const form = document.getElementById('emailCaptureForm');
    const skipBtn = document.getElementById('skipBtn');
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('userEmail').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            if (!agreeTerms) {
                alert('Veuillez accepter de recevoir les nouveautés Jarvis');
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Inscription...</span>';
            submitBtn.disabled = true;
            
            try {
                // Save email to localStorage
                localStorage.setItem('jarvis_user_email', email);
                localStorage.setItem('jarvis_email_subscribed', 'true');
                
                // Send to OneSignal (if configured)
                if (typeof OneSignal !== 'undefined') {
                    await OneSignal.push(function() {
                        OneSignal.setExternalUserId(email);
                        OneSignal.sendTags({
                            user_email: email,
                            subscribed: 'true',
                            device_type: 'mobile'
                        });
                    });
                }
                
                // Show success message
                showEmailCaptureSuccess(email);
                
                // Initialize OneSignal after subscription
                setTimeout(() => {
                    initOneSignal();
                }, 1000);
                
            } catch (error) {
                console.error('Error during email capture:', error);
                // Still proceed with local storage
                showEmailCaptureSuccess(email);
            }
        });
    }
    
    // Handle skip button
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            // Mark as skipped but still show site
            localStorage.setItem('jarvis_email_subscribed', 'skipped');
            initAllContent();
        });
    }
}

function showEmailCaptureSuccess(email) {
    const container = document.querySelector('.email-capture-container');
    if (container) {
        container.innerHTML = `
            <div class="success-content">
                <div class="success-icon">
                    <i class="fa-solid fa-check-circle"></i>
                </div>
                <h2>🎉 Inscription réussie!</h2>
                <p>Merci ${email}!</p>
                <p>Vous recevrez toutes les nouveautés Jarvis directement sur votre mobile.</p>
                <button onclick="initAllContent()" class="continue-btn">
                    <i class="fa-solid fa-rocket"></i>
                    <span>Découvrir Jarvis</span>
                </button>
            </div>
        `;
    }
}

function addEmailCaptureStyles() {
    const style = document.createElement('style');
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
            color: #ffffff;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .email-capture-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 1rem;
            text-align: center;
        }
        
        .email-capture-content {
            max-width: 400px;
            width: 100%;
        }
        
        .email-capture-logo {
            font-size: 1.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
        }
        
        .logo-text {
            color: #0066ff;
        }
        
        .logo-dot {
            color: #00d4ff;
        }
        
        .email-capture-title {
            font-family: 'Orbitron', monospace;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #ffffff;
        }
        
        .email-capture-subtitle {
            font-size: 1rem;
            color: #00d4ff;
            margin-bottom: 2rem;
            font-weight: 500;
        }
        
        .email-capture-message {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            backdrop-filter: blur(10px);
        }
        
        .email-capture-message h2 {
            font-size: 1.2rem;
            margin-bottom: 1rem;
            color: #f59e0b;
        }
        
        .email-capture-message p {
            font-size: 0.9rem;
            line-height: 1.5;
            color: #a0a0a0;
            margin-bottom: 0.5rem;
        }
        
        .email-capture-form {
            background: rgba(0, 102, 255, 0.1);
            border: 1px solid rgba(0, 102, 255, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .email-capture-form h3 {
            font-size: 1rem;
            margin-bottom: 1rem;
            color: #0066ff;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #ffffff;
            font-size: 1rem;
        }
        
        .form-group input::placeholder {
            color: #a0a0a0;
        }
        
        .checkbox-group {
            margin-bottom: 1.5rem;
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            color: #a0a0a0;
            cursor: pointer;
        }
        
        .checkbox-label input[type="checkbox"] {
            display: none;
        }
        
        .checkmark {
            width: 16px;
            height: 16px;
            border: 2px solid #0066ff;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .checkbox-label input[type="checkbox"]:checked + .checkmark {
            background: #0066ff;
        }
        
        .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
            content: '✓';
            color: white;
            font-size: 0.7rem;
        }
        
        .submit-btn {
            width: 100%;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0, 102, 255, 0.3);
        }
        
        .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .email-capture-benefits {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
        }
        
        .email-capture-benefits h3 {
            font-size: 1rem;
            margin-bottom: 1rem;
            color: #10b981;
            text-align: center;
        }
        
        .email-capture-benefits ul {
            list-style: none;
        }
        
        .email-capture-benefits li {
            font-size: 0.85rem;
            color: #a0a0a0;
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
        }
        
        .skip-option {
            text-align: center;
        }
        
        .skip-btn {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 0.5rem 1rem;
            color: #a0a0a0;
            font-size: 0.85rem;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .skip-btn:hover {
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.4);
        }
        
        .success-content {
            text-align: center;
        }
        
        .success-icon {
            font-size: 4rem;
            color: #10b981;
            margin-bottom: 1rem;
        }
        
        .success-content h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #10b981;
        }
        
        .success-content p {
            font-size: 1rem;
            color: #a0a0a0;
            margin-bottom: 0.5rem;
        }
        
        .continue-btn {
            margin-top: 2rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .continue-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .submit-btn:not(:disabled) {
            animation: pulse 2s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

function startMaintenanceCountdown() {
    // Set target time to today at 14:05
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(14, 5, 0, 0);
    
    // If 14:05 has passed, set to tomorrow
    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }
    
    let notificationSent = false;
    
    function updateCountdown() {
        const currentTime = new Date();
        const difference = targetTime - currentTime;
        
        if (difference > 0) {
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
            
            // Envoyer notification 30 secondes avant la fin
            if (difference <= 30000 && difference > 29000 && !notificationSent) {
                sendMaintenanceEndingNotification();
                notificationSent = true;
            }
        } else {
            // Countdown finished - send notification and reload page
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            
            // Envoyer notification de fin de maintenance
            if (!notificationSent) {
                sendMaintenanceCompleteNotification();
                notificationSent = true;
            }
            
            // Afficher message de fin
            showMaintenanceCompleteMessage();
            
            // Reload page après 5 secondes
            setTimeout(() => {
                location.reload();
            }, 5000);
        }
    }
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

// Notification de fin imminente de maintenance
function sendMaintenanceEndingNotification() {
    if (typeof OneSignal !== 'undefined' && window.innerWidth <= 768) {
        OneSignal.sendSelfNotification(
            "⏰ Maintenance bientôt terminée!",
            "Le site Jarvis sera de retour en ligne dans moins de 30 secondes. Préparez-vous!",
            "https://tomclair.tech",
            {
                icon: "https://tomclair.tech/icon.png",
                badge: "https://tomclair.tech/badge.png",
                requireInteraction: true,
                actions: [
                    {
                        action: "view",
                        title: "Actualiser"
                    }
                ]
            }
        );
    }
}

// Afficher le message de fin de maintenance
function showMaintenanceCompleteMessage() {
    const maintenanceMessage = document.querySelector('.maintenance-message');
    if (maintenanceMessage) {
        maintenanceMessage.innerHTML = `
            <h2>🎉 Maintenance Terminée!</h2>
            <p>Le site est maintenant de retour en ligne!</p>
            <p>Rechargement automatique en cours...</p>
        `;
    }
    
    const countdownContainer = document.querySelector('.countdown-container');
    if (countdownContainer) {
        countdownContainer.innerHTML = `
            <h3>✅ Mise à jour réussie!</h3>
            <p>Découvrez les nouvelles améliorations Jarvis</p>
        `;
    }
}

function addMaintenanceStyles() {
    const style = document.createElement('style');
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
            color: #ffffff;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .maintenance-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 1rem;
            text-align: center;
        }
        
        .maintenance-content {
            max-width: 400px;
            width: 100%;
        }
        
        .maintenance-logo {
            font-size: 1.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
        }
        
        .logo-text {
            color: #0066ff;
        }
        
        .logo-dot {
            color: #00d4ff;
        }
        
        .maintenance-title {
            font-family: 'Orbitron', monospace;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #ffffff;
        }
        
        .maintenance-subtitle {
            font-size: 1rem;
            color: #00d4ff;
            margin-bottom: 2rem;
            font-weight: 500;
        }
        
        .maintenance-message {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            backdrop-filter: blur(10px);
        }
        
        .maintenance-message h2 {
            font-size: 1.2rem;
            margin-bottom: 1rem;
            color: #f59e0b;
        }
        
        .maintenance-message p {
            font-size: 0.9rem;
            line-height: 1.5;
            color: #a0a0a0;
            margin-bottom: 0.5rem;
        }
        
        .countdown-container {
            background: rgba(0, 102, 255, 0.1);
            border: 1px solid rgba(0, 102, 255, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .countdown-container h3 {
            font-size: 1rem;
            margin-bottom: 1rem;
            color: #0066ff;
        }
        
        .countdown {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .countdown-item {
            text-align: center;
            min-width: 60px;
        }
        
        .countdown-value {
            display: block;
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            font-weight: 700;
            color: #00d4ff;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 8px;
            padding: 0.5rem;
            margin-bottom: 0.25rem;
        }
        
        .countdown-label {
            font-size: 0.7rem;
            color: #a0a0a0;
            text-transform: uppercase;
        }
        
        .target-time {
            font-size: 0.9rem;
            color: #f59e0b;
            font-weight: 500;
        }
        
        .maintenance-features {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
        }
        
        .maintenance-features h3 {
            font-size: 1rem;
            margin-bottom: 1rem;
            color: #10b981;
            text-align: center;
        }
        
        .maintenance-features ul {
            list-style: none;
        }
        
        .maintenance-features li {
            font-size: 0.85rem;
            color: #a0a0a0;
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
        }
        
        .maintenance-contact {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1rem;
        }
        
        .maintenance-contact p {
            font-size: 0.9rem;
            color: #a0a0a0;
            margin-bottom: 0.5rem;
        }
        
        .contact-link {
            color: #0066ff;
            text-decoration: none;
            font-size: 0.9rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(0, 102, 255, 0.1);
            border: 1px solid rgba(0, 102, 255, 0.3);
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .contact-link:hover {
            background: rgba(0, 102, 255, 0.2);
            transform: translateY(-2px);
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .countdown-value {
            animation: pulse 1s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

function initAllContent() {
    initNavbarScroll();
    initMobileMenu();
    initFAQ();
    initContactForm();
    initScrollEffects();
    initAnimations();
    initOneSignal();
    initQuiz();
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

// ===== ONE SIGNAL PUSH NOTIFICATIONS =====
function initOneSignal() {
    // Only initialize on mobile devices
    if (window.innerWidth > 768) {
        return; // Skip on desktop/tablet
    }
    
    // Wait for OneSignal SDK to load
    setTimeout(() => {
        if (typeof OneSignal !== 'undefined') {
            OneSignal.init({
                appId: "YOUR_ONESIGNAL_APP_ID", // Remplacer par votre App ID OneSignal
                notifyButton: {
                    enable: false, // Désactiver le bouton de notification par défaut
                },
                promptOptions: {
                    slidedown: {
                        prompts: [
                            {
                                type: "push",
                                autoPrompt: true,
                                text: {
                                    actionMessage: "Jarvis veut vous envoyer des notifications de mises à jour",
                                    acceptButton: "Autoriser",
                                    cancelButton: "Plus tard",
                                    explanationMessage: "Recevez les dernières nouvelles de Jarvis directement sur votre mobile"
                                }
                            }
                        ]
                    }
                },
                welcomeNotification: {
                    title: "Bienvenue sur Jarvis!",
                    message: "Vous recevrez les alertes de mises à jour très bientôt.",
                    url: "https://tomclair.tech"
                }
            });
            
            // Event listeners pour les notifications
            OneSignal.on('subscriptionChange', function (isSubscribed) {
                if (isSubscribed) {
                    console.log('Utilisateur abonné aux notifications OneSignal');
                    sendWelcomeNotification();
                }
            });
            
            // Configurer les tags pour les notifications ciblées
            OneSignal.push(function() {
                OneSignal.sendTag("device_type", "mobile");
                OneSignal.sendTag("user_type", "jarvis_visitor");
            });
            
        } else {
            console.log('OneSignal SDK pas encore chargé');
        }
    }, 2000);
}

// Envoyer une notification de bienvenue
function sendWelcomeNotification() {
    if (typeof OneSignal !== 'undefined') {
        OneSignal.sendSelfNotification(
            " Jarvis vous remercie!",
            "Merci d'avoir activé les notifications. Restez informé des mises à jour!",
            "https://tomclair.tech",
            {
                icon: "https://tomclair.tech/icon.png",
                badge: "https://tomclair.tech/badge.png",
                image: "https://tomclair.tech/jarvis-notification.png"
            }
        );
    }
}

// Envoyer des notifications de mises à jour (à appeler manuellement)
function sendUpdateNotification(title, message, url = "https://tomclair.tech") {
    if (typeof OneSignal !== 'undefined' && window.innerWidth <= 768) {
        OneSignal.sendSelfNotification(
            "🚀 " + title,
            message,
            url,
            {
                icon: "https://tomclair.tech/icon.png",
                badge: "https://tomclair.tech/badge.png",
                requireInteraction: true,
                actions: [
                    {
                        action: "view",
                        title: "Voir les détails"
                    },
                    {
                        action: "dismiss",
                        title: "Ignorer"
                    }
                ]
            }
        );
    }
}

// Notification de maintenance terminée
function sendMaintenanceCompleteNotification() {
    sendUpdateNotification(
        "Maintenance Terminée!",
        "Jarvis est de retour avec de nouvelles améliorations. Découvrez les nouveautés!",
        "https://tomclair.tech"
    );
}

// Notification de nouvelle version
function sendNewVersionNotification(version) {
    sendUpdateNotification(
        "Nouvelle Version Jarvis v" + version,
        "Téléchargez la dernière version avec des fonctionnalités améliorées et corrections de bugs.",
        "https://tomclair.tech#installation"
    );
}

// Notification de fonctionnalités
function sendFeatureNotification(featureName, description) {
    sendUpdateNotification(
        "🎉 Nouveauté: " + featureName,
        description,
        "https://tomclair.tech#features"
    );
}

// ===== QUIZ FUNCTIONALITY =====
function initQuiz() {
    const quizData = [
        {
            question: "Quelle est la principale fonctionnalité de Jarvis ?",
            options: [
                "Assistant vocal intelligent",
                "Jeu vidéo",
                "Réseau social",
                "Navigateur web"
            ],
            correct: 0,
            feedback: "Jarvis est un assistant vocal intelligent qui vous aide dans vos tâches quotidiennes."
        },
        {
            question: "Quel système d'exploitation est compatible avec Jarvis ?",
            options: [
                "macOS uniquement",
                "Windows 10/11",
                "Linux uniquement",
                "Tous les systèmes"
            ],
            correct: 1,
            feedback: "Jarvis est compatible avec Windows 10 et Windows 11 pour une expérience optimale."
        },
        {
            question: "Quelle technologie utilise Jarvis pour la reconnaissance vocale ?",
            options: [
                "Siri",
                "Google Assistant",
                "Propriétaire avec IA avancée",
                "Alexa"
            ],
            correct: 2,
            feedback: "Jarvis utilise sa propre technologie de reconnaissance vocale avec IA avancée."
        },
        {
            question: "Combien de langues Jarvis peut-il traduire ?",
            options: [
                "10 langues",
                "25 langues",
                "Plus de 50 langues",
                "100 langues"
            ],
            correct: 2,
            feedback: "Jarvis peut traduire plus de 50 langues avec une précision remarquable."
        },
        {
            question: "Quelle est la taille du fichier d'installation de Jarvis ?",
            options: [
                "10MB",
                "45MB",
                "100MB",
                "500MB"
            ],
            correct: 1,
            feedback: "Le fichier JARVIS_Setup_v3.5.exe pèse moins de 50MB (environ 45MB)."
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    let answered = false;
    
    const quizContent = document.getElementById('quizContent');
    const quizResults = document.getElementById('quizResults');
    const quizProgress = document.getElementById('quizProgress');
    const progressText = document.getElementById('progressText');
    const quizScore = document.getElementById('quizScore');
    const nextBtn = document.getElementById('nextBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    if (!quizContent) return;
    
    function loadQuestion() {
        const question = quizData[currentQuestion];
        const quizQuestion = document.getElementById('quizQuestion');
        
        quizQuestion.innerHTML = `
            <h3>${question.question}</h3>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <button class="quiz-option" data-answer="${index}">
                        <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                        <span class="option-text">${option}</span>
                    </button>
                `).join('')}
            </div>
        `;
        
        // Update progress
        const progress = ((currentQuestion + 1) / quizData.length) * 100;
        quizProgress.style.width = `${progress}%`;
        progressText.textContent = `Question ${currentQuestion + 1}/${quizData.length}`;
        
        // Add event listeners to options
        const options = quizQuestion.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.addEventListener('click', () => selectAnswer(parseInt(option.dataset.answer)));
        });
        
        // Hide feedback and next button
        const feedback = document.getElementById('quizFeedback');
        feedback.classList.remove('show');
        nextBtn.style.display = 'none';
        answered = false;
    }
    
    function selectAnswer(selectedIndex) {
        if (answered) return;
        answered = true;
        
        const question = quizData[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        const feedback = document.getElementById('quizFeedback');
        
        // Disable all options
        options.forEach(option => option.classList.add('disabled'));
        
        // Show correct/incorrect
        if (selectedIndex === question.correct) {
            options[selectedIndex].classList.add('correct');
            score++;
            quizScore.textContent = score;
            
            feedback.className = 'quiz-feedback correct show';
            feedback.innerHTML = `
                <div class="feedback-content">
                    <i class="feedback-icon fa-solid fa-check-circle"></i>
                    <p class="feedback-text">Correct! ${question.feedback}</p>
                </div>
            `;
        } else {
            options[selectedIndex].classList.add('incorrect');
            options[question.correct].classList.add('correct');
            
            feedback.className = 'quiz-feedback incorrect show';
            feedback.innerHTML = `
                <div class="feedback-content">
                    <i class="feedback-icon fa-solid fa-times-circle"></i>
                    <p class="feedback-text">Incorrect. ${question.feedback}</p>
                </div>
            `;
        }
        
        // Show next button or finish
        if (currentQuestion < quizData.length - 1) {
            nextBtn.style.display = 'flex';
        } else {
            setTimeout(showResults, 2000);
        }
    }
    
    function nextQuestion() {
        currentQuestion++;
        loadQuestion();
    }
    
    function showResults() {
        quizContent.style.display = 'none';
        quizResults.style.display = 'block';
        
        const finalScore = document.getElementById('finalScore');
        const resultsMessage = document.getElementById('resultsMessage');
        const resultsBadge = document.getElementById('resultsBadge');
        
        finalScore.textContent = score;
        
        let message, badge;
        if (score === 5) {
            message = "Excellent! Vous connaissez parfaitement Jarvis! Vous êtes un véritable expert.";
            badge = "🏆 Expert Jarvis";
        } else if (score >= 3) {
            message = "Bravo! Vous avez une bonne connaissance de Jarvis. Continuez comme ça!";
            badge = "🌟 Connaisseur Jarvis";
        } else {
            message = "Pas mal! Il y a encore des choses à découvrir sur Jarvis. Téléchargez-le pour en savoir plus!";
            badge = "📚 Apprenti Jarvis";
        }
        
        resultsMessage.textContent = message;
        resultsBadge.textContent = badge;
        
        restartBtn.style.display = 'flex';
    }
    
    function restartQuiz() {
        currentQuestion = 0;
        score = 0;
        answered = false;
        
        quizScore.textContent = '0';
        quizContent.style.display = 'block';
        quizResults.style.display = 'none';
        restartBtn.style.display = 'none';
        
        loadQuestion();
    }
    
    // Event listeners
    nextBtn?.addEventListener('click', nextQuestion);
    restartBtn?.addEventListener('click', restartQuiz);
    
    // Load first question
    loadQuestion();
}

// ===== CONSOLE LOGO =====
console.log('%c Jarvis Assistant %c tomclair.tech', 
    'color: #0066ff; font-size: 20px; font-weight: bold;', 
    'color: #00d4ff; font-size: 16px;');
