// Cursor
// reference: https://dev.to/uuuulala/coding-an-interactive-and-damn-satisfying-cursor-7-simple-steps-2kb-of-code-1c8b
    //        https://www.youtube.com/watch?v=f5ZswIE_SgY
    //        https://www.youtube.com/watch?v=Th_OvCwQHpw

// AI debug:
    // 1. the text is not showing in the right position
    // 2. the mouse takes too long to load
    // 3. too laggy (I used DOM approach first > failed changing to canvas apprach) did not solved

const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン的一是不了人我在有他這為之大來以個中上們到說國和地也子時道出而要於就下得可你年生自會那後能對著事其裡所去行過家十用發天如然作方成者多日都三小軍二無同麼經法當起與好看學進種將還分此心前面又定見只主沒公從$@#%&*+=<>?/\\|[]{}';

function startMatrixStreams() {
    createMatrixStream();

    const nextDelay = 80 + Math.random() * 200;
    setTimeout(startMatrixStreams, nextDelay);
}

let mouseX = 0;
let mouseY = 0;
let isOverMarquee = false;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        cursorGlow.style.left = mouseX + 'px';
        cursorGlow.style.top = mouseY + 'px';
    }

    const customCursor = document.getElementById('customCursor');
    if (customCursor) {
        customCursor.style.left = mouseX + 'px';
        customCursor.style.top = mouseY + 'px';
    }

    if (!isOverMarquee) {
        createCursorTrail(mouseX, mouseY);
    }
});

let lastTrailTime = 0;
function createCursorTrail(x, y) {
    const now = Date.now();
    if (now - lastTrailTime < 50) return;
    lastTrailTime = now;

    const trail = document.createElement('div');
    trail.className = 'cursorTrail';
    trail.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';

    document.body.appendChild(trail);

    setTimeout(() => {
        trail.style.opacity = '0';
        setTimeout(() => trail.remove(), 500);
    }, 100);
}

function getMousePosition() {
    return { x: mouseX, y: mouseY };
}


