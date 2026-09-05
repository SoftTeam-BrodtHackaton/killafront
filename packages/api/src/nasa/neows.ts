import { nasa } from "../cliente.js";
import * as cache from "../cache.js";
import type { Asteroide, Dato } from "../tipos.js";

const CLAVE = "neows:feed:hoy";

/** Objetos cercanos de hoy. Usado por el Nivel 2 (defensa planetaria). */
export async function cercanosDeHoy(): Promise<Dato<Asteroide[]> | null> {
  if (cache.esFresco(CLAVE)) return cache.leer<Asteroide[]>(CLAVE)!;
  const hoy = new Date().toISOString().slice(0, 10);

  try {
    const crudo = (await nasa("/neo/rest/v1/feed", { start_date: hoy, end_date: hoy })) as {
      near_earth_objects: Record<string, Array<Record<string, any>>>;
    };
    const lista: Asteroide[] = (crudo.near_earth_objects[hoy] ?? []).map((o) => {
      const ap = o.close_approach_data?.[0];
      return {
        designacion: o.name as string,
        fecha: ap?.close_approach_date_full ?? hoy,
        distanciaKm: Number(ap?.miss_distance?.kilometers ?? 0),
        velocidadKmS: Number(ap?.relative_velocity?.kilometers_per_second ?? 0),
        diametroMinM: o.estimated_diameter?.meters?.estimated_diameter_min ?? null,
        diametroMaxM: o.estimated_diameter?.meters?.estimated_diameter_max ?? null,
      };
    });
    if (!lista.length) return cache.leer<Asteroide[]>(CLAVE);

    return cache.guardar<Asteroide[]>(CLAVE, {
      valor: lista,
      fuente: "NeoWs",
      capturado: new Date().toISOString(),
      procedencia: "vivo",
    });
  } catch {
    return cache.leer<Asteroide[]>(CLAVE);
  }
}
