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
  children: ReactNode;
  className?: string;
};

/**
 * Envoltura de sección con la cabecera editorial del sistema:
 * número + etiqueta monoespaciada, regla capilar y título.
 */
export function Seccion({
  id,
  numero,
  etiqueta,
  titulo,
  bajada,
  children,
  className,
}: Props) {
  const idTitulo = `${id}-titulo`;

  return (
    <section
      id={id}
      aria-labelledby={idTitulo}
      className={cn("scroll-mt-24 py-seccion", className)}
    >
      <div className="lienzo">
        <Reveal>
          <div className="flex items-baseline gap-3">
            <span className="etiqueta" aria-hidden="true">
              {numero}
            </span>
            <span className="etiqueta">{etiqueta}</span>
          </div>
          <hr className="regla mt-4 mb-10" />
        </Reveal>

        <div className="grid gap-x-canal gap-y-10 md:grid-cols-12">
          <Reveal className="md:col-span-5 lg:col-span-4">
            <h2
              id={idTitulo}
              className="text-t2 text-balance md:sticky md:top-28"
            >
              {titulo}
              {bajada ? (
                <span className="mt-4 block font-sans text-base font-normal leading-relaxed tracking-normal text-atenuado">
                  {bajada}
                </span>
              ) : null}
            </h2>
          </Reveal>

          <div className="md:col-span-7 lg:col-span-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
