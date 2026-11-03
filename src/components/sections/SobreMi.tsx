import type { ReactNode } from "react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { pieza } from "@/lib/pieza";
import { Titulo } from "@/components/ui/Titulo";

type Props = { t: Diccionario };

const Cadena = ({ children }: { children: ReactNode }) => (
  <span className="text-[#A5E3B5]">{children}</span>
);
const Llave = ({ children }: { children: ReactNode }) => (
  <span className="text-[#9CC8FF]">{children}</span>
);

/**
 * Quién soy, con el «código» del reel: un archivo de perfil cuyas líneas
 * escriben los agentes una por una. Los valores son los del CV.
 */
export function SobreMi({ t }: Props) {
  const c = t.sobreMi.codigo;
  const lista = (valores: readonly string[]) => (
    <>
      [
      {valores.map((v, i) => (
        <span key={v}>
          <Cadena>{v}</Cadena>
          {i < valores.length - 1 ? ", " : ""}
        </span>
      ))}
      ]
    </>
  );

  const lineas: ReactNode[] = [
    <>
      <span className="text-[#C9A8FF]">const</span> {c.variable} = {"{"}
    </>,
    <>
      <Llave>{c.rol}</Llave>: <Cadena>&quot;{t.inicio.rol}&quot;</Cadena>,
    </>,
    <>
      <Llave>{c.base}</Llave>: <Cadena>&quot;{perfil.ubicacion}&quot;</Cadena>,
    </>,
    <>
      <Llave>{c.egreso}</Llave>: <Cadena>&quot;{c.egresoValor}&quot;</Cadena>,
    </>,
    <>
      <Llave>{c.idiomas}</Llave>: {lista(c.idiomasValor)},
    </>,
    <>
      <Llave>{c.busca}</Llave>: {lista(c.buscaValor)},
    </>,
    <>
      <Llave>{c.trabajaCon}</Llave>: {lista(c.trabajaConValor)},
    </>,
    <>{"};"}</>,
  ];

  return (
    <section
      id="sobre-mi"
      data-seccion="sobre-mi"
      aria-labelledby="titulo-sobre-mi"
      className="lienzo grid gap-10 pb-seccion lg:grid-cols-[1fr_1.05fr] lg:gap-16"
    >
      <div>
        <Titulo id="sobre-mi" etiqueta={t.sobreMi.etiqueta} titulo={t.sobreMi.titulo} />
        <div className="mt-6 space-y-4 text-cuerpo text-atenuado">
          {t.sobreMi.parrafos.map((p, i) => (
            <p key={i} {...pieza(`sobre-p-${i}`, "párrafo")} className="block">
              {p}
            </p>
          ))}
          <p
            {...pieza("sobre-agentes", "párrafo")}
            className="block border-l-2 border-acentovivo pl-4 text-texto"
          >
            {t.sobreMi.agentes}
          </p>
        </div>
      </div>

      <figure
        {...pieza("sobre-codigo", "editor", "caja")}
        className="self-start overflow-hidden rounded-[14px] border border-[#1F2530] bg-codigo text-codigotexto shadow-[0_24px_60px_-30px_var(--c-sombra)]"
      >
        <figcaption className="flex items-center gap-3 border-b border-[#1F2530] px-4 py-3 font-mono text-[0.75rem] text-[#AFB7C4]">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#FF6B6B]" />
            <span className="size-2.5 rounded-full bg-[#FFD25C]" />
            <span className="size-2.5 rounded-full bg-[#5BE49B]" />
          </span>
          {t.sobreMi.archivo}
        </figcaption>
        <pre className="p-4 font-mono text-[0.78rem] leading-[1.75] sm:p-5 sm:text-[0.8125rem]">
          <code>
            {lineas.map((linea, i) => (
              <span
                key={i}
                {...pieza(`codigo-${i}`, `línea ${i + 1}`)}
                className="grid grid-cols-[1.25rem_1fr] gap-x-3"
              >
                <span className="select-none text-right text-[#6B7383]" aria-hidden="true">
                  {i + 1}
                </span>
                {/* Ajusta en vez de desbordar: en un teléfono no queda código cortado. */}
                <span className={`whitespace-pre-wrap break-words ${i > 0 && i < lineas.length - 1 ? "pl-4" : ""}`}>
                  {linea}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </figure>
    </section>
  );
}
