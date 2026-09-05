import type { Dato } from "../modelo";

/**
 * Caché con noción de frescura. Vencido no significa inservible: el caso de uso
 * prefiere un dato viejo bien fechado antes que una pantalla rota.
 */
export interface PuertoAlmacenTemporal {
  leer<T>(clave: string): Dato<T> | null;
  esFresco(clave: string): boolean;
  guardar<T>(clave: string, dato: Dato<T>, ttlMs?: number): Dato<T>;
}
