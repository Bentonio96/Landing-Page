type Props = { texto: string };

/** Primer elemento enfocable de la página: salta el nav y va al contenido. */
export function SaltarAlContenido({ texto }: Props) {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pieza focus:bg-acento focus:px-4 focus:py-3 focus:font-mono focus:text-etiqueta focus:uppercase focus:tracking-[0.12em] focus:text-acentosobre"
    >
      {texto}
    </a>
  );
}
