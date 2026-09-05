import type { Grupo, Progreso } from "../modelo";

/**
 * Lo que aporta el backend propio de KillaLab (repo aparte). Mientras ese
 * servicio no esté en pie, `@killalab/composicion` enchufa un adaptador local
 * que cumple el mismo contrato: la web se desarrolla y se demuestra igual.
 */

export interface PuertoProgreso {
  readonly disponible: boolean;
  progresoDe(estudianteId: string): Promise<Progreso[]>;
  registrarPaso(estudianteId: string, temaSlug: string, pasoId: string): Promise<Progreso>;
}

export interface PuertoDirectorio {
  readonly disponible: boolean;
  grupos(): Promise<Grupo[]>;
}
