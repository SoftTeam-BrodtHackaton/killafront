import type { PuertoRespaldo } from "@killalab/dominio";
import { aLlamarada } from "./clima-espacial";
import { aAsteroides, type RespuestaCAD } from "./asteroides";
import flr from "./respaldos/donki-flr.json";
import cad from "./respaldos/jpl-cad.json";

/**
 * Último recurso. Se versiona con el repo: si la NASA se cae durante la demo, la
 * pantalla sigue enseñando un evento real y fechado en vez de un hueco.
 *
 * `_capturado` es la fecha en que se guardó la respuesta, y es la que se muestra.
 * Un respaldo sin fecha sería exactamente lo que este producto promete no hacer.
 */
export const respaldoEnDisco = (): PuertoRespaldo => ({
  llamarada() {
    const valor = aLlamarada(flr as Parameters<typeof aLlamarada>[0]);
    return valor ? { valor, capturado: (flr as { _capturado: string })._capturado } : null;
  },

  aproximaciones() {
    const valor = aAsteroides(cad as unknown as RespuestaCAD);
    return valor.length ? { valor, capturado: (cad as unknown as { _capturado: string })._capturado } : null;
  },
});
