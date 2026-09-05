import { Tema } from "./esquema";
import sistemaSolar from "./nivel-0/sistema-solar.json";
import fasesLuna from "./nivel-0/fases-de-la-luna.json";
import diaYNoche from "./nivel-0/dia-y-noche.json";
import estaciones from "./nivel-0/estaciones.json";
import gravedad from "./nivel-0/gravedad-basica.json";
import elSol from "./nivel-0/el-sol.json";

export * from "./esquema";

const crudos = [sistemaSolar, fasesLuna, diaYNoche, estaciones, gravedad, elSol];

/** Se valida al importar: un JSON mal formado rompe el build, no la demo. */
export const TEMAS: Tema[] = crudos.map((t) => Tema.parse(t));

export const temasPorNivel = (nivel: number) => TEMAS.filter((t) => t.nivel === nivel);
export const temaPorSlug = (slug: string) => TEMAS.find((t) => t.slug === slug) ?? null;

/** Mazo de repaso derivado del tema. Nada que producir a mano. */
export const tarjetasDe = (tema: Tema) =>
  tema.conceptos.map((c) => ({ anverso: c.titulo, reverso: c.explicacion }));
