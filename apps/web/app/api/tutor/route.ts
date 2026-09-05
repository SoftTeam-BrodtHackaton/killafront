import { NextResponse } from "next/server";
import { killalab } from "@killalab/composicion";

/**
 * El tutor: responde preguntas del estudiante sobre la lección que tiene abierta.
 *
 * Esta es **la única parte del proyecto que llama a un modelo en tiempo de
 * ejecución**, y por eso está aislada aquí y no en el hexágono. Todo lo demás
 * —quiz, tarjetas, narración, fichas— se generó antes y está en el repo, así que
 * la lección entera sigue funcionando aunque esto no responda. El chat es un
 * añadido, nunca un requisito.
 *
 * Dos cosas que lo mantienen honesto:
 *
 * 1. **El tema entero va en el prompt** y la instrucción es no salirse de él. Un
 *    tutor que inventa datos en una plataforma escolar es peor que no tener tutor.
 *    Si la pregunta no se puede responder con la lección, tiene que decirlo.
 * 2. **Si Ollama no está, se devuelve 200 diciendo que no está.** No es un error
 *    de la aplicación: es información que la interfaz muestra tal cual, igual que
 *    hace con una fuente de la NASA caída.
 */

const OLLAMA = process.env.OLLAMA_BASE ?? "http://localhost:11434";
const MODELO = process.env.OLLAMA_MODELO_TUTOR ?? "qwen2.5:7b";

const SISTEMA = `Eres un tutor de ciencia espacial para estudiantes de colegio en Perú.

REGLA ABSOLUTA: solo puedes usar la LECCIÓN que te dan. No agregues datos, cifras,
fechas ni hechos que no estén ahí. Si el estudiante pregunta algo que la lección no
cubre, dilo con naturalidad: "eso no lo vemos en esta lección" y ofrece lo que sí
puedes explicar de ella.

Responde en español de Perú, en dos o tres frases, directo y sin adornos. Trata al
estudiante como alguien inteligente que todavía no sabe del tema. Nada de listas ni
de markdown: es una conversación.`;

export async function POST(req: Request) {
  const { slug, pregunta } = (await req.json()) as { slug?: string; pregunta?: string };

  const tema = slug ? killalab.mision(slug) : null;
  if (!tema || !pregunta?.trim()) {
    return NextResponse.json({ estado: "peticion-invalida" as const }, { status: 400 });
  }

  const narracion = killalab.narracion(slug!);

  const prompt = `LECCIÓN (esto es todo lo que sabes):
${JSON.stringify({ titulo: tema.titulo, resumen: tema.resumen, conceptos: tema.conceptos }, null, 2)}
${narracion ? `\nEXPLICACIÓN AMPLIADA:\n${narracion.parrafos.join("\n\n")}` : ""}

PREGUNTA DEL ESTUDIANTE:
${pregunta.trim().slice(0, 500)}`;

  try {
    const r = await fetch(`${OLLAMA}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(120_000),
      body: JSON.stringify({
        model: MODELO,
        prompt,
        system: SISTEMA,
        stream: false,
        options: { temperature: 0.3, num_ctx: 4096, num_predict: 220 },
      }),
    });

    if (!r.ok) throw new Error(`ollama ${r.status}`);
    const { response } = (await r.json()) as { response?: string };
    const texto = response?.trim();
    if (!texto) throw new Error("respuesta vacía");

    return NextResponse.json({ estado: "ok" as const, respuesta: texto, modelo: MODELO });
  } catch {
    // No es un fallo de esta ruta: es que el tutor no está disponible ahora.
    return NextResponse.json({ estado: "sin-tutor" as const });
  }
}
