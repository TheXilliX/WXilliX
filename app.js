const intro = document.getElementById('intro');
const gate = document.getElementById('passwordScreen');
const passwordInput = document.getElementById('sitePassword');
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

const gateHint = document.querySelector('.gate-hint');
if (gateHint) gateHint.textContent = 'DATE OF BIRTH / NO ENTER';

const inspirationTitle = document.querySelector('.inspiration-head h1');
if (inspirationTitle && inspirationTitle.textContent.trim() === 'ВДОХНОВЕНИЕ') {
  inspirationTitle.innerHTML = '<span>ВДОХ</span><span>НОВЕНИЕ</span>';
  inspirationTitle.classList.add('mobile-split-title');
}

function showMenu({ immediate = false } = {}) {
  if (!menu) return;
  intro?.classList.add('is-skipped');
  intro?.setAttribute('aria-hidden', 'true');
  gate?.classList.remove('is-visible', 'is-unlocking');
  gate?.classList.add('is-finished');
  gate?.setAttribute('aria-hidden', 'true');
  menu.classList.add('is-visible');
  menu.setAttribute('aria-hidden', 'false');
  if (!immediate) {
    menu.animate(
      [
        { opacity: 0, filter: 'blur(14px)', transform: 'scale(1.01)' },
        { opacity: 1, filter: 'blur(0)', transform: 'scale(1)' }
      ],
      { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' }
    );
  }
}

function showPassword() {
  if (!gate) return showMenu();
  intro?.classList.add('is-leaving');
  window.setTimeout(() => {
    gate.classList.add('is-visible');
    gate.setAttribute('aria-hidden', 'false');
    passwordInput?.focus({ preventScroll: true });
  }, 300);
  window.setTimeout(() => {
    intro?.classList.add('is-finished');
    intro?.setAttribute('aria-hidden', 'true');
  }, 980);
}

if (menu) {
  const skipGateOnce = sessionStorage.getItem('skipGateOnce') === '1';
  if (skipGateOnce) {
    sessionStorage.removeItem('skipGateOnce');
    showMenu({ immediate: false });
  } else {
    window.setTimeout(showPassword, 2000);
  }
}

if (passwordInput) {
  passwordInput.addEventListener('input', () => {
    passwordInput.value = passwordInput.value.replace(/\D/g, '').slice(0, 4);
    if (passwordInput.value !== '1812') return;

    passwordInput.blur();
    gate?.classList.add('is-unlocking');
    window.setTimeout(() => showMenu(), 420);
  });
}

function updateClock() {
  document.querySelectorAll('[data-clock]').forEach((node) => {
    node.textContent = new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  });
}

updateClock();
window.setInterval(updateClock, 30000);

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

window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-is-leaving');
});
