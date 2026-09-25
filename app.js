const intro = document.getElementById('intro');
const menu = document.getElementById('menuScreen');
const enter = document.getElementById('enterButton');

function openMenu(){
  if (!intro || !menu) return;
  intro.classList.add('is-leaving');
  window.setTimeout(() => {
    menu.classList.add('is-visible');
    menu.setAttribute('aria-hidden','false');
  }, 220);
}

enter?.addEventListener('click', openMenu);
intro?.addEventListener('dblclick', openMenu);

function updateClock(){
  document.querySelectorAll('[data-clock]').forEach((node)=>{
    node.textContent = new Intl.DateTimeFormat('ru-RU',{hour:'2-digit',minute:'2-digit'}).format(new Date());
  });
}
updateClock();
window.setInterval(updateClock, 30000);

document.querySelectorAll('a').forEach((link)=>{
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http')) return;
  link.addEventListener('click', (event)=>{
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.style.transition = 'opacity .28s ease, filter .28s ease';
    document.body.style.opacity = '0';
    document.body.style.filter = 'blur(6px)';
    window.setTimeout(()=>{ window.location.href = href; }, 260);
  });
});

window.addEventListener('pageshow',()=>{
  document.body.style.opacity='1';
  document.body.style.filter='none';
});
