import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";

/**
 * Las tres se sirven autoalojadas por next/font: cero requests a Google en
 * producción y `size-adjust` automático en la fuente de respaldo, que es lo
 * que evita el salto de layout mientras cargan.
 *
 * Solo se pide lo que el sistema de diseño usa de verdad: Fraunces en 400 y
 * 500 (titulares), y las otras dos únicamente en 400. Cada peso extra son
 * ~20 KB en la ruta crítica compitiendo con la foto del hero por ancho de
 * banda, y eso empuja el LCP en móvil.
 * De Fraunces se usan instancias estáticas en vez de la variable: los ejes
 * opsz/SOFT/WONK se descargaban sin que ninguna regla los usara.
 */
export const fuenteDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--fuente-display",
});

export const fuenteSans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--fuente-sans",
});

/**
 * La mono es el único caso donde el respaldo automático de next/font hace
 * daño. Lo genera a partir de `local("Arial")` con `size-adjust: 134.59%`:
 * ajusta las métricas verticales, pero Arial es proporcional y estirarla un
 * 35 % deja cada carácter casi un 30 % más ancho que JetBrains Mono. Las
 * líneas largas de versales del hero envolvían con el respaldo y se
 * recolocaban al llegar la tipografía real, que es de donde salía el CLS
 * en móvil.
 *
 * Con `adjustFontFallback: false` se cae a monoespaciadas de verdad, cuyo
 * avance (~0.6em) es prácticamente el de JetBrains Mono. Se pierde el ajuste
 * vertical automático, pero aquí no hace falta: todo lo que usa la mono
 * declara su propio line-height en globals.css.
 */
export const fuenteMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--fuente-mono",
  adjustFontFallback: false,
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Consolas",
    "monospace",
  ],
});

export const clasesFuentes = `${fuenteDisplay.variable} ${fuenteSans.variable} ${fuenteMono.variable}`;
