/** Ninguna cifra viaja sin su fuente. El tipo lo obliga. */
export type CodigoFuente = "DONKI" | "NeoWs" | "JPL CAD";

export const FUENTES: Record<CodigoFuente, { nombre: string; url: string }> = {
  DONKI: { nombre: "NASA DONKI", url: "https://ccmc.gsfc.nasa.gov/donki/" },
  NeoWs: { nombre: "NASA NeoWs", url: "https://api.nasa.gov/#NeoWS" },
  "JPL CAD": { nombre: "JPL Close-Approach Data", url: "https://ssd-api.jpl.nasa.gov/doc/cad.html" },
};

/** Estado de procedencia del dato. `cache` y `respaldo` NO son errores:
 *  se muestran igual, fechados. El módulo nunca se oculta.
 *  `simulado` = viene de la fake API; se etiqueta en pantalla sin excepción. */
export type Procedencia = "vivo" | "cache" | "respaldo" | "simulado";

export interface Dato<T> {
  valor: T;
  fuente: CodigoFuente;
  /** ISO 8601 — cuándo se leyó de la fuente, no cuándo ocurrió el evento. */
  capturado: string;
  procedencia: Procedencia;
}

export interface Llamarada {
  id: string;
  claseSolar: string | null;
  inicio: string;
  pico: string | null;
  regionActiva: number | null;
  velocidadKmS: number | null;
  enlace: string | null;
}

export interface Asteroide {
  designacion: string;
  fecha: string;
  distanciaKm: number;
  velocidadKmS: number;
  diametroMinM: number | null;
  diametroMaxM: number | null;
}
