import Link from "next/link";
import { obtenerDiccionario } from "@/i18n/diccionario";
import { IDIOMA_POR_DEFECTO } from "@/i18n/config";

export const metadata = {
  title: "Página no encontrada — Benjamín Peña",
  robots: { index: false, follow: false },
};

/**
 * 404 del sitio.
 *
 * Va con estilos embebidos a propósito. El root layout vive dentro del
 * segmento dinámico [idioma] (necesario para que `lang` sea correcto en
 * español e inglés), y en esa situación Next renderiza la página de
 * not-found fuera del layout: no le adjunta la hoja de Tailwind. Antes que
 * degradar el `lang` de todo el sitio inglés para arreglar una página que
 * casi nadie ve, esta página se basta sola.
 *
 * Los valores replican los tokens de globals.css. Si cambias la paleta ahí,
 * actualiza también estos cinco colores.
 */
const estilos = `
  :root {
    --fondo: #FBFAF8;
    --texto: #16181D;
    --atenuado: #5C6069;
    --acento: #B04426;
    --sobre-acento: #FFFFFF;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --fondo: #0C0E12;
      --texto: #EDEDEB;
      --atenuado: #9BA1AB;
      --acento: #F0784E;
      --sobre-acento: #14100E;
    }
  }
  html { color-scheme: light dark; }
  .e404-cuerpo {
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6rem 1.5rem;
    background: var(--fondo);
    color: var(--texto);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  .e404-caja { max-width: 34rem; text-align: center; }
  .e404-etiqueta {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--acento);
    margin: 0;
  }
  .e404-titulo {
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.75rem, 1.4rem + 1.6vw, 2.75rem);
    font-weight: 500;
    letter-spacing: -0.022em;
    line-height: 1.12;
    margin: 1.25rem 0 0;
  }
  .e404-bajada {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--atenuado);
    margin: 1rem 0 0;
  }
  .e404-boton {
    display: inline-block;
    margin-top: 2.5rem;
    padding: 0.85rem 1.35rem;
    border-radius: 2px;
    background: var(--acento);
    color: var(--sobre-acento);
    text-decoration: none;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .e404-boton:focus-visible {
    outline: 2px solid var(--acento);
    outline-offset: 3px;
  }
`;

export default function NoEncontrado() {
  const t = obtenerDiccionario(IDIOMA_POR_DEFECTO);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: estilos }} />
      <main id="contenido" className="e404-cuerpo">
        <div className="e404-caja">
          <p className="e404-etiqueta">Error 404</p>
          <h1 className="e404-titulo">{t.noEncontrado.titulo}</h1>
          <p className="e404-bajada">{t.noEncontrado.bajada}</p>
          <Link href="/" className="e404-boton">
            ← {t.noEncontrado.volver}
          </Link>
        </div>
      </main>
    </>
  );
}
