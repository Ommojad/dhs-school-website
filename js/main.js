/* ============================================================
   DEOLALI HIGH SCHOOL — Main JavaScript
   Handles: Navbar, Scroll Animations, Counters, Slider, Menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Remove preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('hidden'), 800);
        setTimeout(() => preloader.remove(), 1300);
    }

    // ---- Sticky Navbar with Background Change ----
    const navbar = document.querySelector('.navbar');
    const handleNavScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll(); // Initial check

    // ---- Mobile Hamburger Menu ----
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            hamburger.classList.add('active');
            navLinks.classList.add('open');
            if (navOverlay) navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Intersection Observer: Scroll Animations ----
    const animatedElements = document.querySelectorAll(
        '.fade-in, .fade-in-left, .fade-in-right, .scale-in'
    );

    const observerOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate once only
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ---- Animated Number Counters ----
    const counters = document.querySelectorAll('[data-count]');
    let countersAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // ms
            const steps = 60;
            const stepValue = target / steps;
            let current = 0;
            let step = 0;

            const interval = setInterval(() => {
                step++;
                current = Math.min(Math.round(stepValue * step), target);
                counter.textContent = current.toLocaleString() + suffix;
                if (step >= steps) {
                    counter.textContent = target.toLocaleString() + suffix;
                    clearInterval(interval);
                }
            }, duration / steps);
        });
    };

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsBar);
    }

    // ---- Testimonials Slider ----
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const startSlider = () => {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    };

    if (slides.length > 0) {
        showSlide(0);
        startSlider();

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(i);
                startSlider();
            });
        });
    }

    // ---- Back to Top Button ----
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Scroll Indicator Click ----
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.stats-bar') || document.querySelector('#about');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ---- Active Nav Link Highlight on Scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinksArr = document.querySelectorAll('.nav-links a[href^="#"]');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinksArr.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + id) {
                        link.style.color = 'var(--gold-400)';
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav);

    // ---- Parallax-like subtle movement for hero shapes ----
    const heroShapes = document.querySelectorAll('.hero-shape');
    if (heroShapes.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroShapes.forEach((shape, i) => {
                const speed = (i + 1) * 0.15;
                shape.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }
});
