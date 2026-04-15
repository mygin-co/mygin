/**
 * config.js — Fuente de verdad de MyGin
 *
 * EDITA SOLO ESTE ARCHIVO para cambiar:
 * - Precios, textos, testimonios, links, momentos
 *
 * Respeta el principio de Inversión de Dependencias (SOLID-D):
 * render.js, nav.js y animations.js dependen de este módulo, no al revés.
 */

const MyGinConfig = {

  brand: {
    name:         'MyGin',
    tagline:      'El gin que se vive.',
    instagram:    'mygin.cl',
    instagramUrl: 'https://instagram.com/mygin.cl',
    email:        'destileriamygin@gmail.com',
    logo:         'assets/images/logo_vertical.png',
    origin:       'Villarrica, Chile',
  },

  nav: {
    links: [
      { label: 'Producto',    href: '#producto'    },
      { label: 'Experiencia', href: '#experiencia' },
      { label: 'Precios',     href: '#precios'     },
    ],
    cta: { label: 'Pedir ahora', href: '#precios' },
  },

  hero: {
    label:       'Gin Premium Chileno',
    headline:    'Momentos que\nmerecen más.',
    subheadline: 'MyGin es el gin que reúne a la gente que vale la pena. Sin pretensiones, con estilo.',
    bgImage:     'assets/images/hero_bg.jpeg',
    ctas: [
      { label: 'Explorar Colección', type: 'primary', action: 'shopify', variantKey: 'small' },
      { label: 'Nuestra Historia',   type: 'outline', href: '#producto' },
    ],
  },

  producto: {
    label:    'El Producto',
    headline: 'Crafted para los<br><span class="text-secondary">que saben.</span>',
    body:     'MyGin nace con una sola misión: ser el gin que no necesita explicación. Sabor redondo, aroma fresco y una botella que habla sola.',
    image:    'assets/images/botella_naturaleza.jpeg',
    benefits: [
      { icon: 'eco',           title: 'Sabor sin egos',       desc: 'Botánicos seleccionados a mano que hablan por sí solos. Sin pretensiones, solo calidad pura.' },
      { icon: 'payments',      title: 'Precio que libera',    desc: 'Eliminamos intermediarios innecesarios para entregarte lujo accesible directamente desde la destilería.' },
      { icon: 'local_shipping',title: 'Despacho a tu puerta', desc: 'Logística premium que garantiza que tu MyGin llegue en perfectas condiciones en menos de 48 horas.' },
    ],
  },

  experiencia: {
    label:    'La Experiencia',
    headline: 'No vendemos gin,\nvendemos experiencias.',
    // 4 momentos para el bento grid asimétrico
    moments: [
      { image: 'assets/images/amigos.jpeg',             caption: 'Esa noche que se alarga sin querer.',    span: 'col-2-row-2' },
      { image: 'assets/images/supermercado.jpeg',       caption: 'El instante perfecto.',                  span: 'col-1-row-1' },
      { image: 'assets/images/marciano.jpeg',           caption: 'El gin que eleva cualquier escenario.',  span: 'col-1-row-2' },
      { image: 'assets/images/botella_naturaleza.jpeg', caption: 'Botánicos chilenos, pureza natural.',    span: 'col-1-row-1' },
    ],
  },

  testimonios: {
    headline: 'La gente habla.',
    items: [
      {
        name:     'Matías R.',
        location: 'Sommelier',
        stars:    5,
        text:     '"Una sorpresa absoluta. La calidad del destilado compite fácilmente con marcas que duplican su precio."',
      },
      {
        name:     'Carla V.',
        location: 'Content Creator',
        stars:    5,
        text:     '"El packaging es increíble y el gin es aún mejor. Se convirtió en mi favorito para el Gin & Tonic del fin de semana."',
      },
      {
        name:     'Andrés L.',
        location: 'Arquitecto',
        stars:    4,
        text:     '"Envío rapidísimo y el gin es super equilibrado. Los toques botánicos chilenos se sienten sutiles pero presentes."',
      },
    ],
  },

  precios: {
    label:    'Precios',
    headline: 'Simple, directo,\nsin letra chica.',
    tiers: [
      {
        label:     'Pack Degustación',
        sublabel:  '2-3 Botellas',
        price:     39990,
        unit:      '/ pack',
        highlight: false,
        badge:     null,
        features: [
          'MyGin London Dry',
          'Envío Standard Incluido',
          'Recetario Digital',
        ],
        cta: { label: 'Comprar ahora', action: 'shopify', variantKey: 'small' },
      },
      {
        label:     'Pack Coleccionista',
        sublabel:  '4+ Botellas',
        price:     69990,
        unit:      '/ pack',
        highlight: true,
        badge:     'Recomendado',
        features: [
          'Mix MyGin London Dry & Pink',
          'Envío Priority 24h',
          'Kit de Botánicos MyGin',
          '15% Desc. Futuras Compras',
        ],
        cta: { label: 'Comprar ahora', action: 'shopify', variantKey: 'bulk' },
      },
    ],
  },

  urgencyBanner: {
    headline: 'El stock se acaba.',
    sublabel: 'Lote #048 en sus últimas unidades.',
    cta:      { label: 'Asegurar mi Gin', action: 'shopify', variantKey: 'small' },
  },

  footer: {
    links: [
      { label: 'Privacy Policy',   href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Drink Responsibly',href: '#' },
      { label: 'Press Kit',        href: '#' },
    ],
    copy: '© 2026 MyGin Distillery. Crafted in Chile.',
    note: 'Venta exclusiva a mayores de 18 años.',
  },

};

export default MyGinConfig;
