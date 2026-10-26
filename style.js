// Cursor
// reference: https://dev.to/uuuulala/coding-an-interactive-and-damn-satisfying-cursor-7-simple-steps-2kb-of-code-1c8b
    //        https://www.youtube.com/watch?v=f5ZswIE_SgY
    //        https://www.youtube.com/watch?v=Th_OvCwQHpw

// AI debug:
    // 1. the text is not showing in the right position
    // 2. the mouse takes too long to load
    // 3. too laggy (I used DOM approach first > failed changing to canvas apprach) did not solved

const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン的一是不了人我在有他這為之大來以個中上們到說國和地也子時道出而要於就下得可你年生自會那後能對著事其裡所去行過家十用發天如然作方成者多日都三小軍二無同麼經法當起與好看學進種將還分此心前面又定見只主沒公從$@#%&*+=<>?/\\|[]{}';

// shared mobile check — matches the site's existing 768px CSS breakpoint,
// used to skip the mouse-follow cursor and tab-swipe carousel on mobile
const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;

function startMatrixStreams() {
    createMatrixStream();

    const nextDelay = 80 + Math.random() * 200;
    setTimeout(startMatrixStreams, nextDelay);
}

let mouseX = 0;
let mouseY = 0;
let isOverMarquee = false;
if (!isMobileViewport) {
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
}

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

    const customCursor = document.createElement('div');
    customCursor.id = 'customCursor';
    customCursor.className = 'customCursor';

    if (!isMobileViewport) {
        document.body.appendChild(cursorGlow);
        document.body.appendChild(customCursor);
    }

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

    // image lightbox — click a case-study image to enlarge it against a
    // dimmed backdrop. Hovering an eligible image previews the action via
    // the same cursor-pill technique as the marquee hovers above; once
    // open, hovering the backdrop (not the enlarged image itself) previews
    // the close action the same way. The overlay is built once and reused,
    // toggled via .open rather than added/removed from the DOM.
    const lightboxImages = Array.from(document.querySelectorAll(
        '.flowImageHolder img, .stepItemImageSlot img, .resultMedia .panel'
    )).filter(el => el.tagName === 'IMG');

    if (lightboxImages.length) {
        const lightbox = document.createElement('div');
        lightbox.className = 'imageLightbox';
        const lightboxImg = document.createElement('img');
        lightboxImg.className = 'imageLightboxImg';
        lightbox.appendChild(lightboxImg);
        document.body.appendChild(lightbox);

        let lightboxOpen = false;

        const showCursor = (text) => {
            if (isMobileViewport) return;
            customCursor.classList.add('textHover');
            customCursor.textContent = text;
        };
        const hideCursor = () => {
            if (isMobileViewport) return;
            customCursor.classList.remove('textHover');
            customCursor.textContent = '';
        };

        // .noScroll alone (overflow:hidden) doesn't preserve scroll
        // position — collapsing body's scroll context snaps the page back
        // to the top. Pinning body in place with a matching negative
        // offset first, then restoring both on close, is the standard fix.
        function lockScroll() {
            const y = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${y}px`;
            document.body.style.width = '100%';
            document.body.classList.add('noScroll');
        }

        function unlockScroll() {
            const y = -parseInt(document.body.style.top || '0', 10);
            document.body.classList.remove('noScroll');
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, y);
        }

        function openLightbox(img) {
            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('open');
            lightboxOpen = true;
            lockScroll();
            hideCursor();
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            lightboxOpen = false;
            unlockScroll();
            hideCursor();
        }

        lightboxImages.forEach(img => {
            img.addEventListener('click', () => openLightbox(img));
            img.addEventListener('mouseenter', () => showCursor('Full Screen'));
            img.addEventListener('mouseleave', hideCursor);
        });

        // clicking anywhere in the lightbox closes it — the image itself
        // included, not just the backdrop around it
        lightbox.addEventListener('click', closeLightbox);

        lightbox.addEventListener('mouseenter', () => {
            if (lightboxOpen) showCursor('Exit');
        });
        lightbox.addEventListener('mouseleave', hideCursor);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxOpen) closeLightbox();
        });
    }
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


// generic "last intersecting wins" scroll-spy: watches a list of
// {target, activate, deactivate} entries and keeps exactly one active —
// whichever target is currently intersecting the rootMargin band and comes
// latest in document order. `activateFirstByDefault` (default true) marks
// the first entry active before anything has scrolled into view yet —
// suitable for a page's top section, but not for a group that may start
// below the fold (it would show as "active" before it's ever been seen).
function createScrollSpy(entries, rootMargin, activateFirstByDefault = true) {
    if (!entries.length) return;

    const intersecting = new Set();
    let activeIndex = -1;

    function setActive(index) {
        if (index === activeIndex) return;
        if (activeIndex !== -1) entries[activeIndex].deactivate();
        activeIndex = index;
        if (activeIndex !== -1) entries[activeIndex].activate();
    }

    const observer = new IntersectionObserver((observed) => {
        observed.forEach(obs => {
            if (obs.isIntersecting) intersecting.add(obs.target);
            else intersecting.delete(obs.target);
        });

        for (let i = entries.length - 1; i >= 0; i--) {
            if (intersecting.has(entries[i].target)) {
                setActive(i);
                return;
            }
        }
    }, { rootMargin, threshold: 0 });

    entries.forEach(({ target }) => observer.observe(target));
    if (activateFirstByDefault) setActive(0);
}

// case-study sidebar nav (Circula) — highlights the current section as you
// scroll and reveals its sub-items, no-ops on every other page since
// #caseStudyNav only exists here
function initCaseStudyNav() {
    const nav = document.getElementById('caseStudyNav');
    if (!nav) return;

    // `top: 50vh` alone would stick the nav's TOP edge to viewport-middle,
    // not its center. CSS can't reference the element's own height to
    // correct for that, so measure it and bake the correction into `top`
    // itself — the browser's native sticky scrolling then eases from the
    // natural (Brief-aligned) position into the centered one as a single
    // continuous motion, with no JS-driven snap partway through. Re-run
    // after a top-level item's sub-nav finishes expanding/collapsing
    // (that's the only thing that changes the nav's own height), so it
    // stays centered even while a sub-nav is open.
    const centerStickyNav = isMobileViewport ? () => {} : () => {
        nav.style.top = `calc(50vh - ${nav.offsetHeight / 2}px)`;
    };
    // recenters instantly, bypassing the 0.3s transition below — used
    // whenever nav's height just changed and something else (a scroll
    // alignment) is about to measure its new position immediately, so
    // there's no stale value to animate away from
    const snapCenterNav = () => {
        if (isMobileViewport) return;
        nav.style.transition = 'none';
        centerStickyNav();
        nav.offsetHeight;
        nav.style.transition = 'top 0.3s ease';
    };
    if (!isMobileViewport) {
        // the page's first paint (before this script runs) already commits
        // the CSS fallback top:50vh as the "previous" value — merely
        // ordering the top change before enabling the transition isn't
        // enough to stop the browser animating from that committed value,
        // so explicitly disable the transition, force a reflow to commit
        // the correction under transition:none, then turn it on for any
        // later recenters (sub-nav expand/collapse, resize)
        snapCenterNav();
        window.addEventListener('resize', centerStickyNav);
    } else {
        centerStickyNav();
    }

    const navItems = Array.from(nav.querySelectorAll('.caseStudyNavItem'));
    const topEntries = navItems
        .map(item => {
            const link = item.querySelector(':scope > a');
            const target = link ? document.getElementById(link.getAttribute('href').slice(1)) : null;
            if (!target) return null;
            return {
                target,
                activate: () => {
                    item.classList.add('active');
                    if (item.classList.contains('hasSub')) setTimeout(centerStickyNav, 360);
                },
                deactivate: () => {
                    item.classList.remove('active');
                    if (item.classList.contains('hasSub')) setTimeout(centerStickyNav, 360);
                },
            };
        })
        .filter(Boolean);

    createScrollSpy(topEntries, '0px 0px -70% 0px');

    // sub-item spy — highlights the matching design-task subtitle (h3) and
    // its sidebar sub-link once the title itself reaches viewport-middle,
    // same trigger point as the .stepBar orange highlight below, so both
    // turn black/orange in sync as the reader scrolls past. Unlike
    // topEntries, the first sub-item isn't at the top of the page, so it
    // must not be activated by default — otherwise it shows black/active
    // immediately on load, long before the reader has scrolled anywhere
    // near it.
    const subEntries = Array.from(nav.querySelectorAll('.caseStudySubNav a'))
        .map(link => {
            const target = document.getElementById(link.getAttribute('href').slice(1));
            if (!target) return null;
            const subtitle = target.querySelector('h3');
            return {
                target,
                activate: () => {
                    if (subtitle) subtitle.classList.add('active');
                    link.classList.add('active');
                },
                deactivate: () => {
                    if (subtitle) subtitle.classList.remove('active');
                    link.classList.remove('active');
                },
            };
        })
        .filter(Boolean);

    createScrollSpy(subEntries, '-45% 0px -45% 0px', false);

    // clicking a nav link aligns the target's title to the nav's own top
    // edge (not the viewport's) — on desktop the nav is vertically centered
    // via sticky, so jumping to viewport-top would leave the title far from
    // where the reader's eye already is on the nav. Mobile's nav isn't
    // sticky, so it just scrolls to viewport-top as before.
    nav.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(a.getAttribute('href').slice(1));
            if (!target) return;

            const alignTo = (behavior) => {
                if (isMobileViewport) {
                    target.scrollIntoView({ behavior, block: 'start' });
                } else {
                    const delta = target.getBoundingClientRect().top - nav.getBoundingClientRect().top;
                    window.scrollBy({ top: delta, behavior });
                }
            };

            const titleEl = target.querySelector(':scope > .projectSubTitle, :scope > h3');
            const flash = () => {
                if (!titleEl) return;
                titleEl.classList.add('caseStudyArrived');
                titleEl.addEventListener('animationend', () => {
                    titleEl.classList.remove('caseStudyArrived');
                }, { once: true });
            };

            alignTo('smooth');

            // landing on (or passing through) a section under a collapsed
            // sidebar group makes the scroll-spy expand/collapse sidebar
            // sub-navs shortly after this scroll lands, resizing the
            // sticky nav and re-centering it — shifting target out from
            // under the alignment above. Worse, correcting that can itself
            // cross the threshold that decides which section counts as
            // "active" (since it moves target closer to/past the nav),
            // triggering a second resize. So this doesn't correct once —
            // it converges: snap nav to its current correct position,
            // measure the gap, nudge it closed, and repeat a few times a
            // beat apart (letting each resize's own transition catch up)
            // until the gap stops moving, then flash.
            let settled = false;
            let attempts = 0;
            const settle = () => {
                if (settled) return;
                snapCenterNav();
                if (isMobileViewport) {
                    settled = true;
                    flash();
                    return;
                }
                const delta = target.getBoundingClientRect().top - nav.getBoundingClientRect().top;
                attempts++;
                if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: 'auto' });
                if (Math.abs(delta) > 1 && attempts < 8) {
                    setTimeout(settle, 180);
                } else {
                    settled = true;
                    flash();
                }
            };
            window.addEventListener('scrollend', () => setTimeout(settle, 200), { once: true });
            setTimeout(settle, 1800);
        });
    });
}
initCaseStudyNav();

// mobile-only reading progress bar (Circula case studies) — replaces the
// desktop sidebar nav with a single fixed bar pinned to the top of the
// viewport: its fill tracks scroll progress through .caseStudyContent
// left-to-right, and its label shows whichever section is currently active,
// reusing the same section titles already listed in #caseStudyNav
function initCaseStudyProgressBar() {
    if (!isMobileViewport) return;
    const bar = document.getElementById('caseStudyProgress');
    const fill = document.getElementById('caseStudyProgressFill');
    const titleEl = document.getElementById('caseStudyProgressTitle');
    const content = document.querySelector('.caseStudyContent');
    if (!bar || !fill || !titleEl || !content) return;

    const sections = Array.from(content.querySelectorAll(':scope > .caseStudySection'))
        .map(section => {
            const link = document.querySelector(`.caseStudyNav a[href="#${section.id}"]`);
            return { section, title: link ? link.textContent.trim() : '' };
        })
        .filter(s => s.title);
    if (!sections.length) return;

    let ticking = false;
    const update = () => {
        ticking = false;
        const contentTop = content.getBoundingClientRect().top + window.scrollY;
        const readable = content.scrollHeight - window.innerHeight;
        const pct = readable > 0 ? Math.min(1, Math.max(0, (window.scrollY - contentTop) / readable)) : 0;
        fill.style.width = `${pct * 100}%`;

        // stays hidden until the reader scrolls past the top of the first
        // section (i.e. into the case study itself, past the hero/title),
        // so it isn't fixed on screen for the plain intro area above it
        bar.classList.toggle('visible', content.getBoundingClientRect().top <= 0);

        let active = sections[0];
        sections.forEach(s => {
            if (s.section.getBoundingClientRect().top - window.innerHeight * 0.3 <= 0) active = s;
        });
        titleEl.textContent = active.title;
    };

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }, { passive: true });
    update();
}
initCaseStudyProgressBar();


// step lists (e.g. Problem / Flows / User assumptions) — each row's bar
// lights up orange as it scrolls through, same mechanism as the sidebar's
// active dot, just re-used at a smaller, denser scale. A narrower band
// centred on the viewport (rather than the sections' top-third band) suits
// short, closely-packed rows better. All step items on the page (across
// every .stepList) share ONE spy rather than one per list, so there's a
// single shared active-index and only one bar can ever be lit at a time —
// document order makes that active row progress downward one list, then
// the next, as the reader scrolls past each one in turn.
function initStepLists() {
    const entries = Array.from(document.querySelectorAll('.stepList .stepItem'))
        // Impact's ticks use their own cumulative tracker below instead —
        // they'd otherwise compete for this spy's single active slot
        .filter(item => !item.closest('#cs-impact') && !item.closest('.numberedList'))
        .map(item => ({
            target: item,
            activate: () => item.classList.add('active'),
            deactivate: () => item.classList.remove('active'),
        }));
    createScrollSpy(entries, '-45% 0px -45% 0px', false);
}
initStepLists();

// Impact checklist — unlike the spy above (only one bar lit at a time),
// any number of ticks can be green at once, one per item that's been
// scrolled past the centre line. Each is still fully reversible, same as
// the orange bars — it's only the "just one at a time" part that's
// different. rootMargin shrinks the observed root to the viewport's top
// half, so the observer only fires right as an item crosses that 50%
// line; checking the item's own boundingClientRect at that moment (rather
// than trusting isIntersecting alone) tells us which side it landed on
// even once it's scrolled fully off-screen above, where isIntersecting
// alone would go back to false and wrongly read as "not reached yet".
function initImpactChecklist() {
    // numbered lists (1, 2, 3 circles) share the exact same behaviour
    const items = document.querySelectorAll('#cs-impact .stepItem, .numberedList .stepItem');
    if (!items.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const passedCentre = entry.boundingClientRect.top < window.innerHeight * 0.5;
            entry.target.classList.toggle('completed', passedCentre);
        });
    }, { rootMargin: '0px 0px -50% 0px', threshold: 0 });
    items.forEach(item => observer.observe(item));
}
initImpactChecklist();

// reflection carousel (Learning & Reflect) — a segmented progress bar
// where each tab is one paragraph; clicking a tab crossfades/slides to
// it. Only one non-active resting position exists in CSS (off to the
// right, ready to enter), so the outgoing slide gets a temporary
// .exiting class to send it off to the left instead — removed once its
// own transition finishes, so it's back in the shared default resting
// state next time it needs to enter from the right again.
function initReflectionCarousel() {
    document.querySelectorAll('.reflectionCarousel').forEach(carousel => {
        const tabs = Array.from(carousel.querySelectorAll('.reflectionTab'));
        const slides = Array.from(carousel.querySelectorAll('.reflectionSlide'));
        const slidesContainer = carousel.querySelector('.reflectionSlides');
        if (!tabs.length || tabs.length !== slides.length) return;

        let activeIndex = Math.max(slides.findIndex(s => s.classList.contains('active')), 0);

        // set below when this carousel is scroll-driven (inside a
        // .reflectionScrollTrack): tabs/swipes then move the page to the
        // matching scroll position so scrolling and the carousel stay in sync
        let syncScroll = null;

        function goTo(index, fromScroll = false) {
            if (index === activeIndex || index < 0 || index >= slides.length) return;
            const oldSlide = slides[activeIndex];
            const newSlide = slides[index];
            const forward = index > activeIndex;

            oldSlide.classList.remove('active');
            if (forward) {
                // outgoing slide leaves to the left, new one enters from the right
                oldSlide.classList.add('exiting');
                oldSlide.addEventListener('transitionend', () => {
                    oldSlide.classList.remove('exiting');
                }, { once: true });
            } else {
                // going back: outgoing slide returns to its resting spot on the
                // right, and the new one enters from the left
                newSlide.classList.remove('exiting');
                newSlide.classList.add('enterFromLeft');
                void newSlide.offsetWidth; // commit the left-hand start position
                newSlide.classList.remove('enterFromLeft');
            }

            newSlide.classList.add('active');
            tabs[activeIndex].classList.remove('active');
            tabs[index].classList.add('active');
            activeIndex = index;
            if (!fromScroll && syncScroll) syncScroll(index);
        }

        tabs.forEach((tab, i) => tab.addEventListener('click', () => goTo(i)));

        // scroll-driven mode: the carousel pins in place (CSS sticky) while
        // the page scrolls through a taller track; every step of scroll
        // advances one reflection to the right, and scrolling back up steps
        // back. Once the last one is reached the page continues as normal.
        const track = carousel.closest('.reflectionScrollTrack');
        if (track) {
            const sticky = track.querySelector('.reflectionSticky');
            const step = () => Math.max(window.innerHeight * 0.45, 260);
            const stickyTop = () => parseFloat(getComputedStyle(sticky).top) || 0;

            // + extra room so the last reflection stays pinned too, instead of
            // the section already starting to scroll away when it appears
            const layout = () => {
                track.style.height = (sticky.offsetHeight + (slides.length - 1) * step() + step() * 0.75) + 'px';
            };
            const onScroll = () => {
                const travelled = stickyTop() - track.getBoundingClientRect().top;
                const index = Math.min(slides.length - 1, Math.max(0, Math.floor(travelled / step())));
                goTo(index, true);
            };
            syncScroll = (index) => {
                const trackTop = track.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: trackTop - stickyTop() + index * step() + 2, behavior: 'smooth' });
            };

            layout();
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', () => { layout(); onScroll(); });
            window.addEventListener('load', () => { layout(); onScroll(); });
        }

        // swipe left/right on touch devices to step between reflections —
        // reuses the same goTo/active-class transition as tapping a tab,
        // just triggered by a horizontal drag instead
        if (slidesContainer) {
            const SWIPE_THRESHOLD_PX = 40;
            const DIRECTION_LOCK_PX = 10;
            let startX = 0;
            let startY = 0;
            let horizontal = null;

            slidesContainer.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1) return;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                horizontal = null;
            }, { passive: true });

            slidesContainer.addEventListener('touchmove', (e) => {
                if (e.touches.length !== 1) return;
                if (horizontal === null) {
                    const dx = e.touches[0].clientX - startX;
                    const dy = e.touches[0].clientY - startY;
                    if (Math.abs(dx) < DIRECTION_LOCK_PX && Math.abs(dy) < DIRECTION_LOCK_PX) return;
                    horizontal = Math.abs(dx) > Math.abs(dy);
                }
                // only swallow the scroll gesture once it's confirmed
                // horizontal, so a vertical page scroll starting here is
                // never blocked
                if (horizontal) e.preventDefault();
            }, { passive: false });

            slidesContainer.addEventListener('touchend', (e) => {
                if (horizontal !== true) return;
                const dx = e.changedTouches[0].clientX - startX;
                if (Math.abs(dx) > SWIPE_THRESHOLD_PX) goTo(activeIndex + (dx < 0 ? 1 : -1));
            }, { passive: true });
        }
    });
}
initReflectionCarousel();

// slide mode (opt-in via <body class="slideMode">): the case study reads
// like a deck. Slides = the page header, the intro video and each major
// section. Only the current slide is shown; the others are faded out.
//
// Desktop (mouse/trackpad): scrolling no longer free-scrolls the page.
// Each wheel gesture / arrow key either moves within the current slide
// (only when that slide is taller than the screen, e.g. Solution) or, once
// at its edge, swaps to the next/previous slide with a fade. One gesture
// never skips more than one slide: trackpad inertia from the gesture that
// triggered a swap is ignored. The page layout itself is untouched, so the
// sidebar spy, step lists, lightbox and the Reflection carousel (which
// steps as the page moves through its own track) all keep working.
//
// Touch devices / reduced motion: no scroll hijacking — sections just
// fade in as they arrive and fade back once passed.
function initSlideMode() {
    if (!document.body.classList.contains('slideMode')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const content = document.querySelector('.caseStudyContent');
    if (!content) return;

    const heroEls = ['.pageProjectMeta', '.aboutPageHomeSubTitle', '.projectRoleTime']
        .map(sel => document.querySelector('#projectsSection > ' + sel)).filter(Boolean);
    const blocks = Array.from(content.children).filter(el => el.matches('.caseStudySection, .resultMedia'));
    // the closing block (live-site banner + back-to-top) after the case study
    const layout = document.querySelector('#projectsSection > .caseStudyLayout');
    const endEls = layout ? Array.from(layout.parentElement.children)
        .filter(el => layout.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) : [];
    // the top of the page (header + intro video) belongs to the first
    // section's slide, and the closing banner + footer to the last one, so
    // both ends scroll normally into / out of the deck
    const sectionBlocks = blocks.filter(el => el.matches('.caseStudySection'));
    if (sectionBlocks.length < 2) return;
    const firstSec = sectionBlocks[0], lastSec = sectionBlocks[sectionBlocks.length - 1];
    const slides = [];
    slides.push([...heroEls, ...blocks.slice(0, blocks.indexOf(firstSec) + 1)]);
    blocks.slice(blocks.indexOf(firstSec) + 1, blocks.indexOf(lastSec)).forEach(el => slides.push([el]));
    slides.push([lastSec, ...blocks.slice(blocks.indexOf(lastSec) + 1), ...endEls]);
    slides.flat().forEach(el => el.classList.add('slideItem'));

    const paging = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const vh = () => window.innerHeight;
    // layout position (ignores the slide transforms on hidden slides)
    const absTop = el => { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; };
    const absBottom = el => absTop(el) + el.offsetHeight;
    const maxScroll = () => document.documentElement.scrollHeight - vh();

    // ---- touch / reduced setups: arrival-based fade only
    if (!paging) {
        let ticking = false;
        const update = () => {
            ticking = false;
            slides.forEach(els => els.forEach(el => {
                const r = el.getBoundingClientRect();
                const past = r.bottom < vh() * 0.28;
                el.classList.toggle('slideIn', r.top < vh() * 0.82 && !past);
                el.classList.toggle('slidePast', past);
            }));
        };
        update();
        window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
        window.addEventListener('resize', update);
        window.addEventListener('load', update);
        return;
    }

    document.body.classList.add('paging');

    // ---- slide ranges in page-scroll coordinates: [start, stop]
    // short slides are centred on screen; tall ones start just below the top
    // and can be moved through until their bottom reaches the screen bottom.
    let ranges = [];
    // invisible room after the Reflection so its last reflection (and then the
    // closing slide) can always be scrolled to, even on very tall screens
    const reflectionSection = slides.map(els => els[0]).find(el => el.querySelector && el.querySelector('.reflectionScrollTrack'));
    const spacer = document.createElement('div');
    spacer.className = 'slideSpacer';
    spacer.setAttribute('aria-hidden', 'true');
    if (reflectionSection) reflectionSection.appendChild(spacer);
    const measure = () => {
        spacer.style.height = '0px';
        measureRanges();
        const ref = ranges.find(r => r.points);
        if (ref) {
            const need = ref.points[ref.points.length - 1] + 2 - maxScroll();
            if (need > 0) { spacer.style.height = Math.ceil(need) + 'px'; measureRanges(); }
        }
    };
    const measureRanges = () => {
        // the bottom band is kept clear for the "Next —" scroll cue
        const top = Math.round(vh() * 0.12), bottomPad = Math.round(Math.max(vh() * 0.08, 150 + vh() * 0.035));
        ranges = slides.map((els, k) => {
            const t = Math.min(...els.map(absTop)), btm = Math.max(...els.map(absBottom));
            const h = btm - t;
            // short slides are centred in the space above the cue band
            let start = k === 0 ? 0 : (h <= vh() - top - bottomPad ? t - (vh() - bottomPad - h) / 2 : t - top);
            start = Math.max(0, Math.min(start, maxScroll()));
            let stop = k === slides.length - 1 ? maxScroll() : Math.max(start, btm + bottomPad - vh());
            // a slide that only overflows by a sliver counts as fitting the screen
            if (k !== slides.length - 1 && stop - start < vh() * 0.04) stop = start;
            // numbered points (1, 2, 3) turn green as they cross the middle of
            // the screen — make sure the slide can scroll far enough for the
            // last one to get there before it slides on
            const numbered = els.flatMap(el => Array.from(el.querySelectorAll ? el.querySelectorAll('.numberedList .stepItem') : []));
            if (numbered.length) {
                const lastItem = numbered[numbered.length - 1];
                stop = Math.max(stop, absBottom(lastItem) - vh() * 0.5 + 16);
            }
            // a scroll-driven Reflection needs enough travel to reach its last
            // reflection (same step size as initReflectionCarousel uses)
            // a scroll-driven Reflection gets one stop per reflection, so each
            // gesture moves exactly one reflection (same step size as
            // initReflectionCarousel uses to pick the active one)
            const track = els[0].querySelector && els[0].querySelector('.reflectionScrollTrack');
            let points = null;
            if (track) {
                const sticky = track.querySelector('.reflectionSticky');
                const n = track.querySelectorAll('.reflectionSlide').length;
                const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
                const stepR = Math.max(vh() * 0.45, 260);
                const p0 = absTop(track) - stickyTop + 4;
                points = Array.from({ length: n }, (_, i) => Math.round(p0 + i * stepR + stepR * 0.5));
                start = Math.min(start, points[0]);
                // the last slide carries on past its last reflection to the footer
                stop = k === slides.length - 1 ? Math.max(maxScroll(), points[n - 1]) : points[n - 1];
            }
            return { start: Math.round(start), stop: Math.round(Math.min(stop, maxScroll())), points };
        });
        // a slide must end before the next one begins
        for (let k = 0; k < ranges.length - 1; k++) {
            if (ranges[k].points) {
                ranges[k + 1].start = Math.max(ranges[k + 1].start, ranges[k].stop + 1);
                ranges[k + 1].stop = Math.max(ranges[k + 1].stop, ranges[k + 1].start);
            } else {
                ranges[k].stop = Math.max(ranges[k].start, Math.min(ranges[k].stop, ranges[k + 1].start - 1));
            }
        }
    };
    const currentIndex = () => {
        const y = window.scrollY + 2;
        let k = 0;
        ranges.forEach((r, i) => { if (y >= r.start) k = i; });
        return k;
    };

    // ---- visibility: only the current slide is shown
    let shown = -1;
    const show = (k) => {
        shown = k;
        slides.forEach((els, i) => els.forEach(el => {
            el.classList.toggle('slideIn', i === k);
            el.classList.toggle('slidePast', i < k);
        }));
    };
    const syncFromScroll = () => { if (!swapping) { const k = currentIndex(); if (k !== shown) show(k); } };

    // ---- swapping with a fade
    let swapping = false, lockedGesture = -1, swapEndedAt = 0;
    let updateCue = () => {};
    const SWAP_OUT_MS = 280, SWAP_IN_MS = 520;
    const swapTo = (k, landAt) => {
        if (swapping || k < 0 || k >= slides.length) return;
        const from = shown, forward = k > from;
        swapping = true;
        lockedGesture = gesture;
        updateCue();
        slides[from].forEach(el => el.classList.add(forward ? 'leavingUp' : 'leavingDown'));
        setTimeout(() => {
            window.scrollTo({ top: landAt, behavior: 'instant' });
            slides[from].forEach(el => el.classList.remove('leavingUp', 'leavingDown'));
            show(k);
            setTimeout(() => { swapping = false; swapEndedAt = performance.now(); updateCue(); }, SWAP_IN_MS);
        }, SWAP_OUT_MS);
    };

    // ---- input: wheel / trackpad
    let gesture = 0, lastWheel = 0, lastAbs = 0, gesturePeak = 0, endHitGesture = -1, endHitAt = 0, hopGesture = -1;
    const step = (dy) => {
        const k = shown, r = ranges[k], y = window.scrollY;
        if (r.points) {
            const lastP = r.points[r.points.length - 1];
            // past the last reflection (e.g. scrolling on to the footer):
            // plain scrolling between the last reflection and the page end
            // (moving on from the last reflection needs a fresh gesture, so the
            // gesture that showed it doesn't also carry the page onwards)
            if ((y > lastP + 3 || (dy > 0 && y >= lastP - 3 && hopGesture !== gesture)) && r.stop > lastP + 3) {
                if (dy > 0) {
                    window.scrollTo({ top: Math.min(y + dy, r.stop), behavior: 'instant' });
                    return;
                }
                if (y > lastP + 3) {
                    const ny = Math.max(y + dy, lastP);
                    window.scrollTo({ top: ny, behavior: 'instant' });
                    if (ny <= lastP + 3) { endHitGesture = hopGesture = gesture; endHitAt = performance.now(); }
                    return;
                }
            }
            // Reflection: hop between its reflections (one hop per gesture),
            // then on to the next slide
            if (hopGesture === gesture) return;
            let idx = -1;
            r.points.forEach((p, i) => { if (y >= p - 3) idx = i; });
            if (dy > 0) {
                if (idx < r.points.length - 1) {
                    window.scrollTo({ top: r.points[idx + 1], behavior: 'instant' });
                    endHitGesture = hopGesture = gesture; endHitAt = performance.now();
                } else if (k < slides.length - 1 && endHitGesture !== gesture) {
                    swapTo(k + 1, ranges[k + 1].points ? ranges[k + 1].points[0] : ranges[k + 1].start);
                }
            } else if (dy < 0) {
                if (idx > 0) {
                    window.scrollTo({ top: r.points[idx - 1], behavior: 'instant' });
                    endHitGesture = hopGesture = gesture; endHitAt = performance.now();
                } else if (k > 0 && endHitGesture !== gesture) {
                    swapTo(k - 1, ranges[k - 1].stop);
                }
            }
            return;
        }
        if (dy > 0) {
            if (y < r.stop - 1) {
                const ny = Math.min(y + dy, r.stop);
                window.scrollTo({ top: ny, behavior: 'instant' });
                if (ny >= r.stop - 1) { endHitGesture = gesture; endHitAt = performance.now(); }
            } else if (k < slides.length - 1 && endHitGesture !== gesture) {
                swapTo(k + 1, ranges[k + 1].points ? ranges[k + 1].points[0] : ranges[k + 1].start);
            }
        } else if (dy < 0) {
            if (y > r.start + 1) {
                const ny = Math.max(y + dy, r.start);
                window.scrollTo({ top: ny, behavior: 'instant' });
                if (ny <= r.start + 1) { endHitGesture = gesture; endHitAt = performance.now(); }
            } else if (k > 0 && endHitGesture !== gesture) {
                swapTo(k - 1, ranges[k - 1].stop);
            }
        }
    };
    const blocked = () => document.body.classList.contains('noScroll') || document.body.classList.contains('navLocked');

    window.addEventListener('wheel', (e) => {
        if (blocked() || e.ctrlKey) return;               // let pinch-zoom / open overlays behave normally
        e.preventDefault();
        const now = performance.now();
        let dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vh() : 1);
        const abs = Math.abs(dy);
        // a new gesture starts after a pause, when a fresh swipe ramps up
        // (deltas jump up, unlike a decaying inertia tail), or when someone
        // simply keeps scrolling well after the last swap has finished
        // "keeps scrolling" only counts while the scrolling stays strong — a
        // trackpad's inertia tail fades away and never re-triggers
        const strong = abs >= Math.max(15, gesturePeak * 0.5);
        if (now - lastWheel > 160 ||
            (abs > lastAbs * 1.6 && abs > 12 && lastAbs < gesturePeak * 0.6) ||   // re-accelerating after a fade-out
            (strong && gesture === lockedGesture && !swapping && now - swapEndedAt > 700) ||
            (strong && gesture === endHitGesture && now - endHitAt > 700)) { gesture++; gesturePeak = 0; }
        lastWheel = now;
        lastAbs = abs;
        gesturePeak = Math.max(gesturePeak, abs);
        if (swapping || gesture === lockedGesture) return; // ignore the inertia tail of a swap
        if (abs < 2) return;
        step(dy);
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
        if (blocked() || e.target.closest('input, textarea, select, [contenteditable]')) return;
        const down = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey);
        const up = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
        if (!down && !up) return;
        e.preventDefault();
        gesture++;
        if (swapping) return;
        step((down ? 1 : -1) * vh() * 0.6);
    });

    // ---- sidebar nav: swap straight to the clicked section
    document.querySelectorAll('#caseStudyNav a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.getElementById(a.getAttribute('href').slice(1));
            if (!target) return;
            const k = slides.findIndex(els => els.some(el => el === target || el.contains(target)));
            if (k < 0) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            measure();
            const r = ranges[k];
            const isSub = slides[k][0] !== target;
            const land = isSub ? Math.min(r.stop, Math.max(r.start, absTop(target) - vh() * 0.12)) : r.start;
            if (k === shown) window.scrollTo({ top: land, behavior: 'smooth' });
            else swapTo(k, land);
        }, true);
    });

    // the closing banner + footer (part of the last slide) stay hidden while
    // the reflections are showing, and fade in once you scroll past the last one
    const tailEls = endEls;
    const syncTail = () => {
        const last = ranges[ranges.length - 1];
        if (!last || !last.points) return;
        const lastP = last.points[last.points.length - 1];
        const waiting = window.scrollY <= lastP + 3;
        tailEls.forEach(el => el.classList.toggle('tailWaiting', waiting));
    };

    // ---- "keep scrolling" cue: pops up the moment you reach the bottom of a
    // section and names what's next (plus a hint on first arrival)
    const titleOf = (els) => {
        const h = els[0].querySelector && els[0].querySelector('.projectSubTitle h1');
        return h ? h.textContent.trim() : '';
    };
    const cue = document.createElement('button');
    cue.type = 'button';
    cue.className = 'scrollCue';
    cue.setAttribute('aria-label', 'Go to the next part');
    cue.innerHTML = '<span class="scrollCueLabel"></span><span class="scrollCueLine" aria-hidden="true"></span>';
    document.body.appendChild(cue);
    const cueLabel = cue.querySelector('.scrollCueLabel');
    let cueKey = '', hasScrolled = false;
    const cueState = () => {
        const k = shown, r = ranges[k], y = window.scrollY;
        if (!r) return null;
        if (r.points) {
            const lastP = r.points[r.points.length - 1];
            if (y >= lastP - 3) return k < slides.length - 1 ? 'next' : (y <= lastP + 3 ? 'more' : null);  // last reflection: just "keep scrolling" on to the footer
            if (r.points.some(p => Math.abs(y - p) <= 3)) return 'reflection';
            return null;
        }
        if (y >= r.stop - 1) return k < slides.length - 1 ? 'next' : null;  // bottom of the section
        return hasScrolled ? null : 'start';
    };
    updateCue = () => {
        const t = (swapping || blocked()) ? null : cueState();
        if (!t) { cue.classList.remove('show', 'callout'); cueKey = ''; return; }
        const key = t + ':' + shown;
        if (key === cueKey) return;
        cueKey = key;
        if (t === 'next') {
            const n = shown + 1;
            cueLabel.innerHTML = 'Next \u2014 <span class="scrollCueNum"></span>';
            cueLabel.querySelector('.scrollCueNum').textContent = titleOf(slides[n]);
        } else cueLabel.textContent = t === 'reflection' ? 'Next reflection' : t === 'more' ? 'Keep scrolling' : 'Scroll';
        const c = content.getBoundingClientRect();
        cue.style.left = Math.round(c.left + c.width / 2) + 'px';
        cue.classList.add('show');
        cue.classList.remove('callout'); void cue.offsetWidth; cue.classList.add('callout');
    };
    cue.addEventListener('click', () => {
        if (swapping) return;
        gesture++;
        step(1);
    });
    let cueTick = false;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 4) hasScrolled = true;
        if (!cueTick) { cueTick = true; requestAnimationFrame(() => { cueTick = false; updateCue(); }); }
    }, { passive: true });
    window.addEventListener('resize', () => { cueKey = ''; updateCue(); });

    measure();
    show(currentIndex());
    syncTail();
    setTimeout(updateCue, 400);
    window.addEventListener('scroll', syncFromScroll, { passive: true });
    window.addEventListener('scroll', syncTail, { passive: true });
    window.addEventListener('resize', () => { measure(); syncFromScroll(); });
    window.addEventListener('load', () => { measure(); show(currentIndex()); });
}
initSlideMode();

// image carousel (Inspiration / Research) — same segmented-tab-bar
// mechanic as the reflection carousel above, but each slide holds an
// image instead of a paragraph, and each tab autoplays: an inner
// .imageCarouselTabFill sweeps 0 -> 100% over SLIDE_DURATION, then
// advances to the next slide (looping back to the first after the last).
function initImageCarousel() {
    const SLIDE_DURATION = 4000;

    document.querySelectorAll('.imageCarousel').forEach(carousel => {
        const tabs = Array.from(carousel.querySelectorAll('.imageCarouselTab'));
        const slides = Array.from(carousel.querySelectorAll('.imageCarouselSlide'));
        const fills = tabs.map(tab => tab.querySelector('.imageCarouselTabFill'));
        if (!tabs.length || tabs.length !== slides.length) return;

        let activeIndex = Math.max(slides.findIndex(s => s.classList.contains('active')), 0);
        let timer = null;

        function resetFill(fill) {
            if (!fill) return;
            fill.style.transition = 'none';
            fill.style.width = '0%';
            void fill.offsetWidth; // force reflow so the next transition restarts from 0
        }

        function startFill(index) {
            clearTimeout(timer);
            const fill = fills[index];
            resetFill(fill);
            if (fill) {
                requestAnimationFrame(() => {
                    fill.style.transition = `width ${SLIDE_DURATION}ms linear`;
                    fill.style.width = '100%';
                });
            }
            timer = setTimeout(() => goTo((activeIndex + 1) % slides.length), SLIDE_DURATION);
        }

        function goTo(index) {
            if (index === activeIndex || index < 0 || index >= slides.length) return;
            const oldSlide = slides[activeIndex];
            const newSlide = slides[index];

            oldSlide.classList.remove('active');
            oldSlide.classList.add('exiting');
            oldSlide.addEventListener('transitionend', () => {
                oldSlide.classList.remove('exiting');
            }, { once: true });

            newSlide.classList.add('active');
            tabs[activeIndex].classList.remove('active');
            tabs[index].classList.add('active');
            resetFill(fills[activeIndex]);

            activeIndex = index;
            startFill(activeIndex);
        }

        tabs.forEach((tab, i) => tab.addEventListener('click', () => goTo(i)));

        startFill(activeIndex);
    });
}
initImageCarousel();


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

// footer ARTHUR: each letter rises (and warms to orange) by how close the
// pointer is along the word — eased every frame, so it glides instead of
// flickering between the thin letter strokes
function initFooterWave() {
    const svg = document.querySelector('.footerLogo');
    const zone = svg && svg.closest('.footer2');
    if (!zone || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const letters = Array.from(svg.querySelectorAll('path'));
    const vbW = svg.viewBox.baseVal.width || 184;
    const spans = letters.map(p => { const b = p.getBBox(); return [b.x, b.x + b.width]; });
    const cur = letters.map(() => 0), target = letters.map(() => 0);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LIFT = 3.2, REACH = 14;            // in viewBox units (the word is 184 x 7)
    const from = [233, 233, 233], to = [205, 62, 0];
    let raf = 0;
    const frame = () => {
        let moving = false;
        letters.forEach((p, i) => {
            cur[i] += (target[i] - cur[i]) * 0.12;
            if (Math.abs(target[i] - cur[i]) > 0.002) moving = true; else cur[i] = target[i];
            const v = cur[i];
            p.setAttribute('transform', reduce ? '' : 'translate(0 ' + (-LIFT * v).toFixed(3) + ')');
            const k = Math.pow(v, 1.6);
            p.style.fill = 'rgb(' + from.map((f, j) => Math.round(f + (to[j] - f) * k)).join(',') + ')';
        });
        raf = moving ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    zone.addEventListener('mousemove', (e) => {
        const r = svg.getBoundingClientRect();
        const u = (e.clientX - r.left) / r.width * vbW;
        spans.forEach(([a, b], i) => {
            const d = u < a ? a - u : u > b ? u - b : 0;
            target[i] = Math.exp(-(d / REACH) * (d / REACH));
        });
        kick();
    });
    const cursor = () => document.getElementById('customCursor');
    zone.addEventListener('mouseenter', () => { const c = cursor(); if (c) c.classList.add('footerHover'); });
    zone.addEventListener('mouseleave', () => {
        target.fill(0); kick();
        const c = cursor(); if (c) c.classList.remove('footerHover');
    });
}
initFooterWave();
