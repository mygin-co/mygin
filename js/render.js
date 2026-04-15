/**
 * render.js — Genera el DOM dinámicamente desde config.js
 *
 * Single Responsibility: solo lee el config y construye nodos HTML.
 * Dependency Inversion: depende de config.js y shopify.js, no conoce el HTML del index.
 *
 * Cada sección tiene su propio método privado (Interface Segregation).
 * Clases visuales: Tailwind v4 con tokens del design system "The Editorial Sommelier".
 */

import config from './config.js';
import { isShopifyConfigured, getSmallTierUrl, getBulkTierUrl } from './shopify.js';

/* ─── Helpers ──────────────────────────────────────────────────── */

function buildInstagramUrl(message) {
  const text = encodeURIComponent(message || 'Hola, quiero pedir MyGin 🍸');
  return `https://ig.me/m/${config.brand.instagram}?text=${text}`;
}

function buildShopifyCtaUrl(variantKey) {
  if (!isShopifyConfigured()) return config.brand.instagramUrl;
  if (variantKey === 'small') return getSmallTierUrl(2);
  if (variantKey === 'bulk')  return getBulkTierUrl(4);
  return config.brand.instagramUrl;
}

function resolveCta(cta) {
  if (cta.action === 'shopify')   return buildShopifyCtaUrl(cta.variantKey);
  if (cta.action === 'instagram') return buildInstagramUrl(cta.message);
  return cta.href || '#';
}

function el(tag, classNames = '', attrs = {}) {
  const node = document.createElement(tag);
  if (classNames) node.className = classNames;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== '') node.setAttribute(k, v);
  });
  return node;
}

function createBtn(cta, extraClass = '') {
  const isExternal = cta.action === 'instagram' || cta.action === 'shopify';
  const isPrimary  = (cta.type || 'primary') === 'primary';

  const baseClass = isPrimary
    ? 'bg-primary text-on-primary px-10 py-4 font-bold tracking-widest uppercase text-xs hover:opacity-90 transition-opacity rounded-lg'
    : 'border border-outline-variant/40 text-secondary px-10 py-4 font-bold tracking-widest uppercase text-xs hover:bg-surface-container-high transition-all rounded-lg';

  const a = el('a', `${baseClass} ${extraClass}`.trim(), {
    href:   resolveCta(cta),
    target: isExternal ? '_blank' : '_self',
    rel:    isExternal ? 'noopener noreferrer' : '',
  });
  a.textContent = cta.label;
  return a;
}

function icon(name, fill = 1) {
  const span = el('span', 'material-symbols-outlined');
  span.style.fontVariationSettings = `'FILL' ${fill}, 'wght' 300, 'GRAD' 0, 'opsz' 24`;
  span.textContent = name;
  return span;
}

/* ─── Secciones ────────────────────────────────────────────────── */

function renderNav() {
  // Logo
  const logoSlot = document.querySelector('[data-slot="nav-logo"]');
  if (logoSlot) logoSlot.textContent = config.brand.name;

  // Links desktop
  const linksSlot = document.querySelector('[data-slot="nav-links"]');
  if (linksSlot) {
    config.nav.links.forEach(link => {
      const a = el('a',
        'text-on-surface hover:text-secondary transition-colors duration-300 font-headline tracking-tighter uppercase text-sm',
        { href: link.href }
      );
      a.textContent = link.label;
      linksSlot.appendChild(a);
    });
  }

  // CTA desktop
  const ctaSlot = document.querySelector('[data-slot="nav-cta"]');
  if (ctaSlot) {
    const cartBtn = el('button', 'material-symbols-outlined text-on-surface hover:opacity-80 transition-opacity');
    cartBtn.textContent = 'shopping_bag';

    const contactBtn = el('a',
      'border border-outline-variant/40 text-secondary px-5 py-2 font-bold uppercase text-xs tracking-widest hover:bg-surface-container-high transition-all rounded',
      {
        href:   `mailto:${config.brand.email}`,
        title:  `Contactar ventas: ${config.brand.email}`,
      }
    );
    contactBtn.textContent = 'Contactar Ventas';

    const buyBtn = el('a',
      'bg-primary text-on-primary px-6 py-2 font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-opacity rounded',
      { href: config.nav.cta.href }
    );
    buyBtn.textContent = config.nav.cta.label;

    ctaSlot.appendChild(cartBtn);
    ctaSlot.appendChild(contactBtn);
    ctaSlot.appendChild(buyBtn);
  }

  // Links mobile
  const mobileSlot = document.querySelector('[data-slot="nav-mobile-links"]');
  if (mobileSlot) {
    config.nav.links.forEach(link => {
      const a = el('a',
        'font-headline text-2xl text-on-surface hover:text-secondary tracking-tighter uppercase transition-colors',
        { href: link.href, role: 'menuitem' }
      );
      a.textContent = link.label;
      mobileSlot.appendChild(a);
    });
    const mobileContact = el('a',
      'border border-outline-variant/40 text-secondary px-8 py-3 font-bold uppercase text-xs tracking-widest rounded',
      { href: `mailto:${config.brand.email}` }
    );
    mobileContact.textContent = 'Contactar Ventas';
    mobileSlot.appendChild(mobileContact);

    const mobileBuy = el('a',
      'bg-primary text-on-primary px-8 py-3 font-bold uppercase text-xs tracking-widest rounded',
      { href: config.nav.cta.href }
    );
    mobileBuy.textContent = config.nav.cta.label;
    mobileSlot.appendChild(mobileBuy);
  }
}

