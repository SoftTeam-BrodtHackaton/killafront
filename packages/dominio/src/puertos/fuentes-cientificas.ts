import type { Asteroide, Llamarada } from "../modelo";

/**
 * Puertos de salida hacia las fuentes científicas. Los implementa
 * `@killalab/adaptadores`. Lanzan cuando la fuente falla: decidir qué hacer con
 * esa falla es política, y la política vive en los casos de uso.
 */

export interface PuertoClimaEspacial {
  /** true cuando detrás no está la NASA sino la fake API. La UI está obligada a decirlo. */
  readonly simulado: boolean;
  llamaradasRecientes(dias: number): Promise<Llamarada[]>;
}

export interface PuertoAsteroides {
  readonly simulado: boolean;
  proximasAproximaciones(limite: number): Promise<Asteroide[]>;
  cercanosDeHoy(): Promise<Asteroide[]>;
}

/**
 * El último recurso: respuestas guardadas en disco, fechadas. No es un caché,
 * es un respaldo que se versiona con el repo y garantiza que la demo nunca
 * muestre una pantalla vacía.
 */
export interface PuertoRespaldo {
  llamarada(): { valor: Llamarada; capturado: string } | null;
  aproximaciones(): { valor: Asteroide[]; capturado: string } | null;
}
