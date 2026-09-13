import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Retardo en segundos, para escalonar elementos de una misma fila. */
  retardo?: number;
  className?: string;
};

/**
 * Marca un bloque para que entre con el scroll.
 *
 * Solo pone el atributo: la animación la crea components/Movimiento.tsx con
 * GSAP y ScrollTrigger, que recorre todos los [data-revelar] de la página.
 * Así este componente queda en el servidor y no manda JavaScript por cada
 * bloque, como hacía cuando cada uno tenía su propio IntersectionObserver.
 *
 * Sin JavaScript, o con movimiento reducido, no se anima nada y el bloque
 * está en su sitio desde el principio: no hay estado oculto que desbloquear.
 */
export function Reveal({ children, retardo = 0, className }: Props) {
  return (
    <div
      data-revelar=""
      data-retardo={retardo ? String(retardo) : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
