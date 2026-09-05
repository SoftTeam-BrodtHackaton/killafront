/** Tokens en TS para consumo desde JS (charts, Expo, generación de OG images).
 *  El origen de verdad para la web es tokens.css; esto lo espeja. */

export const colores = {
  indigo: "#2D2A6E",
  indigoSuave: "#4A46A8",
  ambar: "#F0A202",
  ambarSuave: "#FFC53D",
  turquesa: "#0E9AA7",
  turquesaSuave: "#3FBFCB",
  bg: "#FFFFFF",
  bgElevado: "#F3F4F8",
  borde: "#DFE1EA",
  texto: "#14142B",
  textoSec: "#5A5C78",
  ok: "#12855F",
  warn: "#D97706",
  error: "#C0392B",
} as const;

export const coloresOscuro = {
  ...colores,
  indigo: "#A5A0F0",
  indigoSuave: "#6F6ACB",
  ambar: "#FFB627",
  turquesa: "#45C7D4",
  bg: "#101024",
  bgElevado: "#1A1A38",
  borde: "#2C2C52",
  texto: "#EDEDF7",
  textoSec: "#A0A2C0",
} as const;

/** Cada color tiene un trabajo asignado. No se mezclan en gradientes. */
export const rolDeColor = {
  estructura: "indigo",
  accion: "ambar",
  dato: "turquesa",
} as const;

export const radios = { s: 4, m: 10, l: 20 } as const;

export type Tema = "claro" | "oscuro";
