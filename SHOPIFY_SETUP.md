# Configuración de Shopify — MyGin

Sigue estos pasos para conectar la landing page con tu tienda Shopify.

---

## Paso 1 — Obtener el dominio de tu tienda

1. Entra a tu **Shopify Admin** → `https://admin.shopify.com`
2. Ve a **Configuración → Dominios**
3. El dominio que necesitas tiene el formato `tu-tienda.myshopify.com`
   - Usá el dominio `.myshopify.com`, **no** tu dominio personalizado
4. Copiá ese valor en el archivo `.env`:
   ```
   VITE_SHOPIFY_DOMAIN=tu-tienda.myshopify.com
   ```

---

## Paso 2 — Configurar el producto en Shopify

1. En el Admin, ve a **Productos → Agregar producto** (o abrí el producto MyGin si ya existe)
2. Creá (o verificá que existan) **dos variantes**:
   - Variante 1: nombre `"2–3 botellas"` → precio $15.990
   - Variante 2: nombre `"4+ botellas"` → precio $14.990
3. Guardá el producto

---

## Paso 3 — Obtener los Variant IDs

### Método A — Desde la URL del Admin (más fácil)

1. Ve a **Productos** y abrí el producto MyGin
2. Hacé click en la variante **"2–3 botellas"**
3. Mirá la URL del navegador:
   ```
   https://admin.shopify.com/store/tu-tienda/products/123456789/variants/9876543210
   ```
4. El número al final (`9876543210`) es el **Variant ID**
5. Copiá ese número en `.env` como `VITE_SHOPIFY_VARIANT_SMALL`
6. Repetí para la variante **"4+ botellas"** → `VITE_SHOPIFY_VARIANT_BULK`

### Método B — Desde la API de Admin

1. En Shopify Admin, ve a **Configuración → Aplicaciones y canales de ventas → Desarrollar aplicaciones**
2. Creá una app con permiso de lectura de productos (`read_products`)
3. Consultá el endpoint:
   ```
   GET https://tu-tienda.myshopify.com/admin/api/2024-01/products.json
   ```
4. En la respuesta, buscá el producto MyGin y copiá los `id` de cada variante

---

## Paso 4 — Completar el archivo `.env`

Abrí el archivo `.env` en la raíz del proyecto (`mygin/.env`) y completá los tres valores:

```env
VITE_SHOPIFY_DOMAIN=tu-tienda.myshopify.com
VITE_SHOPIFY_VARIANT_SMALL=9876543210
VITE_SHOPIFY_VARIANT_BULK=9876543211
```

---

## Paso 5 — Verificar que el checkout funciona

1. Reiniciá el servidor de desarrollo (importante: Vite lee el `.env` al arrancar):
   ```bash
   npm run dev
   ```
2. Abrí la landing en el navegador
3. Hacé click en un botón **"Comprar ahora"**
4. Deberías ser redirigido al checkout de Shopify con el producto en el carrito

> **Si los botones siguen yendo a Instagram:** significa que el `.env` no está completo.
> Verificá que los tres campos tengan valor y reiniciá `npm run dev`.

---

## Paso 6 — Producción (Vercel, Netlify, etc.)

El archivo `.env` **no se sube a Git** (está en `.gitignore`). Para producción, configurá las variables de entorno directamente en tu plataforma de hosting:

**Vercel:**
Settings → Environment Variables → agregar las tres variables `VITE_SHOPIFY_*`

**Netlify:**
Site Configuration → Environment Variables → agregar las tres variables `VITE_SHOPIFY_*`

Luego hacé un nuevo deploy para que los cambios tomen efecto.

---

## Notas

- Los Variant IDs son números enteros y no cambian salvo que elimines y recreés la variante
- El dominio debe ser `.myshopify.com`, no el dominio personalizado (ej. `mygin.cl`)
- Cada cambio en el `.env` requiere reiniciar `npm run dev` para que Vite lo incorpore