window.addEventListener('load', () => {
    // cursor glowing animation
    // Reference: https://www.youtube.com/watch?v=BfWZmBzVxlw
    const cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursorGlow';
    cursorGlow.className = 'cursorGlow';
    document.body.appendChild(cursorGlow);

    const customCursor = document.createElement('div');
    customCursor.id = 'customCursor';
    customCursor.className = 'customCursor';
    document.body.appendChild(customCursor);

    if (document.getElementById('landingTitle')) {
        startMatrixStreams();
    }


    // floating tip
    // Reference: https://www.w3schools.com/css/css_tooltip.asp (for CSS) and https://www.youtube.com/watch?v=iZS-tu08ZvQ (for JS)
    const floatingTip = document.createElement('div');
    floatingTip.className = 'tooltip';
    document.body.appendChild(floatingTip);

    document.querySelectorAll('[data-tooltip-src]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            const src = document.getElementById(el.dataset.tooltipSrc);
            if (src) floatingTip.innerHTML = src.innerHTML;
            floatingTip.classList.add('visible');
        });
        el.addEventListener('mouseleave', () => floatingTip.classList.remove('visible'));
        el.addEventListener('mousemove', e => {
            floatingTip.style.left = e.clientX + 'px';
            floatingTip.style.top  = e.clientY + 'px';
        });
    });



    // ul scroll
    // Vibe code with Claude (couldn't find any reference)
    // Debug:
        // 1. scrolling math logic
    const descSection = document.querySelector('.description');
    if (descSection) {
        const uls = descSection.querySelectorAll('ul');
        if (uls.length >= 3) {
            const melbUl = uls[1];
            const ausUl  = uls[2];

            const melbRect     = melbUl.getBoundingClientRect();
            const ausRect      = ausUl.getBoundingClientRect();
            const melbAbsTop   = melbRect.top + window.scrollY;
            const maxTranslate = Math.max(0, ausRect.left - melbRect.right - 20);

            if (maxTranslate > 0) {
                function updateMelbSlide() {
                    const scrollY     = window.scrollY;
                    const vh          = window.innerHeight;
                    const scrollStart = melbAbsTop - vh;
                    const scrollEnd   = melbAbsTop - vh / 3;
                    const range       = scrollEnd - scrollStart;
                    const progress    = range > 0 ? Math.max(0, Math.min(1, (scrollY - scrollStart) / range)) : 0;
                    melbUl.style.transform = `translateX(${maxTranslate * progress}px)`;
                }

                window.addEventListener('scroll', updateMelbSlide, { passive: true });
                updateMelbSlide();
            }
        }
    }

    // Hero SVGs
    // Reference: https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
    // AI debug: 
        // in terms of changing images (svg), changing opacity may be a better option.
    const heroImg = document.querySelector('.try');
    const heroSection = document.querySelector('.heroSection');
    if (heroImg && heroSection) {
        const svgs = Array.from({ length: 10 }, (_, i) => `./assets/img/hero${i}.svg`);

        svgs.forEach(src => { const img = new Image(); img.src = src; });

        const FADE = 50;

        requestAnimationFrame(() => {
            heroImg.style.transition = `opacity ${FADE}ms ease`;
        });

        let displayedSrc = heroImg.src;
        let targetSrc    = heroImg.src;
        let animating    = false;

        function step() {
            if (targetSrc === displayedSrc) {
                animating = false;
                heroImg.style.opacity = '1';
                return;
            }
            animating = true;
            heroImg.style.opacity = '0';
            setTimeout(() => {
                heroImg.src           = targetSrc; 
                displayedSrc          = targetSrc;
                heroImg.style.opacity = '1';
                setTimeout(step, FADE); 
            }, FADE);
        }

        function updateHeroSvg() {
            const progress = Math.max(0, Math.min(1, window.scrollY / heroSection.offsetHeight));
            const index    = Math.min(Math.floor(progress * svgs.length), svgs.length - 1);
            targetSrc = svgs[index];
            if (!animating) step();
        }

        window.addEventListener('scroll', updateHeroSvg, { passive: true });
        updateHeroSvg();
    }

    // Back to top
    document.querySelector('.backTop')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Project enlarge on scroll to center
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px' });

    document.querySelectorAll('.selectedProjectHeader').forEach(project => {
        projectObserver.observe(project);
    });

    // Hover cursor
    document.querySelectorAll('.marquee').forEach(marquee => {
        marquee.addEventListener('mouseenter', () => {
            isOverMarquee = true;
            customCursor.classList.add('marqueeHover');
            customCursor.textContent = 'Reach out';
        });
        marquee.addEventListener('mouseleave', () => {
            isOverMarquee = false;
            customCursor.classList.remove('marqueeHover');
            customCursor.textContent = '';
        });
    });

    // lunar link
    document.querySelectorAll('.marquee.Lunar').forEach(marquee => {
        marquee.addEventListener('mouseenter', () => {
            isOverMarquee = true;
            customCursor.classList.add('marqueeHover');
            customCursor.textContent = 'The actual Lunar Embassy Website I built!';
        });
        marquee.addEventListener('mouseleave', () => {
            isOverMarquee = false;
            customCursor.classList.remove('marqueeHover');
            customCursor.textContent = '';
        });
    });

    // circula link
    document.querySelectorAll('.marquee.circula').forEach(marquee => {
        marquee.addEventListener('mouseenter', () => {
            isOverMarquee = true;
            customCursor.classList.add('marqueeHover');
            customCursor.textContent = 'Visit Cirucla!';
        });
        marquee.addEventListener('mouseleave', () => {
            isOverMarquee = false;
            customCursor.classList.remove('marqueeHover');
            customCursor.textContent = '';
        });
    });

    // pacman link
    document.querySelectorAll('.marquee.pacman').forEach(marquee => {
        marquee.addEventListener('mouseenter', () => {
            isOverMarquee = true;
            customCursor.classList.add('marqueeHover');
            customCursor.textContent = 'See what is Pac-Man!';
        });
        marquee.addEventListener('mouseleave', () => {
            isOverMarquee = false;
            customCursor.classList.remove('marqueeHover');
            customCursor.textContent = '';
        });
    });
});


let tabReady = false;

//tab change
// Reference: https://www.w3schools.com/howto/howto_js_tabs.asp
// AI debug
    // 1. result tab is not the default tab
