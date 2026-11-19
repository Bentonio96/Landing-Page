import type { ReactNode } from "react";
import type { Idioma } from "@/types";
import { clasesFuentes, scriptFuentes } from "@/lib/fuentes";
import { scriptTema } from "@/lib/tema";
import "@/app/globals.css";

type Props = { idioma: Idioma; children: ReactNode };

/**
 * Cascarón <html>/<body> compartido por las dos raíces del sitio. Los dos
 * scripts del <head> corren antes de pintar: el tema (sin destello) y la
 * espera de la fuente del titular, que además marca `data-js` y
 * `data-reducido` (?reduced=1).
 */
export function LayoutRaiz({ idioma, children }: Props) {
  return (
    <html lang={idioma} className={clasesFuentes} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
        <script dangerouslySetInnerHTML={{ __html: scriptFuentes }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
