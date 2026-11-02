import { Descifrar } from "@/components/Descifrar";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  codigo: string;
  metafora: string;
  titulo: string;
  bajada?: string;
  className?: string;
};

/**
 * Cabecera de sector: la línea de cronometraje que se dibuja a todo el
 * ancho, el código del sector («S2 · Garage») que se descifra, el titular
 * con sus palabras que suben y, detrás, el número del sector enorme y en
 * trazo, que se desliza con el scroll.
 */
export function Encabezado({ id, codigo, metafora, titulo, bajada, className }: Props) {
  const numero = codigo.replace(/\D/g, "").padStart(2, "0");
  return (
    <header className={cn("relative", className)}>
      <svg
        aria-hidden="true"
        data-fantasma
        viewBox="0 0 400 200"
        className="pointer-events-none absolute -top-10 right-0 -z-10 hidden h-[clamp(140px,18vw,260px)] w-auto md:block"
      >
        <text
          x="400"
          y="170"
          textAnchor="end"
          fill="none"
          stroke="var(--c-linea-fuerte)"
          strokeWidth="1.2"
          style={{ font: "italic 800 210px var(--fuente-titular)", fontVariationSettings: '"wdth" 125' }}
        >
          {numero}
        </text>
      </svg>

      <div className="flex items-center gap-3">
        <span data-trazo className="h-px flex-1 origin-left bg-tinta" />
      </div>
      <p className="mono-etiqueta mt-4 flex items-center gap-3 text-atenuado">
        <span className="bg-tinta px-1.5 py-0.5 text-papel">{codigo}</span>
        <Descifrar texto={metafora} />
      </p>
      <h2 id={`${id}-titulo`} data-titular className="titular mt-5 text-t2 focus:outline-none">
        {titulo.split(" ").map((palabra, i) => (
          // Ranura recortada solo por abajo: la palabra sube desde ahí, y la
          // tilde de arriba y la inclinación de la itálica quedan libres.
          <span key={i} className="inline-block pb-[0.08em] align-bottom [clip-path:inset(-1em_-1em_0_-1em)]">
            <span className="palabra inline-block">{palabra}&nbsp;</span>
          </span>
        ))}
      </h2>
      {bajada && <p className="mt-5 max-w-[56ch] text-guia text-atenuado">{bajada}</p>}
    </header>
  );
}
