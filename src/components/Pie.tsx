import type { Diccionario } from "@/i18n/diccionario";
import { Marca } from "@/components/Marca";

/** Pie: la firma y la versión anterior, por si alguien la busca. */
export function Pie({ t }: { t: Diccionario }) {
  return (
    <footer className="relative z-[1] border-t border-linea px-4 pb-24 pt-8 md:px-8 md:pb-10">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-8 gap-y-4 text-[0.9375rem] text-atenuado">
        <p className="flex items-center gap-3">
          <Marca className="h-6 text-tinta" />
          <span>
            © 2026 Benjamín Peña Díaz. {t.pie.hecho}
          </span>
        </p>
        <p>{t.pie.construido}</p>
        <p className="flex items-center gap-4">
          <span className="mono-etiqueta text-tenue">{t.pie.versiones}</span>
          <a href="https://benjamin-pena.vercel.app" className="underline decoration-lineafuerte underline-offset-4 hover:text-morado">
            v1
          </a>
          <a href="#parrilla" className="underline decoration-lineafuerte underline-offset-4 hover:text-morado">
            {t.pie.volver}
          </a>
        </p>
      </div>
    </footer>
  );
}