function renderHero() {
  const set = (sel, val) => {
    const n = document.querySelector(sel);
    if (n) n.textContent = val;
  };

  set('[data-hero="label"]',       config.hero.label);
  set('[data-hero="subheadline"]', config.hero.subheadline);

  // Headline con salto de línea
  const h1 = document.querySelector('[data-hero="headline"]');
  if (h1) {
    const [line1, line2] = config.hero.headline.split('\n');
    h1.innerHTML = `${line1}<br><span class="italic text-primary">${line2 || ''}</span>`;
  }

  // Imagen de fondo
  const bgImg = document.querySelector('[data-hero="bg"]');
  if (bgImg) {
    bgImg.src = config.hero.bgImage;
    bgImg.alt = `${config.brand.name} — Gin Premium Chileno`;
  }

  // CTAs
  const ctaGroup = document.querySelector('[data-hero="ctas"]');
  if (ctaGroup) {
    config.hero.ctas.forEach(cta => ctaGroup.appendChild(createBtn(cta)));
  }
}

function renderProducto() {
  const set = (sel, val) => {
    const n = document.querySelector(sel);
    if (n) n.textContent = val;
  };

  set('[data-producto="label"]', config.producto.label);

  const h2 = document.querySelector('[data-producto="headline"]');
  if (h2) h2.innerHTML = config.producto.headline;

  set('[data-producto="body"]', config.producto.body);

  const img = document.querySelector('[data-producto="image"]');
  if (img) {
    img.src = config.producto.image;
    img.alt = `${config.brand.name} — Botella`;
  }

  const list = document.querySelector('[data-producto="benefits"]');
  if (list) {
    config.producto.benefits.forEach((b, i) => {
      const li = el('li', `flex gap-6 group reveal reveal--delay-${i + 1}`);

      const iconWrap = el('div',
        'w-12 h-12 flex-shrink-0 bg-surface-container-highest flex items-center justify-center rounded-lg group-hover:text-primary transition-colors'
      );
      iconWrap.appendChild(icon(b.icon, 1));

      const textWrap = el('div', '');
      const title = el('h3', 'font-headline text-xl mb-2 text-on-surface');
      title.textContent = b.title;
      const desc = el('p', 'text-on-surface-variant text-sm leading-relaxed max-w-sm');
      desc.textContent = b.desc;
      textWrap.appendChild(title);
      textWrap.appendChild(desc);

      li.appendChild(iconWrap);
      li.appendChild(textWrap);
      list.appendChild(li);
    });
  }
}

function renderExperiencia() {
  const h2 = document.querySelector('[data-experiencia="headline"]');
  if (h2) {
    const [line1, line2] = config.experiencia.headline.split('\n');
    h2.innerHTML = `${line1}<br><span class="italic text-primary">${line2 || ''}</span>`;
  }

  const label = document.querySelector('[data-experiencia="label"]');
  if (label) label.textContent = config.experiencia.label;

  const grid = document.querySelector('[data-experiencia="moments"]');
  if (!grid) return;

  // Bento grid: 4 imágenes asimétricas
  // Layout: [0]=col-span-2 row-span-2 | [1]=col-span-1 row-span-1 | [2]=col-span-1 row-span-2 | [3]=col-span-1 row-span-1
  const spanClasses = [
    'md:col-span-2 md:row-span-2',
    'md:col-span-1 md:row-span-1',
    'md:col-span-1 md:row-span-2',
    'md:col-span-1 md:row-span-1',
  ];

  grid.className = 'grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[800px]';

  config.experiencia.moments.forEach((m, i) => {
    const wrap = el('div',
      `${spanClasses[i]} relative overflow-hidden rounded-xl reveal reveal--delay-${i + 1}`
    );
    const img = el('img', 'w-full h-full object-cover hover:scale-110 transition-transform duration-1000', {
      src:     m.image,
      alt:     m.caption,
      loading: 'lazy',
    });
    wrap.appendChild(img);
    grid.appendChild(wrap);
  });
}

