import type { Idioma } from "@/types";
import { obtenerDiccionario } from "@/i18n/diccionario";
import { CANONICA_URL, perfil } from "@/data/perfil";
import { Pildora } from "@/components/layout/Pildora";
import { Pie } from "@/components/layout/Pie";
import { SaltarAlContenido } from "@/components/layout/SaltarAlContenido";
import { Escenario } from "@/components/sections/Escenario";
import { Preguntas } from "@/components/ui/Preguntas";
import { Stack } from "@/components/sections/Stack";
import { Proyectos } from "@/components/sections/Proyectos";
import { Experiencia } from "@/components/sections/Experiencia";
import { Contacto } from "@/components/sections/Contacto";
import { ProveedorAvisos } from "@/components/ui/Avisos";
import { Movimiento } from "@/components/Movimiento";

type Props = { idioma: Idioma };

export function Pagina({ idioma }: Props) {
  const t = obtenerDiccionario(idioma);

  const datosEstructurados = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: perfil.nombre,
    jobTitle: t.hero.rol,
    description: t.hero.intro.replaceAll("**", ""),
    knowsAbout: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Next.js", "Power BI", "Power Apps", "Power Pages", "Power Query", "Python", "SQL"],
    url: CANONICA_URL,
    image: `${CANONICA_URL}/benjamin-pena.jpg`,
    email: `mailto:${perfil.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ñuñoa",
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Universidad Andrés Bello" },
    knowsLanguage: ["es", "en"],
    sameAs: [perfil.github, perfil.linkedin],
  };

  return (
    <ProveedorAvisos>
      <SaltarAlContenido texto={t.saltarAlContenido} />
      <Pildora idioma={idioma} t={t} />
      <main id="contenido">
        <Escenario t={t} />
        <Stack idioma={idioma} t={t} />
        <Proyectos idioma={idioma} t={t} />
        <Experiencia idioma={idioma} t={t} />
        <Contacto t={t} />
      </main>
      <Pie t={t} />
      <Preguntas idioma={idioma} t={t} />
      <Movimiento />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }} />
    </ProveedorAvisos>
  );
}
