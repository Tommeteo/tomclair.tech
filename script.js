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
    initMobileSwipeBlock();
    initMobileDownloadMessage();
    initMobileMenuToggle();
    initDownloadButton();
    
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

// ===== USER COUNTER =====
function initUserCounter() {
    const counterElement = document.getElementById('navUserCounter');
    if (!counterElement) return;
    
    // Nombre final d'utilisateurs (simulé)
    const targetUsers = 45832;
    const duration = 3000; // 3 secondes
    const steps = 60;
    const increment = targetUsers / steps;
    let currentUsers = 0;
    let step = 0;
    
    // Animation du compteur
    const counterInterval = setInterval(() => {
        step++;
        currentUsers = Math.floor(increment * step);
        
        // Ajouter un effet aléatoire pour simuler des ajouts en temps réel
        const randomAdd = Math.floor(Math.random() * 3);
        currentUsers += randomAdd;
        
        if (currentUsers >= targetUsers) {
            currentUsers = targetUsers;
            clearInterval(counterInterval);
        }
        
        counterElement.textContent = currentUsers.toLocaleString('fr-FR');
        
        // Effet de pulsation quand on atteint le nombre final
        if (currentUsers === targetUsers) {
            counterElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                counterElement.style.transform = 'scale(1)';
            }, 200);
        }
    }, duration / steps);
    
    // Simulation d'ajouts occasionnels après l'animation
    setInterval(() => {
        const current = parseInt(counterElement.textContent.replace(/\s/g, ''));
        const newTotal = current + Math.floor(Math.random() * 2) + 1;
        counterElement.textContent = newTotal.toLocaleString('fr-FR');
        
        // Effet subtil quand un nouvel utilisateur s'ajoute
        counterElement.style.color = '#10b981';
        setTimeout(() => {
            counterElement.style.color = '';
        }, 500);
    }, 8000 + Math.random() * 4000); // Entre 8 et 12 secondes
}

// ===== WELCOME MESSAGE =====
function initWelcomeMessage() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const welcomeBtn = document.getElementById('welcomeBtn');
    
    if (!welcomeOverlay || !welcomeBtn) return;
    
    // Vérifier si le message a déjà été montré aujourd'hui
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('jarvis_welcome_shown');
    
    if (lastShown === today) {
        // Si déjà montré aujourd'hui, cacher directement
        welcomeOverlay.classList.add('hidden');
        return;
    }
    
    // Gérer le clic sur le bouton
    welcomeBtn.addEventListener('click', () => {
        closeWelcomeMessage();
    });
    
    // Fermer automatiquement après 10 secondes (optionnel)
    setTimeout(() => {
        if (!welcomeOverlay.classList.contains('hidden')) {
            closeWelcomeMessage();
        }
    }, 10000);
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !welcomeOverlay.classList.contains('hidden')) {
            closeWelcomeMessage();
        }
    });
}

function closeWelcomeMessage() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    if (!welcomeOverlay) return;
    
    // Animation de sortie
    welcomeOverlay.classList.add('hidden');
    
    // Sauvegarder la date d'affichage
    localStorage.setItem('jarvis_welcome_shown', new Date().toDateString());
    
    // Supprimer complètement après l'animation
    setTimeout(() => {
        welcomeOverlay.style.display = 'none';
    }, 500);
}

// ===== MOBILE SWIPE BLOCK =====
function initMobileSwipeBlock() {
    // Only apply on mobile devices
    if (window.innerWidth > 768) return;
    
    let startX = 0;
    let startY = 0;
    let isScrolling = false;
    
    // Prevent horizontal swipe on touch devices
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isScrolling = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // Detect horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Prevent horizontal swipe
            if (Math.abs(diffX) > 10) {
                e.preventDefault();
                return false;
            }
        }
    }, { passive: false });
    
    // Prevent horizontal scroll with wheel
    document.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            return false;
        }
    }, { passive: false });
    
    // Force body to stay in place
    document.body.style.overflowX = 'hidden';
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100vw';
    
    // Prevent overscroll behavior
    document.body.style.overscrollBehavior = 'none';
    
    // Add touch action for better control
    document.body.style.touchAction = 'pan-y';
}

