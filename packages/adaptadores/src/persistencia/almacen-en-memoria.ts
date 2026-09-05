import type { Dato, PuertoAlmacenTemporal } from "@killalab/dominio";

const TTL_POR_DEFECTO = 15 * 60 * 1000;

/**
 * Caché por proceso. Suficiente para el SSR de Next con `revalidate`: entre
 * revalidaciones ninguna visita vuelve a pegarle a la NASA.
 *
 * La capa durable la dará el backend propio de KillaLab cuando exista; se
 * enchufará implementando este mismo puerto, sin tocar los casos de uso.
 */
export function almacenEnMemoria(ttlMs = TTL_POR_DEFECTO): PuertoAlmacenTemporal {
  const memoria = new Map<string, { dato: Dato<unknown>; expira: number }>();

  return {
    leer<T>(clave: string): Dato<T> | null {
      const hit = memoria.get(clave);
      if (!hit) return null;
      const dato = hit.dato as Dato<T>;
      // Vencido no es inservible: degrada a `cache` en vez de desaparecer.
      return Date.now() > hit.expira ? { ...dato, procedencia: "cache" } : dato;
    },

    esFresco(clave: string) {
      const hit = memoria.get(clave);
      return hit !== undefined && Date.now() <= hit.expira;
    },

    guardar<T>(clave: string, dato: Dato<T>, ttl = ttlMs): Dato<T> {
      memoria.set(clave, { dato, expira: Date.now() + ttl });
      return dato;
    },
  };
}
