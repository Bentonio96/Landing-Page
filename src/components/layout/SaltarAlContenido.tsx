export function SaltarAlContenido({ texto }: { texto: string }) {
  return (
    <a
      href="#contenido"
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-texto px-4 py-2.5 text-menor font-semibold text-fondo transition-transform focus:translate-y-0"
    >
      {texto}
    </a>
  );
}
