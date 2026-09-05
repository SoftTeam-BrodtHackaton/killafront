import type { Grupo, Progreso, PuertoDirectorio, PuertoProgreso } from "@killalab/dominio";

/**
 * El backend propio de KillaLab vive en su repo aparte. Aquí solo está el cliente
 * que habla con él, detrás de los puertos del dominio.
 *
 * Se activa con `KILLALAB_BACKEND_URL`. Mientras esa variable no exista, la raíz de
 * composición enchufa los dobles locales de `sin-backend.ts` y la web funciona igual:
 * ninguna pantalla depende de que el servicio esté en pie.
 *
 * Cuando el contrato del backend se cierre, lo único que cambia es este archivo.
 */

const BASE = process.env.KILLALAB_BACKEND_URL ?? "";

export const hayBackend = () => BASE !== "";

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const r = await fetch(new URL(ruta, BASE), {
      ...init,
      signal: ctrl.signal,
      headers: { accept: "application/json", "content-type": "application/json", ...init?.headers },
    });
    if (!r.ok) throw new Error(`el backend de KillaLab respondió ${r.status} en ${ruta}`);
    return (await r.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

export const progresoHttp = (): PuertoProgreso => ({
  disponible: true,
  progresoDe: (estudianteId) => pedir<Progreso[]>(`/progreso/${encodeURIComponent(estudianteId)}`),
  registrarPaso: (estudianteId, temaSlug, pasoId) =>
    pedir<Progreso>(`/progreso/${encodeURIComponent(estudianteId)}/pasos`, {
      method: "POST",
      body: JSON.stringify({ temaSlug, pasoId }),
    }),
});

export const directorioHttp = (): PuertoDirectorio => ({
  disponible: true,
  grupos: () => pedir<Grupo[]>("/grupos"),
});