// ===== MOBILE DOWNLOAD REMOVAL =====
function initMobileDownloadMessage() {
    // Only apply on mobile devices
    if (window.innerWidth > 768) return;
    
    const downloadBtn = document.querySelector('a[href="JARVIS_Setup_v3.5.exe"]');
    if (!downloadBtn) return;
    
    // Remove download button on mobile
    downloadBtn.remove();
}

function showMobileDownloadMessage() {
    // Create message overlay
    const messageDiv = document.createElement('div');
    messageDiv.className = 'mobile-download-message';
    messageDiv.innerHTML = `
        <h3>� Téléchargement bloqué sur mobile</h3>
        <p>
            Le téléchargement de Jarvis est temporairement bloqué sur les appareils mobiles.
            Je travaille actuellement à optimiser la version mobile pour vous offrir la meilleure expérience.
        </p>
        <p>
            Pour télécharger Jarvis, veuillez utiliser un ordinateur desktop.
            Merci de votre compréhension !
        </p>
        <div class="signature">- Tom, Fondateur de Jarvis</div>
        <button class="mobile-download-close" onclick="this.parentElement.remove()">
            J'ai compris
        </button>
    `;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // NO auto-remove - user must close manually
    
    // Close only on user action (escape key)
    const escapeHandler = (e) => {
        if (e.key === 'Escape' && messageDiv.parentElement) {
            messageDiv.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// ===== MOBILE MENU TOGGLE =====
function initMobileMenuToggle() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    // Toggle menu on click
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navLinks.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navLinks.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                span.style.transform = '';
                span.style.opacity = '';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navLinks.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    });
}

