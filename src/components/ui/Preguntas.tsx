"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUp, MessageCircle, X } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil, idiomasHablados } from "@/data/perfil";
import { proyectos } from "@/data/proyectos";
import { stack } from "@/data/stack";
import { experiencia } from "@/data/experiencia";

type Props = { idioma: Idioma; t: Diccionario };
type Mensaje = { de: "yo" | "asistente"; texto: string };

/**
 * El «Ask AI» del reel, sin modelo detrás: un asistente con respuestas
 * armadas a partir de src/data, elegidas por palabras clave. El panel lo dice
 * («Respuestas armadas con la información de este sitio») para no prometer
 * algo que no es.
 */
function responder(pregunta: string, idioma: Idioma): string {
  const q = pregunta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const es = idioma === "es";
  const tiene = (...p: string[]) => p.some((x) => q.includes(x));

  if (tiene("proyecto", "project", "construi", "built", "hecho", "demo", "portafolio", "portfolio")) {
    const lista = proyectos.map((p) => `${p.nombre}: ${p.resumen?.[idioma] ?? p.descripcion[idioma]}`).join(". ");
    return es
      ? `Estos son sus proyectos: ${lista}. Puedes abrir cada carpeta en «Proyectos destacados».`
      : `Here are his projects: ${lista}. You can open each folder under “Featured Projects”.`;
  }
  if (tiene("stack", "tecnolog", "herramient", "tool", "react", "typescript", "python", "power", "lenguaje", "language", "framework")) {
    const principales = stack.flatMap((c) => c.items.filter((i) => i.principal).map((i) => i.nombre));
    const sumando = stack.find((c) => c.id === "incorporando")?.items.map((i) => i.nombre) ?? [];
    return es
      ? `Lo que más usa: ${principales.join(", ")}. También Next.js, GSAP, SQL Server, Python y .NET. Ahora está sumando ${sumando.join(", ")}.`
      : `His everyday tools: ${principales.join(", ")}. Also Next.js, GSAP, SQL Server, Python and .NET. He's currently picking up ${sumando.join(", ")}.`;
  }
  if (tiene("trabaj", "experien", "work", "cmpc", "empresa", "company", "practica", "intern", "job")) {
    const lista = experiencia.map((h) => `${h.rol[idioma]} en ${h.organizacion} (${h.periodo[idioma]})`).join("; ");
    return es ? `Su recorrido: ${lista}.` : `His path: ${lista.replaceAll(" en ", " at ")}.`;
  }
  if (tiene("disponib", "availab", "freelance", "contrat", "hire", "full-time", "full time", "tiempo completo")) {
    return es
      ? "Está disponible para proyectos freelance. Puedes escribirle desde «Hablemos.» o copiar su correo."
      : "He's available for freelance projects. You can reach him from “Let's talk.” or copy his email.";
  }
  if (tiene("correo", "email", "mail", "contact", "linkedin", "github", "escrib", "reach")) {
    return es
      ? `Su correo es ${perfil.email}. También está en GitHub (${perfil.githubUsuario}) y LinkedIn.`
      : `His email is ${perfil.email}. He's also on GitHub (${perfil.githubUsuario}) and LinkedIn.`;
  }
  if (tiene("estudi", "universidad", "university", "tesis", "thesis", "unab", "carrera", "degree")) {
    return es
      ? "Está terminando Ingeniería Civil en Informática en la Universidad Andrés Bello y egresa en noviembre de 2026. Su tesis compara tres configuraciones de Búsqueda Tabú y se presentó en ECP 2026."
      : "He's finishing a Computer Engineering degree at Universidad Andrés Bello, graduating in November 2026. His thesis compares three Tabu Search configurations and was presented at ECP 2026.";
  }
  if (tiene("cv", "curriculum", "resume")) {
    return es ? "Puedes descargar su CV en PDF desde el menú «⋯» o en «Hablemos.»." : "You can download his CV (PDF) from the “⋯” menu or in “Let's talk.”.";
  }
  if (tiene("idioma", "ingles", "english", "spanish", "espanol")) {
    return idiomasHablados.map((h) => `${h.nombre[idioma]}: ${h.nivel[idioma]}`).join(". ") + ".";
  }
  if (tiene("donde", "where", "vive", "live", "ubica", "location", "chile", "santiago")) {
    return es ? `Vive en ${perfil.ubicacion}.` : `He's based in ${perfil.ubicacion}.`;
  }
  return es
    ? "Eso no lo sé, pero puedo contarte de sus proyectos, su stack, su experiencia, sus estudios o cómo contactarlo."
    : "I don't know that one, but I can tell you about his projects, stack, experience, studies or how to reach him.";
}

