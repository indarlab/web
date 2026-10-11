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
