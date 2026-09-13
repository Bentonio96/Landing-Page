import type { ReactNode } from "react";
import type { Idioma } from "@/types";
import { Ambiente } from "@/components/layout/Ambiente";
import { clasesFuentes, scriptFuentes } from "@/lib/fuentes";
import { scriptTema } from "@/lib/tema";
import "@/app/globals.css";

type Props = { idioma: Idioma; children: ReactNode };

/**
 * Cascarón <html>/<body> compartido por las dos raíces del sitio.
 * Cada idioma tiene su propio root layout para que `lang` sea correcto
 * sin caer en renderizado dinámico.
 */
export function LayoutRaiz({ idioma, children }: Props) {
  return (
    <html
      lang={idioma}
      className={clasesFuentes}
      suppressHydrationWarning /* el script de tema añade .dark antes de hidratar */
    >
      {/*
        <head> explícito a propósito: el script de tema tiene que ejecutarse
        antes de que el navegador pinte, o se ve el destello de tema
        equivocado. `next/head` es de Pages Router y no aplica aquí; en App
        Router un <head> en el root layout es válido y Next lo fusiona.
      */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
        <script dangerouslySetInnerHTML={{ __html: scriptFuentes }} />
      </head>
      <body className="min-h-dvh text-texto">
        <Ambiente />
        {children}
      </body>
    </html>
  );
}
