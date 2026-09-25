const intro = document.getElementById('intro');
const passwordScreen = document.getElementById('passwordScreen');
const passwordInput = document.getElementById('sitePassword');
const menu = document.getElementById('menuScreen');

function showMenuImmediate() {
  intro?.classList.add('is-skipped');
  intro?.setAttribute('aria-hidden', 'true');
  passwordScreen?.classList.add('is-finished');
  passwordScreen?.setAttribute('aria-hidden', 'true');
  if (!menu) return;
  menu.classList.add('is-visible');
  menu.setAttribute('aria-hidden', 'false');
}

function showPasswordGate() {
  if (!passwordScreen) {
    showMenuImmediate();
    return;
  }

  intro?.classList.add('is-leaving');
  window.setTimeout(() => {
    passwordScreen.classList.add('is-visible');
    passwordScreen.setAttribute('aria-hidden', 'false');
    passwordInput?.focus({ preventScroll: true });
  }, 320);

  window.setTimeout(() => {
    intro?.classList.add('is-finished');
    intro?.setAttribute('aria-hidden', 'true');
  }, 1050);
}

function unlockSite() {
  if (!passwordScreen || !menu) return;
  passwordScreen.classList.add('is-unlocking');
  passwordInput?.blur();

  window.setTimeout(() => {
    menu.classList.add('is-visible');
    menu.setAttribute('aria-hidden', 'false');
  }, 300);

  window.setTimeout(() => {
    passwordScreen.classList.remove('is-visible');
    passwordScreen.classList.add('is-finished');
    passwordScreen.setAttribute('aria-hidden', 'true');
  }, 850);
}

if (menu) {
  if (window.location.hash === '#menu') {
    showMenuImmediate();
  } else {
    window.setTimeout(showPasswordGate, 2000);
  }
}

passwordInput?.addEventListener('input', () => {
  passwordInput.value = passwordInput.value.replace(/\D/g, '').slice(0, 4);
  if (passwordInput.value === '1812') unlockSite();
});

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

const inspirationModals = document.querySelectorAll('.inspiration-modal');

function openModal(name) {
  const modal = document.querySelector(`.inspiration-modal[data-modal="${name}"]`);
  if (!modal) return;
  document.body.classList.add('modal-open');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.inspiration-modal.is-open')) {
    document.body.classList.remove('modal-open');
  }
}

document.querySelectorAll('[data-panel]').forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.panel));
});

document.querySelectorAll('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', () => closeModal(button.closest('.inspiration-modal')));
});

const posterImages = Array.isArray(window.POSTER_IMAGES) ? window.POSTER_IMAGES : [];
const posterGrid = document.getElementById('posterGrid');
const posterPreview = document.getElementById('posterPreview');
const posterViewer = document.getElementById('posterViewer');
const posterViewerImage = document.getElementById('posterViewerImage');

if (posterPreview && posterImages.length) {
  posterPreview.src = posterImages[0];
}

if (posterGrid) {
  posterImages.forEach((src, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'poster-thumb';
    button.setAttribute('aria-label', `Открыть постер ${index + 1}`);

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Постер ${index + 1}`;
    img.loading = 'lazy';
    button.appendChild(img);

    button.addEventListener('click', () => {
      if (!posterViewer || !posterViewerImage) return;
      posterViewerImage.src = src;
      posterViewer.classList.add('is-open');
      posterViewer.setAttribute('aria-hidden', 'false');
    });

    posterGrid.appendChild(button);
  });
}

function closePosterViewer() {
  if (!posterViewer) return;
  posterViewer.classList.remove('is-open');
  posterViewer.setAttribute('aria-hidden', 'true');
  if (posterViewerImage) posterViewerImage.removeAttribute('src');
}

document.querySelectorAll('[data-close-viewer]').forEach((button) => {
  button.addEventListener('click', closePosterViewer);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (posterViewer?.classList.contains('is-open')) {
    closePosterViewer();
    return;
  }
  const open = document.querySelector('.inspiration-modal.is-open');
  if (open) closeModal(open);
});

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    const state = button.querySelector('.copy-state');
    if (!value || !state) return;
    try {
      await navigator.clipboard.writeText(value);
      const previous = state.textContent;
      state.textContent = 'СКОПИРОВАНО';
      window.setTimeout(() => { state.textContent = previous; }, 1300);
    } catch (_) {
      state.textContent = value;
    }
  });
});

document.querySelectorAll('a').forEach((link) => {
  if (link.closest('.main-nav')) return;
  const href = link.getAttribute('href');
  if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add('page-is-leaving');
    window.setTimeout(() => { window.location.href = href; }, 320);
  });
});

window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-is-leaving');
});
