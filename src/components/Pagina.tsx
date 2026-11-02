import type { Idioma } from "@/types";
import { obtenerDiccionario } from "@/i18n/diccionario";
import { rutaDe, idiomaAlterno } from "@/i18n/config";
import { perfil, SITIO_URL } from "@/data/perfil";
import { proyectos } from "@/data/proyectos";
import { stack } from "@/data/stack";
import type { Conocimiento } from "@/lib/apex";
import { Hud } from "@/components/hud/Hud";
import { Pista } from "@/components/hud/Pista";
import { Radio } from "@/components/hud/Radio";
import { Estela } from "@/components/Estela";
import { Movimiento } from "@/components/Movimiento";
import { Pie } from "@/components/Pie";
import { Parrilla } from "@/components/secciones/Parrilla";
import { Piloto } from "@/components/secciones/Piloto";
import { Garage } from "@/components/secciones/Garage";
import { Sistemas } from "@/components/secciones/Sistemas";
import { Encabezado } from "@/components/secciones/Encabezado";
import { Tiempos } from "@/components/secciones/Tiempos";
import { Box } from "@/components/secciones/Box";

type Props = { idioma: Idioma };

const PAPER = "https://sciforum.net/paper/35126";

/**
 * La vuelta completa. Las dos rutas (/ y /en) renderizan esto mismo con
 * distinto idioma. Lo que ÁPEX sabe se arma aquí, en el servidor, desde
 * src/data: al cliente le llega solo el texto del idioma que se ve.
 */
export function Pagina({ idioma }: Props) {
  const t = obtenerDiccionario(idioma);
  const proyectosRadio = proyectos.map((p) => ({
    slug: p.slug,
    nombre: p.nombre,
    clase: p.clase[idioma],
    descripcion: p.descripcion[idioma],
    tecnologias: p.tecnologias,
    demoUrl: p.demoUrl,
    repoUrl: p.repoUrl,
  }));
  const conocimiento: Conocimiento = {
    idioma,
    proyectos: proyectosRadio,
    stack: stack.flatMap((c) => c.items.map((i) => i.nombre)),
    incorporando: stack.find((c) => c.id === "incorporando")?.items.map((i) => i.nombre) ?? [],
    email: perfil.email,
    telefono: perfil.telefono,
    linkedin: perfil.linkedin,
    github: perfil.github,
    cv: perfil.cv,
    cvArchivo: perfil.cvArchivo,
    paper: PAPER,
  };
  const otroIdioma = rutaDe(idiomaAlterno(idioma));

  const datosEstructurados = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: perfil.nombre,
    jobTitle: t.hero.rol.split("&").map((parte) => parte.trim()),
    description: t.hero.intro,
    knowsAbout: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GSAP", "WebGL2", "Power BI", "Python", "FastAPI", "PostgreSQL"],
    url: SITIO_URL,
    image: `${SITIO_URL}/benjamin-pena.jpg`,
    email: `mailto:${perfil.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Ñuñoa", addressRegion: "Región Metropolitana", addressCountry: "CL" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Universidad Andrés Bello" },
    knowsLanguage: ["es", "en"],
    sameAs: [perfil.github, perfil.linkedin],
  };

  const s = t.nav.sectores.sistemas;

  return (
    <>
      <a
        href="#contenido"
        className="fixed left-4 top-3 z-[60] -translate-y-24 bg-tinta px-4 py-3 font-mono text-etiqueta uppercase tracking-[0.12em] text-papel focus:translate-y-0"
      >
        {t.saltarAlContenido}
      </a>
      <span aria-hidden="true" className="reticula hidden md:block">
        <span />
      </span>
      <Estela />
      <Hud t={t} />

      <main id="contenido" tabIndex={-1} className="relative z-[1] focus:outline-none">
        <Parrilla t={t} />
        <Piloto idioma={idioma} t={t} />
        <Garage idioma={idioma} t={t} />
        <section id="sistemas" aria-labelledby="sistemas-titulo" className="relative z-[1] px-4 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-[1440px]">
            <Encabezado id="sistemas" codigo={s.codigo} metafora={s.metafora} titulo={t.sistemas.titulo} bajada={t.sistemas.bajada} />
            <Sistemas idioma={idioma} t={t} stack={stack} proyectos={proyectosRadio} />
          </div>
        </section>
        <Tiempos idioma={idioma} t={t} />
        <Box t={t} />
      </main>

      <Pie t={t} />
      <Radio t={t} conocimiento={conocimiento} otroIdioma={otroIdioma} />
      <Pista otroIdioma={otroIdioma} />
      <Movimiento />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }}
      />
    </>
  );
}
