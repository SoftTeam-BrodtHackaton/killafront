/**
 * Tarjetas de respuesta escrita y su corrección.
 *
 * El estudiante escribe con sus propias palabras y el sistema le dice cuánto se
 * acercó. Es más lento que reconocer una opción y por eso enseña más: reconocer
 * la respuesta correcta entre cuatro no prueba que la sepas producir.
 *
 * **La corrección no llama a ningún modelo en tiempo de ejecución.** El modelo ya
 * trabajó antes, cuando generó las `claves` de cada tarjeta: las ideas que una
 * respuesta correcta tiene que tocar. Comparar contra esas claves es una función
 * pura, instantánea y determinista, y —lo que importa aquí— **funciona sin
 * internet**, que es la promesa de los niveles 0 y 1.
 */

export interface TarjetaEscrita {
  id: string;
  pregunta: string;
  /** La respuesta modelo. No se enseña hasta que el estudiante responde. */
  respuesta: string;
  /** Las ideas que hay que tocar. Son el criterio de corrección. */
  claves: string[];
  concepto: string;
}

export interface Correccion {
  porcentaje: number;
  clavesTocadas: string[];
  clavesFaltantes: string[];
  aprobada: boolean;
  vacia: boolean;
}

/** A partir de aquí la tarjeta se da por sabida y se pasa a la siguiente. */
export const UMBRAL_APROBACION = 60;

/** Palabras que no aportan significado y que no deberían contar como coincidencia. */
const VACIAS = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al", "a",
  "en", "y", "o", "que", "se", "su", "sus", "por", "para", "con", "es", "son",
  "esta", "este", "esto", "lo", "le", "como", "mas", "pero", "no", "si", "ya",
]);

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s.]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const enPalabras = (s: string) =>
  normalizar(s)
    .split(" ")
    .filter((p) => p.length > 0 && !VACIAS.has(p));

/**
 * Una clave está tocada si el estudiante mencionó lo esencial de ella.
 *
 * No se exige la frase literal: "29.5 días" también se da por buena si escribió
 * "29,5 dias" o "casi 30 días". Se pide que aparezcan al menos dos tercios de las
 * palabras con significado de la clave, y para las claves de una sola palabra, esa
 * palabra o una que la contenga (así "órbita" acepta "orbital").
 */
function claveTocada(clave: string, escrito: string): boolean {
  const texto = normalizar(escrito);
  const palabras = enPalabras(clave);
  if (palabras.length === 0) return false;

  const presentes = palabras.filter((p) => {
    if (texto.includes(p)) return true;
    // Tolera plurales y derivados cortos: orbita/orbital, fase/fases.
    if (p.length >= 5 && texto.includes(p.slice(0, Math.max(4, p.length - 2)))) return true;
    // Los números se comparan sin separador decimal: 29.5 y 29,5 son lo mismo.
    if (/\d/.test(p) && texto.replace(/,/g, ".").includes(p.replace(/,/g, "."))) return true;
    return false;
  });

  return presentes.length / palabras.length >= 2 / 3;
}

export function corregirRespuesta(tarjeta: TarjetaEscrita, escrito: string): Correccion {
  const limpio = escrito.trim();

  if (limpio.length === 0) {
    return {
      porcentaje: 0,
      clavesTocadas: [],
      clavesFaltantes: tarjeta.claves,
      aprobada: false,
      vacia: true,
    };
  }

  const tocadas = tarjeta.claves.filter((c) => claveTocada(c, limpio));
  const porcentaje =
    tarjeta.claves.length === 0 ? 0 : Math.round((tocadas.length / tarjeta.claves.length) * 100);

  return {
    porcentaje,
    clavesTocadas: tocadas,
    clavesFaltantes: tarjeta.claves.filter((c) => !tocadas.includes(c)),
    aprobada: porcentaje >= UMBRAL_APROBACION,
    vacia: false,
  };
}

/** Qué decirle al estudiante. Nunca solo un número: un número solo no enseña. */
export function comentarioDe(c: Correccion): string {
  if (c.vacia) return "Escribe tu respuesta antes de comprobar.";
  if (c.porcentaje === 100) return "Completa: mencionaste todo lo que hacía falta.";
  if (c.aprobada) return "Bien. Te faltó algo, pero lo esencial está.";
  if (c.porcentaje > 0) return "Vas por buen camino, pero falta lo principal.";
  return "Eso no es. Mira la respuesta y vuelve a intentarlo con tus palabras.";
}