function renderTestimonios() {
  const h2 = document.querySelector('[data-testimonios="headline"]');
  if (h2) h2.textContent = config.testimonios.headline;

  const grid = document.querySelector('[data-testimonios="items"]');
  if (!grid) return;

  config.testimonios.items.forEach((t, i) => {
    const card = el('div',
      `bg-surface-container-low p-10 rounded-lg border-b border-secondary/10 reveal reveal--delay-${i + 1}`
    );

    // Estrellas con Material Symbols
    const starsWrap = el('div', 'flex text-secondary mb-6');
    for (let s = 1; s <= 5; s++) {
      starsWrap.appendChild(icon('star', s <= t.stars ? 1 : 0));
    }

    const text = el('p', 'font-body italic text-lg mb-8 leading-relaxed');
    text.textContent = t.text;

    const author = el('span', 'block text-xs uppercase tracking-widest text-primary font-bold');
    author.textContent = `${t.name} — ${t.location}`;

    card.appendChild(starsWrap);
    card.appendChild(text);
    card.appendChild(author);
    grid.appendChild(card);
  });
}

function renderPrecios() {
  const set = (sel, val) => {
    const n = document.querySelector(sel);
    if (n) n.textContent = val;
  };

  set('[data-precios="label"]', config.precios.label);

  const h2 = document.querySelector('[data-precios="headline"]');
  if (h2) {
    const [line1, line2] = config.precios.headline.split('\n');
    h2.innerHTML = `${line1}<br><span class="text-secondary italic">${line2 || ''}</span>`;
  }

  const grid = document.querySelector('[data-precios="tiers"]');
  if (!grid) return;

  config.precios.tiers.forEach((tier, i) => {
    const formattedPrice = tier.price.toLocaleString('es-CL');

    if (tier.highlight) {
      // Card destacada — fondo primary
      const card = el('div',
        `bg-primary text-on-primary p-12 rounded-xl flex flex-col justify-between relative overflow-hidden reveal reveal--delay-${i + 1}`
      );

      // Badge diagonal
      if (tier.badge) {
        const badge = el('div',
          'absolute -top-4 -right-12 bg-white/20 text-white text-[0.6rem] font-bold px-12 py-2 rotate-45 uppercase tracking-widest'
        );
        badge.textContent = tier.badge;
        card.appendChild(badge);
      }

      const body = el('div', '');

      const header = el('div', 'flex justify-between items-start mb-8');
      const title = el('h3', 'font-headline text-2xl uppercase tracking-tighter');
      title.textContent = tier.label;
      const sublabel = el('span',
        'bg-primary-container text-primary px-3 py-1 text-[0.6rem] tracking-[0.2em] uppercase rounded-full'
      );
      sublabel.textContent = tier.sublabel;
      header.appendChild(title);
      header.appendChild(sublabel);

      const priceWrap = el('div', 'mb-8');
      priceWrap.innerHTML = `<span class="text-4xl font-headline">$${formattedPrice}</span><span class="text-on-primary-container text-sm ml-2">${tier.unit}</span>`;

      const featuresList = el('ul', 'space-y-4 mb-12');
      tier.features.forEach(f => {
        const li = el('li', 'flex items-center gap-3 text-sm text-on-primary/80');
        li.appendChild(icon('check', 0));
        li.append(` ${f}`);
        featuresList.appendChild(li);
      });

      body.appendChild(header);
      body.appendChild(priceWrap);
      body.appendChild(featuresList);
      card.appendChild(body);
      card.appendChild(createBtn({ ...tier.cta, type: 'primary-inv' }));
      grid.appendChild(card);

    } else {
      // Card normal — outline
      const card = el('div',
        `bg-surface p-12 rounded-xl flex flex-col justify-between group hover:bg-surface-container-low transition-all duration-500 reveal reveal--delay-${i + 1}`
      );

      const body = el('div', '');

      const header = el('div', 'flex justify-between items-start mb-8');
      const title = el('h3', 'font-headline text-2xl uppercase tracking-tighter');
      title.textContent = tier.label;
      const sublabel = el('span',
        'bg-surface-container-highest px-3 py-1 text-[0.6rem] tracking-[0.2em] uppercase rounded-full'
      );
      sublabel.textContent = tier.sublabel;
      header.appendChild(title);
      header.appendChild(sublabel);

      const priceWrap = el('div', 'mb-8');
      priceWrap.innerHTML = `<span class="text-4xl font-headline">$${formattedPrice}</span><span class="text-on-surface-variant text-sm ml-2">${tier.unit}</span>`;

      const featuresList = el('ul', 'space-y-4 mb-12');
      tier.features.forEach(f => {
        const li = el('li', 'flex items-center gap-3 text-sm text-on-surface-variant');
        const checkIcon = icon('check', 0);
        checkIcon.className = 'material-symbols-outlined text-xs text-secondary';
        li.appendChild(checkIcon);
        li.append(` ${f}`);
        featuresList.appendChild(li);
      });

      body.appendChild(header);
      body.appendChild(priceWrap);
      body.appendChild(featuresList);
      card.appendChild(body);

      // Botón outline que se llena al hacer hover en la card
      const btn = el('a',
        'w-full text-center border border-primary text-primary py-4 rounded-lg font-bold uppercase text-xs tracking-widest group-hover:bg-primary group-hover:text-on-primary transition-all duration-300',
        {
          href:   resolveCta(tier.cta),
          target: '_blank',
          rel:    'noopener noreferrer',
        }
      );
      btn.textContent = tier.cta.label;
      card.appendChild(btn);
      grid.appendChild(card);
    }
  });
}

