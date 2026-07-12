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


// swipeable tabs (mobile) — dragging over the project content follows the
// finger, sliding the current tab out and the neighbouring tab in (so a
// half-swipe shows half of the next tab), snapping to whichever side wins
// once the finger lifts. Reuses the existing openTab click handler to
// finalise state so it stays identical to tapping a tab button.
function initSwipeableTabs() {
    const cate = document.querySelector('.projectsCate');
    const container = document.getElementById('projectsSection');
    if (!cate || !container) return;

    const tabs = Array.from(cate.querySelectorAll('.tablinks'));
    if (tabs.length < 2) return;

    const panels = tabs.map(btn => document.getElementById(btn.getAttribute('aria-controls')));

    const DIRECTION_LOCK_PX = 10;
    const COMMIT_RATIO = 0.25;

    let startX = 0;
    let startY = 0;
    let dragging = false;
    let horizontal = null;
    let activeIndex = -1;
    let activePanel = null;
    let targetIndex = -1;
    let targetPanel = null;
    let spacer = null;
    let viewportWidth = 0;

    function resetPanel(panel) {
        if (!panel) return;
        panel.style.position = '';
        panel.style.top = '';
        panel.style.left = '';
        panel.style.width = '';
        panel.style.maxHeight = '';
        panel.style.overflow = '';
        panel.style.margin = '';
        panel.style.zIndex = '';
        panel.style.transform = '';
        panel.style.transition = '';
        panel.style.pointerEvents = '';
        panel.style.display = '';
    }

    function mountActivePanel() {
        const rect = activePanel.getBoundingClientRect();
        spacer = document.createElement('div');
        spacer.style.height = rect.height + 'px';
        activePanel.parentNode.insertBefore(spacer, activePanel);

        viewportWidth = rect.width;
        activePanel.style.position = 'fixed';
        activePanel.style.top = rect.top + 'px';
        activePanel.style.left = rect.left + 'px';
        activePanel.style.width = rect.width + 'px';
        activePanel.style.margin = '0';
        activePanel.style.zIndex = '10';
        activePanel.style.transition = 'none';
        return rect;
    }

    function mountTargetPanel(rect) {
        targetPanel.style.display = 'block';
        targetPanel.style.position = 'fixed';
        targetPanel.style.top = rect.top + 'px';
        targetPanel.style.left = rect.left + 'px';
        targetPanel.style.width = rect.width + 'px';
        targetPanel.style.maxHeight = rect.height + 'px';
        targetPanel.style.overflow = 'hidden';
        targetPanel.style.margin = '0';
        targetPanel.style.zIndex = '9';
        targetPanel.style.pointerEvents = 'none';
        targetPanel.style.transition = 'none';
    }

    function finish(commit) {
        const ap = activePanel;
        const tp = targetPanel;
        const ti = targetIndex;
        const sp = spacer;
        if (!ap) return;

        const done = () => {
            resetPanel(ap);
            resetPanel(tp);
            if (sp) sp.remove();
            if (commit && ti !== -1) tabs[ti].click();
        };

        // force a reflow so the browser commits the current drag position
        // (still under transition:none) before we enable the transition —
        // otherwise the synchronous style writes below can get coalesced
        // and the transition (and its transitionend event) never fires
        ap.getBoundingClientRect();
        if (tp) tp.getBoundingClientRect();

        ap.style.transition = 'transform 250ms ease';
        if (tp) tp.style.transition = 'transform 250ms ease';

        requestAnimationFrame(() => {
            if (tp) {
                const dir = ti > activeIndex ? 1 : -1;
                if (commit) {
                    ap.style.transform = `translateX(${-dir * viewportWidth}px)`;
                    tp.style.transform = 'translateX(0px)';
                } else {
                    ap.style.transform = 'translateX(0px)';
                    tp.style.transform = `translateX(${dir * viewportWidth}px)`;
                }
                tp.addEventListener('transitionend', done, { once: true });
            } else {
                ap.style.transform = 'translateX(0px)';
                ap.addEventListener('transitionend', done, { once: true });
            }
        });

        activePanel = null;
        targetPanel = null;
        targetIndex = -1;
        spacer = null;
    }

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1 || dragging) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        dragging = true;
        horizontal = null;
        activeIndex = tabs.findIndex(btn => btn.classList.contains('active'));
        activePanel = null;
        targetPanel = null;
        targetIndex = -1;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!dragging || e.touches.length !== 1 || activeIndex === -1) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;

        if (horizontal === null) {
            if (Math.abs(dx) < DIRECTION_LOCK_PX && Math.abs(dy) < DIRECTION_LOCK_PX) return;
            horizontal = Math.abs(dx) > Math.abs(dy);
            if (!horizontal) return;
        }
        if (!horizontal) return;

        e.preventDefault();

        const dir = dx < 0 ? 1 : -1;
        const wantIndex = activeIndex + dir;
        const hasTarget = wantIndex >= 0 && wantIndex < tabs.length;

        if (!activePanel) {
            activePanel = panels[activeIndex];
            const rect = mountActivePanel();
            if (hasTarget) {
                targetIndex = wantIndex;
                targetPanel = panels[targetIndex];
                mountTargetPanel(rect);
            }
        }

        if (targetPanel) {
            const tdir = targetIndex > activeIndex ? 1 : -1;
            activePanel.style.transform = `translateX(${dx}px)`;
            targetPanel.style.transform = `translateX(${dx + tdir * viewportWidth}px)`;
        } else {
            // at an edge with no neighbour — light rubber-band feedback
            activePanel.style.transform = `translateX(${dx * 0.3}px)`;
        }
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
        if (!dragging) return;
        dragging = false;
        if (!activePanel) return;

        const dx = e.changedTouches[0].clientX - startX;
        const commit = !!targetPanel && Math.abs(dx) > viewportWidth * COMMIT_RATIO;
        finish(commit);
    }, { passive: true });

    container.addEventListener('touchcancel', () => {
        dragging = false;
        if (activePanel) finish(false);
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