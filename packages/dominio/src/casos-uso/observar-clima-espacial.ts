import type { Dato, Llamarada } from "../modelo";
import type { PuertoAlmacenTemporal, PuertoClimaEspacial, PuertoRespaldo, PuertoReloj } from "../puertos";

const CLAVE = "donki:flr:ultima";

export interface DependenciasClimaEspacial {
  clima: PuertoClimaEspacial;
  almacen: PuertoAlmacenTemporal;
  respaldo: PuertoRespaldo;
  reloj: PuertoReloj;
}

/**
 * La promesa central del producto, escrita una sola vez y aquí:
 *
 *   vivo → caché fresco → caché vencido → respaldo en disco
 *
 * Nunca lanza y nunca devuelve vacío. Si DONKI se cae en plena demo, la pantalla
 * sigue mostrando el último evento conocido con su fecha y su etiqueta, en vez de
 * un error o un hueco. Que esto sea política de dominio y no un try/catch dentro
 * del cliente HTTP es lo que hace que se pueda probar sin red.
 */
export function observarUltimaLlamarada(d: DependenciasClimaEspacial) {
  return async function ultimaLlamarada(dias = 30): Promise<Dato<Llamarada>> {
    if (d.almacen.esFresco(CLAVE)) return d.almacen.leer<Llamarada>(CLAVE)!;

    try {
      const recientes = await d.clima.llamaradasRecientes(dias);
      const ultima = [...recientes].sort((a, b) => Date.parse(b.inicio) - Date.parse(a.inicio))[0];
      if (!ultima) throw new Error("la fuente no devolvió eventos en el rango pedido");

      return d.almacen.guardar<Llamarada>(CLAVE, {
        valor: ultima,
        fuente: "DONKI",
        capturado: d.reloj.ahora().toISOString(),
        procedencia: d.clima.simulado ? "simulado" : "vivo",
      });
    } catch {
      const viejo = d.almacen.leer<Llamarada>(CLAVE);
      if (viejo) return viejo;

      const guardado = d.respaldo.llamarada();
      if (!guardado) throw new Error("sin respaldo de llamaradas: revisa @killalab/adaptadores");
      return { ...guardado, fuente: "DONKI", procedencia: "respaldo" };
    }
  };
}
