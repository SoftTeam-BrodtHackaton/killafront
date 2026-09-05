/**
 * Cliente de Ollama. Cero dependencias: es `fetch` contra localhost.
 *
 * Tres disciplinas que impone el tamaño de los modelos, y no son negociables:
 *
 *   1. Un tema por llamada. Nunca "procesa los seis": la ventana se llena y la
 *      calidad se cae en picado.
 *   2. Temperatura baja y el tema entero pegado en el prompt. El modelo no
 *      recuerda nada del proyecto; todo lo que necesita va en la llamada.
 *   3. `format: "json"` cuando se espera JSON. Es la diferencia entre un pipeline
 *      que funciona y uno que pelea con markdown mal cerrado.
 */

const BASE = process.env.OLLAMA_BASE ?? "http://localhost:11434";

/**
 * Qué modelo hace qué, y con qué respaldo.
 *
 * `qwen2.5:7b` sigue esquemas bastante mejor, así que es el primero para todo lo
 * que deba salir en JSON estricto. Pero un 7B no entra en memoria en cualquier
 * máquina: en la de desarrollo Ollama devolvía 500 al cargarlo. Por eso cada
 * trabajo es una **lista** y no un nombre: si el primero no arranca se baja al
 * siguiente y el pipeline sigue, en vez de dejar al equipo sin generar nada.
 *
 * El modelo que acabó escribiendo queda sellado en el archivo de salida, así que
 * un derivado hecho con el de respaldo se distingue en el diff.
 */
export const MODELOS = {
  estructurado: ["qwen2.5:7b", "gemma3:4b"],
  rapido: ["gemma3:4b", "qwen2.5:7b"],
};

/** Errores de Ollama que significan "este modelo no cabe aquí", no "el prompt está mal". */
const NO_ARRANCA = /out-of-memory|no longer running|failed to load|unable to load|model requires more system memory/i;

export async function estaVivo() {
  try {
    const r = await fetch(`${BASE}/api/tags`, { signal: AbortSignal.timeout(4000) });
    if (!r.ok) return null;
    const { models = [] } = await r.json();
    return models.map((m) => m.name);
  } catch {
    return null;
  }
}

/**
 * Ventana de contexto. 4096 y no más: con 8192 el 7B no entraba en memoria en
 * una máquina de desarrollo normal y Ollama devolvía 500 al arrancar el modelo.
 * Un tema de `packages/content` ocupa menos de 1500 tokens, así que sobra.
 */
const VENTANA = Number(process.env.OLLAMA_NUM_CTX ?? 4096);

export async function generar({ modelo, prompt, sistema, json = false, temperatura = 0.3, timeoutMs = 300_000 }) {
  const r = await fetch(`${BASE}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      model: modelo,
      prompt,
      system: sistema,
      stream: false,
      ...(json ? { format: "json" } : {}),
      options: { temperature: temperatura, num_ctx: VENTANA },
    }),
  });

  if (!r.ok) throw new Error(`Ollama respondió ${r.status}: ${await r.text()}`);
  const { response } = await r.json();
  return response;
}

/**
 * Genera y valida contra un esquema zod. Un reintento y se rinde.
 *
 * No se "arregla a mano en silencio" una salida inválida: si el modelo no
 * respeta el esquema dos veces seguidas, el problema es el prompt y hay que
 * verlo, no taparlo.
 */
export async function generarValidado({ esquema, modelos, intentos = 2, ...opciones }) {
  const cadena = Array.isArray(modelos) ? modelos : [modelos];
  let ultimoError = null;

  for (const modelo of cadena) {
    for (let i = 0; i < intentos; i++) {
      let crudo;
      try {
        crudo = await generar({ ...opciones, modelo, json: true });
      } catch (e) {
        ultimoError = e;
        if (NO_ARRANCA.test(String(e.message))) {
          console.warn(`  · ${modelo} no arranca en esta máquina, bajando al siguiente`);
          break; // no tiene sentido reintentar: el modelo no cabe
        }
        console.warn(`  · ${modelo} falló: ${String(e.message).slice(0, 90)}`);
        continue;
      }

      try {
        return { datos: esquema.parse(JSON.parse(crudo)), modelo };
      } catch (e) {
        ultimoError = e;
        const detalle = e?.issues ? JSON.stringify(e.issues.slice(0, 2)) : String(e).slice(0, 160);
        console.warn(`  · ${modelo}, intento ${i + 1}: salida inválida ${detalle}`);
      }
    }
  }

  throw new Error(`ningún modelo dio salida válida (${cadena.join(", ")}): ${ultimoError}`);
}