// ===== JARVIS MINI GAME MODAL =====
function initJarvisGame() {
    const gameLink = document.getElementById('gameLink');
    const gameModal = document.getElementById('gameModal');
    const gameModalClose = document.getElementById('gameModalClose');
    const gameStartBtn = document.getElementById('gameStartBtn');
    const gameGrid = document.getElementById('gameGrid');
    const gameMessage = document.getElementById('gameMessage');
    const gameScore = document.getElementById('gameScore');
    const gameLevel = document.getElementById('gameLevel');
    const gameLives = document.getElementById('gameLives');
    const gameResetBtn = document.getElementById('gameResetBtn');
    const gameSoundBtn = document.getElementById('gameSoundBtn');
    
    // Check if elements exist
    if (!gameLink) {
        console.log('Game link not found');
        return;
    }
    
    if (!gameModal) {
        console.log('Game modal not found');
        return;
    }
    
    // Modal controls - Add multiple event listeners for reliability
    gameLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Game link clicked - direct function');
        openGameModal();
        return false;
    });
    
    // Also try mousedown for mobile
    gameLink.addEventListener('mousedown', function(e) {
        e.preventDefault();
        console.log('Game link mousedown');
        setTimeout(() => openGameModal(), 100);
    });
    
    // Also try touchstart for mobile
    gameLink.addEventListener('touchstart', function(e) {
        e.preventDefault();
        console.log('Game link touchstart');
        setTimeout(() => openGameModal(), 100);
    });
    
    if (gameModalClose) {
        gameModalClose.addEventListener('click', closeGameModal);
    }
    
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            closeGameModal();
        }
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameModal.classList.contains('active')) {
            closeGameModal();
        }
    });
    
    function openGameModal() {
        console.log('Opening game modal');
        console.log('Modal element:', gameModal);
        
        // Force display and visibility
        gameModal.style.display = 'block';
        gameModal.style.visibility = 'visible';
        gameModal.style.opacity = '1';
        gameModal.style.pointerEvents = 'auto';
        gameModal.classList.add('active');
        
        // Block body scroll
        document.body.style.overflow = 'hidden';
        
        console.log('Modal should be visible now');
    }
    
    function closeGameModal() {
        console.log('Closing game modal');
        gameModal.classList.remove('active');
        gameModal.style.display = 'none';
        document.body.style.overflow = '';
        resetGame();
    }
    
    if (!gameStartBtn || !gameGrid || !gameMessage) return;
    
    let sequence = [];
    let playerSequence = [];
    let score = 0;
    let level = 1;
    let lives = 10;
    let isPlaying = false;
    let soundEnabled = true;
    
    // Game tiles
    const tiles = {
        red: document.getElementById('tileRed'),
        blue: document.getElementById('tileBlue'),
        green: document.getElementById('tileGreen'),
        yellow: document.getElementById('tileYellow')
    };
    
    // Start game
    gameStartBtn.addEventListener('click', startGame);
    gameResetBtn.addEventListener('click', resetGame);
    gameSoundBtn.addEventListener('click', toggleSound);
    
    // Tile clicks
    Object.keys(tiles).forEach(color => {
        tiles[color].addEventListener('click', () => handleTileClick(color));
    });
    
    function startGame() {
        gameMessage.style.display = 'none';
        gameGrid.style.display = 'grid';
        isPlaying = true;
        score = 0;
        level = 1;
        lives = 10;
        updateDisplay();
        nextRound();
    }
    
    function nextRound() {
        playerSequence = [];
        sequence.push(getRandomColor());
        showSequence();
    }
    
    function getRandomColor() {
        const colors = ['red', 'blue', 'green', 'yellow'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function showSequence() {
        let index = 0;
        disableTiles();
        
        const interval = setInterval(() => {
            if (index >= sequence.length) {
                clearInterval(interval);
                enableTiles();
                return;
            }
            
            lightUpTile(sequence[index]);
            index++;
        }, 600);
    }
    
    function lightUpTile(color) {
        const tile = tiles[color];
        tile.classList.add('lit');
        playSound(color);
        
        setTimeout(() => {
            tile.classList.remove('lit');
        }, 400);
    }
    
    function handleTileClick(color) {
        if (!isPlaying) return;
        
        playerSequence.push(color);
        lightUpTile(color);
        
        const currentIndex = playerSequence.length - 1;
        
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            // Wrong tile
            lives--;
            updateDisplay();
            playFailureSound();
            
            if (lives === 0) {
                gameOver();
            } else {
                showMessage(` Mauvaise tuile ! ${lives} vies restantes`, 'Réessayez la séquence...');
                setTimeout(() => {
                    playerSequence = [];
                    showSequence();
                }, 2000);
            }
        } else if (playerSequence.length === sequence.length) {
            // Round complete
            score += level * 10;
            level++;
            updateDisplay();
            playSuccessSound();
            
            showMessage(' Excellent !', `Niveau ${level} - Préparez-vous...`);
            setTimeout(() => {
                nextRound();
            }, 2000);
        }
    }
    
    function disableTiles() {
        Object.values(tiles).forEach(tile => {
            tile.style.pointerEvents = 'none';
        });
    }
    
    function enableTiles() {
        Object.values(tiles).forEach(tile => {
            tile.style.pointerEvents = 'auto';
        });
    }
    
    function updateDisplay() {
        gameScore.textContent = score;
        gameLevel.textContent = level;
        
        // Update lives - make sure we have exactly 10 hearts
        const hearts = gameLives.querySelectorAll('i');
        console.log('Updating display - lives:', lives, 'hearts found:', hearts.length);
        
        hearts.forEach((heart, index) => {
            if (index >= lives) {
                heart.classList.add('lost');
            } else {
                heart.classList.remove('lost');
            }
        });
        
        // Debug: log heart states
        const activeHearts = gameLives.querySelectorAll('i:not(.lost)').length;
        console.log('Active hearts:', activeHearts, 'Expected lives:', lives);
    }
    
    function gameOver() {
        isPlaying = false;
        disableTiles();
        
        showMessage(' Game Over !', `Score final: ${score} | Niveau atteint: ${level}`);
        
        setTimeout(() => {
            gameGrid.style.display = 'none';
            gameMessage.style.display = 'block';
            gameMessage.innerHTML = `
                <h3> Game Over !</h3>
                <p>Score final: ${score} | Niveau atteint: ${level}</p>
                <button class="game-start-btn" onclick="startGame()">
                    <i class="fa-solid fa-redo"></i>
                    <span>Rejouer</span>
                </button>
            `;
        }, 3000);
    }
    
    function resetGame() {
        isPlaying = false;
        sequence = [];
        playerSequence = [];
        score = 0;
        level = 1;
        lives = 10;
        updateDisplay();
        
        gameGrid.style.display = 'none';
        gameMessage.style.display = 'block';
        gameMessage.innerHTML = `
            <h3>Prêt à jouer avec Jarvis ?</h3>
            <p>Jarvis va vous montrer une séquence de couleurs. Répétez-la !</p>
            <button class="game-start-btn" id="gameStartBtn">
                <i class="fa-solid fa-play"></i>
                <span>Commencer le jeu</span>
            </button>
        `;
        
        // Re-attach event listener
        document.getElementById('gameStartBtn').addEventListener('click', startGame);
    }
    
    function toggleSound() {
        soundEnabled = !soundEnabled;
        gameSoundBtn.innerHTML = soundEnabled ? 
            '<i class="fa-solid fa-volume-up"></i><span>Son: ON</span>' : 
            '<i class="fa-solid fa-volume-mute"></i><span>Son: OFF</span>';
    }
    
    function playSound(color) {
        if (!soundEnabled) return;
        
        // Create varied sounds using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different sounds for each color
        const soundTypes = {
            red: { frequency: 261.63, type: 'square', duration: 0.3 },    // C - square wave
            blue: { frequency: 329.63, type: 'sine', duration: 0.4 },     // E - sine wave
            green: { frequency: 392.00, type: 'triangle', duration: 0.35 }, // G - triangle wave
            yellow: { frequency: 523.25, type: 'sawtooth', duration: 0.25 } // C - sawtooth wave
        };
        
        const sound = soundTypes[color];
        
        oscillator.frequency.value = sound.frequency;
        oscillator.type = sound.type;
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + sound.duration);
    }
    
    // Add success and failure sounds
    function playSuccessSound() {
        if (!soundEnabled) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Ascending notes for success
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G
        
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    function playFailureSound() {
        if (!soundEnabled) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Descending notes for failure
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
        
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    function showMessage(title, text) {
        const tempMessage = document.createElement('div');
        tempMessage.className = 'game-temp-message';
        tempMessage.innerHTML = `<h4>${title}</h4><p>${text}</p>`;
        tempMessage.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 14, 39, 0.95);
            border: 2px solid var(--primary-color);
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            z-index: 1000;
            color: white;
        `;
        
        gameBoard.appendChild(tempMessage);
        
        setTimeout(() => {
            tempMessage.remove();
        }, 2000);
    }
}

// ===== DOWNLOAD BUTTON HANDLER =====
function initDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (!downloadBtn) return;
    
    // Add visual feedback for local file download
    downloadBtn.addEventListener('click', function(e) {
        console.log('Download button clicked - downloading JARVIS_Setup_v4.zip');
        
        // Add visual feedback immediately
        const originalHTML = this.innerHTML;
        const originalStyle = this.style.background;
        
        this.innerHTML = '<i class="fa-solid fa-download"></i> <span>Téléchargement de Jarvis v4...</span>';
        this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        // Reset after 2 seconds
        setTimeout(() => {
            this.innerHTML = originalHTML;
            this.style.background = originalStyle;
        }, 2000);
    });
}

// ===== CONSOLE LOGO =====
console.log('%c Jarvis Assistant %c tomclair.tech', 
    'color: #0066ff; font-size: 20px; font-weight: bold;', 
    'color: #00d4ff; font-size: 16px;');
