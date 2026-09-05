import type { Asteroide, Dato } from "../modelo";
import { porCercania } from "../modelo";
import type { PuertoAlmacenTemporal, PuertoAsteroides, PuertoRespaldo, PuertoReloj } from "../puertos";

const CLAVE = "jpl:cad:proximas";

export interface DependenciasAsteroides {
  asteroides: PuertoAsteroides;
  almacen: PuertoAlmacenTemporal;
  respaldo: PuertoRespaldo;
  reloj: PuertoReloj;
}

/** Misma cadena de degradación que el clima espacial. La política se escribe una vez. */
export function vigilarAproximaciones(d: DependenciasAsteroides) {
  return async function proximasAproximaciones(limite = 5): Promise<Dato<Asteroide[]>> {
    if (d.almacen.esFresco(CLAVE)) return d.almacen.leer<Asteroide[]>(CLAVE)!;

    try {
      const lista = await d.asteroides.proximasAproximaciones(limite);
      if (!lista.length) throw new Error("la fuente no devolvió aproximaciones");

      return d.almacen.guardar<Asteroide[]>(CLAVE, {
        valor: [...lista].sort(porCercania),
        fuente: "JPL CAD",
        capturado: d.reloj.ahora().toISOString(),
        procedencia: d.asteroides.simulado ? "simulado" : "vivo",
      });
    } catch {
      const viejo = d.almacen.leer<Asteroide[]>(CLAVE);
      if (viejo) return viejo;

      const guardado = d.respaldo.aproximaciones();
      if (!guardado) throw new Error("sin respaldo de aproximaciones: revisa @killalab/adaptadores");
      return { ...guardado, fuente: "JPL CAD", procedencia: "respaldo" };
    }
  };
}
