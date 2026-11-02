import type { ReactNode } from "react";
import type { Idioma } from "@/types";
import { clasesFuentes } from "@/lib/fuentes";
import "@/app/globals.css";

type Props = { idioma: Idioma; children: ReactNode };

/**
 * Marca el documento como «con JavaScript» antes de pintar, para que los
 * revelados al hacer scroll solo escondan algo cuando hay quien los
 * muestre. Va en un atributo data-* y no en una clase: React gestiona el
 * className de <html>. Debe ser ES5.
 */
const scriptJs = `document.documentElement.setAttribute('data-js','');`;

/**
 * Cascarón <html>/<body> compartido por las dos raíces del sitio. «Pole»
 * tiene un solo tema, claro, con secciones de asfalto en la tinta del CV.
 */
export function LayoutRaiz({ idioma, children }: Props) {
  return (
    <html lang={idioma} className={clasesFuentes} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptJs }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <div aria-hidden="true" className="grano" />
        {children}
      </body>
    </html>
  );
}
