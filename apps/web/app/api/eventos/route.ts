import { NextResponse } from "next/server";
import { ultimaLlamarada, proximasAproximaciones } from "@killalab/api";

/** BFF: el cliente nunca ve la NASA_API_KEY ni el formato crudo de la NASA.
 *  Devuelve siempre 200 con procedencia declarada — el front decide cómo mostrarlo. */
export async function GET(req: Request) {
  const tipo = new URL(req.url).searchParams.get("tipo") ?? "llamarada";

  const dato = tipo === "asteroides" ? await proximasAproximaciones() : await ultimaLlamarada();

  return NextResponse.json(dato, {
    headers: { "cache-control": "public, s-maxage=900, stale-while-revalidate=86400" },
  });
}
