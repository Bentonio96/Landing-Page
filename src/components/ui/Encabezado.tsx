import type { ReactNode } from "react";

type Props = { id: string; titulo: string; bajada?: string; extra?: ReactNode; bajadaAbajo?: boolean; figura?: string };

/**
 * Título de sección del reel: grande a la izquierda y una nota breve a la
 * derecha. En Proyectos la bajada va bajo el título y a la derecha solo el
 * enlace (bajadaAbajo).
 */
export function EncabezadoSeccion({ id, titulo, bajada, extra, bajadaAbajo, figura }: Props) {
  // Zona donde el campo de partículas arma la figura de la sección: entre el
  // título y la nota en pantallas anchas, arriba del título en celulares.
  const zona = figura ? (
    <div aria-hidden="true" data-particulas={figura} className="order-first h-24 w-full md:order-none md:h-44 md:w-auto md:flex-1 md:self-stretch md:mx-8 lg:mx-14" />
  ) : null;
  if (bajadaAbajo) {
    return (
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id={id} className="titulo-seccion max-w-[10ch]">
            {titulo}
          </h2>
          {bajada ? <p className="mt-7 max-w-[44ch] text-base text-atenuado">{bajada}</p> : null}
        </div>
        {zona}
        {extra ? <div className="text-menor md:pb-1">{extra}</div> : null}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <h2 id={id} className="titulo-seccion">
        {titulo}
      </h2>
      {zona}
      {bajada || extra ? (
        <div className="max-w-[24ch] text-menor text-atenuado md:pb-3">
          {bajada ? <p>{bajada}</p> : null}
          {extra}
        </div>
      ) : null}
    </div>
  );
}
