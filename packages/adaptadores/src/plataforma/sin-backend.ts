import type { Grupo, Progreso, PuertoDirectorio, PuertoProgreso } from "@killalab/dominio";

/**
 * Dobles locales que cumplen los mismos puertos mientras el backend no esté en pie.
 * Declaran `disponible: false` para que la UI lo diga en pantalla en vez de fingir
 * que guardó algo.
 *
 * El progreso vive solo en el proceso: se pierde al reiniciar, y está bien. Sirve
 * para desarrollar la interacción de la misión sin esperar al backend.
 */

export function progresoEfimero(): PuertoProgreso {
  const memoria = new Map<string, Map<string, Progreso>>();

  return {
    disponible: false,

    async progresoDe(estudianteId) {
      return [...(memoria.get(estudianteId)?.values() ?? [])];
    },

    async registrarPaso(estudianteId, temaSlug, pasoId) {
      const del = memoria.get(estudianteId) ?? new Map<string, Progreso>();
      const previo = del.get(temaSlug);
      const pasosResueltos = [...new Set([...(previo?.pasosResueltos ?? []), pasoId])];
      const actualizado: Progreso = {
        temaSlug,
        estado: "en-curso",
        pasosResueltos,
        actualizado: new Date().toISOString(),
      };
      del.set(temaSlug, actualizado);
      memoria.set(estudianteId, del);
      return actualizado;
    },
  };
}

/**
 * El directorio de grupos está vacío a propósito. Las entradas tienen que ser
 * grupos reales con contacto verificado; sembrarlo con nombres inventados sería
 * exactamente lo contrario de lo que promete el producto. La pantalla muestra un
 * vacío honesto con una vía para sumarse.
 */
export const directorioVacio = (): PuertoDirectorio => ({
  disponible: false,
  async grupos(): Promise<Grupo[]> {
    return [];
  },
});
