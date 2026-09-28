import type { Idioma } from "@/types";
import { obtenerDiccionario } from "@/i18n/diccionario";
import { perfil, SITIO_URL } from "@/data/perfil";
import { Encabezado } from "@/components/layout/Encabezado";
import { PieDePagina } from "@/components/layout/PieDePagina";
import { SaltarAlContenido } from "@/components/layout/SaltarAlContenido";
import { Hero } from "@/components/sections/Hero";
import { SobreMi } from "@/components/sections/SobreMi";
import { Stack } from "@/components/sections/Stack";
import { Proyectos } from "@/components/sections/Proyectos";
import { Experiencia } from "@/components/sections/Experiencia";
import { Contacto } from "@/components/sections/Contacto";
import { ProveedorTecnologia } from "@/components/ui/ContextoTecnologia";
import { ProveedorAvisos } from "@/components/ui/Avisos";
import { Movimiento } from "@/components/Movimiento";

type Props = { idioma: Idioma };

/**
 * Composición única de la página. Las dos rutas del sitio (/ en español
 * y /en en inglés) renderizan esto mismo con distinto idioma: cero
 * duplicación de componentes.
 */
export function Pagina({ idioma }: Props) {
  const t = obtenerDiccionario(idioma);

  const datosEstructurados = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: perfil.nombre,
    // schema.org admite varios cargos. Se parte el titular en sus dos mitades
    // en vez de declarar una sola cadena con un "&" dentro, que ningún
    // buscador sabe interpretar como dos oficios distintos.
    jobTitle: t.hero.rol.split("&").map((parte) => parte.trim()),
    description: t.hero.intro,
    knowsAbout: [
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Next.js",
      "GSAP",
      "Power BI",
      "Power Apps",
      "Power Pages",
      "Power Query",
      "Python",
      "SQL",
    ],
    url: SITIO_URL,
    image: `${SITIO_URL}/benjamin-pena.jpg`,
    email: `mailto:${perfil.email}`,
    telephone: perfil.telefonoEnlace,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ñuñoa",
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidad Andrés Bello",
    },
    knowsLanguage: ["es", "en"],
    sameAs: [perfil.github, perfil.linkedin],
  };

  return (
    <>
      <SaltarAlContenido texto={t.saltarAlContenido} />
      <Encabezado idioma={idioma} t={t} />

      <ProveedorAvisos>
      <ProveedorTecnologia>
        <main id="contenido">
          <Hero t={t} />
          <SobreMi idioma={idioma} t={t} />
          <Stack idioma={idioma} t={t} />
          <Proyectos idioma={idioma} t={t} />
          <Experiencia idioma={idioma} t={t} />
          <Contacto t={t} />
        </main>
      </ProveedorTecnologia>
      </ProveedorAvisos>

      <PieDePagina idioma={idioma} t={t} />
      <Movimiento />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datosEstructurados),
        }}
      />
    </>
  );
}
