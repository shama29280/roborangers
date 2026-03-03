// ========================================
// ROBO RANGER WEBSITE - MAIN JAVASCRIPT
// ========================================

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    initProtection(); // run early to block unwanted actions and protect assets
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
// PROTECTION MODULE
// ========================================
function initProtection() {
    // core event handlers are encoded to obscure them from casual view
    var encoded = "ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLGZ1bmN0aW9uKGUpe2UucHJldmVu" +
                  "dERlZmF1bHQoKTt9KTtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLGZ1bmN0aW9uKGUpe2lmKGUudGFyZ2V0LnRhZ05hbWU9PT0nSU1HJyllLnByZXZlbnREZWZhdWx0KCk7fSk7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsZnVuY3Rpb24oZSl7aWYoZS5jdHJsS2V5fHxlLm1ldGFLZXkpe3ZhciBrPWUua2V5LnRvTG93ZXJDYXNlKCk7aWYoaz09PSdzJ3x8az09PSd1J3x8KGUuc2hpZnRLZXkmJms9PT0naScpKWUucHJldmVudERlZmF1bHQoKTt9aWYoZS5rZXk9PT0nRjEyJyllLnByZXZlbnREZWZhdWx0KCk7fSk7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2VsZWN0c3RhcnQnLGZ1bmN0aW9uKGUpe2lmKGUudGFyZ2V0LnRhZ05hbWU9PT0nSU1HJyllLnByZXZlbnREZWZhdWx0KCk7fSk7c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtpZih3aW5kb3cub3V0ZXJXaWR0aC13aW5kb3cuaW5uZXJXaWR0aD4xNjApe2NvbnNvbGUud2FybignRGV2VG9vbHMgZGV0ZWN0ZWQnKTt9fSwxMDAwKTs=";
    try {
        eval(atob(encoded));
    } catch (e) {
        console.warn('Protection script failed to initialize', e);
    }

    // append a randomized query parameter to every background url we control
    document.querySelectorAll('.slider-slide, .gallery-item, .illustration').forEach(el => {
        const bg = window.getComputedStyle(el).backgroundImage || '';
        const matches = /url\(["']?(.*?)["']?\)/.exec(bg);
        if (matches && matches[1]) {
            let url = matches[1];
            // don't add repeatedly if already has v=
            if (!url.includes('v=')) {
                const rnd = Math.random().toString(36).substr(2,6);
                el.style.backgroundImage = 'url("' + url + (url.includes('?') ? '&' : '?') + 'v=' + rnd + '")';
            }
        }
    });
}


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
// ROBO RANGERS CONTACT FORM
// ========================================

function initFormHandling() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    // prevent multiple registrations if this function called twice accidentally
    if (form.dataset.handlerAttached) return;
    form.dataset.handlerAttached = "true";

    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // ✅ Prevent default redirect
        console.log('contactForm.submit event fired');

        const button = form.querySelector("button");
        const originalText = button.innerText;

        // disable click re‑trigger immediately
        if (button.disabled) {
            console.log('submit button already disabled, aborting');
            return;
        }

        // Disable button + show loading state
        button.disabled = true;
        button.innerText = "Submitting...";

        try {
            // use explicit URL instead of relying on form.action
            const url = "https://formspree.io/f/mnjbykeo";
            console.log('Sending fetch to', url);
            const response = await fetch(url, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                console.log('Fetch succeeded');
                showMessage("🎉 Thank you! We’ll contact you within 24 hours.", "success");
                form.reset();
            } else {
                console.log('Fetch returned non-ok status', response.status);
                showMessage("❌ Oops! Something went wrong. Please try again.", "error");
            }

        } catch (error) {
            console.log('Fetch error', error);
            showMessage("⚠️ Network error. Please check your connection.", "error");
        }

        // Restore button
        button.disabled = false;
        button.innerText = originalText;
    });
}


// ========================================
// SUCCESS / ERROR MESSAGE
// ========================================

function showMessage(message, type) {

    // Remove existing message if any
    const existing = document.querySelector(".form-alert");
    if (existing) existing.remove();

    const alertBox = document.createElement("div");
    alertBox.className = "form-alert";
    alertBox.innerText = message;

    alertBox.style.marginBottom = "20px";
    alertBox.style.padding = "12px 16px";
    alertBox.style.borderRadius = "8px";
    alertBox.style.fontWeight = "500";
    alertBox.style.textAlign = "center";
    alertBox.style.transition = "opacity 0.3s ease";

    if (type === "success") {
        alertBox.style.background = "#e6fffa";
        alertBox.style.color = "#065f46";
        alertBox.style.border = "1px solid #34d399";
    } else {
        alertBox.style.background = "#ffe6e6";
        alertBox.style.color = "#991b1b";
        alertBox.style.border = "1px solid #ef4444";
    }

    const form = document.getElementById("contactForm");
    form.parentNode.insertBefore(alertBox, form);

    // Auto remove after 5 seconds
    setTimeout(() => {
        alertBox.style.opacity = "0";
        setTimeout(() => alertBox.remove(), 300);
    }, 5000);
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
            // read the computed background image (the URL is wrapped in url("...") )
            const bg = window.getComputedStyle(item).backgroundImage;
            const matches = /url\(["']?(.*?)["']?\)/.exec(bg);
            const src = matches ? matches[1] : '';
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position:fixed;inset:0;background:#000d;
                display:flex;align-items:center;justify-content:center;z-index:3000;
            `;
            const big = document.createElement('img');
            big.src = src;
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
    // append a small random query string to make the URL less guessable
    document.querySelectorAll('img[data-src]').forEach(img => {
        let url = img.dataset.src || '';
        if (url) {
            const rnd = Math.random().toString(36).substr(2,6);
            img.src = url + (url.includes('?') ? '&' : '?') + 'v=' + rnd;
        }
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