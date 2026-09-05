import type { Llamarada, PuertoClimaEspacial } from "@killalab/dominio";
import { apuntaAFalsa, nasa, rangoDeDias } from "./cliente-http";

interface FilaFLR {
  flrID?: string;
  classType?: string;
  beginTime?: string;
  peakTime?: string;
  activeRegionNum?: number | null;
  link?: string;
}

/** Traduce la forma cruda de DONKI al modelo. Lo que no viene se deja null: no se inventa. */
export function aLlamarada(f: FilaFLR): Llamarada | null {
  if (!f.flrID || !f.beginTime) return null;
  return {
    id: f.flrID,
    claseSolar: f.classType ?? null,
    inicio: f.beginTime,
    pico: f.peakTime ?? null,
    regionActiva: f.activeRegionNum ?? null,
    enlace: f.link ?? null,
  };
}

/** Adaptador DONKI. Lanza si la fuente falla; la degradación es del caso de uso. */
export const climaEspacialNasa = (): PuertoClimaEspacial => ({
  simulado: apuntaAFalsa(),

  async llamaradasRecientes(dias) {
    const { inicio, fin } = rangoDeDias(dias);
    const crudo = (await nasa("/DONKI/FLR", { startDate: inicio, endDate: fin })) as FilaFLR[];
    return (Array.isArray(crudo) ? crudo : [])
      .map(aLlamarada)
      .filter((x): x is Llamarada => x !== null);
  },
});
