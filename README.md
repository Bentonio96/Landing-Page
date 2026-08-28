# Portafolio · Benjamín Peña Díaz

Sitio personal de **Benjamín Peña Díaz**, desarrollador frontend en Santiago de Chile.
Español en `/`, inglés en `/en`, modo claro y oscuro, y todo el contenido en archivos de datos tipados.

**Lighthouse en producción:** 100 / 100 / 100 / 100 en escritorio · 96 / 100 / 100 / 100 en móvil
**Accesibilidad:** 0 violaciones de axe-core (WCAG 2.1 AA) en las 5 pantallas auditadas

![Hero en modo claro](docs/capturas/hero-claro.png)

---

## Índice

- [Cómo agregar un proyecto](#cómo-agregar-un-proyecto) ← lo que vas a hacer más seguido
- [Puesta en marcha](#puesta-en-marcha)
- [Capturas](#capturas)
- [Stack](#stack)
- [Decisiones de diseño](#decisiones-de-diseño)
- [Decisiones técnicas](#decisiones-técnicas)
- [Estructura](#estructura)
- [Deploy en Vercel](#deploy-en-vercel)
- [Pendientes para Benjamín](#pendientes-para-benjamín)

---

## Cómo agregar un proyecto

Se edita **un solo archivo**: [`src/data/proyectos.ts`](src/data/proyectos.ts).
Nada más. La grilla, la numeración, las animaciones y los enlaces se ajustan solos.

```ts
{
  slug: "epicentro",                     // identificador único, sin espacios
  nombre: "Epicentro",
  descripcion: {
    es: "Rastreador de sismos en Chile en tiempo casi real con datos del USGS.",
    en: "Near real-time earthquake tracker for Chile using USGS data.",
  },
  tecnologias: ["Next.js 15", "TypeScript", "Tailwind CSS", "MapLibre"],
  anio: "2026",
  demoUrl: "https://epicentro-sigma.vercel.app",         // ← opcional
  repoUrl: "https://github.com/Bentonio96/Epicentro",    // ← opcional
}
```

### Sobre los dos enlaces

`demoUrl` y `repoUrl` son **opcionales a propósito**:

| Situación | Qué se muestra |
|---|---|
| Ambas URLs | Botones **Ver sitio** y **Ver código** |
| Solo `repoUrl` | Solo **Ver código** |
| Solo `demoUrl` | Solo **Ver sitio** |
| Ninguna | Ningún botón, y la tarjeta se cierra limpia sin dejar hueco |

**Nunca se renderiza un enlace roto.** Mientras no tengas una URL, deja la propiedad comentada o bórrala — no pongas `""` ni `"#"`.

El tipo `Proyecto` está en [`src/types/index.ts`](src/types/index.ts), así que si te falta un campo obligatorio TypeScript te avisa antes de compilar.

---

## Puesta en marcha

```bash
npm install
```

```bash
npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en http://localhost:3000 |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sin emitir |

Regenerar imágenes (foto optimizada, favicons, Open Graph) después de cambiar la foto:

```bash
node scripts/generar-assets.mjs
```

---

## Capturas

| Claro | Oscuro |
|---|---|
| ![Hero claro](docs/capturas/hero-claro.png) | ![Hero oscuro](docs/capturas/hero-oscuro.png) |

**Sobre mí** — biografía, idiomas y certificaciones

![Sobre mí](docs/capturas/sobre-mi.png)

**Proyectos** — tarjetas con los dos enlaces, numeración editorial y chips de tecnología

![Proyectos](docs/capturas/proyectos.png)

**Experiencia** — línea de tiempo con el hito actual acentuado

![Experiencia](docs/capturas/experiencia.png)

**Inglés** (`/en`) — misma composición, `lang="en"`, hreflang cruzado

![Versión en inglés](docs/capturas/ingles.png)

**Móvil** — 390 px, navegación en panel desplegable

| Claro | Oscuro |
|---|---|
| ![Móvil claro](docs/capturas/movil-claro.png) | ![Móvil oscuro](docs/capturas/movil-oscuro.png) |

---

## Stack

- **Next.js 15** con App Router
- **TypeScript** en modo estricto
- **Tailwind CSS v4** — los tokens viven en `@theme`, dentro de `src/app/globals.css`
- **lucide-react** para íconos
- **next/font** — Fraunces, Inter Tight y JetBrains Mono, autoalojadas
- **next/image** — AVIF y WebP automáticos
- Sin dependencias de runtime más allá de React, Next y lucide

---

## Decisiones de diseño

### Concepto: "Cordillera Editorial"

La idea era que no pareciera plantilla de portafolio. Tres reglas sostienen todo:

1. **Grilla editorial visible.** Secciones numeradas en monoespaciada (`01 — SOBRE MÍ`), reglas capilares de 1 px, columnas asimétricas donde el título queda fijo (`sticky`) mientras el contenido se desplaza. Se lee como algo compuesto, no como bloques apilados.

2. **Un solo acento, con disciplina.** El naranja quemado aparece únicamente en: el CTA primario, el indicador de sección activa del nav, el anillo de foco, el punto de "disponible", el hito actual de la línea de tiempo y el hover de enlaces. En ningún otro lugar. Todo lo demás vive en neutros.

3. **La foto como pieza, no como avatar.** Bloque 4:5 en escritorio con un marco de acento desplazado detrás que rompe la grilla; banda 4:3 en móvil. El cielo de la foto funciona como espacio negativo.

### Tipografía

| Rol | Fuente | Por qué |
|---|---|---|
| Titulares | **Fraunces** 400/500 | Serif de alto contraste con carácter propio, sin caer en decorativa |
| Cuerpo | **Inter Tight** 400 | Neutra y estrecha, aguanta bien párrafos largos |
| Etiquetas y chips | **JetBrains Mono** 400 | Da el tono técnico de los metadatos sin gritar |

Escala modular de 1.25, fluida con `clamp()` en los tamaños grandes.

### Color

Neutros fríos con un acento cálido. Todos los pares cumplen **WCAG AA** (verificado con axe-core, no a ojo):

| Token | Claro | Oscuro | Contraste |
|---|---|---|---|
| Fondo | `#FBFAF8` | `#0C0E12` | — |
| Texto | `#16181D` | `#EDEDEB` | 16.4:1 / 17.1:1 |
| Atenuado | `#5C6069` | `#9BA1AB` | 6.0:1 / 7.5:1 |
| Tenue | `#6A6E77` | `#878D98` | 4.9:1 / 5.4:1 |
| **Acento** | `#B04426` | `#F0784E` | 5.4:1 / 6.9:1 |

Los radios son de 2 px: casi rectos, editorial y no burbuja.

---

## Decisiones técnicas

### Un solo idioma por documento, sin librería de i18n

El sitio sirve español en `/` e inglés en `/en`, ambos **prerenderizados estáticos** y ambos indexables, con `hreflang` cruzado y los dos en el sitemap.

La estructura es un único root layout dentro de `src/app/[idioma]/`, que es lo que permite que `<html lang>` sea correcto en cada idioma sin renderizado dinámico. La raíz `/` sirve el español mediante un **rewrite** (no un redirect), así que el enlace del CV queda limpio y sin saltos.

No se usó `next-intl` ni similar: para dos idiomas y un diccionario plano, un `Record<Idioma, string>` tipado hace lo mismo con cero kilobytes de runtime.

### Animaciones en CSS, no en JavaScript

Las apariciones al hacer scroll son transiciones CSS de `transform` controladas por un `IntersectionObserver` propio ([`src/components/ui/Reveal.tsx`](src/components/ui/Reveal.tsx)).

**No se anima la opacidad, y es deliberado.** En una página larga todo lo que está bajo el pliegue espera al scroll; si ese estado fuera `opacity: 0`, el texto quedaría transparente para cualquier auditoría automática, que lo reporta como fallo de contraste. Con la primera versión Lighthouse marcaba 35 nodos —incluidos títulos que en aislado dan 16:1— y la puntuación de accesibilidad oscilaba entre 96 y 100 según el momento del muestreo. Animando solo el desplazamiento el contraste es siempre el final, y la puntuación quedó en 100 de forma determinista (verificado en tres corridas seguidas).

El plan original era Framer Motion, pero en la combinación **framer-motion 12.43 + React 19.2** las animaciones no se aplicaban: fallaron tanto `whileInView` como `animate`, y el `ref` sobre `motion.div` tampoco llegaba al DOM. Eso dejaba todas las secciones en `opacity: 0` — el sitio se veía vacío. Se reemplazó por CSS, que además sacó **39 kB** del bundle (154 → 115 kB de First Load JS).

El componente tiene tres redes de seguridad para que una sección **nunca** quede invisible: si no hay `IntersectionObserver` se muestra de inmediato, hay un temporizador de respaldo por si el observador no dispara, y una regla `<noscript>` fuerza todo visible sin JavaScript.

### Rendimiento

Qué movió la aguja, medido y no supuesto:

- **CLS 0.168 → 0.019.** La fila de CTAs del hero medía 96 px con la fuente de respaldo (envuelta en dos líneas) y colapsaba a 43 px al cargar la monoespaciada, arrastrando todo lo de abajo. Se apilan a ancho completo en móvil: altura determinista.
- **Fuentes 202 → 79 kB.** Fraunces descargaba los ejes `SOFT`, `WONK` y `opsz` sin que ninguna regla los usara, y se pedían pesos 500 que solo hacían falta en los titulares.
- **Móvil 81 → 96** en el score de rendimiento.
- **Accesibilidad 96 → 100 estable**, quitando la opacidad del reveal (ver arriba).

### Tema claro/oscuro

Script bloqueante en `<head>` que lee `localStorage` antes del primer pintado, así que no hay destello de tema equivocado. Si el almacenamiento está bloqueado (modo privado), el tema igual cambia, solo que no persiste.

El tema vive en un atributo `data-tema` sobre `<html>`, no en una clase, y **el switch de idioma es un `<a>` y no un `<Link>`**. Las dos cosas resuelven el mismo problema: React es dueño del elemento raíz, y al navegar entre `/` y `/en` cambia el segmento `[idioma]`, re-renderiza el root layout y al reconciliar `<html>` descarta lo que no está en sus props. Con navegación blanda eso borraba el tema que el script había dejado puesto en runtime: entrabas en oscuro, cambiabas a inglés y salías en claro. Con una carga completa el script vuelve a ejecutarse antes de pintar, así que el tema sobrevive y sin destello — y para un cambio de idioma, que además cambia el `lang` del documento, recargar es lo correcto.

### Accesibilidad

Auditado con axe-core sobre las reglas WCAG 2.1 A/AA + best-practices, en 5 pantallas (español claro y oscuro, inglés, móvil y 404): **0 violaciones**.

- Skip link como primer elemento enfocable
- Foco visible de 2 px en todo el sitio, nunca eliminado
- `aria-expanded` / `aria-controls` en el menú móvil, cierre con `Escape` y foco que vuelve al botón
- El menú móvil se desmonta al cerrar: no queda en el orden de tabulación
- Alt descriptivo en la foto, íconos decorativos con `aria-hidden`
- Enlaces externos avisan "(se abre en una pestaña nueva)" a lectores de pantalla
- `prefers-reduced-motion` respetado globalmente y en cada animación

### El 404 lleva estilos embebidos

Es la única rareza del proyecto y es deliberada. Con el root layout dentro del segmento dinámico `[idioma]` (necesario para que `lang` sea correcto en ambos idiomas), Next renderiza la página de *not-found* fuera del layout: no le adjunta la hoja de Tailwind ni el `<html lang>`. Antes que degradar el `lang` de todo el sitio inglés para arreglar una página que casi nadie ve, esa página se basta sola: lleva sus estilos embebidos y fija el idioma con una línea de script. Los lectores de pantalla leen el DOM ya ejecutado, así que para ellos queda correcto, y la página es `noindex`. Todo está comentado en el archivo.

---

## Estructura

```
src/
├─ app/
│  ├─ [idioma]/
│  │  ├─ layout.tsx        root layout: <html lang>, fuentes, tema
│  │  ├─ page.tsx          /es y /en, prerenderizadas
│  │  └─ not-found.tsx     404 con estilos propios
│  ├─ globals.css          ← EL SISTEMA DE DISEÑO (tokens en @theme)
│  ├─ sitemap.ts · robots.ts
│
├─ components/
│  ├─ Pagina.tsx           composición única, compartida por ambos idiomas
│  ├─ LayoutRaiz.tsx       cascarón <html>/<body>
│  ├─ layout/              Encabezado · PieDePagina · BotonTema · BotonIdioma · SaltarAlContenido
│  ├─ sections/            Hero · SobreMi · Stack · Proyectos · Experiencia · Contacto
│  └─ ui/                  Seccion · TarjetaProyecto · Boton · Chip · Reveal
│
├─ data/
│  ├─ proyectos.ts         ← el archivo que vas a editar
│  ├─ perfil.ts            datos personales y SEO
│  ├─ stack.ts · experiencia.ts
│
├─ i18n/                   config.ts · diccionario.ts (todo el texto de interfaz)
├─ lib/                    fuentes · metadata · tema · blur · utils
└─ types/                  Proyecto · CategoriaStack · Hito · Idioma
```

Para cambiar la paleta, la tipografía o el espaciado: **`src/app/globals.css`**, bloque `@theme`. Un valor ahí se propaga a todo el sitio.

Para cambiar textos de interfaz: **`src/i18n/diccionario.ts`**, en ambos idiomas.

El CV en PDF vive en `public/CV-Benjamin-Pena.pdf` y se enlaza desde Contacto con el atributo `download`. La ruta está en `perfil.cv`, dentro de [`src/data/perfil.ts`](src/data/perfil.ts), junto con idiomas y certificaciones.

---

## Deploy en Vercel

1. Importa el repositorio en Vercel.
2. Deploy. **No hay que configurar nada.**

El [`vercel.json`](vercel.json) declara `"framework": "nextjs"` de forma explícita, para no depender de la autodetección. Se usa `vercel.json` y no `vercel.ts` a propósito: este último necesita instalar `@vercel/config`, y no vale la pena sumar una dependencia por tres líneas de configuración.

Todo el sitio es estático: no hay funciones de servidor ni base de datos.

### Si el deploy devuelve 404

Síntoma: `/og-es.png` y `/favicon.ico` cargan, pero `/`, `/es`, `/en`, `/robots.txt` y `/sitemap.xml` dan 404 de Vercel (`X-Vercel-Error: NOT_FOUND`).

Significa que el proyecto quedó con el preset **"Other"** en vez de Next.js: en ese modo Vercel publica la carpeta `public/` tal cual y descarta la aplicación. Se arregla en **Settings → Build and Deployment**:

- **Framework Preset:** `Next.js`
- **Build Command / Output Directory / Install Command:** con el override **apagado**, usando los valores por defecto
- **Root Directory:** vacío

Después, **Deployments → ⋯ → Redeploy**. Un diagnóstico rápido para distinguirlo:

```bash
curl -s -o /dev/null -w "%{http_code}
" https://TU-DOMINIO.vercel.app/sitemap.xml
```

`200` es que la app está desplegada; `404` con `/favicon.ico` en `200` es este caso.

### De dónde sale la URL del sitio

Las canónicas, el `hreflang`, el sitemap, las imágenes de Open Graph y los datos estructurados necesitan la URL absoluta del sitio. Se resuelve sola en [`src/data/perfil.ts`](src/data/perfil.ts), en este orden:

| Orden | Variable | De dónde viene |
|---|---|---|
| 1 | `NEXT_PUBLIC_SITIO_URL` | Tuya. Defínela **solo si tienes dominio propio**, con protocolo |
| 2 | `VERCEL_PROJECT_PRODUCTION_URL` | La inyecta Vercel. Dominio de producción, estable entre despliegues |
| 3 | `VERCEL_URL` | La inyecta Vercel. Única por despliegue: los previews se apuntan a sí mismos |
| 4 | `http://localhost:3000` | Desarrollo local |

Gracias al punto 2, un deploy en Vercel queda correcto sin tocar nada. `NEXT_PUBLIC_SITIO_URL` es una variable **de este proyecto**, no de Vercel, y solo hace falta el día que apuntes un dominio propio:

```bash
vercel env add NEXT_PUBLIC_SITIO_URL production
```

Ver también [`.env.example`](.env.example).

---

## Pendientes para Benjamín

- [ ] **Revisar la cuarta tarjeta.** El "Portal de Ciberoperaciones" lo saqué de tu CV: es trabajo interno de CMPC, así que no tiene demo ni repo y la tarjeta se renderiza sin botones. Si prefieres dejar solo los tres proyectos públicos, borra ese bloque de [`src/data/proyectos.ts`](src/data/proyectos.ts).
- [ ] **Actualizar el CV** en `public/CV-Benjamin-Pena.pdf` cuando cambie. El botón de descarga en Contacto apunta a ese archivo.
- [ ] Solo si algún día compras un dominio propio: definir `NEXT_PUBLIC_SITIO_URL` (ver [Deploy en Vercel](#deploy-en-vercel)).

---

Hecho en Santiago de Chile.
