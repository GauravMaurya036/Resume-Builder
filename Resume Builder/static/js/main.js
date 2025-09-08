// Add animation classes to elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
            element.classList.add('animate-fade-up');
        }
    });
};

// Helper function to check if element is in viewport
const isElementInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Navbar Scroll Effect
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.hash) {
                e.preventDefault();
                const target = document.querySelector(link.hash);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - navbar.offsetHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections for animation
    sections.forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });
});

// Form Validation with Modern Feedback
const forms = document.querySelectorAll('.needs-validation');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            
            // Add shake animation to invalid fields
            const invalidFields = form.querySelectorAll(':invalid');
            invalidFields.forEach(field => {
                field.classList.add('shake');
                setTimeout(() => field.classList.remove('shake'), 600);
            });
        }
        form.classList.add('was-validated');
    });
});

// Template Filtering
document.addEventListener('DOMContentLoaded', function() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const templateItems = document.querySelectorAll('.template-item');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            
            // Show/hide templates based on category
            templateItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    // Add animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// Template Preview Modal
document.addEventListener('DOMContentLoaded', function() {
    const previewButtons = document.querySelectorAll('.preview-btn');
    const previewModal = new bootstrap.Modal(document.getElementById('templatePreview'));
    const previewContent = document.querySelector('.template-preview-content');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const templateCard = button.closest('.template-card');
            const templateImage = templateCard.querySelector('img').src;
            const templateTitle = templateCard.querySelector('h3').textContent;
            
            // Update modal content
            document.querySelector('.modal-title').textContent = templateTitle;
            previewContent.innerHTML = `<img src="${templateImage}" alt="${templateTitle}">`;
            
            // Show modal
            previewModal.show();
        });
    });
});

// Use Template Button
document.addEventListener('DOMContentLoaded', function() {
    const useButtons = document.querySelectorAll('.use-btn');
    
    useButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const templateCard = button.closest('.template-card');
            const templateTitle = templateCard.querySelector('h3').textContent;
            
            // Show success message
            showToast(`Template "${templateTitle}" selected! Redirecting to editor...`);
            
            // Redirect to editor after delay
            setTimeout(() => {
                window.location.href = 'editor.html';
            }, 1500);
        });
    });
});

// Template Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-md)';
        });
    });
});

// Template Filtering
const templateFilters = document.querySelectorAll('[data-filter]');
const templateItems = document.querySelectorAll('.template-item');

templateFilters?.forEach(filter => {
    filter.addEventListener('click', () => {
        const category = filter.dataset.filter;
        
        // Update active filter
        templateFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        // Filter templates with animation
        templateItems.forEach(item => {
            const itemCategory = item.dataset.category;
            if (category === 'all' || category === itemCategory) {
                item.style.display = 'block';
                item.classList.add('animate-fade-up');
            } else {
                item.style.display = 'none';
                item.classList.remove('animate-fade-up');
            }
        });
    });
});

// Statistics Counter Animation
const stats = document.querySelectorAll('.statistics-item h3');
const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const step = duration / 50;
        
        const counter = setInterval(() => {
            current += increment;
            stat.textContent = Math.floor(current);
            
            if (current >= target) {
                stat.textContent = target;
                clearInterval(counter);
            }
        }, step);
    });
};

// Trigger stats animation when in view
const statsSection = document.querySelector('.statistics');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Modern Tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
        trigger: 'hover',
        animation: true
    });
});

// FAQ Accordion Animation
const accordionButtons = document.querySelectorAll('.accordion-button');
accordionButtons?.forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        if (content) {
            content.style.maxHeight = button.classList.contains('collapsed') 
                ? '0px' 
                : `${content.scrollHeight}px`;
        }
    });
});

// Initialize Particles Background
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.particles-bg')) {
        particlesJS('particles-bg', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: false
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
});

// Smooth Scroll with Progress Indicator
const initSmoothScroll = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
};

// Template Carousel with Touch Support
class TemplateCarousel {
    constructor(element) {
        this.carousel = element;
        this.slides = this.carousel.querySelectorAll('.template-card');
        this.currentSlide = 0;
        this.slideWidth = this.slides[0].offsetWidth;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.setupTouchEvents();
        this.setupAutoPlay();
        this.setupNavigation();
    }
    
    setupTouchEvents() {
        this.carousel.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
    }
    
    handleSwipe() {
        const swipeDistance = this.touchEndX - this.touchStartX;
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        }
    }
    
    setupAutoPlay() {
        setInterval(() => this.nextSlide(), 5000);
    }
    
    setupNavigation() {
        const nav = document.createElement('div');
        nav.className = 'carousel-nav';
        
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => this.prevSlide());
        
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => this.nextSlide());
        
        nav.appendChild(prevBtn);
        nav.appendChild(nextBtn);
        this.carousel.appendChild(nav);
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    }
    
    updateSlides() {
        const offset = -this.currentSlide * this.slideWidth;
        this.carousel.style.transform = `translateX(${offset}px)`;
    }
}

