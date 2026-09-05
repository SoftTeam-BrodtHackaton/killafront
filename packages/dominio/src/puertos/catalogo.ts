import type { Tema } from "../modelo";
import type { TarjetaEscrita } from "../modelo/repaso";

/** Una lección resumida en una página, para repasar antes de un examen. */
export interface Ficha {
  slug: string;
  titulo: string;
  idea: string;
  puntos: Array<{ titulo: string; explicacion: string }>;
  comprueba: Array<{ pregunta: string; respuesta: string }>;
  duracionMin: number;
}

/** Los conceptos ordenados por dependencia: qué hay que entender antes de qué. */
export interface Secuencia {
  slug: string;
  pasos: Array<{
    posicion: number;
    id: string;
    titulo: string;
    explicacion: string;
    lleva: string[];
  }>;
}

export interface PreguntaQuiz {
  id: string;
  enunciado: string;
  opciones: string[];
  correcta: number;
  porque: string;
  concepto: string;
}

/** El sello de origen viaja con el derivado: quién lo escribió y si alguien lo revisó. */
export interface Sello {
  generadoPor?: string | null;
  revisadoPor?: string | null;
}

export interface Quiz extends Sello {
  slug: string;
  preguntas: PreguntaQuiz[];
}

export interface Flashcards extends Sello {
  slug: string;
  tarjetas: TarjetaEscrita[];
}

/**
 * De dónde salen los temas y sus derivados.
 *
 * Hoy es JSON versionado en el repo — por eso los niveles 0 y 1 abren en un aula
 * sin internet. Mañana podría ser el backend sin que cambie una línea de los
 * casos de uso.
 *
 * Los derivados devuelven `null` cuando ese formato no se ha generado para ese
 * tema. La lección enseña los formatos que hay y no finge los que faltan.
 */
export interface PuertoCatalogo {
  temas(): Tema[];
  temaPorSlug(slug: string): Tema | null;
  fichaDe(slug: string): Ficha | null;
  secuenciaDe(slug: string): Secuencia | null;
  quizDe(slug: string): Quiz | null;
  flashcardsDe(slug: string): Flashcards | null;
}
