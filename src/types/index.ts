/** Los dos idiomas que sirve el sitio. */
export type Idioma = "es" | "en";

/** Un texto que existe en ambos idiomas. */
export type Texto = Record<Idioma, string>;

/**
 * Un proyecto del portafolio.
 *
 * `demoUrl` y `repoUrl` son opcionales a propósito: la tarjeta oculta el
 * botón correspondiente si la URL no está, en vez de renderizar un enlace roto.
 */
export type Proyecto = {
  /** Identificador estable, usado como key y ancla. */
  slug: string;
  /** Nombre del proyecto (no se traduce). */
  nombre: string;
  /** Una o dos líneas describiendo qué es. */
  descripcion: Texto;
  /** Tecnologías usadas, en orden de relevancia. */
  tecnologias: string[];
  /** URL de la demo en vivo. Si falta, no se muestra el botón "Ver sitio". */
  demoUrl?: string;
  /** URL del repositorio. Si falta, no se muestra el botón "Ver código". */
  repoUrl?: string;
  /** Año o rango, se muestra como metadato discreto. */
  anio?: string;
};

/** Una categoría del stack con sus tecnologías. */
export type CategoriaStack = {
  id: string;
  titulo: Texto;
  items: string[];
};

/** Un hito de la línea de tiempo de experiencia. */
export type Hito = {
  id: string;
  /** Empresa o institución. */
  organizacion: string;
  rol: Texto;
  periodo: Texto;
  lugar?: string;
  descripcion: Texto;
  /** Marca el hito como en curso (punto acentuado en la línea de tiempo). */
  actual?: boolean;
};