// Pricing Toggle Animation
const initPricingToggle = () => {
    const toggle = document.querySelector('.pricing-toggle');
    const monthlyPrices = document.querySelectorAll('.price-monthly');
    const yearlyPrices = document.querySelectorAll('.price-yearly');
    
    if (toggle) {
        toggle.addEventListener('change', () => {
            monthlyPrices.forEach(price => price.classList.toggle('active'));
            yearlyPrices.forEach(price => price.classList.toggle('active'));
        });
    }
};

// Statistics Counter Animation
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const step = duration / 50;
    
    const counter = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        }
    }, step);
};

// Contact Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            if (!contactForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                // Here you would typically send the form data to your server
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };
                
                // Show success message
                showToast('Message sent successfully! We will get back to you soon.');
                contactForm.reset();
            }
            
            contactForm.classList.add('was-validated');
        });
    }
});

// Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }, 100);
}

// Particles Background for Contact Hero
document.addEventListener('DOMContentLoaded', function() {
    const particlesBg = document.getElementById('particles-bg');
    if (particlesBg) {
        particlesJS('particles-bg', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: false
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
});

// Pricing Toggle
document.addEventListener('DOMContentLoaded', function() {
    const billingToggle = document.getElementById('billingToggle');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            document.body.classList.toggle('annual-pricing', this.checked);
            
            // Update pricing display
            pricingCards.forEach(card => {
                const monthlyPrice = card.querySelector('.amount.monthly');
                const annualPrice = card.querySelector('.amount.annual');
                
                if (this.checked) {
                    if (monthlyPrice) monthlyPrice.style.display = 'none';
                    if (annualPrice) annualPrice.style.display = 'inline';
                } else {
                    if (monthlyPrice) monthlyPrice.style.display = 'inline';
                    if (annualPrice) annualPrice.style.display = 'none';
                }
            });
            
            // Add price change animation
            pricingCards.forEach(card => {
                card.classList.add('price-change');
                setTimeout(() => {
                    card.classList.remove('price-change');
                }, 300);
            });
        });
    }
});

// Pricing Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            pricingCards.forEach(c => c.classList.remove('hover'));
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });
});

// FAQ Accordion Animation
document.addEventListener('DOMContentLoaded', function() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Remove active class from all buttons
            accordionButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button if expanding
            if (!isExpanded) {
                this.classList.add('active');
            }
        });
    });
});

// Smooth Scroll for Pricing Links
document.addEventListener('DOMContentLoaded', function() {
    const pricingLinks = document.querySelectorAll('a[href^="#"]');
    
    pricingLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Sign Up Flow
document.addEventListener('DOMContentLoaded', function() {
    const getStartedButtons = document.querySelectorAll('.pricing-action .btn');
    
    getStartedButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get plan details
            const pricingCard = this.closest('.pricing-card');
            const planName = pricingCard.querySelector('h3').textContent;
            const isAnnual = document.body.classList.contains('annual-pricing');
            
            // Store selected plan in session storage
            const planDetails = {
                name: planName,
                billing: isAnnual ? 'annual' : 'monthly',
                timestamp: new Date().toISOString()
            };
            sessionStorage.setItem('selectedPlan', JSON.stringify(planDetails));
            
            // Different flow for enterprise plan
            if (planName.toLowerCase() === 'enterprise') {
                // Show enterprise contact modal
                const modal = new bootstrap.Modal(document.getElementById('enterpriseModal'));
                modal.show();
            } else {
                // Redirect to sign up page with plan info
                const params = new URLSearchParams({
                    plan: planName.toLowerCase(),
                    billing: isAnnual ? 'annual' : 'monthly'
                });
                window.location.href = `signup.html?${params.toString()}`;
            }
        });
    });
    
    // Enterprise Contact Form Handler
    const enterpriseForm = document.getElementById('enterpriseForm');
    if (enterpriseForm) {
        enterpriseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            
            // Simulate API call (replace with actual API endpoint)
            setTimeout(() => {
                // Reset form and button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Show success message
                showToast('Thank you! Our team will contact you shortly.');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('enterpriseModal'));
                modal.hide();
                
                // Clear form
                this.reset();
            }, 1500);
        });
    }
});

// Toast Notification System
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        // Create toast container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(container);
    }
    
    // Create toast element
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    // Add toast to container
    document.getElementById('toastContainer').insertAdjacentHTML('beforeend', toastHtml);
    
    // Initialize and show toast
    const toastElement = document.querySelector('.toast:last-child');
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    window.addEventListener('scroll', animateOnScroll);
    initSmoothScroll();
    
    // Initialize carousels
    const templateCarousel = document.querySelector('.template-carousel');
    if (templateCarousel) {
        new TemplateCarousel(templateCarousel);
    }
    
    // Initialize pricing toggle
    initPricingToggle();
    
    // Initialize testimonial carousel
    initTestimonialCarousel();
    
    // Initialize statistics animation
    const stats = document.querySelectorAll('.statistics-item h3');
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.5
    });
    
    stats.forEach(stat => observer.observe(stat));
    
    // Add parallax effect to CTA background
    const parallaxBg = document.querySelector('.bg-parallax');
    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            const offset = window.pageYOffset;
            parallaxBg.style.backgroundPositionY = `${offset * 0.5}px`;
        });
    }
});
