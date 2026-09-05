/**
 * Contenido derivado: generado en el taller (`herramientas/generador`) y
 * versionado en el repo.
 *
 * La web NUNCA llama a un modelo en tiempo de ejecución. Lo que hay aquí ya se
 * generó, se revisó y se commiteó, así que los niveles 0 y 1 siguen abriendo en
 * un aula sin internet y la demo no depende de que Ollama esté levantado.
 *
 * ESTE ARCHIVO SE GENERA. No editarlo a mano: lo reescribe `node cli.mjs indice`.
 */

import ficDiaYNoche from "./derivados/fichas/dia-y-noche.json";
import ficElSol from "./derivados/fichas/el-sol.json";
import ficEstaciones from "./derivados/fichas/estaciones.json";
import ficFasesDeLaLuna from "./derivados/fichas/fases-de-la-luna.json";
import ficGravedadBasica from "./derivados/fichas/gravedad-basica.json";
import ficSistemaSolar from "./derivados/fichas/sistema-solar.json";
import secDiaYNoche from "./derivados/secuencias/dia-y-noche.json";
import secElSol from "./derivados/secuencias/el-sol.json";
import secEstaciones from "./derivados/secuencias/estaciones.json";
import secFasesDeLaLuna from "./derivados/secuencias/fases-de-la-luna.json";
import secGravedadBasica from "./derivados/secuencias/gravedad-basica.json";
import secSistemaSolar from "./derivados/secuencias/sistema-solar.json";
import quiDiaYNoche from "./derivados/quiz/dia-y-noche.json";
import quiElSol from "./derivados/quiz/el-sol.json";
import quiEstaciones from "./derivados/quiz/estaciones.json";
import quiFasesDeLaLuna from "./derivados/quiz/fases-de-la-luna.json";
import quiGravedadBasica from "./derivados/quiz/gravedad-basica.json";
import quiSistemaSolar from "./derivados/quiz/sistema-solar.json";
import flaDiaYNoche from "./derivados/flashcards/dia-y-noche.json";
import flaElSol from "./derivados/flashcards/el-sol.json";
import flaEstaciones from "./derivados/flashcards/estaciones.json";
import flaFasesDeLaLuna from "./derivados/flashcards/fases-de-la-luna.json";
import flaGravedadBasica from "./derivados/flashcards/gravedad-basica.json";
import flaSistemaSolar from "./derivados/flashcards/sistema-solar.json";

export const FICHAS: unknown[] = [ficDiaYNoche, ficElSol, ficEstaciones, ficFasesDeLaLuna, ficGravedadBasica, ficSistemaSolar];
export const SECUENCIAS: unknown[] = [secDiaYNoche, secElSol, secEstaciones, secFasesDeLaLuna, secGravedadBasica, secSistemaSolar];
export const QUIZ: unknown[] = [quiDiaYNoche, quiElSol, quiEstaciones, quiFasesDeLaLuna, quiGravedadBasica, quiSistemaSolar];
export const FLASHCARDS: unknown[] = [flaDiaYNoche, flaElSol, flaEstaciones, flaFasesDeLaLuna, flaGravedadBasica, flaSistemaSolar];
export const GUIONES: unknown[] = [];
export const REGISTROS: unknown[] = [];
