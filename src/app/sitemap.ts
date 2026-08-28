import type { MetadataRoute } from "next";
import { SITIO_URL } from "@/data/perfil";

export default function sitemap(): MetadataRoute.Sitemap {
  const modificado = new Date();
  const idiomas = { es: `${SITIO_URL}/`, en: `${SITIO_URL}/en` };

  return [
    {
      url: `${SITIO_URL}/`,
      lastModified: modificado,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: idiomas },
    },
    {
      url: `${SITIO_URL}/en`,
      lastModified: modificado,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: idiomas },
    },
  ];
}
