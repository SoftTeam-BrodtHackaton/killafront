import {
  abrirCurso,
  abrirMision,
  construirMapaMental,
  cursoDeTema,
  generarMazo,
  listarCursos,
  listarPlanetas,
  observarUltimaLlamarada,
  recorrerNiveles,
  recorrerNivelesConCursos,
  vigilarAproximaciones,
  type PuertoDirectorio,
  type PuertoProgreso,
} from "@killalab/dominio";
import {
  almacenEnMemoria,
  asteroidesNasa,
  catalogoJson,
  climaEspacialNasa,
  directorioHttp,
  directorioVacio,
  hayBackend,
  progresoEfimero,
  progresoHttp,
  relojDelSistema,
  respaldoEnDisco,
} from "@killalab/adaptadores";

/**
 * La raíz de composición: el único sitio del proyecto donde se elige una
 * implementación concreta y se lee el entorno.
 *
 * `apps/web` importa de aquí y de `@killalab/dominio` (para los tipos). Nunca de
 * `@killalab/adaptadores`. Esa regla es lo que hace que cambiar de fuente de datos
 * o enchufar el backend propio no toque ni una pantalla.
 */

const almacen = almacenEnMemoria();
const reloj = relojDelSistema();
const catalogo = catalogoJson();
const respaldo = respaldoEnDisco();

const progreso: PuertoProgreso = hayBackend() ? progresoHttp() : progresoEfimero();
const directorio: PuertoDirectorio = hayBackend() ? directorioHttp() : directorioVacio();

/** Los casos de uso ya cableados. Esto es todo lo que la web tiene permitido usar. */
export const killalab = {
  ultimaLlamarada: observarUltimaLlamarada({ clima: climaEspacialNasa(), almacen, respaldo, reloj }),
  proximasAproximaciones: vigilarAproximaciones({ asteroides: asteroidesNasa(), almacen, respaldo, reloj }),
  niveles: recorrerNiveles({ catalogo }),
  nivelesConCursos: recorrerNivelesConCursos({ catalogo }),
  cursos: listarCursos({ catalogo }),
  curso: abrirCurso({ catalogo }),
  cursoDeTema: cursoDeTema({ catalogo }),
  mision: abrirMision({ catalogo }),
  mazo: generarMazo({ catalogo }),
  // Los derivados del taller: se leen del catálogo igual que los temas.
  ficha: (slug: string) => catalogo.fichaDe(slug),
  secuencia: (slug: string) => catalogo.secuenciaDe(slug),
  quiz: (slug: string) => catalogo.quizDe(slug),
  flashcards: (slug: string) => catalogo.flashcardsDe(slug),
  narracion: (slug: string) => catalogo.narracionDe(slug),
  mapaMental: construirMapaMental({ catalogo }),
  planetas: listarPlanetas({ catalogo }),
  progreso,
  directorio,
} as const;

/** Qué piezas del sistema están enchufadas de verdad. La UI lo dice en pantalla. */
export const estadoDeLaPlataforma = () => ({
  backend: hayBackend(),
  progresoPersistente: progreso.disponible,
  directorioPoblado: directorio.disponible,
});

export type Killalab = typeof killalab;
