import type { Dato } from "./dato";

export interface Llamarada {
  id: string;
  /** Notación de la NASA: letra + magnitud, p. ej. "M5.4". Puede faltar. */
  claseSolar: string | null;
  inicio: string;
  pico: string | null;
  regionActiva: number | null;
  enlace: string | null;
}

export const CLASES_SOLARES = ["A", "B", "C", "M", "X"] as const;
export type ClaseSolar = (typeof CLASES_SOLARES)[number];

/** "M5.4" → "M". Devuelve null si la NASA no clasificó el evento. */
export function letraDeClase(claseSolar: string | null): ClaseSolar | null {
  const letra = claseSolar?.trim().charAt(0).toUpperCase();
  return CLASES_SOLARES.find((c) => c === letra) ?? null;
}

/** "M5.4" → 5.4. La magnitud dentro de la letra; null si no viene. */
export function magnitudDeClase(claseSolar: string | null): number | null {
  const n = Number.parseFloat(claseSolar?.trim().slice(1) ?? "");
  return Number.isFinite(n) ? n : null;
}

/**
 * Posición del evento sobre la escala A→X, de 0 a 1.
 *
 * La escala solar es logarítmica: cada letra vale diez veces la anterior, y la
 * magnitud ("M5.4" → 5.4) dice en qué punto del tramo cae. Con cinco letras hay
 * cuatro tramos, así que el reparto es sobre `CLASES_SOLARES.length - 1`: el mismo
 * denominador con el que la regla coloca sus marcas. Si aquí se dividiera entre
 * cinco, el cursor caería un tramo corrido respecto a su propia letra.
 *
 * X no tiene techo (existen X20), así que el resultado se recorta a 1.
 */
export function posicionEnEscala(claseSolar: string | null): number | null {
  const letra = letraDeClase(claseSolar);
  if (!letra) return null;

  const tramos = CLASES_SOLARES.length - 1;
  const dentroDelTramo = Math.min((magnitudDeClase(claseSolar) ?? 1) / 10, 1);
  const posicion = (CLASES_SOLARES.indexOf(letra) + dentroDelTramo) / tramos;

  return Math.min(Math.max(posicion, 0), 1);
}

/** Qué significa la letra, en castellano llano y sin adjetivos de más. */
export const SIGNIFICADO_DE_CLASE: Record<ClaseSolar, string> = {
  A: "de fondo, no se nota en la Tierra",
  B: "débil, sin efectos en la Tierra",
  C: "menor, apenas afecta las comunicaciones",
  M: "media, puede alterar la radio en los polos",
  X: "intensa, afecta satélites y navegación",
};

export function significadoDeClase(claseSolar: string | null): string | null {
  const letra = letraDeClase(claseSolar);
  return letra ? SIGNIFICADO_DE_CLASE[letra] : null;
}

export type DatoLlamarada = Dato<Llamarada>;
