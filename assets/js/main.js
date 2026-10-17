// Menú desplegable en móvil
const toggle = document.querySelector('.nav__toggle');
const links = document.querySelector('.nav__links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Año actual en el pie de página
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Pestañas de la maqueta de la plataforma
const tabs = document.querySelectorAll('.mock__tabs [role="tab"]');
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      activate(next); next.focus();
    }
  });
});
function activate(tab) {
  tabs.forEach(t => {
    const on = t === tab;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
}

// Visor de capturas reales (clic para ampliar)
const zoomables = document.querySelectorAll('.zoomable');
if (zoomables.length) {
  const txtCerrar = { es: 'Cerrar', en: 'Close', eu: 'Itxi', ru: 'Закрыть' }[document.documentElement.lang] || 'Cerrar';
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<button class="lightbox__close" type="button">×</button><img alt="">';
  document.body.appendChild(box);
  const img = box.querySelector('img');
  const btnClose = box.querySelector('button');
  btnClose.setAttribute('aria-label', txtCerrar);
  let origen = null;
  const cerrar = () => { box.hidden = true; img.removeAttribute('src'); if (origen) origen.focus(); };
  zoomables.forEach(b => b.addEventListener('click', () => {
    origen = b;
    img.src = b.dataset.full;
    img.alt = (b.querySelector('img') || {}).alt || '';
    box.hidden = false;
    btnClose.focus();
  }));
  box.addEventListener('click', e => { if (e.target !== img) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) cerrar(); });
}

// Vídeos de campo: se pausan fuera de pantalla y respetan "reducir movimiento"
const videos = document.querySelectorAll('.field video');
const reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
videos.forEach(v => {
  if (reducir) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; }
});
if (!reducir && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entradas => entradas.forEach(e => {
    if (e.isIntersecting) { e.target.play().catch(() => {}); } else { e.target.pause(); }
  }), { threshold: 0.2 });
  videos.forEach(v => io.observe(v));
}

// Vídeo de fondo del hero: solo se descarga en pantallas grandes y si no se ha pedido "reducir movimiento"
const heroVideo = document.querySelector('.hero__video');
if (heroVideo) {
  const sinMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ahorroDatos = navigator.connection && navigator.connection.saveData;
  if (!sinMovimiento && !ahorroDatos && window.innerWidth > 720) {
    const mp4 = heroVideo.canPlayType('video/mp4; codecs="avc1.42E01E"');
    heroVideo.src = mp4 ? heroVideo.dataset.src : (heroVideo.dataset.srcWebm || heroVideo.dataset.src);
    heroVideo.addEventListener('canplay', () => heroVideo.classList.add('is-ready'), { once: true });
    heroVideo.play().catch(() => {});
  }
}
