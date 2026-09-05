import type { PuertoReloj } from "@killalab/dominio";

export const relojDelSistema = (): PuertoReloj => ({ ahora: () => new Date() });

/** Para pruebas: congela el tiempo en una fecha conocida. */
export const relojFijo = (fecha: Date): PuertoReloj => ({ ahora: () => new Date(fecha) });
