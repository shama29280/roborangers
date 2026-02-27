// ========================================
// ROBO RANGER WEBSITE - MAIN JAVASCRIPT
// ========================================

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initSlider();
    initCounters();
    initFormHandling();
    initIntersectionObserver();
    initMobileMenu();
    initGalleryLightbox();
    initLazyLoading();
});

// ========================================
// NAVBAR FUNCTIONALITY
// ========================================

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const ctaBtn = document.querySelector('.nav-cta');

    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    closeMobileMenu();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    ctaBtn.addEventListener('click', function () {
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    });
}

// ========================================
// MOBILE MENU
// ========================================

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

function closeMobileMenu() {
    document.querySelector('.hamburger')?.classList.remove('active');
    document.querySelector('.nav-menu')?.classList.remove('active');
}

// ========================================
// SWIPER
// ========================================

function initSlider() {
    new Swiper('.slider-container', {
        loop: true,
        autoplay: { delay: 5000 },
        pagination: {
            el: '.slider-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.slider-button-next',
            prevEl: '.slider-button-prev'
        },
        effect: 'fade',
        speed: 1000
    });
}

// ========================================
// COUNTERS
// ========================================

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = +counter.dataset.count;
                    let value = 0;
                    const step = Math.ceil(target / 50);

                    const update = () => {
                        value += step;
                        if (value < target) {
                            counter.textContent = value;
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    update();
                });
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.stats-section'));
}

// ========================================
// FORM
// ========================================

function initFormHandling() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        showMessage("Thank you! We'll contact you soon.", "success");
        form.reset();
    });
}

function showMessage(msg, type) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.marginBottom = '15px';
    el.style.color = type === 'success' ? 'green' : 'red';
    document.getElementById('contactForm').before(el);
    setTimeout(() => el.remove(), 4000);
}

// ========================================
// VIDEO MODAL (✅ FIXED)
// ========================================

const levelVideos = {
    1: "videos/level1.mp4",
    2: "videos/level2.mp4",
    3: "videos/level3.mp4",
    4: "videos/level4.mp4",
    5: "videos/level5.mp4",
    6: "videos/level6.mp4"
};

function openVideoModal(level) {
    const videoModal = document.getElementById("videoModal");
    const modalVideo = document.getElementById("modalVideo");
    const videoSource = document.getElementById("videoSource");

    videoSource.src = levelVideos[level];
    modalVideo.load();
    videoModal.style.display = "flex";
    modalVideo.play();
    document.body.style.overflow = "hidden";
}

function closeVideoModal() {
    const videoModal = document.getElementById("videoModal");
    const modalVideo = document.getElementById("modalVideo");

    modalVideo.pause();
    modalVideo.currentTime = 0;
    videoModal.style.display = "none";
    document.body.style.overflow = "auto";
}

// ========================================
// GALLERY LIGHTBOX
// ========================================

function initGalleryLightbox() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position:fixed;inset:0;background:#000d;
                display:flex;align-items:center;justify-content:center;z-index:3000;
            `;
            const big = document.createElement('img');
            big.src = img.src;
            big.style.maxWidth = '90%';
            overlay.appendChild(big);
            overlay.onclick = () => overlay.remove();
            document.body.appendChild(overlay);
        });
    });
}

// ========================================
// LAZY LOAD
// ========================================

function initLazyLoading() {
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
    });
}

// ========================================
// CONSOLE
// ========================================

console.log("🤖 RoboRangers loaded successfully");


const thumbnail = document.getElementById('videoThumbnail');
    const playBtn = document.getElementById('thumbnailPlayButton');
    const video = document.getElementById('promoVideo');

    function playVideo() {
        thumbnail.style.display = 'none';
        playBtn.style.display = 'none';
        video.style.display = 'block';
        video.play();
    }

    thumbnail.addEventListener('click', playVideo);
    playBtn.addEventListener('click', playVideo);