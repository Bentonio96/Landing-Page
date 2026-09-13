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
 * Por la misma razón el <html> de esta página llega sin `lang`, y no hay
 * forma de fijarlo desde aquí en el servidor. Se pone con una línea de
 * script: los lectores de pantalla leen el DOM ya ejecutado, así que para
 * ellos queda correcto, y la página es noindex, de modo que a los
 * buscadores no les afecta.
 *
 * Los valores replican los tokens de globals.css. Si cambias la paleta ahí,
 * actualiza también estos cinco colores.
 */
const estilos = `
  :root {
    --fondo: #F6F7F9;
    --texto: #0E1117;
    --atenuado: #414A58;
    --acento: #4335C9;
    --sobre-acento: #FFFFFF;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --fondo: #0E1117;
      --texto: #F1F3F7;
      --atenuado: #AFB7C4;
      --acento: #A79BFF;
      --sobre-acento: #0E1117;
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
    font-family: Impact, "Arial Narrow", "Helvetica Neue Condensed", sans-serif;
    font-size: clamp(2.5rem, 1.6rem + 3.4vw, 4.25rem);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0;
    line-height: 0.95;
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
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang='${IDIOMA_POR_DEFECTO}'`,
        }}
      />
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
