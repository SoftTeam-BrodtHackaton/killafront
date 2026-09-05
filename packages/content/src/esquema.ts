import { z } from "zod";

/** Un tema es la unidad de contenido. De aquí salen la misión y, automáticamente,
 *  el mazo de tarjetas y los nodos del mapa mental. Un solo JSON, tres formatos. */

export const NivelId = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);

export const Paso = z.object({
  id: z.string(),
  enunciado: z.string().max(280),
  tipo: z.enum(["opcion", "numero", "orden", "observacion"]),
  opciones: z.array(z.string()).optional(),
  respuesta: z.union([z.string(), z.number(), z.array(z.string())]),
  pista: z.string().optional(),
  /** Obligatorio en niveles 2 y 3: de dónde sale la cifra del enunciado. */
  fuente: z.enum(["DONKI", "NeoWs", "JPL CAD", "propio"]).default("propio"),
});

export const Concepto = z.object({
  id: z.string(),
  titulo: z.string(),
  explicacion: z.string(),
  /** Aristas del mapa mental. Ids de otros conceptos, del mismo tema o de otro. */
  conectaCon: z.array(z.string()).default([]),
});

export const Tema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  nivel: NivelId,
  planeta: z.string(),
  titulo: z.string(),
  resumen: z.string().max(200),
  duracionMin: z.number().int().positive(),
  /** true = no toca ninguna API externa. Los niveles 0 y 1 son todos offline. */
  offline: z.boolean(),
  conceptos: z.array(Concepto).min(1),
  pasos: z.array(Paso).min(1),
});

export type Tema = z.infer<typeof Tema>;
export type Paso = z.infer<typeof Paso>;
export type Concepto = z.infer<typeof Concepto>;

export const NIVELES = [
  { id: 0, nombre: "Despegue", publico: "Primaria alta, 9 a 12", requiereApi: false },
  { id: 1, nombre: "Órbita Baja", publico: "Secundaria inicial", requiereApi: false },
  { id: 2, nombre: "Espacio Profundo", publico: "Secundaria superior", requiereApi: true },
  { id: 3, nombre: "Estación", publico: "Universitarios de primeros ciclos", requiereApi: true },
] as const;
