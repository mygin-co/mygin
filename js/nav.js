/**
 * nav.js — Comportamiento del navbar
 *
 * Single Responsibility: solo gestiona el estado visual del nav
 * (scroll, mobile toggle, active link).
 */

/**
 * Añade clase `nav--scrolled` al nav cuando el usuario baja más de 40px.
 */
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const update = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/**
 * Toggle del menú mobile.
 * El menú usa translate-x para slide-in/out (clase `!translate-x-0`).
 */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const open = () => {
    menu.classList.remove('translate-x-full');
    menu.classList.add('translate-x-0');
    toggle.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    menu.classList.add('translate-x-full');
    menu.classList.remove('translate-x-0');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('translate-x-0');
    isOpen ? close() : open();
  });

  // Cerrar al hacer click en un link
  menu.addEventListener('click', e => {
    if (e.target.tagName === 'A') close();
  });
}

/**
 * Marca el link de nav activo según la sección visible.
 */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const linksSlot = document.querySelector('[data-slot="nav-links"]');
  if (!sections.length || !linksSlot) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        linksSlot.querySelectorAll('a').forEach(link => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          // Active: color primary con border-b
          link.classList.toggle('text-primary', isActive);
          link.classList.toggle('border-b', isActive);
          link.classList.toggle('border-primary', isActive);
          link.classList.toggle('text-on-surface', !isActive);
        });
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
}

export function initNav() {
  initNavScroll();
  initMobileMenu();
  initActiveNavLink();
}
