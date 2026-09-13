import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  id: string;
  /** Número editorial de la sección, p.ej. "02". */
  numero: string;
  etiqueta: string;
  titulo: string;
  bajada?: string;
  /** Pinta la banda de fondo alterna, para marcar el ritmo entre secciones. */
  alterna?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Envoltura de sección con la cabecera editorial del sistema: número y
 * etiqueta monoespaciada, una regla corta y el titular de cartel.
 *
 * El titular va a ancho completo encima del contenido, no en una columna
 * lateral: a tamaño de cartel necesita la línea entera, y es justo esa escala
 * la que marca dónde empieza cada sección.
 */
export function Seccion({
  id,
  numero,
  etiqueta,
  titulo,
  bajada,
  alterna = false,
  children,
  className,
}: Props) {
  const idTitulo = `${id}-titulo`;

  return (
    <section
      id={id}
      aria-labelledby={idTitulo}
      className={cn("scroll-mt-16 py-seccion", alterna && "bg-banda", className)}
    >
      <div className="lienzo">
        <Reveal>
          <p className="etiqueta flex items-baseline gap-3">
            <span aria-hidden="true">{numero}</span>
            <span>{etiqueta}</span>
          </p>
          <span aria-hidden="true" className="mt-4 block h-px w-8 bg-bordefuerte" />

          <h2 id={idTitulo} className="mt-10 text-t1 text-texto">
            {titulo}
          </h2>

          {bajada ? (
            <p className="mt-8 max-w-[46ch] text-guia text-atenuado">{bajada}</p>
          ) : null}
        </Reveal>

        <div className="mt-16 md:mt-24">{children}</div>
      </div>
    </section>
  );
}
