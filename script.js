// Particles Configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 50, // Уменьшили количество частиц
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#FF3366'
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
            color: '#FF3366',
            opacity: 0.2,
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

// Enhanced Navigation
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.sidebar nav ul li a');

function updateActiveSection() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveSection);
});
updateActiveSection();

// Enhanced Scroll Reveal with performance optimization
const reveals = document.querySelectorAll('.reveal');
let scrollTimeout;

function reveal() {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }, 100);
}

window.addEventListener('scroll', reveal);
reveal();

// Performance optimization
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical images
    const imagesToPreload = document.querySelectorAll('.project-image, .hero-image img');
    const preloadPromises = Array.from(imagesToPreload).map(image => {
        return new Promise((resolve, reject) => {
            if (image.tagName === 'IMG') {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = image.src;
            } else {
                const bgUrl = image.style.backgroundImage.slice(5, -2);
                if (bgUrl) {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = bgUrl;
                } else {
                    resolve();
                }
            }
        });
    });

    // Initialize features after critical images are loaded
    Promise.all(preloadPromises)
        .then(() => initPreloader())
        .catch(() => initPreloader()); // Continue even if some images fail to load

    // Initialize other features after preloader
    document.addEventListener('preloaderDone', () => {
        initParallax();
        initParticles();
        initProjectCards();
        initModal();
        initNavigation();
        initReveal();
    });
});

// Optimized parallax effect
function initParallax() {
    const parallaxItems = document.querySelectorAll('[data-speed]');
    let ticking = false;
    let lastScrollY = window.scrollY;
    
    function updateParallax() {
        parallaxItems.forEach(item => {
            const speed = parseFloat(item.getAttribute('data-speed')) || 0.1;
            const yPos = -(lastScrollY * speed);
            item.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    // Initial update
    updateParallax();
}

// Optimized preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.preloader-progress');
    const body = document.body;
    
    if (!preloader || !progress) return;
    
    body.classList.add('loading');
    
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            preloader.classList.add('preloader-finish');
            
            setTimeout(() => {
                body.classList.remove('loading');
                preloader.style.display = 'none';
                document.dispatchEvent(new CustomEvent('preloaderDone'));
            }, 500);
        } else {
            width += 2;
            progress.style.width = width + '%';
        }
    }, 20);
}

// Mobile Menu Toggle with performance optimization
const menuBtn = document.querySelector('.menu-btn');
const sidebar = document.querySelector('.sidebar');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    if(!menuOpen) {
        menuBtn.classList.add('open');
        sidebar.classList.add('open');
        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        sidebar.classList.remove('open');
        menuOpen = false;
    }
});

// Optimized click outside handler
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && menuOpen && 
        !sidebar.contains(e.target) && 
        !menuBtn.contains(e.target)) {
        menuBtn.classList.remove('open');
        sidebar.classList.remove('open');
        menuOpen = false;
    }
});

// Form Validation
const contactForm = document.getElementById('contactForm');
const formGroups = contactForm.querySelectorAll('.form-group');

function validateField(field) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');

    if (field.hasAttribute('required') && !value) {
        formGroup.classList.add('error');
        errorMessage.textContent = 'This field is required';
        return false;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            formGroup.classList.add('error');
            errorMessage.textContent = 'Please enter a valid email address';
            return false;
        }
    }

    formGroup.classList.remove('error');
    return true;
}

// Add input validation listeners
formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    input.addEventListener('input', () => validateField(input));
    input.addEventListener('blur', () => validateField(input));
});

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (!validateField(input)) {
            isValid = false;
        }
    });

    if (isValid) {
        console.log('Form submitted successfully');
        contactForm.reset();
        
        // Redirect to Telegram
        window.open('https://t.me/iryawww', '_blank');
    }
});

