#!/usr/bin/env node
/**
 * El taller. Lee los temas de `packages/content`, genera derivados y los escribe
 * como JSON versionado en `packages/content/src/derivados/`.
 *
 * NO entra en el hexágono: no importa nada de `dominio` ni de `adaptadores`, y
 * nada de la web lo importa a él. Para la aplicación, un derivado es contenido
 * más, servido por el mismo catálogo de siempre.
 *
 *   node cli.mjs derivar            fichas y secuencias (sin modelo, instantáneo)
 *   node cli.mjs quiz [slug]        quiz de opción múltiple con qwen2.5
 *   node cli.mjs flashcards [slug]  tarjetas de respuesta escrita con qwen2.5
 *   node cli.mjs guion [slug]       guion de podcast con qwen2.5
 *   node cli.mjs registros [slug]   la misma idea en tres registros con gemma3
 *   node cli.mjs indice             reescribe el índice de derivados
 *   node cli.mjs todo [slug]        todo lo anterior
 *
 * Sin slug, procesa todos los temas. Un tema por llamada, siempre.
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MODELOS, estaVivo, generar, generarValidado } from "./ollama.mjs";
import { Flashcards, Guion, Quiz, Registros, olfatearInventos } from "./esquemas.mjs";
import { promptFlashcards, promptGuion, promptQuiz, promptRegistros, SISTEMA } from "./prompts.mjs";
import { fichaDeRepaso, lineaDeTiempo } from "./derivar.mjs";
import { escribirIndice } from "./indice.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const CONTENIDO = join(AQUI, "..", "..", "packages", "content", "src");
const DESTINO = join(CONTENIDO, "derivados");

async function cargarTemas() {
  const niveles = await readdir(CONTENIDO, { withFileTypes: true });
  const temas = [];

  for (const d of niveles) {
    if (!d.isDirectory() || !d.name.startsWith("nivel-")) continue;
    for (const f of await readdir(join(CONTENIDO, d.name))) {
      if (!f.endsWith(".json")) continue;
      temas.push(JSON.parse(await readFile(join(CONTENIDO, d.name, f), "utf8")));
    }
  }
  return temas.sort((a, b) => a.nivel - b.nivel || a.slug.localeCompare(b.slug));
}

async function escribir(carpeta, slug, datos) {
  const dir = join(DESTINO, carpeta);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${slug}.json`), JSON.stringify(datos, null, 2) + "\n", "utf8");
  return join("derivados", carpeta, `${slug}.json`);
}

/** Sello de origen. Sin esto, dentro de un mes nadie sabe qué salió de un modelo. */
const sellar = (datos, modelo) => ({
  ...datos,
  generadoPor: modelo,
  generadoEl: new Date().toISOString(),
  revisadoPor: null,
  revisadoEl: null,
});

const TAREAS = {
  quiz: {
    carpeta: "quiz",
    modelos: MODELOS.estructurado,
    esquema: Quiz,
    prompt: promptQuiz,
    // Un quiz mal formado es peor que no tenerlo: se corrige el prompt, no la salida.
    temperatura: 0.3,
  },
  flashcards: {
    carpeta: "flashcards",
    modelos: MODELOS.estructurado,
    esquema: Flashcards,
    prompt: promptFlashcards,
    // Las claves son el criterio de corrección: aquí no se quiere creatividad.
    temperatura: 0.25,
  },
  guion: {
    carpeta: "guiones",
    modelos: MODELOS.estructurado,
    esquema: Guion,
    prompt: promptGuion,
    // Un poco más de aire: es conversación, no una tabla.
    temperatura: 0.5,
  },
  registros: {
    carpeta: "registros",
    modelos: MODELOS.rapido,
    esquema: Registros,
    prompt: promptRegistros,
    temperatura: 0.4,
  },
};

async function correrTarea(nombre, tema) {
  const t = TAREAS[nombre];
  const inicio = Date.now();
  process.stdout.write(`  ${nombre.padEnd(10)} ${tema.slug.padEnd(20)}
`);

  try {
    const { datos, modelo } = await generarValidado({
      esquema: t.esquema,
      modelos: t.modelos,
      sistema: SISTEMA,
      prompt: t.prompt(tema),
      temperatura: t.temperatura,
    });

    const sospechas = olfatearInventos(JSON.stringify(datos));
    const ruta = await escribir(t.carpeta, tema.slug, sellar(datos, modelo));

    const seg = ((Date.now() - inicio) / 1000).toFixed(0);
    console.log(`  · ok con ${modelo} en ${seg}s → ${ruta}`);
    if (sospechas.length) {
      console.log(`             ⚠ revisar a mano: posible dato inventado (${sospechas.length} coincidencias)`);
    }
    return true;
  } catch (e) {
    console.log(`  · FALLÓ: ${String(e.message).slice(0, 120)}`);
    return false;
  }
}

async function main() {
  const [tarea = "derivar", filtro] = process.argv.slice(2);

  if (tarea === "indice") {
    console.log("Índice de derivados:", await escribirIndice());
    return;
  }

  const todos = await cargarTemas();
  const temas = filtro ? todos.filter((t) => t.slug === filtro) : todos;

  if (temas.length === 0) {
    console.error(`No hay ningún tema con slug "${filtro}". Hay: ${todos.map((t) => t.slug).join(", ")}`);
    process.exit(1);
  }

  // --- Lo que no necesita modelo ---
  if (tarea === "derivar" || tarea === "todo") {
    console.log(`\nDerivados sin modelo (${temas.length} temas)`);
    for (const tema of temas) {
      await escribir("fichas", tema.slug, fichaDeRepaso(tema));
      await escribir("secuencias", tema.slug, lineaDeTiempo(tema));
      console.log(`  ficha + secuencia  ${tema.slug}`);
    }
    console.log(`  índice → packages/content/src/derivados.ts`, await escribirIndice());
    if (tarea === "derivar") return;
  }

  // --- Lo que sí ---
  const disponibles = await estaVivo();
  if (!disponibles) {
    console.error("\nOllama no responde en :11434. Levántalo con `ollama serve`.");
    console.error("Los derivados sin modelo (`node cli.mjs derivar`) sí funcionan sin él.");
    process.exit(1);
  }

  // Basta con que esté uno: la cadena baja sola si el primero no arranca.
  const necesarios = [...new Set(Object.values(TAREAS).flatMap((t) => t.modelos))];
  const hayAlguno = necesarios.some((m) => disponibles.includes(m));
  if (!hayAlguno) {
    console.error(`
No hay ningún modelo instalado. Hace falta al menos uno de: ${necesarios.join(", ")}`);
    console.error(`Instálalo con: ollama pull ${necesarios[necesarios.length - 1]}`);
    process.exit(1);
  }

  const cuales = tarea === "todo" ? Object.keys(TAREAS) : [tarea];
  for (const c of cuales) {
    if (!TAREAS[c]) {
      console.error(`Tarea desconocida: "${c}". Hay: derivar, ${Object.keys(TAREAS).join(", ")}, todo`);
      process.exit(1);
    }
  }

  console.log(`\nGenerando con modelo (${temas.length} temas × ${cuales.length} tareas)`);
  console.log("Un tema por llamada: los modelos son pequeños y la ventana se llena.\n");

  let ok = 0;
  let mal = 0;
  for (const tema of temas) {
    for (const c of cuales) {
      (await correrTarea(c, tema)) ? ok++ : mal++;
    }
  }

  console.log(`\n${ok} generados, ${mal} fallidos.`);
  console.log("Revisa la salida a mano antes de commitear: el sello `revisadoPor` sigue en null.");
  if (mal > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
