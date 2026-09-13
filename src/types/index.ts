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
  /**
   * Cuándo se hizo, como mes y año ("Agosto 2026") o rango de meses. Va por
   * idioma porque el mes se traduce. Se muestra como metadato discreto.
   */
  fecha?: Texto;
  /**
   * Miniatura del proyecto, relativa a /public. La genera
   * scripts/capturar-proyectos.mjs desde el sitio en vivo. Si falta, la
   * tarjeta se renderiza sin imagen.
   */
  imagen?: string;
};

/** Una tecnología dentro del stack. */
export type ItemStack = {
  nombre: string;
  /**
   * Marca la herramienta como principal: se muestra con el color de acento
   * para que se lea primero. Úsalo con moderación — si se resalta todo, deja
   * de resaltarse nada.
   */
  principal?: boolean;
};

/** Una categoría del stack con sus tecnologías. */
export type CategoriaStack = {
  id: string;
  titulo: Texto;
  items: ItemStack[];
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

/** Una certificación obtenida, para la sección Sobre mí. */
export type Certificacion = {
  nombre: string;
  emisor: string;
  fecha: Texto;
};

/** Un idioma hablado y su nivel. */
export type IdiomaHablado = {
  nombre: Texto;
  nivel: Texto;
};
