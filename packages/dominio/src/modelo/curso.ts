import type { NivelId, Tema } from "./contenido";

/**
 * Un curso agrupa las lecciones de un mismo objeto de estudio dentro de un nivel:
 * el Sol, la Luna, la Tierra. Es la unidad que el estudiante elige y la que se
 * certifica al terminar.
 *
 * No se declara a mano en ningún JSON: se deriva de los temas. Un tema nuevo con
 * `planeta: "Marte"` crea el curso de Marte sin tocar una línea de código, que es
 * justo lo que hace barato producir contenido.
 */
export interface Curso {
  /** Derivado de nivel y planeta: `0-luna`. Estable mientras no cambie el planeta. */
  slug: string;
  nivel: NivelId;
  planeta: string;
  titulo: string;
  temas: Tema[];
  duracionMin: number;
  lecciones: number;
  /** Total de pasos del curso. Es el denominador del progreso. */
  pasos: number;
  conceptos: number;
  /** true si alguna lección necesita datos en vivo de la NASA. */
  requiereApi: boolean;
}

export const slugDeCurso = (nivel: number, planeta: string) =>
  `${nivel}-${planeta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")}`;

/** Agrupa una lista de temas en cursos, en el orden en que se estudian. */
export function agruparEnCursos(temas: Tema[]): Curso[] {
  const porClave = new Map<string, Tema[]>();

  for (const t of temas) {
    const clave = slugDeCurso(t.nivel, t.planeta);
    porClave.set(clave, [...(porClave.get(clave) ?? []), t]);
  }

  return [...porClave.entries()]
    .map(([slug, lista]) => {
      const orden = [...lista].sort((a, b) => a.duracionMin - b.duracionMin);
      const primero = orden[0]!;
      return {
        slug,
        nivel: primero.nivel,
        planeta: primero.planeta,
        titulo: primero.planeta,
        temas: orden,
        duracionMin: orden.reduce((n, t) => n + t.duracionMin, 0),
        lecciones: orden.length,
        pasos: orden.reduce((n, t) => n + t.pasos.length, 0),
        conceptos: orden.reduce((n, t) => n + t.conceptos.length, 0),
        requiereApi: orden.some((t) => !t.offline),
      };
    })
    .sort((a, b) => a.nivel - b.nivel || a.planeta.localeCompare(b.planeta, "es"));
}

/* ------------------------------------------------------------------ */
/* Progreso                                                            */
/* ------------------------------------------------------------------ */

/** Qué pasos lleva resueltos el estudiante, por slug de tema. */
export type PasosResueltos = Readonly<Record<string, readonly string[]>>;

export interface AvanceDeTema {
  tema: Tema;
  resueltos: number;
  total: number;
  porcentaje: number;
  completado: boolean;
  empezado: boolean;
}

export interface AvanceDeCurso {
  curso: Curso;
  temas: AvanceDeTema[];
  resueltos: number;
  total: number;
  porcentaje: number;
  completado: boolean;
  empezado: boolean;
  /** La primera lección sin terminar. Es a donde lleva el botón de continuar. */
  siguiente: Tema | null;
}

const pct = (hechos: number, total: number) =>
  total === 0 ? 0 : Math.round((hechos / total) * 100);

export function avanceDeTema(tema: Tema, resueltos: PasosResueltos): AvanceDeTema {
  const hechos = (resueltos[tema.slug] ?? []).filter((id) =>
    tema.pasos.some((p) => p.id === id),
  ).length;
  const total = tema.pasos.length;

  return {
    tema,
    resueltos: hechos,
    total,
    porcentaje: pct(hechos, total),
    completado: total > 0 && hechos >= total,
    empezado: hechos > 0,
  };
}

export function avanceDeCurso(curso: Curso, resueltos: PasosResueltos): AvanceDeCurso {
  const temas = curso.temas.map((t) => avanceDeTema(t, resueltos));
  const hechos = temas.reduce((n, a) => n + a.resueltos, 0);
  const total = temas.reduce((n, a) => n + a.total, 0);

  return {
    curso,
    temas,
    resueltos: hechos,
    total,
    porcentaje: pct(hechos, total),
    completado: total > 0 && hechos >= total,
    empezado: hechos > 0,
    // Se continúa por la primera lección a medias; si no hay ninguna, por la
    // primera sin empezar. Volver a la que dejaste a medias es lo que se espera.
    siguiente:
      temas.find((a) => a.empezado && !a.completado)?.tema ??
      temas.find((a) => !a.completado)?.tema ??
      null,
  };
}
