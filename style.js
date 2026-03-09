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

    // Result media enlarge
    // AI debug:
        // 1. after enlarge, the reachout will reach above the last video 
        // 2. disable in mobile breakpoint
        // 3. image enlarge based on width, not height
        // 4. video ratio crashed when scrolling
    function initResultExpand() {
        const resultTab      = document.querySelector('.tab.result');
        const mediaContainer = document.querySelector('.resultMedia');
        const resultImgs     = mediaContainer ? [...mediaContainer.querySelectorAll('img, video')] : [];
        if (!resultTab || resultImgs.length === 0) return;

        let stackCaptured = false;
        let imgAbsTops    = [];
        let scrollExitEnd = null;

        function updateResultExpand() {
            const scrollY = window.scrollY;
            const vw      = window.innerWidth;
            const vh      = window.innerHeight;

            const maxPad       = parseFloat(getComputedStyle(resultTab).paddingLeft);
            const tabRect      = resultTab.getBoundingClientRect();
            const tabAbsTop    = tabRect.top + scrollY;
            const tabLeft      = tabRect.left;
            const naturalWidth = resultTab.offsetWidth - 2 * maxPad;
            const range        = vh * 0.5;

            if (scrollExitEnd === null) {
                const lastImgAbsBot = resultImgs[resultImgs.length - 1].getBoundingClientRect().bottom + scrollY;
                scrollExitEnd = lastImgAbsBot - vh * 0.5;
            }

            const scrollEnterStart = tabAbsTop - vh * 0.6;
            const enterProgress = Math.max(0, Math.min(1, (scrollY - scrollEnterStart) / range));
            const exitProgress  = Math.max(0, Math.min(1, (scrollExitEnd - scrollY)    / range));
            const progress = Math.min(enterProgress, exitProgress);

            resultTab.style.paddingLeft  = `${maxPad * (1 - progress)}px`;
            resultTab.style.paddingRight = `${maxPad * (1 - progress)}px`;

            const width      = naturalWidth + (vw - naturalWidth) * progress;
            const marginLeft = -tabLeft * progress;

            resultImgs.forEach(el => {
                if (el.tagName === 'VIDEO') {
                    const ar        = (el.videoHeight && el.videoWidth) ? el.videoHeight / el.videoWidth : 9 / 16;
                    const expandedW = Math.min(vh / ar, vw);
                    const w  = naturalWidth + (expandedW - naturalWidth) * progress;
                    const h  = w * ar;
                    const ml = ((vw / 2 - expandedW / 2) - tabLeft) * progress;
                    el.style.width      = `${w}px`;
                    el.style.height     = `${h}px`;
                    el.style.marginLeft = `${ml}px`;
                    el.style.objectFit  = 'contain';
                } else {
                    el.style.width      = `${width}px`;
                    el.style.marginLeft = `${marginLeft}px`;
                }
            });

            if (progress >= 1) {
                if (!stackCaptured) {
                    imgAbsTops    = resultImgs.map(el => el.getBoundingClientRect().top + scrollY);
                    scrollExitEnd = imgAbsTops[imgAbsTops.length - 1] + range;
                    stackCaptured = true;
                }
                resultImgs.forEach((el, i) => {
                    el.style.transform = `translateY(${Math.max(0, scrollY - imgAbsTops[i])}px)`;
                });
            } else {
                if (stackCaptured) {
                    resultImgs.forEach(el => { el.style.transform = ''; });
                    stackCaptured = false;
                    scrollExitEnd = null;
                }
            }
        }

        let rafPending = false;
        function onScroll() {
            if (rafPending) return;
            rafPending = true;
            requestAnimationFrame(() => {
                updateResultExpand();
                rafPending = false;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        updateResultExpand();
    }

    const resultVideos = [...document.querySelectorAll('.resultMedia video')];
    if (resultVideos.length > 0) {
        const readyPromises = resultVideos.map(v =>
            v.readyState >= 1
                ? Promise.resolve()
                : new Promise(resolve => {
                    v.addEventListener('loadedmetadata', resolve, { once: true });
                    setTimeout(resolve, 3000);
                })
        );
        Promise.all(readyPromises).then(initResultExpand);
    } else {
        initResultExpand();
    }



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