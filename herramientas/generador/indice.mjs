/**
 * Reescribe `packages/content/src/derivados.ts` con un import por archivo.
 *
 * Hace falta un índice explícito y no un glob porque el bundler tiene que ver
 * cada import literal para meter el JSON en el build. Un `readdir` en tiempo de
 * ejecución no funcionaría: en producción no hay sistema de archivos que leer.
 *
 * Se regenera cada vez que el taller escribe algo, así que nadie tiene que
 * acordarse de añadir la línea a mano.
 */

import { readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const CONTENIDO = join(AQUI, "..", "..", "packages", "content", "src");

const CARPETAS = ["fichas", "secuencias", "quiz", "flashcards", "narraciones", "guiones", "registros"];

const enCamello = (slug) =>
  slug.split("-").map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1))).join("");

export async function escribirIndice() {
  const lineas = [
    "/**",
    " * Contenido derivado: generado en el taller (`herramientas/generador`) y",
    " * versionado en el repo.",
    " *",
    " * La web NUNCA llama a un modelo en tiempo de ejecución. Lo que hay aquí ya se",
    " * generó, se revisó y se commiteó, así que los niveles 0 y 1 siguen abriendo en",
    " * un aula sin internet y la demo no depende de que Ollama esté levantado.",
    " *",
    " * ESTE ARCHIVO SE GENERA. No editarlo a mano: lo reescribe `node cli.mjs indice`.",
    " */",
    "",
  ];
  const porCarpeta = {};

  for (const carpeta of CARPETAS) {
    let archivos = [];
    try {
      archivos = (await readdir(join(CONTENIDO, "derivados", carpeta)))
        .filter((f) => f.endsWith(".json"))
        .sort();
    } catch {
      // La carpeta no existe todavía: ese formato aún no se ha generado.
    }

    porCarpeta[carpeta] = archivos.map((f) => {
      const slug = f.slice(0, -5);
      const variable = carpeta.slice(0, 3) + enCamello(slug)[0].toUpperCase() + enCamello(slug).slice(1);
      lineas.push(`import ${variable} from "./derivados/${carpeta}/${f}";`);
      return variable;
    });
  }

  lineas.push("");
  for (const [carpeta, vars] of Object.entries(porCarpeta)) {
    lineas.push(`export const ${carpeta.toUpperCase()}: unknown[] = [${vars.join(", ")}];`);
  }
  lineas.push("");

  await writeFile(join(CONTENIDO, "derivados.ts"), lineas.join("\n"), "utf8");
  return Object.fromEntries(Object.entries(porCarpeta).map(([k, v]) => [k, v.length]));
}
