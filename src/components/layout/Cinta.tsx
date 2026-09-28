import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Las herramientas que más pesan en el perfil. Son nombres propios, iguales
 * en los dos idiomas, así que la cinta no pasa por el diccionario.
 */
const PALABRAS = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Next.js",
  "GSAP",
  "Power BI",
  "Power Apps",
  "Python",
  "Figma",
];

/**
 * Cinta de titulares que cruza la página entre el hero y "Sobre mí".
 *
 * Las palabras alternan relleno y contorno, como un cartel, y las separa el
 * mismo punto violeta de las herramientas principales. El movimiento lo pone
 * Movimiento.tsx: avanza sola, acelera y se inclina con la velocidad del
 * scroll y cambia de sentido cuando se sube.
 *
 * La pista lleva dos copias idénticas y se desplaza exactamente la mitad de
 * su ancho por vuelta: al terminar, la segunda copia está donde empezó la
 * primera y el salto no se ve.
 *
 * Es decorativa: todo va oculto a lectores de pantalla, que ya tienen el
 * stack completo en su sección. Sin JavaScript, o con movimiento reducido,
 * queda quieta y recortada por los bordes.
 */
export function Cinta() {
  return (
    <div aria-hidden="true" className="select-none overflow-hidden py-10 md:py-16">
      <div data-cinta="" className="flex w-max">
        {[0, 1].map((copia) => (
          <div key={copia} className="flex shrink-0 items-center">
            {PALABRAS.map((palabra, i) => (
              <Fragment key={palabra}>
                <span
                  className={cn(
                    "whitespace-nowrap font-display text-t1 uppercase",
                    i % 2 === 1 ? "texto-contorno" : "text-texto",
                  )}
                >
                  {palabra}
                </span>
                <span className="mx-6 size-2.5 shrink-0 rounded-full bg-acentovivo md:mx-10 md:size-3" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
