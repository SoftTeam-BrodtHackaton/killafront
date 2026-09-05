import { Tema } from "./esquema.js";
import sistemaSolar from "./nivel-0/sistema-solar.json" with { type: "json" };
import fasesLuna from "./nivel-0/fases-de-la-luna.json" with { type: "json" };
import diaYNoche from "./nivel-0/dia-y-noche.json" with { type: "json" };
import estaciones from "./nivel-0/estaciones.json" with { type: "json" };
import gravedad from "./nivel-0/gravedad-basica.json" with { type: "json" };
import elSol from "./nivel-0/el-sol.json" with { type: "json" };

export * from "./esquema.js";

const crudos = [sistemaSolar, fasesLuna, diaYNoche, estaciones, gravedad, elSol];

/** Se valida al importar: un JSON mal formado rompe el build, no la demo. */
export const TEMAS: Tema[] = crudos.map((t) => Tema.parse(t));

export const temasPorNivel = (nivel: number) => TEMAS.filter((t) => t.nivel === nivel);
export const temaPorSlug = (slug: string) => TEMAS.find((t) => t.slug === slug) ?? null;

/** Mazo de repaso derivado del tema. Nada que producir a mano. */
export const tarjetasDe = (tema: Tema) =>
  tema.conceptos.map((c) => ({ anverso: c.titulo, reverso: c.explicacion }));
