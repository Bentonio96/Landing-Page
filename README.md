# Portafolio · Benjamín Peña Díaz

Sitio personal de **Benjamín Peña Díaz**, desarrollador frontend en Santiago de Chile.
Español en `/`, inglés en `/en`, modo claro y oscuro, y todo el contenido en archivos de datos tipados.

**Lighthouse:** 100 / 100 / 100 / 100 en escritorio · 95 / 100 / 100 / 100 en móvil
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
  slug: "panel-cmpc",                    // identificador único, sin espacios
  nombre: "Panel de operaciones",
  descripcion: {
    es: "Portal interno para el equipo de ciberseguridad. Sigue en uso.",
    en: "Internal portal for the cybersecurity team. Still in use today.",
  },
  tecnologias: ["Next.js", "TypeScript", "Tailwind CSS"],
  anio: "2025",
  demoUrl: "https://panel.ejemplo.cl",              // ← opcional
  repoUrl: "https://github.com/Bentonio96/panel",   // ← opcional
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

Las apariciones al hacer scroll son transiciones CSS controladas por un `IntersectionObserver` propio ([`src/components/ui/Reveal.tsx`](src/components/ui/Reveal.tsx)).

El plan original era Framer Motion, pero en la combinación **framer-motion 12.43 + React 19.2** las animaciones no se aplicaban: fallaron tanto `whileInView` como `animate`, y el `ref` sobre `motion.div` tampoco llegaba al DOM. Eso dejaba todas las secciones en `opacity: 0` — el sitio se veía vacío. Se reemplazó por CSS, que además sacó **39 kB** del bundle (154 → 115 kB de First Load JS).

El componente tiene tres redes de seguridad para que una sección **nunca** quede invisible: si no hay `IntersectionObserver` se muestra de inmediato, hay un temporizador de respaldo por si el observador no dispara, y una regla `<noscript>` fuerza todo visible sin JavaScript.

### Rendimiento

Qué movió la aguja, medido y no supuesto:

- **CLS 0.168 → 0.019.** La fila de CTAs del hero medía 96 px con la fuente de respaldo (envuelta en dos líneas) y colapsaba a 43 px al cargar la monoespaciada, arrastrando todo lo de abajo. Se apilan a ancho completo en móvil: altura determinista.
- **Fuentes 202 → 79 kB.** Fraunces descargaba los ejes `SOFT`, `WONK` y `opsz` sin que ninguna regla los usara, y se pedían pesos 500 que solo hacían falta en los titulares.
- **Móvil 81 → 95** en el score de rendimiento.

### Tema claro/oscuro

Script bloqueante en `<head>` que lee `localStorage` antes del primer pintado, así que no hay destello de tema equivocado. Si el almacenamiento está bloqueado (modo privado), el tema igual cambia, solo que no persiste.

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

Es la única rareza del proyecto y es deliberada. Con el root layout dentro del segmento dinámico `[idioma]` (necesario para que `lang` sea correcto en ambos idiomas), Next renderiza la página de *not-found* fuera del layout y no le adjunta la hoja de Tailwind. Antes que degradar el `lang` de todo el sitio inglés para arreglar una página que casi nadie ve, esa página se basta sola. Está comentado en el archivo.

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

---

## Deploy en Vercel

1. Importa el repositorio en Vercel. Detecta Next.js solo, sin configuración.
2. En **Settings → Environment Variables** agrega:

   | Variable | Valor |
   |---|---|
   | `NEXT_PUBLIC_SITIO_URL` | `https://tu-dominio.com` (sin barra final) |

   Sin esa variable el sitio funciona igual, pero las URLs canónicas, el sitemap y las imágenes de Open Graph apuntan al dominio de respaldo definido en [`src/data/perfil.ts`](src/data/perfil.ts).

3. Deploy.

Todo el sitio es estático: no hay funciones de servidor ni base de datos.

---

## Pendientes para Benjamín

- [ ] **Completar las 4 URLs** en [`src/data/proyectos.ts`](src/data/proyectos.ts), junto con nombres y descripciones reales. Ahora son marcadores.
- [ ] **Confirmar los períodos** en [`src/data/experiencia.ts`](src/data/experiencia.ts): no me diste meses, así que puse rangos consistentes con lo que contaste (CMPC 2024–2025 datos, 2025 práctica; universidad 2021–2026). Hay un `TODO` marcado.
- [ ] **Revisar el stack** en [`src/data/stack.ts`](src/data/stack.ts). Armé la lista a partir de tu experiencia en datos y ciberseguridad — es mejor una lista corta y honesta que una larga y decorativa.
- [ ] **Definir `NEXT_PUBLIC_SITIO_URL`** en Vercel cuando tengas el dominio.
- [ ] Opcional: agregar tu CV en PDF a `public/` y enlazarlo desde Contacto.

---

Hecho en Santiago de Chile.
