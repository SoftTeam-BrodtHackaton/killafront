import type { Dato } from "./dato";

export interface Asteroide {
  designacion: string;
  /** Fecha de máxima aproximación, tal como la reporta la fuente. */
  fecha: string;
  distanciaKm: number;
  velocidadKmS: number;
  diametroMinM: number | null;
  diametroMaxM: number | null;
}

/** Distancia Tierra–Luna. La unidad con la que un escolar puede pensar el espacio. */
export const DISTANCIA_LUNAR_KM = 384_400;
export const UNIDAD_ASTRONOMICA_KM = 149_597_870.7;

/** 1 537 600 km → 4 distancias lunares. La cifra cruda no dice nada; esta sí. */
export const distanciaEnLunas = (km: number) => km / DISTANCIA_LUNAR_KM;

/** Diámetro medio estimado en metros, o null si la fuente no lo reporta. */
export function diametroMedioM(a: Asteroide): number | null {
  if (a.diametroMinM === null || a.diametroMaxM === null) return null;
  return (a.diametroMinM + a.diametroMaxM) / 2;
}

/** Orden de la lista: lo más cercano primero. Es lo que interesa en defensa planetaria. */
export const porCercania = (a: Asteroide, b: Asteroide) => a.distanciaKm - b.distanciaKm;

export type DatoAsteroides = Dato<Asteroide[]>;
