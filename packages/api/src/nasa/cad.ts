import { jpl } from "../cliente.js";
import * as cache from "../cache.js";
import respaldo from "../fixtures/jpl-cad.json" with { type: "json" };
import type { Asteroide, Dato } from "../tipos.js";

const CLAVE = "jpl:cad:proximas";

interface RespuestaCAD {
  fields: string[];
  data: string[][];
}

function normalizar(r: RespuestaCAD): Asteroide[] {
  const i = (campo: string) => r.fields.indexOf(campo);
  const UA_KM = 149_597_870.7;
  return r.data.map((fila) => ({
    designacion: fila[i("des")] ?? "sin designación",
    fecha: fila[i("cd")] ?? "",
    distanciaKm: Number(fila[i("dist")] ?? 0) * UA_KM,
    velocidadKmS: Number(fila[i("v_rel")] ?? 0),
    diametroMinM: null,
    diametroMaxM: null,
  }));
}

/** Próximas aproximaciones de asteroides. Misma política de degradación que DONKI. */
export async function proximasAproximaciones(limite = 5): Promise<Dato<Asteroide[]>> {
  if (cache.esFresco(CLAVE)) return cache.leer<Asteroide[]>(CLAVE)!;

  try {
    const crudo = (await jpl("/cad.api", {
      "dist-max": "0.05",
      "date-min": "now",
      sort: "date",
      limit: String(limite),
    })) as RespuestaCAD;

    const lista = normalizar(crudo);
    if (!lista.length) throw new Error("CAD devolvió cero aproximaciones");

    return cache.guardar<Asteroide[]>(CLAVE, {
      valor: lista,
      fuente: "JPL CAD",
      capturado: new Date().toISOString(),
      procedencia: "vivo",
    });
  } catch {
    const viejo = cache.leer<Asteroide[]>(CLAVE);
    if (viejo) return viejo;
    return {
      valor: normalizar(respaldo as unknown as RespuestaCAD),
      fuente: "JPL CAD",
      capturado: (respaldo as { _capturado: string })._capturado,
      procedencia: "respaldo",
    };
  }
}
