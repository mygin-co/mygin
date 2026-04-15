/**
 * shopify.js — Constructor de URLs de checkout de Shopify
 *
 * Single Responsibility: construye URLs directas al carrito de Shopify.
 * Dependency Inversion: render.js depende de este módulo, no de import.meta.env directamente.
 *
 * URL format: https://{domain}/cart/{variantId}:{quantity}
 *
 * Si las variables de entorno no están configuradas, isShopifyConfigured()
 * devuelve false y render.js usa Instagram como fallback automáticamente.
 */

const DOMAIN        = import.meta.env.VITE_SHOPIFY_DOMAIN;
const VARIANT_SMALL = import.meta.env.VITE_SHOPIFY_VARIANT_SMALL;
const VARIANT_BULK  = import.meta.env.VITE_SHOPIFY_VARIANT_BULK;

/**
 * Devuelve true solo si las tres variables de entorno están presentes.
 * Usar como guard antes de construir cualquier URL de Shopify.
 */
export function isShopifyConfigured() {
  return Boolean(DOMAIN && VARIANT_SMALL && VARIANT_BULK);
}

/**
 * Construye una URL de carrito directo de Shopify.
 * @param {string} variantId - ID numérico de la variante en Shopify
 * @param {number} quantity  - Cantidad pre-cargada en el carrito
 */
function buildShopifyUrl(variantId, quantity = 1) {
  return `https://${DOMAIN}/cart/${variantId}:${quantity}`;
}

/**
 * URL de checkout para el tier 2-3 botellas.
 * @param {number} qty - Cantidad inicial (default: 2)
 */
export function getSmallTierUrl(qty = 2) {
  return buildShopifyUrl(VARIANT_SMALL, qty);
}

/**
 * URL de checkout para el tier 4+ botellas.
 * @param {number} qty - Cantidad inicial (default: 4)
 */
export function getBulkTierUrl(qty = 4) {
  return buildShopifyUrl(VARIANT_BULK, qty);
}
