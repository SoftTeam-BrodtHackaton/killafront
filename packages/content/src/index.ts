import sistemaSolar from "./nivel-0/sistema-solar.json";
import fasesLuna from "./nivel-0/fases-de-la-luna.json";
import diaYNoche from "./nivel-0/dia-y-noche.json";
import estaciones from "./nivel-0/estaciones.json";
import gravedad from "./nivel-0/gravedad-basica.json";
import elSol from "./nivel-0/el-sol.json";

/**
 * Contenido crudo, sin validar y sin tipar. Este paquete es una carpeta de datos:
 * la forma la impone `@killalab/adaptadores/contenido`, que lo valida con zod al
 * importar. Así un JSON mal escrito rompe el build y nunca la clase.
 */
export const CRUDOS: unknown[] = [sistemaSolar, fasesLuna, diaYNoche, estaciones, gravedad, elSol];

export { FICHAS, SECUENCIAS, QUIZ, FLASHCARDS, NARRACIONES, GUIONES, REGISTROS } from "./derivados";
