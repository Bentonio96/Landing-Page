import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LayoutRaiz } from "@/components/LayoutRaiz";
import { esIdioma, IDIOMAS, IDIOMA_POR_DEFECTO } from "@/i18n/config";
import { construirMetadata, viewportBase } from "@/lib/metadata";

export const viewport = viewportBase;

/** Prerenderiza /es y /en en el build. */
export function generateStaticParams() {
  return IDIOMAS.map((idioma) => ({ idioma }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ idioma: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  return construirMetadata(esIdioma(idioma) ? idioma : IDIOMA_POR_DEFECTO);
}

export default async function LayoutIdioma({ children, params }: Props) {
  const { idioma } = await params;
  // Un segmento desconocido (p.ej. /cualquier-cosa) igual pasa por aquí antes
  // de que la página lance el 404: se cae al idioma por defecto para que el
  // documento nunca quede con un `lang` inválido.
  const valido = esIdioma(idioma) ? idioma : IDIOMA_POR_DEFECTO;

  return <LayoutRaiz idioma={valido}>{children}</LayoutRaiz>;
}
