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

export const fuenteMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--fuente-mono",
});

export const clasesFuentes = `${fuenteDisplay.variable} ${fuenteSans.variable} ${fuenteMono.variable}`;