function renderUrgencyBanner() {
  const section = document.querySelector('[data-slot="urgency-banner"]');
  if (!section) return;

  const b = config.urgencyBanner;

  const container = el('div',
    'container mx-auto px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8'
  );

  const left = el('div', 'flex items-center gap-6');
  const warningIcon = icon('warning', 1);
  warningIcon.className = 'material-symbols-outlined text-on-primary text-5xl';
  const textWrap = el('div', '');
  const headline = el('h2', 'font-headline text-3xl text-on-primary leading-none mb-2 tracking-tighter');
  headline.id = 'urgencia-headline';
  headline.textContent = b.headline;
  const sublabel = el('p', 'text-on-primary/70 uppercase tracking-widest text-xs font-bold');
  sublabel.textContent = b.sublabel;
  textWrap.appendChild(headline);
  textWrap.appendChild(sublabel);
  left.appendChild(warningIcon);
  left.appendChild(textWrap);

  const cta = el('a',
    'bg-on-primary text-white px-12 py-5 rounded-lg font-bold uppercase text-xs tracking-[0.3em] hover:scale-105 transition-transform',
    {
      href:   resolveCta(b.cta),
      target: '_blank',
      rel:    'noopener noreferrer',
    }
  );
  cta.textContent = b.cta.label;

  container.appendChild(left);
  container.appendChild(cta);
  section.appendChild(container);
}

function renderFooter() {
  const set = (sel, val) => {
    const n = document.querySelector(sel);
    if (n) n.textContent = val;
  };

  set('[data-footer="copy"]', config.footer.copy);
  set('[data-footer="note"]', config.footer.note);

  const logoSlot = document.querySelector('[data-slot="footer-logo"]');
  if (logoSlot) logoSlot.textContent = config.brand.name;

  const igLink = document.querySelector('[data-footer="instagram"]');
  if (igLink) {
    igLink.href = config.brand.instagramUrl;
    igLink.textContent = `@${config.brand.instagram}`;
  }

  const linksSlot = document.querySelector('[data-slot="footer-links"]');
  if (linksSlot) {
    config.footer.links.forEach(link => {
      const a = el('a',
        'text-on-surface/60 hover:text-secondary transition-colors font-body text-xs tracking-widest uppercase',
        { href: link.href }
      );
      a.textContent = link.label;
      linksSlot.appendChild(a);
    });
  }
}

/* ─── Inicialización ───────────────────────────────────────────── */

export function renderAll() {
  renderNav();
  renderHero();
  renderProducto();
  renderExperiencia();
  renderTestimonios();
  renderPrecios();
  renderUrgencyBanner();
  renderFooter();
}
