const intro = document.getElementById('intro');
const menu = document.getElementById('menuScreen');

const mobilePolish = document.createElement('style');
mobilePolish.textContent = `
button,a,.accordion-toggle,.project-toggle,.menu-link{-webkit-tap-highlight-color:transparent}
button,.accordion-toggle,.project-toggle{-webkit-appearance:none;appearance:none}
button:focus:not(:focus-visible),a:focus:not(:focus-visible){outline:none}
.password-screen{display:grid!important;place-items:center!important}
.gate-center{position:relative!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;margin:0!important;width:min(560px,calc(100vw - 40px))!important;display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important}
.gate-center>.eyebrow,.gate-hint{width:100%!important;text-align:center!important}
.password-field{width:min(430px,100%)!important;margin:32px auto 18px!important}
.password-field input{width:100%!important;box-sizing:border-box!important;text-align:center!important;padding-left:0!important;padding-right:0!important}
.mobile-split-title span{display:inline}
@media(max-width:800px){
  .mobile-split-title{font-size:clamp(3.7rem,17vw,5.8rem)!important;line-height:.78!important;letter-spacing:-.07em!important}
  .mobile-split-title span{display:block}
  .gate-center{width:calc(100vw - 40px)!important}
  .gate-center>.eyebrow{font-size:.68rem!important}
  .gate-hint{font-size:.58rem!important;letter-spacing:.14em!important}
  .accordion-toggle,.project-toggle{outline:none!important;box-shadow:none!important;width:100%!important;box-sizing:border-box!important;min-height:82px!important}
  .accordion-toggle:active,.project-toggle:active{background:transparent!important}
  .project-card,.now-item,.project-details,.accordion-details{width:100%!important;max-width:none!important;box-sizing:border-box!important}
}
`;
document.head.appendChild(mobilePolish);

const inspirationTitle = document.querySelector('.inspiration-head h1');
if (inspirationTitle && inspirationTitle.textContent.trim() === 'ВДОХНОВЕНИЕ') {
  inspirationTitle.innerHTML = '<span>ВДОХ</span><span>НОВЕНИЕ</span>';
  inspirationTitle.classList.add('mobile-split-title');
}

let introTimer = null;

function resetMenuState() {
  if (!menu) return;
  menu.classList.remove('is-transitioning', 'to-milk');
  menu.querySelectorAll('.is-selected').forEach((item) => item.classList.remove('is-selected'));
}

function showMenu({ immediate = false } = {}) {
  if (!menu) return;
  if (introTimer) {
    window.clearTimeout(introTimer);
    introTimer = null;
  }

  resetMenuState();
  menu.classList.add('is-visible');
  menu.setAttribute('aria-hidden', 'false');

  if (immediate) {
    intro?.classList.remove('is-leaving');
    intro?.classList.add('is-skipped', 'is-finished');
    intro?.setAttribute('aria-hidden', 'true');
    return;
  }

  intro?.classList.remove('is-skipped', 'is-finished');
  intro?.classList.add('is-leaving');
  intro?.setAttribute('aria-hidden', 'true');

  menu.animate(
    [
      { opacity: 0, filter: 'blur(14px)', transform: 'scale(1.01)' },
      { opacity: 1, filter: 'blur(0)', transform: 'scale(1)' }
    ],
    { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' }
  );

  window.setTimeout(() => {
    intro?.classList.remove('is-leaving');
    intro?.classList.add('is-finished');
  }, 520);
}

if (menu) {
  const skipGateOnce = sessionStorage.getItem('skipGateOnce') === '1';
  if (skipGateOnce) sessionStorage.removeItem('skipGateOnce');

  if (location.hash === '#menu' || skipGateOnce) {
    showMenu({ immediate: true });
  } else {
    introTimer = window.setTimeout(() => showMenu(), 3000);
  }
}

function updateClock() {
  document.querySelectorAll('[data-clock]').forEach((node) => {
    node.textContent = new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date());
  });
}

updateClock();
window.setInterval(updateClock, 1000);

const menuLinks = document.querySelectorAll('.main-nav a');
menuLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const href = link.getAttribute('href');
    if (!href || !menu) return;

    menu.classList.add('is-transitioning');
    link.classList.add('is-selected');
    window.setTimeout(() => menu.classList.add('to-milk'), 110);
    window.setTimeout(() => { window.location.href = href; }, 760);
  });
});

function wireAccordion(selector, cardSelector) {
  document.querySelectorAll(selector).forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest(cardSelector);
      if (!card) return;
      const willOpen = !card.classList.contains('is-open');
      card.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    });
  });
}

