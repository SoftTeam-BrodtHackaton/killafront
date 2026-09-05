import type { PuertoCatalogo, Tema } from "@killalab/dominio";
import { CRUDOS, FICHAS, FLASHCARDS, QUIZ, SECUENCIAS } from "@killalab/content";
import { z } from "zod";

/**
 * El contenido llega como JSON versionado en el repo, no de una base de datos.
 * Por eso los niveles 0 y 1 abren en un aula sin internet y sobreviven a una caída
 * de la NASA.
 *
 * La validación vive aquí y no en el dominio: parsear datos ajenos es trabajo de
 * adaptador. Se ejecuta al importar el módulo, así un JSON mal formado rompe el
 * build y no la demo.
 */

const NivelId = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);

const Paso = z.object({
  id: z.string(),
  enunciado: z.string().max(280),
  tipo: z.enum(["opcion", "numero", "orden", "observacion"]),
  opciones: z.array(z.string()).optional(),
  respuesta: z.union([z.string(), z.number(), z.array(z.string())]),
  pista: z.string().optional(),
  fuente: z.enum(["DONKI", "NeoWs", "JPL CAD", "propio"]).default("propio"),
});

const Concepto = z.object({
  id: z.string(),
  titulo: z.string(),
  explicacion: z.string(),
  conectaCon: z.array(z.string()).default([]),
});

const EsquemaTema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  nivel: NivelId,
  planeta: z.string(),
  titulo: z.string(),
  resumen: z.string().max(200),
  duracionMin: z.number().int().positive(),
  offline: z.boolean(),
  conceptos: z.array(Concepto).min(1),
  pasos: z.array(Paso).min(1),
});

const TEMAS: Tema[] = CRUDOS.map((t) => EsquemaTema.parse(t));

/* ------------------------------------------------------------------ */
/* Derivados                                                           */
/* ------------------------------------------------------------------ */

/**
 * El contenido derivado se valida igual que el original, y por el mismo motivo:
 * lo escribió un modelo local, así que hay más razones para desconfiar del
 * formato, no menos. Un derivado que no valida se descarta en silencio y el
 * formato de estudio correspondiente sencillamente no aparece: la lección sigue
 * abriendo con los formatos que sí llegaron bien.
 */

const Sello = {
  generadoPor: z.string().nullish(),
  generadoEl: z.string().nullish(),
  revisadoPor: z.string().nullish(),
  revisadoEl: z.string().nullish(),
};

const EsquemaFlashcards = z.object({
  slug: z.string(),
  tarjetas: z.array(
    z.object({
      id: z.string(),
      pregunta: z.string(),
      respuesta: z.string(),
      claves: z.array(z.string()).min(1),
      concepto: z.string(),
    }),
  ).min(1),
  ...Sello,
});

const EsquemaQuiz = z.object({
  slug: z.string(),
  preguntas: z.array(
    z.object({
      id: z.string(),
      enunciado: z.string(),
      opciones: z.array(z.string()).length(4),
      correcta: z.number().int().min(0).max(3),
      porque: z.string(),
      concepto: z.string(),
    }),
  ).min(1),
  ...Sello,
});

const EsquemaFicha = z.object({
  slug: z.string(),
  titulo: z.string(),
  idea: z.string(),
  puntos: z.array(z.object({ titulo: z.string(), explicacion: z.string() })),
  comprueba: z.array(z.object({ pregunta: z.string(), respuesta: z.string() })),
  duracionMin: z.number(),
});

const EsquemaSecuencia = z.object({
  slug: z.string(),
  pasos: z.array(
    z.object({
      posicion: z.number(),
      id: z.string(),
      titulo: z.string(),
      explicacion: z.string(),
      lleva: z.array(z.string()),
    }),
  ),
});

/** Valida lo que puede y descarta lo que no, sin tumbar el arranque. */
function porSlug<T extends { slug: string }>(crudos: unknown[], esquema: { parse(x: unknown): T }) {
  const mapa = new Map<string, T>();
  for (const c of crudos) {
    try {
      const v = esquema.parse(c);
      mapa.set(v.slug, v);
    } catch {
      // Derivado mal formado: no se publica ese formato para ese tema.
    }
  }
  return mapa;
}

const FICHAS_POR_SLUG = porSlug(FICHAS, EsquemaFicha);
const SECUENCIAS_POR_SLUG = porSlug(SECUENCIAS, EsquemaSecuencia);
const QUIZ_POR_SLUG = porSlug(QUIZ, EsquemaQuiz);
const FLASHCARDS_POR_SLUG = porSlug(FLASHCARDS, EsquemaFlashcards);

export const catalogoJson = (): PuertoCatalogo => ({
  temas: () => TEMAS,
  temaPorSlug: (slug) => TEMAS.find((t) => t.slug === slug) ?? null,
  fichaDe: (slug) => FICHAS_POR_SLUG.get(slug) ?? null,
  secuenciaDe: (slug) => SECUENCIAS_POR_SLUG.get(slug) ?? null,
  quizDe: (slug) => QUIZ_POR_SLUG.get(slug) ?? null,
  flashcardsDe: (slug) => FLASHCARDS_POR_SLUG.get(slug) ?? null,
});
