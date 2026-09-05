import type { Curso, NodoMapa, Nivel, Tarjeta, Tema } from "../modelo";
import { NIVELES, agruparEnCursos } from "../modelo";
import type { PuertoCatalogo } from "../puertos";

export interface DependenciasCatalogo {
  catalogo: PuertoCatalogo;
}

export interface NivelConTemas {
  nivel: Nivel;
  temas: Tema[];
}

/** Los cuatro niveles con sus temas dentro. Un nivel sin contenido aún se muestra igual. */
export function recorrerNiveles(d: DependenciasCatalogo) {
  return function niveles(): NivelConTemas[] {
    const temas = d.catalogo.temas();
    return NIVELES.map((nivel) => ({ nivel, temas: temas.filter((t) => t.nivel === nivel.id) }));
  };
}

export function abrirMision(d: DependenciasCatalogo) {
  return function mision(slug: string): Tema | null {
    return d.catalogo.temaPorSlug(slug);
  };
}

/** El mazo de repaso no se produce a mano: se deriva del mismo tema. */
export function generarMazo(d: DependenciasCatalogo) {
  return function mazo(slug: string): { tema: Tema; tarjetas: Tarjeta[] } | null {
    const tema = d.catalogo.temaPorSlug(slug);
    if (!tema) return null;
    return {
      tema,
      tarjetas: tema.conceptos.map((c) => ({ anverso: c.titulo, reverso: c.explicacion })),
    };
  };
}

/**
 * El mapa mental de un planeta: todos los conceptos de todos sus temas, con las
 * aristas ya resueltas. Se descartan las aristas que apuntan a un concepto que no
 * existe, para que un JSON con un id mal escrito no dibuje una rama al vacío.
 */
export function construirMapaMental(d: DependenciasCatalogo) {
  return function mapa(planeta: string): NodoMapa[] {
    const temas = d.catalogo.temas().filter((t) => t.planeta === planeta);
    const nodos = temas.flatMap((t) =>
      t.conceptos.map((c) => ({
        id: c.id,
        titulo: c.titulo,
        explicacion: c.explicacion,
        tema: t.slug,
        aristas: c.conectaCon,
      })),
    );
    const existentes = new Set(nodos.map((n) => n.id));
    return nodos.map((n) => ({ ...n, aristas: n.aristas.filter((a) => existentes.has(a)) }));
  };
}

/** Los planetas que hoy tienen contenido, en el orden de los niveles. */
export function listarPlanetas(d: DependenciasCatalogo) {
  return function planetas(): string[] {
    const vistos = new Set<string>();
    return d.catalogo
      .temas()
      .sort((a, b) => a.nivel - b.nivel)
      .filter((t) => (vistos.has(t.planeta) ? false : vistos.add(t.planeta) && true))
      .map((t) => t.planeta);
  };
}


/* ------------------------------------------------------------------ */
/* Cursos                                                              */
/* ------------------------------------------------------------------ */

/** Todos los cursos publicados, en el orden en que se estudian. */
export function listarCursos(d: DependenciasCatalogo) {
  return function cursos(): Curso[] {
    return agruparEnCursos(d.catalogo.temas());
  };
}

export function abrirCurso(d: DependenciasCatalogo) {
  return function curso(slug: string): Curso | null {
    return agruparEnCursos(d.catalogo.temas()).find((c) => c.slug === slug) ?? null;
  };
}

/** El curso al que pertenece una lección. Sirve para el rastro de migas. */
export function cursoDeTema(d: DependenciasCatalogo) {
  return function curso(temaSlug: string): Curso | null {
    return (
      agruparEnCursos(d.catalogo.temas()).find((c) => c.temas.some((t) => t.slug === temaSlug)) ??
      null
    );
  };
}

/** Los niveles con sus cursos dentro. Es el índice del catálogo. */
export function recorrerNivelesConCursos(d: DependenciasCatalogo) {
  return function niveles(): Array<{ nivel: Nivel; cursos: Curso[] }> {
    const cursos = agruparEnCursos(d.catalogo.temas());
    return NIVELES.map((nivel) => ({ nivel, cursos: cursos.filter((c) => c.nivel === nivel.id) }));
  };
}
