/**
 * render.js — Genera el DOM dinámicamente desde config.js
 *
 * Single Responsibility: solo lee el config y construye nodos HTML.
 * Dependency Inversion: depende de config.js y shopify.js, no conoce el HTML del index.
 *
 * Cada sección tiene su propio método privado (Interface Segregation).
 * Clases visuales: Tailwind v4 con tokens del design system.
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
  const isExternal = cta.action === 'instagram' || cta.action === 'shopify' || (cta.href && cta.href.startsWith('http'));
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
  const logoSlot = document.querySelector('[data-slot="nav-logo"]');
  if (logoSlot) logoSlot.textContent = config.brand.name;

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

  const ctaSlot = document.querySelector('[data-slot="nav-cta"]');
  if (ctaSlot) {
    const contactBtn = el('a',
      'border border-outline-variant/40 text-secondary px-5 py-2 font-bold uppercase text-xs tracking-widest hover:bg-surface-container-high transition-all rounded',
      {
        href:  `mailto:${config.brand.email}`,
        title: `Contactar: ${config.brand.email}`,
      }
    );
    contactBtn.textContent = 'Contacto';

    const buyBtn = el('a',
      'bg-primary text-on-primary px-6 py-2 font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-opacity rounded',
      { href: config.nav.cta.href }
    );
    buyBtn.textContent = config.nav.cta.label;

    ctaSlot.appendChild(contactBtn);
    ctaSlot.appendChild(buyBtn);
  }

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
    mobileContact.textContent = 'Contacto';
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

  const h1 = document.querySelector('[data-hero="headline"]');
  if (h1) {
    const [line1, line2] = config.hero.headline.split('\n');
    h1.innerHTML = `${line1}<br><span class="italic text-primary">${line2 || ''}</span>`;
  }

  const bgImg = document.querySelector('[data-hero="bg"]');
  if (bgImg) {
    bgImg.src = config.hero.bgImage;
    bgImg.alt = `${config.brand.name} — Gin Premium Chileno`;
  }

  // Coordenadas
  const coords = document.querySelector('[data-hero="coordinates"]');
  if (coords) coords.textContent = config.brand.coordinates;

  const ctaGroup = document.querySelector('[data-hero="ctas"]');
  if (ctaGroup) {
    config.hero.ctas.forEach(cta => ctaGroup.appendChild(createBtn(cta)));
  }
}

function renderHistoria() {
  const h = config.historia;

  const set = (sel, val) => {
    const n = document.querySelector(sel);
    if (n) n.textContent = val;
  };

  set('[data-historia="label"]',   h.label);
  set('[data-historia="body"]',    h.body);
  set('[data-historia="quote"]',   h.quote);
  set('[data-historia="author"]',  h.quoteAuthor);
  set('[data-historia="location"]', h.distillery.location);

  const headlineEl = document.querySelector('[data-historia="headline"]');
  if (headlineEl) {
    const [line1, line2] = h.headline.split('\n');
    headlineEl.innerHTML = `${line1}<br><span class="italic text-primary">${line2 || ''}</span>`;
  }

  const statsWrap = document.querySelector('[data-historia="stats"]');
  if (statsWrap) {
    h.stats.forEach(stat => {
      const item = el('div', 'text-center');
      const val  = el('div', 'font-headline text-5xl text-primary tracking-tighter');
      val.textContent = stat.value;
      const lbl  = el('div', 'text-on-surface-variant text-xs uppercase tracking-widest mt-2');
      lbl.textContent = stat.label;
      item.appendChild(val);
      item.appendChild(lbl);
      statsWrap.appendChild(item);
    });
  }
}

function renderProducto() {
  const set = (sel, val) => {
    const n = document.querySelector(sel);
    if (n) n.textContent = val;
  };

  set('[data-producto="label"]', config.producto.label);

  const h2 = document.querySelector('[data-producto="headline"]');
  if (h2) {
    const [line1, line2] = config.producto.headline.split('\n');
    h2.innerHTML = `${line1}<br><span class="italic text-primary">${line2 || ''}</span>`;
  }

  set('[data-producto="body"]', config.producto.body);

  const img = document.querySelector('[data-producto="image"]');
  if (img) {
    img.src = config.producto.image;
    img.alt = `${config.brand.name} — Botella`;
  }

  // Perfil sensorial
  const profileWrap = document.querySelector('[data-producto="profile"]');
  if (profileWrap) {
    config.producto.sensorProfile.forEach(p => {
      const item = el('div', 'flex items-start gap-3');
      const ic   = icon(p.icon, 0);
      ic.className += ' text-secondary text-base';
      const txt  = el('div', '');
      const lbl  = el('span', 'text-[0.6rem] uppercase tracking-widest text-on-surface-variant block');
      lbl.textContent = p.label;
      const val  = el('span', 'text-sm text-on-surface');
      val.textContent = p.value;
      txt.appendChild(lbl);
      txt.appendChild(val);
      item.appendChild(ic);
      item.appendChild(txt);
      profileWrap.appendChild(item);
    });
  }

  // Benefits
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

  // Botánicos
  const botGrid = document.querySelector('[data-producto="botanicals"]');
  if (botGrid) {
    config.producto.botanicals.forEach((b, i) => {
      const card = el('div',
        `bg-surface-container-low p-4 rounded-xl flex flex-col gap-2 hover:bg-surface-container-high transition-colors reveal reveal--delay-${(i % 4) + 1}`
      );
      const top = el('div', 'flex items-center gap-2');
      const ic  = icon(b.icon, 0);
      ic.className += ' text-secondary text-sm';
      const name = el('span', 'font-headline text-sm text-on-surface');
      name.textContent = b.name;
      top.appendChild(ic);
      top.appendChild(name);
      const desc = el('p', 'text-on-surface-variant text-xs leading-relaxed');
      desc.textContent = b.desc;
      card.appendChild(top);
      card.appendChild(desc);
      botGrid.appendChild(card);
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

function renderRecetas() {
  const r = config.recetas;

  const set = (sel, val) => {
    const n = document.querySelector(sel);
    if (n) n.textContent = val;
  };

  set('[data-recetas="label"]',    r.label);
  set('[data-recetas="sublabel"]', r.sublabel);

  const h2 = document.querySelector('[data-recetas="headline"]');
  if (h2) {
    const [line1, line2] = r.headline.split('\n');
    h2.innerHTML = `${line1}<br><span class="italic text-primary">${line2 || ''}</span>`;
  }

  const grid = document.querySelector('[data-recetas="items"]');
  if (!grid) return;

  r.items.forEach((coctel, i) => {
    const card = el('div',
      `bg-surface-container-low rounded-2xl overflow-hidden flex flex-col reveal reveal--delay-${i + 1}`
    );

    // Header
    const header = el('div', 'p-8 pb-4');
    const emoji  = el('span', 'text-4xl block mb-4');
    emoji.textContent = coctel.emoji;
    const name = el('h3', 'font-headline text-2xl tracking-tighter text-on-surface mb-3');
    name.textContent = coctel.name;
    const desc = el('p', 'text-on-surface-variant text-sm leading-relaxed');
    desc.textContent = coctel.desc;
    header.appendChild(emoji);
    header.appendChild(name);
    header.appendChild(desc);

    // Ingredientes (details/summary)
    const details = document.createElement('details');
    details.className = 'border-t border-outline-variant/20 group';

    const summary = document.createElement('summary');
    summary.className = 'flex items-center justify-between px-8 py-5 cursor-pointer list-none text-xs uppercase tracking-widest font-bold text-secondary hover:text-primary transition-colors';
    summary.innerHTML = `
      <span>Ver ingredientes</span>
      <span class="material-symbols-outlined transition-transform duration-300 group-open:rotate-180" style="font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24">expand_more</span>
    `;

    const ingList = el('div', 'px-8 pb-6 space-y-2');
    coctel.ingredients.forEach(ing => {
      const row = el('div', 'flex justify-between text-sm py-1 border-b border-outline-variant/10');
      const qty = el('span', 'text-secondary font-bold font-body tabular-nums');
      qty.textContent = ing.qty;
      const item = el('span', 'text-on-surface-variant');
      item.textContent = ing.item;
      row.appendChild(qty);
      row.appendChild(item);
      ingList.appendChild(row);
    });

    // Método
    const method = el('p', 'px-8 pb-6 text-xs text-on-surface-variant/70 italic leading-relaxed');
    method.textContent = coctel.method;

    details.appendChild(summary);
    details.appendChild(ingList);
    details.appendChild(method);

    card.appendChild(header);
    card.appendChild(details);
    grid.appendChild(card);
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

function renderDistribuidores() {
  const d = config.distribuidores;

  const set = (sel, val) => {
    const n = document.querySelector(sel);
    if (n) n.textContent = val;
  };

  set('[data-distribuidores="label"]',    d.label);
  set('[data-distribuidores="sublabel"]', d.sublabel);

  const h2 = document.querySelector('[data-distribuidores="headline"]');
  if (h2) {
    const [line1, line2] = d.headline.split('\n');
    h2.innerHTML = `${line1}<br><span class="italic text-primary">${line2 || ''}</span>`;
  }

  const grid = document.querySelector('[data-distribuidores="ciudades"]');
  if (grid) {
    d.ciudades.forEach((ciudad, i) => {
      const card = el('div',
        `bg-surface-container-low p-8 rounded-2xl reveal reveal--delay-${i + 1}`
      );

      const header = el('div', 'flex items-center gap-3 mb-6');
      const ic     = icon(ciudad.icon, 0);
      ic.className += ' text-secondary';
      const title  = el('h3', 'font-headline text-xl tracking-tighter text-on-surface');
      title.textContent = ciudad.ciudad;
      header.appendChild(ic);
      header.appendChild(title);

      const list = el('ul', 'space-y-3');
      ciudad.puntos.forEach(punto => {
        const li = el('li', 'flex items-start gap-2');
        const dot = el('span', 'text-secondary mt-1 text-xs');
        dot.textContent = '●';
        const wrap = el('div', '');
        const nombre = el('span', 'text-sm text-on-surface');
        nombre.textContent = punto.nombre;
        wrap.appendChild(nombre);
        if (punto.nota) {
          const nota = el('span', 'block text-xs text-secondary font-bold uppercase tracking-wider mt-0.5');
          nota.textContent = punto.nota;
          wrap.appendChild(nota);
        }
        li.appendChild(dot);
        li.appendChild(wrap);
        list.appendChild(li);
      });

      card.appendChild(header);
      card.appendChild(list);
      grid.appendChild(card);
    });
  }

  // CTA online
  const ctaWrap = document.querySelector('[data-distribuidores="cta"]');
  if (ctaWrap) {
    const btn = createBtn({ ...d.onlineCta, type: 'primary' });
    ctaWrap.appendChild(btn);
  }
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
      const card = el('div',
        `bg-primary text-on-primary p-12 rounded-xl flex flex-col justify-between relative overflow-hidden reveal reveal--delay-${i + 1}`
      );

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
  const warningIcon = icon('bolt', 1);
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

  set('[data-footer="copy"]',   config.footer.copy);
  set('[data-footer="note"]',   config.footer.note);
  set('[data-footer="minsal"]', config.footer.minsal);

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
  renderHistoria();
  renderProducto();
  renderExperiencia();
  renderRecetas();
  renderTestimonios();
  renderDistribuidores();
  renderPrecios();
  renderUrgencyBanner();
  renderFooter();
}