function openTab(event, section) {
    document.querySelectorAll(".tab")
    .forEach(tab => tab.classList.remove("active"));

    document.querySelectorAll(".tablinks")
    .forEach(btn => btn.classList.remove("active"));

    document.getElementById(section).classList.add("active");
    event.currentTarget.classList.add("active");

    const btnResult = document.getElementById('btnResult');
    const btnConcept = document.getElementById('btnConcept');
    if (btnResult && btnConcept) {
        if (section === 'projectResult') {
            btnResult.style.visibility = 'hidden';
            btnConcept.style.visibility = 'visible';
        } else if (section === 'projectConcept') {
            btnResult.style.visibility = 'visible';
            btnConcept.style.visibility = 'hidden';
        }

        if (tabReady) {
            const tabRow = document.querySelector('.projectTop');
            if (tabRow) {
                const top = tabRow.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    }
}


document.getElementById("uiuxTab")?.click();
document.getElementById("projectResultTab")?.click();
tabReady = true;


// result media loading animation
// shows a spinner over each image/video/iframe until it's actually ready,
// since Google Drive-hosted media can take a while to fetch
function initMediaLoading() {
    document.querySelectorAll('.resultMedia .panel').forEach(el => {
        const wrap = document.createElement('div');
        wrap.className = 'mediaWrap';
        el.parentNode.insertBefore(wrap, el);
        wrap.appendChild(el);

        const spinner = document.createElement('div');
        spinner.className = 'mediaSpinner';
        spinner.innerHTML = '<span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>';
        wrap.appendChild(spinner);

        const markLoaded = () => wrap.classList.add('mediaLoaded');

        if (el.tagName === 'IMG') {
            if (el.complete && el.naturalWidth > 0) {
                markLoaded();
            } else {
                el.addEventListener('load', markLoaded, { once: true });
                el.addEventListener('error', markLoaded, { once: true });
            }
        } else if (el.tagName === 'VIDEO') {
            if (el.readyState >= 2) {
                markLoaded();
            } else {
                el.addEventListener('loadeddata', markLoaded, { once: true });
                el.addEventListener('error', markLoaded, { once: true });
            }
        } else if (el.tagName === 'IFRAME') {
            el.addEventListener('load', markLoaded, { once: true });

            if (el.src.includes('drive.google.com')) {
                const overlay = document.createElement('div');
                overlay.className = 'driveOverlay';
                wrap.appendChild(overlay);
            }
        }
    });
}
initMediaLoading();


// swipeable tabs (mobile) — swipe left/right over the project content to
// move between tabs (result/concept, or ui/ux/graphics/others), reusing
// the existing openTab click handler so behaviour stays identical
function initSwipeableTabs() {
    const cate = document.querySelector('.projectsCate');
    const container = document.getElementById('projectsSection');
    if (!cate || !container) return;

    const tabs = Array.from(cate.querySelectorAll('.tablinks'));
    if (tabs.length < 2) return;

    const SWIPE_THRESHOLD = 60;
    let startX = 0;
    let startY = 0;
    let tracking = false;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        tracking = true;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        if (!tracking) return;
        tracking = false;

        const touch = e.changedTouches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return;

        const activeIndex = tabs.findIndex(btn => btn.classList.contains('active'));
        if (activeIndex === -1) return;

        let nextIndex = activeIndex;
        if (dx < 0 && activeIndex < tabs.length - 1) {
            nextIndex = activeIndex + 1;
        } else if (dx > 0 && activeIndex > 0) {
            nextIndex = activeIndex - 1;
        }

        if (nextIndex !== activeIndex) tabs[nextIndex].click();
    }, { passive: true });
}
initSwipeableTabs();


// dropdown toggle (e.g. "Image & Text" under graphics)
function toggleDropdown(header) {
    const panel = header.nextElementSibling;
    if (!panel) return;

    const expanded = header.getAttribute('aria-expanded') === 'true';
    if (expanded) {
        header.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
    } else {
        header.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
}

document.querySelectorAll('.dropdownToggle').forEach(header => {
    header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown(header);
        }
    });
});






// mobile nav
// inheren simialr approch from my previous project – lunar embassy
// AI debug: the page underneath will scroll even the nav bar is open already.
const sideNavCloseBtn = document.getElementById('sideNavCloseBtn');
const sideNav         = document.getElementById('sideNav');
const hamburger       = document.getElementById('menu');

let savedScroll = 0;

if (hamburger) {
    hamburger.onclick = function () {
        savedScroll = window.scrollY;
        document.body.style.top = `-${savedScroll}px`;
        document.body.classList.add('navLocked');
        if (sideNav) sideNav.classList.add('active');
    };
}

if (sideNavCloseBtn && sideNav) {
    sideNavCloseBtn.onclick = () => {
        sideNav.classList.remove('active');
        document.body.classList.remove('navLocked');
        document.body.style.top = '';
        window.scrollTo(0, savedScroll);
    };
}


