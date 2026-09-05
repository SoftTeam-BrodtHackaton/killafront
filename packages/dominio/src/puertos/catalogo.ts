import type { Tema } from "../modelo";

/**
 * De dónde salen los temas. Hoy es JSON versionado en el repo — por eso los
 * niveles 0 y 1 funcionan en un aula sin internet. Mañana podría ser el backend
 * sin que cambie una línea de los casos de uso.
 */
export interface PuertoCatalogo {
  temas(): Tema[];
  temaPorSlug(slug: string): Tema | null;
}
