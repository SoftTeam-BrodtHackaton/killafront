/** Fake API de KillaLab — cero dependencias, node:http.
 *
 *  Imita las respuestas crudas de NASA DONKI, NeoWs y JPL CAD para que el frontend
 *  se desarrolle sin llave, sin cuota y sin internet. El cliente real de
 *  packages/api no se modifica: solo se le apunta a otra base con una variable de
 *  entorno, así el camino de parseo que se prueba en dev es el mismo de producción.
 *
 *  Simulación de fallos (para probar la degradación del héroe):
 *    ?fallo=503      devuelve ese código
 *    ?fallo=vacio    responde 200 con cero eventos
 *    ?lento=2500     retrasa la respuesta ese número de ms
 */

import { createServer } from "node:http";
import { llamaradas, feedNeoWs, cad, eyecciones, tormentas } from "./generador.js";

const PUERTO = Number(process.env.FAKE_API_PUERTO ?? 4000);

const json = (res, cuerpo, estado = 200) => {
  const texto = JSON.stringify(cuerpo, null, 2);
  res.writeHead(estado, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "x-killalab-fake": "1",
    "cache-control": "no-store",
  });
  res.end(texto);
};

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const RUTAS = {
  "/DONKI/FLR": (q) => (q.get("fallo") === "vacio" ? [] : llamaradas(12)),
  "/DONKI/CME": (q) => (q.get("fallo") === "vacio" ? [] : eyecciones(6)),
  "/DONKI/GST": (q) => (q.get("fallo") === "vacio" ? [] : tormentas(4)),
  "/neo/rest/v1/feed": (q) => feedNeoWs(q.get("start_date") ?? new Date().toISOString().slice(0, 10)),
  "/cad.api": (q) =>
    q.get("fallo") === "vacio"
      ? { signature: { source: "KillaLab fake API" }, count: "0", fields: [], data: [] }
      : cad(Number(q.get("limit") ?? 8)),
  "/salud": () => ({
    estado: "ok",
    servicio: "killalab-fake-api",
    hora: new Date().toISOString(),
    // La semilla es el día: los datos son estables dentro de una jornada.
    semilla: new Date().toISOString().slice(0, 10),
  }),
};

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PUERTO}`);
  const q = url.searchParams;

  const lento = Number(q.get("lento") ?? 0);
  if (lento > 0) await espera(Math.min(lento, 10_000));

  const fallo = q.get("fallo");
  if (fallo && fallo !== "vacio") {
    return json(res, { error: `fallo simulado ${fallo}`, fuente: "KillaLab fake API" }, Number(fallo) || 500);
  }

  const handler = RUTAS[url.pathname];
  if (!handler) {
    return json(res, { error: "ruta no encontrada", rutas: Object.keys(RUTAS) }, 404);
  }

  console.log(`[fake-api] ${req.method} ${url.pathname}${url.search}`);
  json(res, handler(q));
});

servidor.listen(PUERTO, () => {
  console.log(`[fake-api] escuchando en http://localhost:${PUERTO}`);
  console.log(`[fake-api] rutas: ${Object.keys(RUTAS).join(" · ")}`);
});
