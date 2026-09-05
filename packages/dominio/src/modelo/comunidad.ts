/**
 * El directorio de grupos estudiantiles reales. Es la función de más valor social
 * del producto y la más barata: una lista bien mantenida.
 *
 * Cuidado institucional: `nombre` e `institucion` se muestran como texto. Ningún
 * logo de terceros se publica sin autorización escrita de uso de marca, así que
 * el modelo deliberadamente NO tiene campo de logo.
 */
export interface Grupo {
  id: string;
  nombre: string;
  institucion: string;
  ciudad: string;
  area: string;
  contacto: string;
  /** ISO 8601. null si no hay nada abierto anunciado. */
  proximoEvento: string | null;
  nombreEvento: string | null;
}

export type EstadoMision = "sin-empezar" | "en-curso" | "resuelta";

export interface Progreso {
  temaSlug: string;
  estado: EstadoMision;
  pasosResueltos: string[];
  actualizado: string;
}

export const porcentajeDe = (p: Progreso, totalPasos: number): number =>
  totalPasos === 0 ? 0 : Math.round((p.pasosResueltos.length / totalPasos) * 100);
