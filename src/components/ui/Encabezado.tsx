import type { ReactNode } from "react";

type Props = { id: string; titulo: string; bajada?: string; extra?: ReactNode; bajadaAbajo?: boolean };

/**
 * Título de sección del reel: grande a la izquierda y una nota breve a la
 * derecha. En Proyectos la bajada va bajo el título y a la derecha solo el
 * enlace (bajadaAbajo).
 */
export function EncabezadoSeccion({ id, titulo, bajada, extra, bajadaAbajo }: Props) {
  if (bajadaAbajo) {
    return (
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id={id} className="titulo-seccion max-w-[10ch]">
            {titulo}
          </h2>
          {bajada ? <p className="mt-7 max-w-[44ch] text-base text-atenuado">{bajada}</p> : null}
        </div>
        {extra ? <div className="text-menor md:pb-1">{extra}</div> : null}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <h2 id={id} className="titulo-seccion">
        {titulo}
      </h2>
      {bajada || extra ? (
        <div className="max-w-[24ch] text-menor text-atenuado md:pb-3">
          {bajada ? <p>{bajada}</p> : null}
          {extra}
        </div>
      ) : null}
    </div>
  );
}