export function Preguntas({ idioma, t }: Props) {
  const p = t.preguntas;
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState("");
  const id = useId();
  const boton = useRef<HTMLButtonElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const lista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    campo.current?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [abierto]);

  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight });
  }, [mensajes]);

  function preguntar(pregunta: string) {
    const limpia = pregunta.trim();
    if (!limpia) return;
    setMensajes((m) => [
      ...(m.length ? m : [{ de: "asistente" as const, texto: p.saludo }]),
      { de: "yo", texto: limpia },
      { de: "asistente", texto: responder(limpia, idioma) },
    ]);
    setTexto("");
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    preguntar(texto);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {abierto ? (
        <section
          id={`${id}-panel`}
          role="dialog"
          aria-label={p.titulo}
          className="panel-preguntas pildora flex h-[min(34rem,calc(100svh-6rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl"
        >
          <header className="flex items-center gap-3 border-b px-4 py-3">
            <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-texto text-menor font-semibold text-fondo">
              B
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-menor font-semibold">{p.titulo}</p>
              <p className="text-mini text-tenue">{p.bajada}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAbierto(false);
                boton.current?.focus();
              }}
              aria-label={p.cerrar}
              className="inline-flex size-8 items-center justify-center rounded-md text-atenuado hover:bg-elevado hover:text-texto"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </header>

          <div ref={lista} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {mensajes.length === 0 ? (
              <p className="pt-16 text-[1.75rem] font-semibold leading-tight tracking-[-0.03em]">{p.hola}</p>
            ) : (
              mensajes.map((m, i) => (
                <p
                  key={i}
                  className={
                    m.de === "yo"
                      ? "ml-auto w-fit max-w-[85%] rounded-xl bg-texto px-3 py-2 text-menor text-fondo"
                      : "max-w-[92%] text-menor text-atenuado"
                  }
                >
                  {m.texto}
                </p>
              ))
            )}
          </div>

          <div className="px-4 pb-3">
            <ul className="mb-3 flex flex-wrap gap-1.5">
              {p.sugerencias.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => preguntar(s)} className="chip min-h-8 px-2.5 py-1 text-mini hover:bg-elevado">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={enviar} className="flex items-center gap-2 rounded-xl border border-bordefuerte px-3 py-1.5">
              <label htmlFor={`${id}-q`} className="sr-only">
                {p.campo}
              </label>
              <input
                ref={campo}
                id={`${id}-q`}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder={p.campo}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-1.5 text-menor placeholder:text-tenue focus:outline-none"
              />
              <button type="submit" aria-label={p.enviar} className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-texto text-fondo">
                <ArrowUp aria-hidden="true" className="size-4" />
              </button>
            </form>
            <p className="mt-2 text-center text-[0.6875rem] text-tenue">{p.nota}</p>
          </div>
        </section>
      ) : null}
      <button
        ref={boton}
        type="button"
        aria-expanded={abierto}
        aria-controls={`${id}-panel`}
        onClick={() => setAbierto((a) => !a)}
        className="pildora inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-menor font-medium"
      >
        <MessageCircle aria-hidden="true" className="size-4" />
        {p.boton}
      </button>
    </div>
  );
}
