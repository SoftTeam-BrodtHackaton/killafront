import { nasa, rango, procedenciaInicial } from "../cliente";
import * as cache from "../cache";
import respaldo from "../fixtures/donki-flr.json";
import type { Dato, Llamarada } from "../tipos";

const CLAVE = "donki:flr:ultima";

interface FilaFLR {
  flrID?: string;
  classType?: string;
  beginTime?: string;
  peakTime?: string;
  activeRegionNum?: number | null;
  link?: string;
  linkedEvents?: unknown;
}

function normalizar(f: FilaFLR): Llamarada | null {
  if (!f.flrID || !f.beginTime) return null;
  return {
    id: f.flrID,
    claseSolar: f.classType ?? null,
    inicio: f.beginTime,
    pico: f.peakTime ?? null,
    regionActiva: f.activeRegionNum ?? null,
    velocidadKmS: null, // FLR no trae velocidad; viene de CME. Se deja explícito, no se inventa.
    enlace: f.link ?? null,
  };
}

/** Última llamarada solar registrada. Nunca lanza: si DONKI falla,
 *  devuelve el último dato conocido marcado como `cache` o `respaldo`. */
export async function ultimaLlamarada(dias = 30): Promise<Dato<Llamarada>> {
  if (cache.esFresco(CLAVE)) return cache.leer<Llamarada>(CLAVE)!;

  const { inicio, fin } = rango(dias);
  try {
    const crudo = (await nasa("/DONKI/FLR", { startDate: inicio, endDate: fin })) as FilaFLR[];
    const filas = (Array.isArray(crudo) ? crudo : []).map(normalizar).filter((x): x is Llamarada => !!x);
    filas.sort((a, b) => Date.parse(b.inicio) - Date.parse(a.inicio));
    const ultima = filas[0];
    if (!ultima) throw new Error("DONKI devolvió cero eventos en el rango");

    return cache.guardar<Llamarada>(CLAVE, {
      valor: ultima,
      fuente: "DONKI",
      capturado: new Date().toISOString(),
      procedencia: procedenciaInicial(),
    });
  } catch {
    const viejo = cache.leer<Llamarada>(CLAVE);
    if (viejo) return viejo;
    const fallback = normalizar(respaldo as FilaFLR);
    return {
      valor: fallback!,
      fuente: "DONKI",
      capturado: (respaldo as { _capturado: string })._capturado,
      procedencia: "respaldo",
    };
  }
}
