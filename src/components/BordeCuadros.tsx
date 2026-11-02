import { cn } from "@/lib/utils";

const COLUMNAS = 24;
const FILAS = 3;

/**
 * Borde a cuadros entre el papel y el asfalto: la transición de mosaico
 * del reel, hecha bandera de meta. Los cuadros claros se disuelven uno a
 * uno al entrar en pantalla (CSS con animation-timeline: view(), sin
 * JavaScript). Donde el navegador no lo soporta, o con movimiento
 * reducido, queda la bandera quieta.
 *
 * El retardo de cada cuadro sale de una fórmula fija y no de Math.random:
 * así el HTML del servidor y el del cliente son idénticos.
 */
export function BordeCuadros({ abajo = false }: { abajo?: boolean }) {
  const cuadros = [];
  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLUMNAS; c++) {
      const claro = (f + c) % 2 === 0;
      const orden = ((c * 7 + f * 13) % 17) / 17;
      cuadros.push(
        <span
          key={`${f}-${c}`}
          className={cn("cuadro-mosaico aspect-square", claro && "bg-fondo")}
          style={{ ["--orden" as string]: orden.toFixed(2), ["--fila" as string]: f }}
        />,
      );
    }
  }

  return (
    <div
      aria-hidden="true"
      className={cn("borde-cuadros grid", abajo && "rotate-180")}
      style={{ gridTemplateColumns: `repeat(${COLUMNAS}, minmax(0, 1fr))` }}
    >
      {cuadros}
    </div>
  );
}
