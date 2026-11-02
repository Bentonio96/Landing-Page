import type { ReactNode } from "react";
import type { Idioma } from "@/types";
import { clasesFuentes } from "@/lib/fuentes";
import { scriptTema } from "@/lib/tema";
import "@/app/globals.css";

type Props = { idioma: Idioma; children: ReactNode };

/**
 * Cascarón <html>/<body> compartido por los dos idiomas. Cada idioma tiene
 * su propio root layout para que `lang` sea correcto sin renderizado
 * dinámico. El script de tema corre antes de pintar: sin destello.
 */
export function LayoutRaiz({ idioma, children }: Props) {
  return (
    <html lang={idioma} className={clasesFuentes} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
