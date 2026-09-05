import type { PuertoCatalogo, Tema } from "@killalab/dominio";
import { CRUDOS } from "@killalab/content";
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

export const catalogoJson = (): PuertoCatalogo => ({
  temas: () => TEMAS,
  temaPorSlug: (slug) => TEMAS.find((t) => t.slug === slug) ?? null,
});
