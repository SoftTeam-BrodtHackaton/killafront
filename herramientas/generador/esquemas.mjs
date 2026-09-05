import { z } from "zod";

/**
 * Los esquemas de todo lo que el modelo puede escribir.
 *
 * Son la frontera: nada llega a `packages/content` sin pasar por aquí. Un modelo
 * de 4B o 7B se sale del formato cada tantas llamadas, y eso es esperable; lo
 * que no puede pasar es que esa salida entre al repo sin que nadie lo note.
 */

export const Quiz = z.object({
  slug: z.string(),
  preguntas: z
    .array(
      z.object({
        id: z.string(),
        enunciado: z.string().min(10).max(220),
        opciones: z.array(z.string().min(1).max(120)).length(4),
        /** Índice de la correcta dentro de `opciones`, de 0 a 3. */
        correcta: z.number().int().min(0).max(3),
        /** Por qué es esa. Se muestra al fallar; sin esto el quiz no enseña nada. */
        porque: z.string().min(10).max(300),
        /** Id del concepto del tema del que sale. Ata cada pregunta a su origen. */
        concepto: z.string(),
      }),
    )
    .min(6)
    .max(14),
});

export const Flashcards = z.object({
  slug: z.string(),
  tarjetas: z
    .array(
      z.object({
        id: z.string(),
        /** Lo que se ve delante. Una pregunta abierta, no de sí o no. */
        pregunta: z.string().min(10).max(200),
        /** La respuesta modelo, la que está detrás de la tarjeta. */
        respuesta: z.string().min(15).max(400),
        /**
         * Las ideas que la respuesta del estudiante tiene que tocar para contar
         * como buena. Son el criterio de corrección: se comparan contra lo que
         * escribió, no se le enseña la respuesta modelo hasta que responde.
         */
        claves: z.array(z.string().min(3).max(60)).min(2).max(6),
        concepto: z.string(),
      }),
    )
    .min(6)
    .max(14),
});

/**
 * La narración: la teoría contada de corrido, con una sola voz.
 *
 * No es un diálogo. Un guion a dos voces obliga a escribir "ana dice / beto dice"
 * y suena a sketch; lo que se pidió es lo que hace NotebookLM, alguien que te
 * explica el tema seguido mientras vas al colegio.
 *
 * Se guarda por párrafos y no como un bloque de texto para poder resaltar por
 * dónde va la lectura y para que quien prefiera leer, lea.
 */
export const Narracion = z.object({
  slug: z.string(),
  titulo: z.string().min(5).max(120),
  parrafos: z.array(z.string().min(40).max(700)).min(4).max(12),
});

export const Guion = z.object({
  slug: z.string(),
  turnos: z
    .array(
      z.object({
        voz: z.enum(["ana", "beto"]),
        texto: z.string().min(5).max(600),
      }),
    )
    .min(6)
    .max(40),
});

export const Registros = z.object({
  slug: z.string(),
  /** El mismo contenido en tres registros. El estudiante elige cuál le entra. */
  comoAUnNino: z.string().min(40).max(700),
  comoAUnCompanero: z.string().min(40).max(900),
  comoEnUnLibro: z.string().min(40).max(900),
});

/** Palabras que delatan que el modelo se puso a inventar en vez de reformatear. */
const INVENTOS = [
  /seg[uú]n (?:los )?(?:estudios|cient[ií]ficos|expertos)/i,
  /(?:la )?NASA (?:afirma|asegura|confirma)/i,
  /en \d{4} se descubri[oó]/i,
  /aproximadamente \d[\d.,]* (?:millones|mil millones) de (?:a[nñ]os|kil[oó]metros)/i,
];

/**
 * Aviso, no bloqueo.
 *
 * La regla del proyecto es que el modelo reformatea y nunca inventa, pero
 * detectar un hecho inventado automáticamente no se puede: haría falta saber la
 * verdad. Lo que sí se puede es señalar las construcciones con las que un modelo
 * suele colar datos nuevos, para que la revisión humana mire ahí primero.
 */
export function olfatearInventos(texto) {
  return INVENTOS.filter((r) => r.test(texto)).map((r) => String(r));
}
