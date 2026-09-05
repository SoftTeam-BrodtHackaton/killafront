import type { Paso } from "@killalab/dominio";

/**
 * Evaluación de un paso, en el cliente.
 *
 * Vive en la web y no en el dominio a propósito: es corrección inmediata para que
 * el estudiante siga solo. La calificación que cuente para un certificado la hará
 * el backend, porque una respuesta que el navegador puede leer no sirve para
 * acreditar nada. Aquí la respuesta correcta viaja en el JSON y eso está bien:
 * los niveles 0 y 1 tienen que funcionar sin red.
 */

const normalizar = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Tolerancia del 2 % en las respuestas numéricas: 29.5 días admite 29 y 30. */
const TOLERANCIA = 0.02;

export function esCorrecta(paso: Paso, respuesta: string | string[]): boolean {
  if (paso.tipo === "observacion") return true;

  if (paso.tipo === "numero") {
    const esperado = Number(paso.respuesta);
    const dado = Number(String(respuesta).replace(",", "."));
    if (!Number.isFinite(dado) || !Number.isFinite(esperado)) return false;
    return Math.abs(dado - esperado) <= Math.abs(esperado) * TOLERANCIA;
  }

  if (paso.tipo === "orden") {
    const esperado = Array.isArray(paso.respuesta) ? paso.respuesta : [];
    const dado = Array.isArray(respuesta) ? respuesta : [];
    return (
      esperado.length === dado.length &&
      esperado.every((v, i) => normalizar(v) === normalizar(dado[i] ?? ""))
    );
  }

  return normalizar(String(paso.respuesta)) === normalizar(String(respuesta));
}
