import type { ReactNode } from "react";
import type { Idioma } from "@/types";
import { clasesFuentes } from "@/lib/fuentes";
import { scriptObra } from "@/lib/obra";
import { scriptTema } from "@/lib/tema";
import "@/app/globals.css";

type Props = { idioma: Idioma; children: ReactNode };

/**
 * Cascarón <html>/<body> compartido por las dos raíces del sitio.
 * Los dos scripts del <head> corren antes de pintar: el tema, para que no
 * destelle, y el modo de la obra, para que las piezas no aparezcan armadas
 * y luego se desarmen.
 */
export function LayoutRaiz({ idioma, children }: Props) {
  return (
    <html
      lang={idioma}
      className={clasesFuentes}
      suppressHydrationWarning /* los scripts del <head> añaden data-* antes de hidratar */
    >
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
        <script dangerouslySetInnerHTML={{ __html: scriptObra }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
