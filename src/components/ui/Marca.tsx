import { cn } from "@/lib/utils";

type Props = { className?: string };

/**
 * Marca personal "B = P + D": una B sólida abierta por un corte recto en L.
 * La pieza grande es la P y la chica la D, las tres iniciales en una forma.
 *
 * Los dos trazados son los del logo final y no se retocan: ni el ancho del
 * corte ni su esquina. El viewBox va recortado al ras (39 × 52, proporción
 * 3:4), así que el tamaño se fija con el alto. El mínimo son 24 px: más
 * chica, el corte baja de 2 px y se lee como una B cerrada.
 *
 * Va en `currentColor` y siempre en un solo color, el del texto: tinta sobre
 * claro, hueso sobre oscuro. Nunca en el violeta de acento.
 *
 * Es decorativa: el nombre accesible lo pone quien la usa.
 */
export function Marca({ className }: Props) {
  return (
    <svg
      viewBox="12.5 6 39 52"
      fill="currentColor"
      aria-hidden="true"
      className={cn("aspect-[3/4] w-auto shrink-0", className)}
    >
      <path d="M12.5 6H34.5A13.5 13.5 0 0 1 44.562 28.5H23.5V58H12.5Z" />
      <path d="M28.5 33.5H47.5A14.5 14.5 0 0 1 37 58H28.5Z" />
    </svg>
  );
}
