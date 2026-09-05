/**
 * Derivados que NO necesitan modelo.
 *
 * Son un `map()` sobre el JSON del tema. Usar un modelo aquí sería más caro, más
 * lento y no determinista a cambio de exactamente nada. Por eso se hacen primero.
 */

/** Ficha de repaso de una página: lo que cabe en una hoja antes de un examen. */
export function fichaDeRepaso(tema) {
  return {
    slug: tema.slug,
    titulo: tema.titulo,
    idea: tema.resumen,
    puntos: tema.conceptos.map((c) => ({
      titulo: c.titulo,
      explicacion: c.explicacion,
    })),
    comprueba: tema.pasos.map((p) => ({
      pregunta: p.enunciado,
      respuesta: Array.isArray(p.respuesta) ? p.respuesta.join(" → ") : String(p.respuesta),
    })),
    duracionMin: Math.max(2, Math.round(tema.duracionMin / 3)),
  };
}

/**
 * Secuencia de conceptos ordenada por dependencias.
 *
 * `conectaCon` da un grafo; esto lo aplana en el orden en que conviene leerlo,
 * poniendo antes los conceptos de los que otros dependen. Es un orden topológico
 * simple, y si hay un ciclo se corta y se sigue: un JSON con dos conceptos que se
 * apuntan mutuamente no puede romper la ficha.
 */
export function lineaDeTiempo(tema) {
  const porId = new Map(tema.conceptos.map((c) => [c.id, c]));
  const visitados = new Set();
  const enCurso = new Set();
  const orden = [];

  const visitar = (id) => {
    if (visitados.has(id) || enCurso.has(id)) return;
    const c = porId.get(id);
    if (!c) return;

    enCurso.add(id);
    for (const dep of c.conectaCon) if (porId.has(dep)) visitar(dep);
    enCurso.delete(id);

    visitados.add(id);
    orden.push(c);
  };

  for (const c of tema.conceptos) visitar(c.id);

  return {
    slug: tema.slug,
    pasos: orden.map((c, i) => ({
      posicion: i + 1,
      id: c.id,
      titulo: c.titulo,
      explicacion: c.explicacion,
      lleva: c.conectaCon.filter((x) => porId.has(x)),
    })),
  };
}