// Initialize project cards
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.querySelector('.project-modal');
    const modalContent = modal.querySelector('.modal-content');
    const filterButtons = document.querySelectorAll('.nav-btn');

    // Initialize project filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-filter');
            filterProjects(category);
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Initialize modal functionality
    projectCards.forEach(card => {
        const detailsBtn = card.querySelector('.project-link');
        
        detailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showModal(card);
        });
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function showModal(card) {
    const modal = document.querySelector('.project-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Get project details
    const category = card.querySelector('.project-category').textContent;
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    const techTags = Array.from(card.querySelectorAll('.project-tech span')).map(tag => tag.textContent);
    const projectImage = card.querySelector('.project-image').style.backgroundImage;
    
    // Create modal content
    modalContent.innerHTML = `
        <div class="modal-header">
            <div>
                <div class="project-category">${category}</div>
                <h2 class="modal-title">${title}</h2>
            </div>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="modal-gallery">
                <div class="gallery-main">
                    <img src="${projectImage.replace(/url\(['"](.+)['"]\)/, '$1')}" alt="${title}">
                </div>
            </div>
            <div class="modal-info">
                <div class="modal-description">${description}</div>
                <div class="modal-tech-tags">
                    ${techTags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
                <div class="modal-actions">
                    <a href="#" class="modal-btn modal-btn-primary">
                        View Project
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path fill="currentColor" d="M14 2v12H2V2h12m0-2H2C0.9 0 0 0.9 0 2v12c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2V2c0-1.1-0.9-2-2-2z"/>
                            <path fill="currentColor" d="M6.7 11.7L6 11l3.3-3.3L6 4.3 6.7 3.6l4 4-4 4.1z"/>
                        </svg>
                    </a>
                    <button class="modal-btn modal-btn-secondary">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add close button functionality
    const closeBtn = modalContent.querySelector('.modal-close');
    const secondaryCloseBtn = modalContent.querySelector('.modal-btn-secondary');
    
    closeBtn.addEventListener('click', closeModal);
    secondaryCloseBtn.addEventListener('click', closeModal);

    // Show modal with animation
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.project-modal');
    document.body.style.overflow = '';
    modal.classList.remove('active');
}

// Show/Hide no projects message
function showNoProjectsMessage() {
    let message = document.querySelector('.no-projects-message');
    const projectsContainer = document.querySelector('.projects-container');
    
    if (!message) {
        message = document.createElement('div');
        message.className = 'no-projects-message';
        message.innerHTML = `
            <div class="message-content">
                <svg width="48" height="48" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p>No projects found in this category</p>
                <button class="reset-filter">Show all projects</button>
            </div>
        `;
        projectsContainer.appendChild(message);
        
        // Add click handler for reset button
        message.querySelector('.reset-filter').addEventListener('click', () => {
            const allButton = document.querySelector('[data-filter="all"]');
            if (allButton) {
                allButton.click();
            }
        });
    }
    
    // Show message with animation
    requestAnimationFrame(() => {
        message.style.display = 'flex';
        setTimeout(() => {
            message.style.opacity = '1';
        }, 10);
    });
}

// Optimized navigation
function initNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    let ticking = false;
    
    function updateActiveSection() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateActiveSection);
            ticking = true;
        }
    }, { passive: true });

    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize particles with optimized settings
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 20, density: { enable: true, value_area: 800 } },
            color: { value: '#FF3366' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#FF3366',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.5,
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
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: false },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 0.5 } }
            }
        },
        retina_detect: true
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            menuBtn.classList.remove('open');
            sidebar.classList.remove('open');
        }
    });
});

// Testimonials slider
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.nav-dot');
let currentSlide = 0;

function showSlide(index) {
    testimonialSlides.forEach((slide, i) => {
        slide.classList.remove('active');
        testimonialDots[i].classList.remove('active');
        slide.style.transform = `translateX(${100 * (i - index)}%)`;
    });
    testimonialSlides[index].classList.add('active');
    testimonialDots[index].classList.add('active');
}

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-advance testimonials
setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialSlides.length;
    showSlide(currentSlide);
}, 5000);

// Initialize first slide
showSlide(0);

// Optimized scroll reveal
function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    let ticking = false;
    
    function updateReveal() {
        const windowHeight = window.innerHeight;
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - 150) {
                element.classList.add('active');
            }
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateReveal);
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    updateReveal();
}

// Enhanced project filtering function
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    let hasVisibleProjects = false;
    const projectsContainer = document.querySelector('.projects-container');
    const visibleProjects = [];

    projects.forEach(project => {
        const projectCategory = project.querySelector('.project-category').textContent.toLowerCase();
        
        // Check if project matches the selected category
        const shouldShow = category === 'all' || 
                         (category === 'web' && projectCategory.includes('web')) ||
                         (category === 'ai' && projectCategory.includes('ai'));

        if (shouldShow) {
            visibleProjects.push(project);
            hasVisibleProjects = true;
        }
    });

    // Animate and reorder visible projects
    if (hasVisibleProjects) {
        // First, hide all projects with animation
        projects.forEach(project => {
            project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
        });

        // After hiding animation, reorder and show visible projects
        setTimeout(() => {
            // Remove all projects from container
            projects.forEach(project => {
                project.style.display = 'none';
            });

            // Add visible projects back in new order
            visibleProjects.forEach((project, index) => {
                projectsContainer.appendChild(project);
                project.style.display = 'block';
                
                // Stagger the appearance of each project
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 300);

        // Hide no projects message if it exists
        const existingMessage = document.querySelector('.no-projects-message');
        if (existingMessage) {
            existingMessage.style.display = 'none';
        }
    } else {
        // Show no projects message
        showNoProjectsMessage();
    }
}

// Preloader text
const preloaderText = document.querySelector('.preloader-text');
if (preloaderText) {
    preloaderText.innerHTML = `
        <span>З</span>
        <span>А</span>
        <span>Г</span>
        <span>Р</span>
        <span>У</span>
        <span>З</span>
        <span>К</span>
        <span>А</span>
    `;
}

// Function to get project images
function getProjectImages(projectId) {
    const images = {
        'project1': [
            'images/projects/project1-1.jpg',
            'images/projects/project1-2.jpg',
            'images/projects/project1-3.jpg'
        ],
        'project2': [
            'images/projects/project2-1.jpg',
            'images/projects/project2-2.jpg',
            'images/projects/project2-3.jpg'
        ],
        'project3': [
            'images/projects/project3-1.jpg',
            'images/projects/project3-2.jpg',
            'images/projects/project3-3.jpg'
        ]
    };
    return images[projectId] || [
        'images/projects/default-1.jpg',
        'images/projects/default-2.jpg',
        'images/projects/default-3.jpg'
    ];
} 