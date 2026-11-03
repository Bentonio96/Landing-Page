import { pieza } from "@/lib/pieza";

type Props = {
  id: string;
  etiqueta: string;
  titulo: string;
  bajada?: string;
};

/** Cabecera común de sección: número, título y bajada, cada uno una capa. */
export function Titulo({ id, etiqueta, titulo, bajada }: Props) {
  return (
    <header className="max-w-[46rem]">
      <p {...pieza(`${id}-etiqueta`, "etiqueta")} className="etiqueta block">
        {etiqueta}
      </p>
      <h2
        id={`titulo-${id}`}
        {...pieza(`${id}-titulo`, "h2")}
        className="mt-3 block text-t2 font-semibold tracking-[-0.04em] text-texto"
      >
        {titulo}
      </h2>
      {bajada ? (
        <p {...pieza(`${id}-bajada`, "bajada")} className="mt-4 block text-cuerpo text-atenuado">
          {bajada}
        </p>
      ) : null}
    </header>
  );
}
