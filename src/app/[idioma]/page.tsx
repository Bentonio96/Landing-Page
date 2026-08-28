import { notFound } from "next/navigation";
import { Pagina } from "@/components/Pagina";
import { esIdioma } from "@/i18n/config";

export default async function PaginaIdioma({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!esIdioma(idioma)) notFound();

  return <Pagina idioma={idioma} />;
}
