import { Archivo, Inter_Tight, JetBrains_Mono, Pinyon_Script } from "next/font/google";

/**
 * «Cancha» habla con cuatro voces, todas autoalojadas por next/font.
 *
 * El nombre se compone como en el reel que inspiró esta versión: el nombre
 * de pila en una caligráfica y el apellido en una grotesca negra y ancha.
 * Cuerpo neutro y una mono para el microtexto, las cifras y los dorsales.
 */

/**
 * Titulares y dorsales. Archivo es variable en peso y en ancho: se usa casi
 * siempre a 900 y 125 % de ancho («Archivo Expanded Black»), la voz de una
 * carrocería de carrera, sin cargar un archivo por estilo.
 */
export const fuenteDisplay = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--fuente-display",
});

/** La firma: el nombre de pila y la palabra que abre cada sección. */
export const fuenteFirma = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--fuente-firma",
  // Sin precarga: compite con el retrato (el LCP) y solo es un acento.
  preload: false,
});

/** Cuerpo de lectura. */
export const fuenteSans = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--fuente-sans",
});

/**
 * La mono cae a monoespaciadas de verdad y no al Arial estirado que genera
 * next/font: el microtexto es casi todo versales y con un respaldo
 * proporcional las líneas cambiaban de largo al cargar.
 */
export const fuenteMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--fuente-mono",
  preload: false,
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

export const clasesFuentes = `${fuenteDisplay.variable} ${fuenteFirma.variable} ${fuenteSans.variable} ${fuenteMono.variable}`;
