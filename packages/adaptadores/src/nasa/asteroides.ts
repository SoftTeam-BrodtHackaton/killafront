import type { Asteroide, PuertoAsteroides } from "@killalab/dominio";
import { UNIDAD_ASTRONOMICA_KM } from "@killalab/dominio";
import { apuntaAFalsa, jpl, nasa } from "./cliente-http";

export interface RespuestaCAD {
  fields: string[];
  data: string[][];
}

/** CAD devuelve una matriz de strings más una lista de nombres de columna. */
export function aAsteroides(r: RespuestaCAD): Asteroide[] {
  const col = (campo: string) => r.fields.indexOf(campo);
  return r.data.map((fila) => ({
    designacion: fila[col("des")] ?? "sin designación",
    fecha: fila[col("cd")] ?? "",
    distanciaKm: Number(fila[col("dist")] ?? 0) * UNIDAD_ASTRONOMICA_KM,
    velocidadKmS: Number(fila[col("v_rel")] ?? 0),
    diametroMinM: null,
    diametroMaxM: null,
  }));
}

interface ObjetoNeoWs {
  name?: string;
  estimated_diameter?: { meters?: { estimated_diameter_min?: number; estimated_diameter_max?: number } };
  close_approach_data?: Array<{
    close_approach_date_full?: string;
    miss_distance?: { kilometers?: string };
    relative_velocity?: { kilometers_per_second?: string };
  }>;
}

export const asteroidesNasa = (): PuertoAsteroides => ({
  simulado: apuntaAFalsa(),

  async proximasAproximaciones(limite) {
    const crudo = (await jpl("/cad.api", {
      "dist-max": "0.05",
      "date-min": "now",
      sort: "date",
      limit: String(limite),
    })) as RespuestaCAD;
    return aAsteroides(crudo);
  },

  async cercanosDeHoy() {
    const hoy = new Date().toISOString().slice(0, 10);
    const crudo = (await nasa("/neo/rest/v1/feed", { start_date: hoy, end_date: hoy })) as {
      near_earth_objects?: Record<string, ObjetoNeoWs[]>;
    };
    return (crudo.near_earth_objects?.[hoy] ?? []).map((o) => {
      const ap = o.close_approach_data?.[0];
      return {
        designacion: o.name ?? "sin designación",
        fecha: ap?.close_approach_date_full ?? hoy,
        distanciaKm: Number(ap?.miss_distance?.kilometers ?? 0),
        velocidadKmS: Number(ap?.relative_velocity?.kilometers_per_second ?? 0),
        diametroMinM: o.estimated_diameter?.meters?.estimated_diameter_min ?? null,
        diametroMaxM: o.estimated_diameter?.meters?.estimated_diameter_max ?? null,
      };
    });
  },
});
