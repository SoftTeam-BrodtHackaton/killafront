import type { Curso } from "./curso";

/**
 * El certificado que se emite al terminar un curso.
 *
 * Sigue **Open Badges 3.0**, que es el estándar abierto del 1EdTech para
 * credenciales verificables. La decisión de por qué no se usan NFTs está
 * documentada en el vault, y en corto es esta: Open Badges 3.0 ya es una
 * Verifiable Credential del W3C, o sea que ya es criptográficamente verificable
 * sin billeteras, sin gas y sin cadena. Sumar cripto a una plataforma escolar
 * añadiría fricción para menores de edad y riesgo reputacional con socios
 * públicos, a cambio de una propiedad que el estándar ya da.
 *
 * Aquí se construye la credencial. **Firmarla y publicarla es trabajo del
 * backend**, porque una firma que el navegador puede generar no acredita nada.
 * Mientras tanto el certificado se emite sin firma y se dice en pantalla.
 */

export interface Certificado {
  /** Código público de verificación. Es lo que se comparte y lo que se comprueba. */
  codigo: string;
  cursoSlug: string;
  cursoTitulo: string;
  nivel: number;
  estudiante: string;
  lecciones: number;
  duracionMin: number;
  /** ISO 8601. */
  emitido: string;
  /** false mientras el backend no firme la credencial. La UI lo dice. */
  firmado: boolean;
}

const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Código legible de 12 caracteres en tres bloques: `K7M2-9XPQ-4TBN`.
 *
 * Se deriva del curso, del estudiante y del día, así que el mismo logro produce
 * siempre el mismo código: reemitir un certificado no genera uno nuevo. Sin I, O,
 * 0 ni 1, que son las que se confunden al dictarlo por teléfono o copiarlo de una
 * pantalla proyectada.
 *
 * No es un secreto ni pretende serlo: es un identificador público. La prueba de
 * autenticidad es la firma del emisor, no lo difícil que sea adivinar el código.
 */
export function codigoDeCertificado(cursoSlug: string, estudiante: string, emitido: string): string {
  const semilla = `${cursoSlug}|${estudiante}|${emitido.slice(0, 10)}`;

  // FNV-1a de 32 bits, mezclado para repartir mejor los bits altos.
  let h = 0x811c9dc5;
  for (let i = 0; i < semilla.length; i++) {
    h ^= semilla.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }

  let salida = "";
  let estado = h;
  for (let i = 0; i < 12; i++) {
    estado = (Math.imul(estado ^ (estado >>> 15), 0x2545f491) + i) >>> 0;
    salida += ALFABETO[estado % ALFABETO.length];
  }

  return `${salida.slice(0, 4)}-${salida.slice(4, 8)}-${salida.slice(8, 12)}`;
}

export function emitirCertificado(curso: Curso, estudiante: string, emitido: string): Certificado {
  return {
    codigo: codigoDeCertificado(curso.slug, estudiante, emitido),
    cursoSlug: curso.slug,
    cursoTitulo: curso.titulo,
    nivel: curso.nivel,
    estudiante,
    lecciones: curso.lecciones,
    duracionMin: curso.duracionMin,
    emitido,
    firmado: false,
  };
}

/* ------------------------------------------------------------------ */
/* Open Badges 3.0                                                     */
/* ------------------------------------------------------------------ */

export const EMISOR = {
  nombre: "KillaLab",
  url: "https://killalab.pe",
  descripcion: "Plataforma educativa peruana de ciencia espacial con datos reales de la NASA.",
} as const;

/**
 * La credencial en el formato que Credly y cualquier verificador de Open Badges
 * 3.0 saben leer. Es JSON-LD: los `@context` no son adorno, son lo que hace que
 * un verificador ajeno entienda los campos sin conocer a KillaLab.
 *
 * `proof` va vacío a propósito: la firma la pone el emisor, y el emisor es el
 * backend. Una credencial sin firma es una credencial legible pero no probada, y
 * eso es exactamente lo que hay hoy.
 */
export function comoOpenBadge(c: Certificado, urlVerificacion: string) {
  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
    ],
    id: urlVerificacion,
    type: ["VerifiableCredential", "OpenBadgeCredential"],
    name: `Curso completado: ${c.cursoTitulo}`,
    issuer: {
      id: EMISOR.url,
      type: ["Profile"],
      name: EMISOR.nombre,
      description: EMISOR.descripcion,
    },
    validFrom: c.emitido,
    credentialSubject: {
      type: ["AchievementSubject"],
      identifier: [{ type: "IdentityObject", identityType: "name", hashed: false, identityHash: c.estudiante }],
      achievement: {
        id: `${EMISOR.url}/cursos/${c.cursoSlug}`,
        type: ["Achievement"],
        name: c.cursoTitulo,
        description: `Completó las ${c.lecciones} lecciones del curso de ${c.cursoTitulo}, nivel ${c.nivel} de KillaLab, resolviendo todos sus retos.`,
        criteria: {
          narrative: `Resolver todos los pasos de las ${c.lecciones} lecciones del curso, con ${c.duracionMin} minutos de trabajo estimado.`,
        },
      },
    },
    // Sin firma todavía: la pone el emisor cuando el backend esté en pie.
    proof: [] as unknown[],
  };
}
