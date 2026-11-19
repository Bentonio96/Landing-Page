import type { ReactNode } from "react";

type Props = { id: string; titulo: string; bajada?: string; extra?: ReactNode };

/** Título de sección del reel: grande a la izquierda, nota breve a la derecha. */
export function EncabezadoSeccion({ id, titulo, bajada, extra }: Props) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <h2 id={id} className="titulo-seccion">
        {titulo}
      </h2>
      {bajada || extra ? (
        <div className="max-w-[30ch] text-menor text-atenuado md:pb-2 md:text-right">
          {bajada ? <p>{bajada}</p> : null}
          {extra}
        </div>
      ) : null}
    </div>
  );
}
