import { Inter_Tight, JetBrains_Mono } from "next/font/google";

/**
 * Dos familias autoalojadas por next/font (cero requests a Google y
 * `size-adjust` en el respaldo). La v4 deja la condensada de main: el
 * titular es una grotesca apretada, como en los productos de IA del reel.
 */
export const fuenteSans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--fuente-sans",
});

/**
 * La mono es la voz de los agentes: etiquetas, marcos y la píldora. Sin
 * `adjustFontFallback`: el respaldo automático estira Arial y la hace más
 * ancha que JetBrains Mono; las monoespaciadas del sistema calzan mejor.
 */
export const fuenteMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--fuente-mono",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

export const clasesFuentes = `${fuenteSans.variable} ${fuenteMono.variable}`;
