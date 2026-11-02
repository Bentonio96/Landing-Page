"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { SECTORES, esMejor, formatearTiempo, largar, useCarrera } from "@/lib/carrera";
import { irA } from "@/lib/cliente";
import { TableroLed } from "@/components/TableroLed";
import { cn } from "@/lib/utils";

type Props = { t: Diccionario };

/**
 * La vuelta de quien visita, en el box: el tablero de LED pasa de «BOX BOX»
 * a su tiempo, y debajo van los parciales con el color de la cronometría
 * (morado: mejor marca; ámbar: más lento), siempre con la palabra al lado.
 */
export function Vuelta({ t }: Props) {
  const c = useCarrera();
  const [otra, setOtra] = useState(0);
  const tiempo = c.final !== null ? formatearTiempo(c.final, 2) : null;
  const mejorVuelta = c.final !== null && esMejor("vuelta", c.final);
  const previa = c.mejores.vuelta;

  return (
    <div className="border border-tinta bg-panelalto" key={otra}>
      <div className="flex items-center justify-between border-b border-linea px-4 py-3">
        <h3 className="mono-etiqueta text-atenuado">{t.box.tuVuelta}</h3>
        <span className="mono-etiqueta text-tenue tnum">#{String(c.vueltas || 1).padStart(2, "0")}</span>
      </div>
      <div className="bg-papel p-3">
        <TableroLed lineas={[tiempo ?? "BOX BOX"]} minColumnas={49}>
          {tiempo ?? t.box.sinTiempo}
        </TableroLed>
      </div>

      <table className="w-full border-t border-linea text-left text-[0.9375rem]">
        <caption className="sr-only">{t.box.tuVuelta}</caption>
        <tbody>
          {SECTORES.map((s) => {
            const paso = c.pasos[s];
            const mejor = paso !== undefined && esMejor(s, paso);
            const sec = t.nav.sectores[s];
            return (
              <tr key={s} className="border-b border-linea">
                <th scope="row" className="px-4 py-2 font-normal">
                  <span className="font-mono text-etiqueta text-tenue">{sec.codigo}</span>{" "}
                  <span>{sec.nombre}</span>
                </th>
                <td className="px-2 py-2 text-right font-mono tnum">
                  {paso !== undefined ? formatearTiempo(paso, 2) : "—"}
                </td>
                <td className="w-[7.5rem] px-4 py-2 text-right">
                  {paso !== undefined && (
                    <span
                      className={cn(
                        "mono-etiqueta inline-flex items-center gap-1.5",
                        mejor ? "text-morado" : "text-ambar",
                      )}
                    >
                      <span aria-hidden="true" className={cn("size-2", mejor ? "bg-moradovivo" : "bg-ambar")} />
                      {mejor ? t.box.mejorSector : t.box.masLento}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
          <tr>
            <th scope="row" className="px-4 py-3 font-semibold">{t.box.total}</th>
            <td className={cn("px-2 py-3 text-right font-mono text-lg font-medium tnum", mejorVuelta && "text-morado")}>
              {tiempo ?? t.box.sinTiempo}
            </td>
            <td className="px-4 py-3 text-right font-mono text-etiqueta text-tenue tnum">
              {previa !== undefined && (
                <>
                  <span className="sr-only">{t.box.mejor}: </span>
                  <span aria-hidden="true">PB </span>
                  {formatearTiempo(previa, 2)}
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-linea px-4 py-3">
        <p className="max-w-[44ch] text-[0.8125rem] leading-snug text-tenue">{t.box.notaVuelta}</p>
        <button
          type="button"
          onClick={() => {
            largar();
            setOtra((n) => n + 1);
            irA("parrilla");
          }}
          className="inline-flex h-10 items-center gap-2 border border-tinta px-3 font-mono text-etiqueta uppercase tracking-[0.1em] hover:bg-tinta hover:text-papel"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          {t.box.otraVuelta}
        </button>
      </div>
    </div>
  );
}
