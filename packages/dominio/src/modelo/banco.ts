/**
 * Elegir un subconjunto distinto en cada repaso.
 *
 * El taller genera un banco grande de preguntas por tema; la aplicación saca unas
 * pocas cada vez. Así repasar dos veces el mismo tema no es responder lo mismo
 * dos veces, que es exactamente lo que hace que un estudiante memorice la
 * posición de la respuesta en vez del contenido.
 *
 * La semilla es explícita y no `Math.random()`: el servidor y el cliente tienen
 * que pintar lo mismo o React se queja de hidratación. Quien llama decide la
 * semilla, y con ella la sesión.
 */

/** mulberry32: pequeño, rápido y suficiente para barajar preguntas. */
function generador(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates con semilla. No muta la lista original. */
export function barajar<T>(lista: readonly T[], semilla: number): T[] {
  const azar = generador(semilla);
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [copia[i], copia[j]] = [copia[j]!, copia[i]!];
  }
  return copia;
}

/**
 * Toma `cuantas` de la lista, repartidas entre conceptos distintos cuando se
 * puede. Coger las primeras al azar puede dar tres preguntas del mismo concepto y
 * dejar los otros sin tocar; esto reparte primero una por concepto y luego
 * completa.
 */
export function tomarVariadas<T extends { concepto: string }>(
  lista: readonly T[],
  cuantas: number,
  semilla: number,
): T[] {
  const barajada = barajar(lista, semilla);
  const porConcepto = new Map<string, T[]>();

  for (const x of barajada) {
    porConcepto.set(x.concepto, [...(porConcepto.get(x.concepto) ?? []), x]);
  }

  const elegidas: T[] = [];
  const colas = [...porConcepto.values()];

  // Ronda por ronda: una de cada concepto antes de repetir concepto.
  let quedan = true;
  while (elegidas.length < cuantas && quedan) {
    quedan = false;
    for (const cola of colas) {
      if (elegidas.length >= cuantas) break;
      const siguiente = cola.shift();
      if (siguiente) {
        elegidas.push(siguiente);
        quedan = true;
      }
    }
  }

  return elegidas;
}

/** Cambia cada media hora: repasar más tarde el mismo día da otro conjunto. */
export const semillaDeSesion = () => Math.floor(Date.now() / (30 * 60 * 1000));
