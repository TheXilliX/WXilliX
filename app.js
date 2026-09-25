const intro = document.getElementById('intro');
const menu = document.getElementById('menuScreen');

function revealMenu({ immediate = false } = {}) {
  if (!menu) return;

  if (immediate) {
    intro?.classList.add('is-skipped');
    intro?.setAttribute('aria-hidden', 'true');
    menu.classList.add('is-visible');
    menu.setAttribute('aria-hidden', 'false');
    return;
  }

  if (!intro) {
    menu.classList.add('is-visible');
    menu.setAttribute('aria-hidden', 'false');
    return;
  }

  intro.classList.add('is-leaving');
  window.setTimeout(() => {
    menu.classList.add('is-visible');
    menu.setAttribute('aria-hidden', 'false');
  }, 360);

  window.setTimeout(() => {
    intro.classList.add('is-finished');
    intro.setAttribute('aria-hidden', 'true');
  }, 1150);
}

if (menu) {
  if (window.location.hash === '#menu') {
    revealMenu({ immediate: true });
  } else {
    window.setTimeout(() => revealMenu(), 2000);
  }
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

    window.setTimeout(() => {
      menu.classList.add('to-milk');
    }, 150);

    window.setTimeout(() => {
      window.location.href = href;
    }, 980);
  });
});

document.querySelectorAll('a:not(.main-nav a)').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    document.body.classList.add('page-is-leaving');
    window.setTimeout(() => {
      window.location.href = href;
    }, 460);
  });
});

window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-is-leaving');
});
