// Theme Management System
const initTheme = () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateThemeIcon(theme);
};

const updateThemeIcon = (theme) => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun text-accentGold';
        } else {
            icon.className = 'fas fa-moon text-accentGreen';
        }
    }
};

const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
};

document.addEventListener('DOMContentLoaded', () => {
    // Re-initialize to ensure icon state is correct
    initTheme();

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // RTL Toggle Logic
    const rtlToggles = document.querySelectorAll('#rtl-toggle, #mobile-rtl-toggle, #dashboard-rtl-toggle');
    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
            document.documentElement.setAttribute('dir', isRTL ? 'ltr' : 'rtl');
            localStorage.setItem('dir', isRTL ? 'ltr' : 'rtl');
        });
    });

    // Restore RTL state
    if (localStorage.getItem('dir') === 'rtl') {
        document.documentElement.setAttribute('dir', 'rtl');
    }

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.remove('hidden');
            setTimeout(() => mobileMenuOverlay.classList.add('active'), 10);
            document.body.classList.add('overflow-hidden');
        });
    }
    
    const closeMobileMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('active');
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            setTimeout(() => mobileMenuOverlay.classList.add('hidden'), 300);
        }
        document.body.classList.remove('overflow-hidden');
    };

    if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Close on link click
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Mist Particles Generator
    function createMist() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        const mist = document.createElement('div');
        mist.className = 'mist-particle animate-mist absolute w-24 h-24 bg-white/10 rounded-full blur-3xl pointer-events-none';
        mist.style.left = Math.random() * 100 + '%';
        mist.style.bottom = '0';
        heroSection.appendChild(mist);
        
        setTimeout(() => {
            mist.remove();
        }, 8000);
    }
    
    if (document.querySelector('.hero-section')) {
        setInterval(createMist, 2000);
    }

    // Scroll reveal logic
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // Active Navigation Highlighting logic
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('nav a, #mobile-menu a, aside a');

    navLinks.forEach(link => {
        if (link.classList.contains('brand-logo') || link.innerText.toLowerCase().includes('sign up')) return;

        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            // Check if it is a main nav link
            if (link.closest('nav') && !link.closest('#mobile-menu')) {
                link.classList.add('nav-link-active');
            } 
            // Check if it is a mobile menu link
            else if (link.closest('#mobile-menu')) {
                link.classList.add('mobile-nav-link-active');
            }
            // Check if it is a dashboard sidebar link
            else if (link.closest('aside')) {
                link.classList.add('active');
            }
            
            link.setAttribute('aria-current', 'page');
        }
    });

    // Dashboard Sidebar Logic
    const dashHamburger = document.getElementById('dashboard-hamburger');
    const dashSidebar = document.getElementById('dashboard-sidebar');
    const closeDashSidebar = document.getElementById('close-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (dashHamburger && dashSidebar) {
        dashHamburger.addEventListener('click', () => {
            dashSidebar.classList.remove('-translate-x-full');
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('hidden');
                setTimeout(() => sidebarOverlay.classList.add('opacity-100'), 10);
            }
            document.body.classList.add('overflow-hidden');
        });
    }

    const hideDashSidebar = () => {
        if (!dashSidebar) return;
        dashSidebar.classList.add('-translate-x-full');
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('opacity-100');
            setTimeout(() => sidebarOverlay.classList.add('hidden'), 300);
        }
        document.body.classList.remove('overflow-hidden');
    };

    if (closeDashSidebar) closeDashSidebar.addEventListener('click', hideDashSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', hideDashSidebar);

    // Close dashboard sidebar on link click (mobile only)
    const dashSidebarLinks = dashSidebar ? dashSidebar.querySelectorAll('a') : [];
    dashSidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                hideDashSidebar();
            }
        });
    });
});

// Scroll Header effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('nav');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-xl');
        } else {
            navbar.classList.remove('shadow-xl');
        }
    }
});
