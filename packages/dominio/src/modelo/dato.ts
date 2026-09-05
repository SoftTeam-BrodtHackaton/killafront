/** Ninguna cifra viaja sin su fuente. El tipo lo obliga: no existe un dato desnudo. */

export type CodigoFuente = "DONKI" | "NeoWs" | "JPL CAD" | "propio";

export interface Fuente {
  nombre: string;
  url: string | null;
}

export const FUENTES: Record<CodigoFuente, Fuente> = {
  DONKI: { nombre: "NASA DONKI", url: "https://ccmc.gsfc.nasa.gov/donki/" },
  NeoWs: { nombre: "NASA NeoWs", url: "https://api.nasa.gov/#NeoWS" },
  "JPL CAD": { nombre: "JPL Close-Approach Data", url: "https://ssd-api.jpl.nasa.gov/doc/cad.html" },
  propio: { nombre: "contenido propio de KillaLab", url: null },
};

/**
 * De dónde salió el dato que estás viendo.
 * `cache` y `respaldo` NO son errores: se muestran igual, fechados. El módulo
 * nunca se oculta ni se rompe.
 * `simulado` = la fake API de desarrollo; se etiqueta en pantalla sin excepción.
 */
export type Procedencia = "vivo" | "cache" | "respaldo" | "simulado";

export interface Dato<T> {
  valor: T;
  fuente: CodigoFuente;
  /** ISO 8601 — cuándo se leyó de la fuente, no cuándo ocurrió el evento. */
  capturado: string;
  procedencia: Procedencia;
}

export const degradar = <T>(dato: Dato<T>, procedencia: Procedencia): Dato<T> => ({
  ...dato,
  procedencia,
});

/** Cuánto confiar en lo que se ve. La UI lo usa para elegir el tono del aviso. */
export const esDeVivo = (p: Procedencia) => p === "vivo";
export const necesitaAdvertencia = (p: Procedencia) => p === "cache" || p === "respaldo" || p === "simulado";
