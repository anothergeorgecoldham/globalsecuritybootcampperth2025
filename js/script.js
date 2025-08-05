/**
 * GSB Conference Website - Modern JavaScript
 * Enhanced with modern ES6+ features and best practices
 */

class GSBConference {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeComponents();
        this.handlePreloader();
        this.initScrollEffects();
        this.initFormValidation();
    }

    bindEvents() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }

        // Window events
        window.addEventListener('scroll', this.throttle(this.onScroll.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.onResize.bind(this), 250));
        window.addEventListener('load', () => this.onWindowLoad());
    }

    onDOMReady() {
        this.initSmoothScrolling();
        this.initBackToTop();
        this.initNavbarToggle();
        this.initAnimations();
        this.initInteractiveElements(); this.loadSpeakersFromSessionize(); this.loadSessionsFromSessionize();
    }

    onWindowLoad() {
        this.hidePreloader();
        this.initParallax();
    }

    onScroll() {
        this.updateNavbar();
        this.updateBackToTop();
        this.handleScrollAnimations();
    }

    onResize() {
        this.handleResponsiveElements();
    }

    // Utility functions
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Preloader handling
    handlePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            // Minimum loading time for better UX
            const minLoadTime = 1000;
            const startTime = Date.now();
            
            const hidePreloader = () => {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, minLoadTime - elapsedTime);
                
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    setTimeout(() => preloader.remove(), 300);
                }, remainingTime);
            };

            if (document.readyState === 'complete') {
                hidePreloader();
            } else {
                window.addEventListener('load', hidePreloader);
            }
        }
    }

    hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => preloader.remove(), 300);
        }
    }

    // Component initialization
    initializeComponents() {
        this.initCounters();
        this.initTabsNavigation();
        this.initFormHandling();
    }

    // Navbar functionality
    updateNavbar() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Update active nav links
        this.updateActiveNavLinks();
    }

    updateActiveNavLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    initNavbarToggle() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        // Close navbar when clicking on nav links (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });

        // Close navbar when clicking outside (mobile)
        document.addEventListener('click', (e) => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    }

    // Smooth scrolling
    initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    this.scrollToElement(target);
                }
            });
        });
    }

    scrollToElement(element, offset = 70) {
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    // Back to top button
    initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    updateBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }

    // Counter animation
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const options = {
            threshold: 0.7,
            rootMargin: '0px 0px -100px 0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, options);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        const stepDuration = duration / steps;
        
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, stepDuration);
    }

    // Tabs navigation
    initTabsNavigation() {
        const tabButtons = document.querySelectorAll('#agendaTabs .nav-link');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('show', 'active');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding tab pane
                const targetId = button.getAttribute('data-bs-target');
                const targetPane = document.querySelector(targetId);
                if (targetPane) {
                    targetPane.classList.add('show', 'active');
                }
            });
        });
    }

    // Form handling and validation
    initFormHandling() {
        this.initContactForm();
        this.initNewsletterForm();
    }

    initFormValidation() {
        const forms = document.querySelectorAll('form[novalidate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });
    }

    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (contactForm.checkValidity()) {
                    await this.handleContactFormSubmission(contactForm);
                }
            });
        }
    }

    async handleContactFormSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            
            // Simulate form submission (replace with actual API call)
            await this.simulateFormSubmission(form);
            
            // Show success message
            this.showFormMessage('success', 'Thank you! Your message has been sent successfully.');
            form.reset();
            form.classList.remove('was-validated');
            
        } catch (error) {
            // Show error message
            this.showFormMessage('error', 'Sorry, there was an error sending your message. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async simulateFormSubmission(form) {
        // Simulate API delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                Math.random() > 0.1 ? resolve() : reject(new Error('Simulated error'));
            }, 2000);
        });
    }

    showFormMessage(type, message) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} form-message mt-3`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            ${message}
        `;
        
        // Insert message
        const contactForm = document.getElementById('contactForm');
        contactForm.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    initNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                const submitBtn = newsletterForm.querySelector('button[type="submit"]');
                
                if (emailInput.checkValidity()) {
                    const originalText = submitBtn.textContent;
                    
                    try {
                        submitBtn.disabled = true;
                        submitBtn.textContent = 'Subscribing...';
                        
                        // Simulate subscription
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        
                        submitBtn.textContent = 'Subscribed!';
                        submitBtn.classList.remove('btn-primary');
                        submitBtn.classList.add('btn-success');
                        
                        emailInput.value = '';
                        
                        setTimeout(() => {
                            submitBtn.disabled = false;
                            submitBtn.textContent = originalText;
                            submitBtn.classList.remove('btn-success');
                            submitBtn.classList.add('btn-primary');
                        }, 3000);
                        
                    } catch (error) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Error';
                        console.error('Newsletter subscription error:', error);
                    }
                }
            });
        }
    }

    // Animations
    initAnimations() {
        this.initScrollAnimations();
        this.initHoverEffects();
    }

    initScrollAnimations() {
        // Only animate elements except the contact section (info-card inside #contact)
        const animatedElements = Array.from(document.querySelectorAll([
            '.speaker-card',
            '.pricing-card',
            '.timeline-item',
            '.partner-logo',
            '.about-stats',
            '.info-card'
        ].join(', '))).filter(el => {
            // If element is inside #contact, skip animation
            return !el.closest('#contact');
        });

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            animationObserver.observe(element);
        });

        // Instantly show contact info-card (no animation)
        const contactInfoCard = document.querySelector('#contact .info-card');
        if (contactInfoCard) {
            contactInfoCard.style.opacity = '1';
            contactInfoCard.style.transform = 'none';
            contactInfoCard.style.transition = 'none';
        }
    }

    handleScrollAnimations() {
        // Add any additional scroll-based animations here
        this.updateParallaxElements();
    }

    initHoverEffects() {
        // Speaker cards hover effects
        const speakerCards = document.querySelectorAll('.speaker-card');
        speakerCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Interactive Elements
    initInteractiveElements() {
        this.initSpeakerCards();
        this.initSessionCards();
        this.initSessionModal();
        this.initSpeakerModal();
    }

    async initSpeakerCards() {
        const speakerCards = document.querySelectorAll('.speaker-card.clickable');

        // Fetch Sessionize data if not already available
        if (!this.sessionizeData || !this.sessionizeData.speakers) {
            try {
                const response = await fetch('https://sessionize.com/api/v2/2arq0ql8/view/All');
                this.sessionizeData = await response.json();
            } catch (error) {
                console.error('Error fetching Sessionize data for speaker cards:', error);
            }
        }

        // Build mapping from normalized name to speaker object
        const speakers = (this.sessionizeData && this.sessionizeData.speakers) ? this.sessionizeData.speakers : [];
        const speakerMap = {};
        speakers.forEach(speaker => {
            // Normalize name: lowercase, replace spaces and special chars with hyphens
            let normName = speaker.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            speakerMap[normName] = speaker;
        });

        speakerCards.forEach(card => {
            const speakerId = card.dataset.speakerId;
            const speakerData = speakerMap[speakerId];
            if (speakerData) {
                // Update image
                const imgEl = card.querySelector('.speaker-image img');
                if (imgEl && speakerData.profilePicture) {
                    imgEl.src = speakerData.profilePicture;
                    imgEl.alt = speakerData.fullName || imgEl.alt;
                }
                // Update name
                const nameEl = card.querySelector('h4');
                if (nameEl && speakerData.fullName) {
                    nameEl.textContent = speakerData.fullName;
                }
                // Update position/tagline
                const titleEl = card.querySelector('.speaker-title');
                if (titleEl && speakerData.tagLine) {
                    titleEl.textContent = speakerData.tagLine;
                }
                // Update topic (first session title)
                const topicEl = card.querySelector('.speaker-topic');
                if (topicEl && speakerData.sessions && speakerData.sessions.length > 0) {
                    topicEl.textContent = speakerData.sessions[0].name;
                }
                // Update bio
                const bioEl = card.querySelector('.speaker-bio');
                if (bioEl && speakerData.bio) {
                    bioEl.innerHTML = speakerData.bio;
                }
            } else {
                // Hide card if no matching speaker
                card.style.display = 'none';
            }
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (speakerId) {
                    this.showSpeakerModal(speakerId, card);
                }
            });
        });
    }

    initSpeakerModal() {
        // Create speaker modal if it doesn't exist
        if (!document.getElementById('speakerModal')) {
            this.createSpeakerModal();
        }

        // Close modal on outside click or escape key
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('speakerModal');
            if (modal && e.target === modal) {
                this.hideSpeakerModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSpeakerModal();
            }
        });
    }

    createSpeakerModal() {
        const modalHTML = `
            <div id="speakerModal" class="speaker-modal" style="display: none;">
                <div class="speaker-modal-content">
                    <div class="speaker-modal-header">
                        <div class="speaker-modal-image">
                            <img id="speakerModalImage" src="" alt="" class="img-fluid">
                        </div>
                        <div class="speaker-modal-title">
                            <h4 id="speakerModalName"></h4>
                            <p id="speakerModalTitle" class="speaker-position"></p>
                            <p id="speakerModalTopic" class="speaker-session-topic"></p>
                        </div>
                        <button type="button" class="btn-close" onclick="gsbConference.hideSpeakerModal()"></button>
                    </div>
                    <div class="speaker-modal-body">
                        <div id="speakerModalBio"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    async showSpeakerModal(speakerId, cardElement) {
        const modal = document.getElementById('speakerModal');
        const modalImage = document.getElementById('speakerModalImage');
        const modalName = document.getElementById('speakerModalName');
        const modalTitle = document.getElementById('speakerModalTitle');
        const modalTopic = document.getElementById('speakerModalTopic');
        const modalBio = document.getElementById('speakerModalBio');

        if (!modal || !modalImage || !modalName || !modalTitle || !modalTopic || !modalBio) {
            console.error('Speaker modal elements not found');
            return;
        }

        let speakerData = null;
        try {
            // Try to get speaker data from Sessionize API
            if (!this.sessionizeData || !this.sessionizeData.speakers) {
                const response = await fetch('https://sessionize.com/api/v2/2arq0ql8/view/All');
                this.sessionizeData = await response.json();
            }
            speakerData = this.sessionizeData.speakers.find(s => s.id === speakerId);
        } catch (error) {
            console.error('Error fetching speaker data from Sessionize API:', error);
        }

        try {
            if (speakerData) {
                // Use Sessionize API data for modal
                modalImage.src = speakerData.profilePicture || '';
                modalImage.alt = speakerData.fullName || '';
                modalName.textContent = speakerData.fullName || '';
                modalTitle.textContent = speakerData.tagLine || '';
                // Find the session topic if available
                let sessionTopic = '';
                if (speakerData.sessions && speakerData.sessions.length > 0 && this.sessionizeData.sessions) {
                    const session = this.sessionizeData.sessions.find(sess => sess.speakers && sess.speakers.includes(speakerId));
                    if (session && session.title) {
                        sessionTopic = session.title;
                    }
                }
                modalTopic.textContent = sessionTopic;
                // Bio
                if (speakerData.bio) {
                    modalBio.innerHTML = speakerData.bio;
                } else {
                    modalBio.innerHTML = '<p>Biography information will be available soon.</p>';
                }
            } else {
                // Fallback: Extract information from the clicked card
                const speakerImage = cardElement.querySelector('.speaker-image img');
                const speakerName = cardElement.querySelector('h4');
                const speakerPosition = cardElement.querySelector('.speaker-title');
                const speakerSessionTopic = cardElement.querySelector('.speaker-topic');
                const speakerBioElement = cardElement.querySelector('.speaker-bio');

                if (speakerImage) {
                    modalImage.src = speakerImage.src;
                    modalImage.alt = speakerImage.alt;
                }
                if (speakerName) {
                    modalName.textContent = speakerName.textContent;
                }
                if (speakerPosition) {
                    modalTitle.textContent = speakerPosition.textContent;
                }
                if (speakerSessionTopic) {
                    modalTopic.textContent = speakerSessionTopic.textContent;
                }
                if (speakerBioElement) {
                    modalBio.innerHTML = speakerBioElement.innerHTML;
                } else {
                    modalBio.innerHTML = '<p>Biography information will be available soon.</p>';
                }
            }

            // Show modal
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);

        } catch (error) {
            console.error('Error showing speaker modal:', error);
            modalName.textContent = 'Speaker Information';
            modalBio.innerHTML = '<p>Unable to load speaker details. Please try again later.</p>';
            modal.style.display = 'flex';
        }
    }

    hideSpeakerModal() {
        const modal = document.getElementById('speakerModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }

    closeAllSpeakerBios() {
        // This method is no longer needed with the overlay system
        // but keeping it for backward compatibility
        const allBios = document.querySelectorAll('.speaker-bio');
        const allCards = document.querySelectorAll('.speaker-card.expanded');
        
        allBios.forEach(bio => bio.classList.add('hidden'));
        allCards.forEach(card => card.classList.remove('expanded'));
    }

    initSessionCards() {
        const sessionCards = document.querySelectorAll('.session-card.clickable');
        
        sessionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const sessionId = card.dataset.sessionId;
                if (sessionId) {
                    this.showSessionModal(sessionId);
                }
            });
        });
    }

    initSessionModal() {
        // Create modal if it doesn't exist
        if (!document.getElementById('sessionModal')) {
            this.createSessionModal();
        }

        // Close modal on outside click or escape key
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('sessionModal');
            if (modal && e.target === modal) {
                this.hideSessionModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSessionModal();
            }
        });
    }

    createSessionModal() {
        const modalHTML = `
            <div id="sessionModal" class="session-modal" style="display: none;">
                <div class="session-modal-content">
                    <div class="session-modal-header">
                        <h4 id="sessionModalTitle"></h4>
                        <button type="button" class="btn-close" onclick="gsbConference.hideSessionModal()"></button>
                    </div>
                    <div class="session-modal-body">
                        <div id="sessionModalContent"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    async showSessionModal(sessionId) {
        const modal = document.getElementById('sessionModal');
        const modalTitle = document.getElementById('sessionModalTitle');
        const modalContent = document.getElementById('sessionModalContent');
        
        if (!modal || !modalTitle || !modalContent) {
            console.error('Session modal elements not found');
            return;
        }

        try {
            // Try to get data from Sessionize API first
            const sessionData = await this.getSessionData(sessionId);
            
            if (sessionData) {
                // Use API data
                modalTitle.textContent = sessionData.title || 'Session Details';
                
                let contentHTML = '<div class="session-details">';
                
                // Add time information
                if (sessionData.startsAt || sessionData.endsAt) {
                    const startTime = sessionData.startsAt ? new Date(sessionData.startsAt).toLocaleTimeString('en-AU', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                    }) : '';
                    const endTime = sessionData.endsAt ? new Date(sessionData.endsAt).toLocaleTimeString('en-AU', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                    }) : '';
                    
                    contentHTML += `
                        <div class="session-time mb-3">
                            <i class="fas fa-clock me-2"></i>
                            <strong>Time:</strong> ${startTime}${endTime ? ` - ${endTime}` : ''}
                        </div>
                    `;
                }
                
                // Add room information
                if (sessionData.room) {
                    contentHTML += `
                        <div class="session-room mb-3">
                            <i class="fas fa-map-marker-alt me-2"></i>
                            <strong>Room:</strong> ${sessionData.room}
                        </div>
                    `;
                }
                
                // Add speakers information
                if (sessionData.speakers && sessionData.speakers.length > 0) {
                    contentHTML += `
                        <div class="session-speakers mb-3">
                            <i class="fas fa-user me-2"></i>
                            <strong>Speaker${sessionData.speakers.length > 1 ? 's' : ''}:</strong>
                            <div class="speakers-list mt-2">
                    `;
                    
                    // Get speaker data from the API response
                    const speakers = await this.getSpeakerDetails(sessionData.speakers);
                    
                    speakers.forEach(speaker => {
                        contentHTML += `
                            <div class="speaker-info d-flex align-items-center mb-2">
                                ${speaker.profilePicture ? `
                                    <img src="${speaker.profilePicture}" alt="${speaker.fullName}" class="speaker-thumb me-3">
                                ` : ''}
                                <div>
                                    <strong>${speaker.fullName}</strong>
                                    ${speaker.tagLine ? `<br><small class="text-muted">${speaker.tagLine}</small>` : ''}
                                </div>
                            </div>
                        `;
                    });
                    
                    contentHTML += '</div></div>';
                }
                
                // Add description
                if (sessionData.description) {
                    contentHTML += `
                        <div class="session-description mb-4">
                            <h6>Description:</h6>
                            <p>${sessionData.description}</p>
                        </div>
                    `;
                }
                
                contentHTML += '</div>';
                modalContent.innerHTML = contentHTML;
                
            } else {
                // Fallback to HTML extraction
                this.showSessionModalFromHTML(sessionId, modal, modalTitle, modalContent);
            }
            
            // Show modal
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Animate in
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
        } catch (error) {
            console.error('Error loading session data:', error);
            // Fallback to HTML extraction
            this.showSessionModalFromHTML(sessionId, modal, modalTitle, modalContent);
            
            // Show modal even with error
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => modal.classList.add('show'), 10);
        }
    }

    showSessionModalFromHTML(sessionId, modal, modalTitle, modalContent) {
        // Fallback method using HTML extraction
        const sessionCard = document.querySelector(`[data-session-id="${sessionId}"]`);
        
        if (sessionCard) {
            // Extract information from the session card
            const sessionTitle = sessionCard.querySelector('h5');
            const sessionSpeaker = sessionCard.querySelector('p strong');
            const sessionDescription = sessionCard.querySelector('.session-desc');
            const sessionTime = this.getSessionTimeFromContext(sessionCard);
            const sessionRoom = this.getSessionRoomFromContext(sessionCard);
            
            // Set modal title
            if (sessionTitle) {
                modalTitle.textContent = sessionTitle.textContent;
            } else {
                modalTitle.textContent = 'Session Details';
            }
            
            // Build content HTML
            let contentHTML = '<div class="session-details">';
            
            // Add time information
            if (sessionTime) {
                contentHTML += `
                    <div class="session-time mb-3">
                        <i class="fas fa-clock me-2"></i>
                        <strong>Time:</strong> ${sessionTime}
                    </div>
                `;
            }
            
            // Add room information
            if (sessionRoom) {
                contentHTML += `
                    <div class="session-room mb-3">
                        <i class="fas fa-map-marker-alt me-2"></i>
                        <strong>Room:</strong> ${sessionRoom}
                    </div>
                `;
            }
            
            // Add speaker information
            if (sessionSpeaker) {
                contentHTML += `
                    <div class="session-speaker mb-3">
                        <i class="fas fa-user me-2"></i>
                        <strong>Speaker:</strong> ${sessionSpeaker.textContent}
                    </div>
                `;
            }
            
            // Add description
            if (sessionDescription) {
                contentHTML += `
                    <div class="session-description mb-4">
                        <h6>Description:</h6>
                        <p>${sessionDescription.textContent}</p>
                    </div>
                `;
            } else {
                contentHTML += `
                    <div class="session-description mb-4">
                        <h6>About this Session:</h6>
                        <p>Join us for this engaging session covering important topics in cybersecurity and Microsoft technologies.</p>
                    </div>
                `;
            }
            
            contentHTML += '</div>';
            modalContent.innerHTML = contentHTML;
            
        } else {
            modalTitle.textContent = 'Session Details';
            modalContent.innerHTML = '<p>Session information is not available at this time.</p>';
        }
    }

    getSessionTimeFromContext(sessionCard) {
        // Find the time cell in the same row
        const row = sessionCard.closest('tr');
        if (row) {
            const timeCell = row.querySelector('.time-cell');
            if (timeCell) {
                return timeCell.textContent.trim();
            }
        }
        return null;
    }

    getSessionRoomFromContext(sessionCard) {
        // Determine which room based on the column
        const cell = sessionCard.closest('td');
        if (cell) {
            const row = cell.closest('tr');
            if (row) {
                const cells = row.querySelectorAll('td');
                const cellIndex = Array.from(cells).indexOf(cell);
                
                // Check if it's a full-width session (colspan="2")
                if (cell.hasAttribute('colspan')) {
                    return 'Main Conference Room';
                }
                
                // Determine room based on column position
                if (cellIndex === 1) {
                    return 'Left Room';
                } else if (cellIndex === 2) {
                    return 'Right Room';
                }
            }
        }
        return 'Main Conference Room';
    }

    hideSessionModal() {
        const modal = document.getElementById('sessionModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // Session data is now fetched from Sessionize API
    // This method fetches live data from the Sessionize API
    async getSessionData(sessionId) {
        try {
            const response = await fetch('https://sessionize.com/api/v2/2arq0ql8/view/All');
            const data = await response.json();
            
            // Store the full API data for speaker lookup
            this.sessionizeData = data;
            
            // Find the session by ID
            let session = null;
            
            // Search through sessions array
            if (data.sessions) {
                session = data.sessions.find(s => s.id === sessionId);
            }
            
            // Search through grouped sessions if not found
            if (!session && data.groupedSessions) {
                for (const group of data.groupedSessions) {
                    if (group.sessions) {
                        session = group.sessions.find(s => s.id === sessionId);
                        if (session) break;
                    }
                }
            }
            
            return session;
        } catch (error) {
            console.error('Error fetching session data from Sessionize API:', error);
            return null;
        }
    }

    // Get speaker details from the cached API data
    async getSpeakerDetails(speakerIds) {
        if (!this.sessionizeData || !this.sessionizeData.speakers) {
            // Try to get fresh data if not cached
            try {
                const response = await fetch('https://sessionize.com/api/v2/2arq0ql8/view/All');
                this.sessionizeData = await response.json();
            } catch (error) {
                console.error('Error fetching speaker data:', error);
                return [];
            }
        }

        // Find speakers by their IDs
        const speakers = [];
        speakerIds.forEach(speakerId => {
            const speaker = this.sessionizeData.speakers.find(s => s.id === speakerId);
            if (speaker) {
                speakers.push(speaker);
            }
        });

        return speakers;
    }

    // Parallax effects
    initParallax() {
        this.parallaxElements = document.querySelectorAll('.hero-section');
        this.updateParallaxElements();
    }

    updateParallaxElements() {
        if (!this.parallaxElements) return;
        
        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Responsive handling
    handleResponsiveElements() {
        this.adjustMobileNavigation();
        this.adjustScrollAnimations();
    }

    adjustMobileNavigation() {
        const navbar = document.querySelector('.navbar');
        const isMobile = window.innerWidth < 768;
        
        if (navbar) {
            if (isMobile) {
                navbar.classList.add('mobile-nav');
            } else {
                navbar.classList.remove('mobile-nav');
            }
        }
    }

    adjustScrollAnimations() {
        // Disable animations on mobile for better performance
        const isMobile = window.innerWidth < 768;
        const animatedElements = document.querySelectorAll([
            '.speaker-card',
            '.pricing-card',
            '.timeline-item'
        ].join(', '));
        
        animatedElements.forEach(element => {
            if (isMobile) {
                element.style.transition = 'none';
                element.style.opacity = '1';
                element.style.transform = 'none';
            }
        });
    }

    // Utility methods for external use
    static scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const instance = window.gsbConference;
            if (instance) {
                instance.scrollToElement(element);
            }
        }
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.innerHTML = `
            <button type="button" class="btn-close" aria-label="Close"></button>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.btn-close');
        closeBtn.addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Initialize the application
const gsbConference = new GSBConference();

// Make it globally accessible
window.gsbConference = gsbConference;
window.GSBConference = GSBConference;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GSBConference;
}
