import type { Idioma } from "@/types";
import { obtenerDiccionario } from "@/i18n/diccionario";
import { perfil, SITIO_URL } from "@/data/perfil";
import { proyectos } from "@/data/proyectos";
import { Encabezado } from "@/components/Encabezado";
import { Portada } from "@/components/Portada";
import { BandaCancha } from "@/components/BandaCancha";
import { Ficha } from "@/components/Ficha";
import { Formacion } from "@/components/Formacion";
import { Plantel } from "@/components/Plantel";
import { Temporadas } from "@/components/Temporadas";
import { Pitazo } from "@/components/Pitazo";
import { Revelar } from "@/components/Revelar";

type Props = { idioma: Idioma };

/** URL de la versión actual del portafolio, para comparar. */
const VERSION_ACTUAL = "https://benjamin-pena.vercel.app";

/**
 * Composición de la v2, «Cancha». Mismo contenido que la versión actual
 * (sale de los mismos archivos de /src/data y del mismo diccionario); lo
 * que cambia es el diseño.
 */
export function Pagina({ idioma }: Props) {
  const t = obtenerDiccionario(idioma);

  const secciones = [
    { id: "sobre-mi", etiqueta: t.nav.sobreMi },
    { id: "stack", etiqueta: t.nav.stack },
    { id: "proyectos", etiqueta: t.nav.proyectos },
    { id: "experiencia", etiqueta: t.nav.experiencia },
    { id: "contacto", etiqueta: t.nav.contacto },
  ];

  const datosEstructurados = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: perfil.nombre,
    jobTitle: t.hero.rol.split("&").map((parte) => parte.trim()),
    description: t.hero.intro,
    url: SITIO_URL,
    image: `${SITIO_URL}/benjamin-pena.jpg`,
    email: `mailto:${perfil.email}`,
    sameAs: [perfil.github, perfil.linkedin],
  };

  return (
    <>
      <a
        href="#contenido"
        className="sr-only-focusable etiqueta fixed left-3 top-3 z-50 bg-tinta px-4 py-3 text-papel"
      >
        {t.saltarAlContenido}
      </a>

      {/* El corte verde del reel, al cargar. */}
      <div aria-hidden="true" className="cesped cortina" />

      <Encabezado idioma={idioma} t={t} />

      <main id="contenido">
        <Portada idioma={idioma} t={t} />
        <BandaCancha secciones={secciones} etiquetaNav={t.cancha.navegacion} />
        <Ficha idioma={idioma} t={t} />
        <Formacion idioma={idioma} t={t} />
        <Plantel idioma={idioma} t={t} proyectos={proyectos} />
        <Temporadas idioma={idioma} t={t} />
        <Pitazo idioma={idioma} t={t} />
      </main>

      <footer className="lienzo flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="micro text-tenue">
          {t.cancha.concepto} · {t.pie.derechos} {t.pie.construidoCon}
        </p>
        <a
          href={VERSION_ACTUAL}
          className="micro inline-flex min-h-11 items-center text-tinta underline underline-offset-4 hover:text-acento"
        >
          {t.cancha.versionActual}
        </a>
      </footer>

      <Revelar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }}
      />
    </>
  );
}
