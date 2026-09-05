/**
 * Los tokens se consumen como CSS (`@killalab/tokens/tokens.css`). Este módulo
 * expone lo poco que el TypeScript necesita saber del sistema: nada de colores
 * sueltos, solo lo que la UI tiene que razonar en tiempo de ejecución.
 */

export type Tema = "claro" | "oscuro";

export const CLAVE_TEMA = "killa-tema";

/** Espaciado en píxeles. Todo el sistema es múltiplo de 8 y la trama del papel lo dibuja. */
export const ESPACIADO = { e1: 8, e2: 16, e3: 24, e4: 40, e5: 64, e6: 96, e7: 144 } as const;

/** Los tres colores y su trabajo. Documentado en código para que no se use al revés. */
export const ROLES_DE_COLOR = {
  indigo: "estructura: marca, reglas activas, titulares de sección",
  ambar: "acción: solo donde el usuario puede hacer algo",
  turquesa: "dato: cifras, escalas y enlaces a la fuente",
} as const;
