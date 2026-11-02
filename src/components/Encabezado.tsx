import Image from "next/image";
import Link from "next/link";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Barra superior de microtexto, como la del reel: avatar, dorsal y la
 * disponibilidad. No es fija: la navegación vive en la recta de pista,
 * que sí se queda arriba al bajar.
 */
export function Encabezado({ idioma, t }: Props) {
  const otro = idioma === "es" ? "/en" : "/";

  return (
    <header className="lienzo relative z-20 flex items-center justify-between gap-4 pt-4">
      <Link href={idioma === "es" ? "/" : "/en"} className="flex items-center gap-2.5">
        <Image
          src="/retrato.webp"
          alt=""
          width={32}
          height={32}
          className="size-8 rounded-full bg-elevado object-cover object-[50%_20%]"
        />
        <span className="micro text-tinta">
          BPD <span className="text-tenue">— {t.v2.dorsal}</span>
        </span>
      </Link>

      <p className="micro hidden items-center gap-2 text-tinta md:flex">
        <span aria-hidden="true" className="bg-senal inline-block size-2.5 rounded-full" />
        {t.hero.disponible}
      </p>

      <Link
        href={otro}
        hrefLang={idioma === "es" ? "en" : "es"}
        aria-label={t.idioma.etiqueta}
        className="micro inline-flex min-h-11 min-w-11 items-center justify-center border border-regla px-3 text-tinta hover:border-tinta"
      >
        {t.idioma.codigo}
      </Link>
    </header>
  );
}
