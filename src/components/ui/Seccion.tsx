import { Fragment } from "react";
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
          {/* Se estira desde la izquierda al entrar (Movimiento.tsx). */}
          <span
            aria-hidden="true"
            data-regla=""
            className="mt-4 block h-px w-8 origin-left bg-acentovivo"
          />
        </Reveal>

        {/* Las palabras se parten aquí, en el servidor, y no con SplitText
            en el cliente: GSAP no toca la estructura que React hidrató, solo
            anima transformaciones. Separadas por espacios de texto normales,
            así que se leen y se seleccionan como una frase. */}
        <h2 id={idTitulo} data-titular-3d="" className="mt-10 text-t1 text-texto">
          {titulo.split(" ").map((palabra, i) => (
            <Fragment key={`${palabra}-${i}`}>
              {i > 0 ? " " : null}
              <span className="palabra-mascara">
                <span className="palabra">{palabra}</span>
              </span>
            </Fragment>
          ))}
        </h2>

        {bajada ? (
          <Reveal>
            <p className="mt-8 max-w-[46ch] text-guia text-atenuado">{bajada}</p>
          </Reveal>
        ) : null}

        <div className="mt-16 md:mt-24">{children}</div>
      </div>
    </section>
  );
}
