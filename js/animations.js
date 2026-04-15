/**
 * animations.js — Animaciones de entrada (reveal on scroll)
 *
 * Single Responsibility: solo gestiona la observación de elementos
 * con clase `.reveal` y activa la clase `.is-visible` al entrar en viewport.
 *
 * No conoce el DOM más allá de los selectores que observa.
 */

/**
 * Inicializa el IntersectionObserver para animaciones de reveal.
 * Respeta `prefers-reduced-motion` (gestionado en responsive.css).
 */
export function initAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Una vez revelado, dejar de observar (performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}