wireAccordion('.project-toggle', '.project-card');
wireAccordion('.accordion-toggle', '.now-item');

const modals = document.querySelectorAll('.inspiration-modal');
const launchers = document.querySelectorAll('[data-panel]');

function closeAllModals() {
  modals.forEach((modal) => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.classList.remove('modal-open');
}

launchers.forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.dataset.panel;
    const modal = document.querySelector(`[data-modal="${name}"]`);
    if (!modal) return;
    closeAllModals();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  });
});

document.querySelectorAll('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', closeAllModals);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeAllModals();
});

const posterGrid = document.getElementById('posterGrid');
const posterPreview = document.getElementById('posterPreview');
if (posterGrid && Array.isArray(window.POSTER_IMAGES)) {
  const validPosters = window.POSTER_IMAGES.filter((src) => typeof src === 'string' && src.startsWith('data:image/'));
  validPosters.forEach((src, index) => {
    const figure = document.createElement('figure');
    figure.className = 'poster-static';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Постер ${index + 1}`;
    img.loading = 'lazy';
    figure.appendChild(img);
    posterGrid.appendChild(figure);
  });
  if (posterPreview && validPosters[0]) {
    posterPreview.src = validPosters[0];
  }
}

const copyButton = document.querySelector('.contact-copy');
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const value = copyButton.dataset.copy || '';
    const label = copyButton.querySelector('.copy-state');
    try {
      await navigator.clipboard.writeText(value);
      if (label) {
        const previous = label.textContent;
        label.textContent = 'СКОПИРОВАНО';
        window.setTimeout(() => { label.textContent = previous; }, 1400);
      }
    } catch (_) {}
  });
}

document.querySelectorAll('a').forEach((link) => {
  if (link.closest('.main-nav')) return;
  const href = link.getAttribute('href');
  if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    if (link.classList.contains('menu-link') && href.includes('index.html#menu')) {
      sessionStorage.setItem('skipGateOnce', '1');
    }

    document.body.classList.add('page-is-leaving');
    window.setTimeout(() => { window.location.href = href; }, 420);
  });
});

window.addEventListener('pageshow', (event) => {
  document.body.classList.remove('page-is-leaving');
  const navigationType = performance.getEntriesByType('navigation')[0]?.type;
  if (event.persisted || navigationType === 'back_forward' || location.hash === '#menu') {
    showMenu({ immediate: true });
  }
});

const coniferScene = document.querySelector('#coniferCult');
const coniferMenuTrigger = document.querySelector('#coniferMenuTrigger');
const cultTreeButton = document.querySelector('#treeButton');
const cultBackButton = document.querySelector('#backButton');
let cultTimers = [];

function clearCultTimers() {
  cultTimers.forEach(clearTimeout);
  cultTimers = [];
  cultTreeButton?.classList.remove('is-pressing');
}

function openConiferCult() {
  if (!coniferScene || !cultTreeButton) return;
  clearCultTimers();
  coniferScene.classList.remove('is-closing');
  coniferScene.classList.add('is-open');
  coniferScene.setAttribute('aria-hidden', 'false');
  cultTreeButton.classList.add('is-pressing');
  cultTimers.push(setTimeout(() => {
    cultTreeButton.classList.remove('is-pressing');
    coniferScene.classList.add('is-awake', 'is-flight');
    cultTimers.push(setTimeout(() => coniferScene.classList.add('is-title'), 360));
    cultTimers.push(setTimeout(() => {
      coniferScene.classList.remove('is-title');
      coniferScene.classList.add('is-regalia');
    }, 1250));
    cultTimers.push(setTimeout(() => coniferScene.classList.add('is-regalia-content'), 2050));
  }, 140));
}

function closeConiferCult() {
  if (!coniferScene) return;
  clearCultTimers();
  coniferScene.classList.add('is-closing');
  cultTimers.push(setTimeout(() => {
    coniferScene.classList.remove('is-closing', 'is-open', 'is-regalia-content', 'is-regalia', 'is-flight', 'is-title', 'is-awake');
    coniferScene.setAttribute('aria-hidden', 'true');
  }, 700));
}

coniferMenuTrigger?.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  openConiferCult();
});
cultTreeButton?.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  openConiferCult();
});
cultBackButton?.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  closeConiferCult();
});

window.addEventListener('hashchange', () => {
  if (location.hash === '#menu') showMenu({ immediate: true });
});

