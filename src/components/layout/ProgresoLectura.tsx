/**
 * Barra de progreso de lectura, fija en el borde superior.
 *
 * Se anima con `animation-timeline: scroll(root)`: no hay JavaScript, ni
 * escuchas de scroll, ni trabajo en el hilo principal. Por eso puede ser
 * un componente de servidor.
 *
 * Es decorativa: no aporta información que no esté ya en la barra de
 * desplazamiento del navegador, así que se oculta a lectores de pantalla.
 */
export function ProgresoLectura() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div className="progreso-lectura h-full w-full" />
    </div>
  );
}
