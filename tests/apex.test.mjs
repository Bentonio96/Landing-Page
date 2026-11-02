// Guion de ÁPEX: que cada pregunta típica caiga en la intención correcta.
// Corre con `npm test` (Node quita los tipos del .ts al cargarlo).
import { test } from "node:test";
import assert from "node:assert/strict";
import { responder, tecnologiaMencionada, proyectosQueUsan, normalizar } from "../src/lib/apex.ts";

const proyectos = [
  { slug: "kerr", nombre: "Kerr", clase: "WebGL", descripcion: "Agujero negro.", tecnologias: ["React 19", "TypeScript", "WebGL2"], demoUrl: "https://kerr-mission.vercel.app", repoUrl: "https://github.com/x/kerr" },
  { slug: "barometro", nombre: "Barómetro", clase: "Datos", descripcion: "Indicadores.", tecnologias: ["Next.js 15", "Recharts"] },
  { slug: "portal-ciberoperaciones", nombre: "Portal de Ciberoperaciones", clase: "Interno", descripcion: "Portal.", tecnologias: ["Power Pages", "Power Apps", "Power BI"] },
];
const stack = ["React", "TypeScript", "JavaScript", "Java", "Next.js", "Power BI", "Power Query", "Power Pages", "Power Apps", "Python", "HTML semántico", "WebGL2", "GraphQL"];
const base = {
  proyectos, stack, incorporando: ["GraphQL"],
  email: "a@b.cl", telefono: "+56 9", linkedin: "https://linkedin.com/in/x", github: "https://github.com/x",
  cv: "/CV.pdf", cvArchivo: "CV.pdf", paper: "https://sciforum.net/paper/35126",
};
const es = { ...base, idioma: "es" };
const en = { ...base, idioma: "en" };

test("normaliza tildes y signos", () => {
  assert.equal(normalizar("¿Sabés Next.js?"), "sabes next js");
});

test("un proyecto por su nombre, con o sin tilde", () => {
  const r = responder("háblame de barometro", es);
  assert.match(r.texto, /^Barómetro/);
  assert.deepEqual(r.auto, { tipo: "ir", destino: "proyecto-barometro", texto: "Ir al proyecto" });
  assert.equal(responder("KERR?", en).acciones?.length, 2);
});

test("la tecnología más específica gana", () => {
  assert.equal(tecnologiaMencionada("sabes javascript?", stack), "JavaScript");
  assert.equal(tecnologiaMencionada("y java?", stack), "Java");
  assert.equal(tecnologiaMencionada("usa power apps", stack), "Power Apps");
  assert.equal(tecnologiaMencionada("next.js", stack), "Next.js");
  assert.equal(tecnologiaMencionada("html", stack), "HTML semántico");
});

test("una tecnología responde con los proyectos que la usan", () => {
  assert.deepEqual(proyectosQueUsan("React", proyectos).map((p) => p.slug), ["kerr"]);
  assert.deepEqual(proyectosQueUsan("Next.js", proyectos).map((p) => p.slug), ["barometro"]);
  const r = responder("¿Sabes React?", es);
  assert.match(r.texto, /Afirmativo, React/);
  assert.match(r.texto, /Kerr/);
});

test("lo que está incorporando se dice como tal", () => {
  assert.match(responder("do you know graphql", en).texto, /in development/);
});

test("intenciones de navegación y acciones", () => {
  assert.equal(responder("muéstrame los proyectos", es).auto?.destino, "garage");
  assert.equal(responder("quiero ver tus trabajos", es).auto?.destino, "garage");
  assert.equal(responder("experiencia", es).auto?.destino, "tiempos");
  assert.equal(responder("how do I contact him?", en).auto?.destino, "box");
  assert.equal(responder("modo noche", es).auto?.tipo, "tema");
  assert.equal(responder("english", es).auto?.tipo, "idioma");
  assert.equal(responder("cv", en).acciones?.[0].tipo, "enlace");
  assert.match(responder("está disponible?", es).texto, /disponible/);
  assert.match(responder("what languages does he speak", en).texto, /Spanish/);
  assert.match(responder("tesis", es).texto, /ECP 2026/);
  assert.match(responder("wearables", en).texto, /Oura/);
});

test("jarvis y lo desconocido", () => {
  assert.match(responder("Jarvis, ¿estás?", es).texto, /ÁPEX/);
  assert.match(responder("xyzzy", es).texto, /No tengo eso/);
  assert.match(responder("   ", en).texto, /Channel open/);
});