// Page transition
// a solid circle, matching the custom cursor's colour, enlarges from the
// click point to cover the outgoing page, then the new page loads already
// covered and the same circle shrinks back down to reveal it
(function initPageTransition() {
    const DURATION    = 600; // ms
    const COLOR        = '#cd3e00';
    const STORAGE_KEY  = 'pageTransitionPoint';

    // an inline script in <head> already creates this (pre-covered, no
    // flash) when a transition is expected; reuse it instead of making a
    // second one, and only create fresh here for a plain/direct page load
    let circle = document.getElementById('pageTransitionCircle');
    if (!circle) {
        circle = document.createElement('div');
        circle.id = 'pageTransitionCircle';
        document.body.appendChild(circle);
    }

    function distanceToFarthestCorner(x, y) {
        const dx = Math.max(x, window.innerWidth - x);
        const dy = Math.max(y, window.innerHeight - y);
        return Math.sqrt(dx * dx + dy * dy);
    }

    // COVER: a solid circle grows from the click point until it fully
    // covers the viewport, hiding the outgoing page
    function coverPage(x, y, onDone) {
        const d = distanceToFarthestCorner(x, y) * 2;
        circle.style.boxShadow  = 'none';
        circle.style.background = COLOR;
        circle.style.left   = `${x}px`;
        circle.style.top    = `${y}px`;
        circle.style.width  = `${d}px`;
        circle.style.height = `${d}px`;
        circle.style.transition = 'none';
        circle.style.transform = 'translate(-50%, -50%) scale(0)';
        circle.getBoundingClientRect(); // force reflow before re-enabling transition
        circle.style.transition = `transform ${DURATION}ms ease`;
        requestAnimationFrame(() => {
            circle.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        circle.addEventListener('transitionend', function handler() {
            circle.removeEventListener('transitionend', handler);
            if (onDone) onDone();
        }, { once: true });
    }

    // REVEAL: a transparent hole grows from the click point, letting the
    // already-loaded page show through. The circle itself is the hole;
    // a large fixed box-shadow spread keeps everything outside it covered
    // until the hole itself has grown big enough to reach past the screen.
    function revealPage(x, y) {
        const r = distanceToFarthestCorner(x, y);
        circle.style.background = 'transparent';
        circle.style.boxShadow  = `0 0 0 ${r}px ${COLOR}`;
        circle.style.left = `${x}px`;
        circle.style.top  = `${y}px`;
        circle.style.transform = 'translate(-50%, -50%)';
        circle.style.transition = 'none';
        circle.style.width  = '0px';
        circle.style.height = '0px';
        circle.getBoundingClientRect(); // force reflow before re-enabling transition
        circle.style.transition = `width ${DURATION}ms ease, height ${DURATION}ms ease`;
        requestAnimationFrame(() => {
            circle.style.width  = `${r * 2}px`;
            circle.style.height = `${r * 2}px`;
        });
        circle.addEventListener('transitionend', function handler() {
            circle.removeEventListener('transitionend', handler);
            circle.style.boxShadow = 'none';
        }, { once: true });
    }

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
        sessionStorage.removeItem(STORAGE_KEY);
        const [x, y] = stored.split(',').map(Number);
        revealPage(x, y);
    }

    // if this page is restored from the back/forward cache (e.g. the user
    // hit the browser's back button after we finished covering it right
    // before navigating away), scripts don't re-run — so force the circle
    // back to its hidden state instantly instead of leaving it stuck covering
    window.addEventListener('pageshow', (e) => {
        if (!e.persisted) return;
        circle.style.transition = 'none';
        circle.style.boxShadow  = 'none';
        circle.style.background = 'transparent';
        circle.style.width  = '0px';
        circle.style.height = '0px';
        circle.style.transform = 'translate(-50%, -50%) scale(0)';
    });

    function isInternalNavLink(a) {
        if (!a || a.target === '_blank') return false;
        const href = a.getAttribute('href');
        if (!href) return false;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return false;
        if (/^https?:\/\//i.test(href) && !href.startsWith(window.location.origin)) return false;
        return true;
    }

    document.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target.closest('a');
        if (!isInternalNavLink(a)) return;

        e.preventDefault();
        const href = a.getAttribute('href');
        const x = e.clientX;
        const y = e.clientY;
        sessionStorage.setItem(STORAGE_KEY, `${x},${y}`);
        coverPage(x, y, () => {
            window.location.href = href;
        });
    });
})();