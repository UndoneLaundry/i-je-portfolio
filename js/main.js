// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initActiveLinks();
    initLightbox();
    initExpandableSections();
    initScrollAnimations();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// ===== ACTIVE LINK HIGHLIGHTING =====
function initActiveLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        // Remove active class from all links first
        link.classList.remove('active');
        
        // Add active class to current page link
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage.includes('html') && linkPage === currentPage)) {
            link.classList.add('active');
        }
    });
}

// ===== LIGHTBOX FOR IMAGES =====
function initLightbox() {
    // Create lightbox element if it doesn't exist
    if (!document.getElementById('lightbox')) {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox">
                <span class="lightbox-close">&times;</span>
                <img class="lightbox-img" id="lightbox-image">
                <div class="lightbox-caption" id="lightbox-caption"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    
    // Add click event to all gallery images
    document.querySelectorAll('.gallery-img, .certificate-img').forEach(img => {
        img.addEventListener('click', function() {
            lightboxImg.src = this.src;
            lightboxCaption.textContent = this.alt || 'Image';
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close lightbox
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Add lightbox styles
    const lightboxStyles = `
        .lightbox {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 2000;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
        
        .lightbox-img {
            max-width: 90%;
            max-height: 80%;
            object-fit: contain;
            border-radius: 4px;
        }
        
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 40px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .lightbox-close:hover {
            color: #f59e0b;
        }
        
        .lightbox-caption {
            color: white;
            margin-top: 20px;
            text-align: center;
            max-width: 80%;
        }
    `;
    
    // Add styles if not already present
    if (!document.getElementById('lightbox-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'lightbox-styles';
        styleSheet.textContent = lightboxStyles;
        document.head.appendChild(styleSheet);
    }
}

// ===== EXPANDABLE SECTIONS =====
function initExpandableSections() {
    // Add "View More" buttons to long content sections
    const projectDetails = document.querySelectorAll('.project-details');
    
    projectDetails.forEach((details, index) => {
        if (details.textContent.length > 300) {
            // Create view more button
            const button = document.createElement('button');
            button.className = 'view-more-btn';
            button.innerHTML = '<i class="fas fa-chevron-down"></i> View More Details';
            button.dataset.index = index;
            
            // Wrap content
            const content = details.textContent;
            const shortContent = content.substring(0, 300) + '...';
            const fullContent = content;
            
            details.textContent = shortContent;
            details.dataset.fullContent = fullContent;
            details.dataset.shortContent = shortContent;
            details.dataset.isExpanded = 'false';
            
            // Insert button after details
            details.insertAdjacentElement('afterend', button);
            
            // Add click event
            button.addEventListener('click', function() {
                const idx = this.dataset.index;
                const targetDetails = projectDetails[idx];
                
                if (targetDetails.dataset.isExpanded === 'false') {
                    targetDetails.textContent = targetDetails.dataset.fullContent;
                    this.innerHTML = '<i class="fas fa-chevron-up"></i> View Less';
                    targetDetails.dataset.isExpanded = 'true';
                } else {
                    targetDetails.textContent = targetDetails.dataset.shortContent;
                    this.innerHTML = '<i class="fas fa-chevron-down"></i> View More Details';
                    targetDetails.dataset.isExpanded = 'false';
                }
            });
        }
    });
    
    // Add view more button styles
    const viewMoreStyles = `
        .view-more-btn {
            background: none;
            border: 2px solid #2563eb;
            color: #2563eb;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            margin-top: 1rem;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .view-more-btn:hover {
            background-color: #2563eb;
            color: white;
        }
    `;
    
    if (!document.getElementById('view-more-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'view-more-styles';
        styleSheet.textContent = viewMoreStyles;
        document.head.appendChild(styleSheet);
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-scroll');
    
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };
    
    // Set initial state for fade-in-scroll elements
    fadeElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    
    // Check on load
    fadeInOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', fadeInOnScroll);
}

// ===== HELPER FUNCTIONS =====
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-SG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

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
