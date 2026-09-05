const NASA_BASE = "https://api.nasa.gov";
const JPL_BASE = "https://ssd-api.jpl.nasa.gov";

export class ErrorFuente extends Error {
  constructor(public fuente: string, public estado: number | "red", mensaje: string) {
    super(mensaje);
    this.name = "ErrorFuente";
  }
}

async function pedir(url: string, fuente: string, timeoutMs = 6000): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { accept: "application/json" } });
    if (!r.ok) throw new ErrorFuente(fuente, r.status, `${fuente} respondió ${r.status}`);
    return await r.json();
  } catch (e) {
    if (e instanceof ErrorFuente) throw e;
    throw new ErrorFuente(fuente, "red", `${fuente} inalcanzable: ${(e as Error).message}`);
  } finally {
    clearTimeout(t);
  }
}

export function nasa(ruta: string, params: Record<string, string> = {}) {
  const u = new URL(ruta, NASA_BASE);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  u.searchParams.set("api_key", process.env.NASA_API_KEY ?? "DEMO_KEY");
  return pedir(u.toString(), "NASA");
}

export function jpl(ruta: string, params: Record<string, string> = {}) {
  const u = new URL(ruta, JPL_BASE);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return pedir(u.toString(), "JPL");
}

/** Rango de días hacia atrás en formato YYYY-MM-DD. */
export function rango(dias: number): { inicio: string; fin: string } {
  const fin = new Date();
  const inicio = new Date(fin.getTime() - dias * 86400000);
  const f = (d: Date) => d.toISOString().slice(0, 10);
  return { inicio: f(inicio), fin: f(fin) };
}
