import type { Dato, Procedencia } from "./tipos.js";

/** Caché en memoria por proceso. Suficiente para SSR con revalidate;
 *  la capa durable vive en Supabase (tabla evento_cache). */
const memoria = new Map<string, { dato: Dato<unknown>; expira: number }>();

export const TTL_MS = 15 * 60 * 1000;

export function leer<T>(clave: string): Dato<T> | null {
  const hit = memoria.get(clave);
  if (!hit) return null;
  const vencido = Date.now() > hit.expira;
  const dato = hit.dato as Dato<T>;
  // Vencido no significa inservible: degrada a `cache` en vez de desaparecer.
  return vencido ? { ...dato, procedencia: "cache" } : dato;
}

export function esFresco(clave: string): boolean {
  const hit = memoria.get(clave);
  return !!hit && Date.now() <= hit.expira;
}

export function guardar<T>(clave: string, dato: Dato<T>, ttl = TTL_MS): Dato<T> {
  memoria.set(clave, { dato, expira: Date.now() + ttl });
  return dato;
}

export function degradar<T>(dato: Dato<T>, procedencia: Procedencia): Dato<T> {
  return { ...dato, procedencia };
}
