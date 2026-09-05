import { NextResponse } from "next/server";
import { killalab } from "@killalab/composicion";

/**
 * BFF: el cliente nunca ve la NASA_API_KEY ni el formato crudo de la NASA.
 *
 * Devuelve siempre 200 con la procedencia declarada. Que la fuente esté caída no
 * es un error de esta ruta: es información que el front tiene que mostrar, y por
 * eso viaja en el cuerpo y no en el código de estado.
 */
export async function GET(req: Request) {
  const tipo = new URL(req.url).searchParams.get("tipo") ?? "llamarada";

  const dato =
    tipo === "asteroides"
      ? await killalab.proximasAproximaciones()
      : await killalab.ultimaLlamarada();

  return NextResponse.json(dato, {
    headers: { "cache-control": "public, s-maxage=900, stale-while-revalidate=86400" },
  });
}
