import type { CodigoFuente } from "./dato";

/**
 * Un tema es la unidad de contenido. De un solo tema salen tres formatos:
 * la misión (los pasos), el mazo de tarjetas y los nodos del mapa mental.
 * El dominio declara la forma; validarla contra un JSON es trabajo del adaptador.
 */

export type NivelId = 0 | 1 | 2 | 3;

export interface Nivel {
  id: NivelId;
  nombre: string;
  publico: string;
  edades: string;
  requiereApi: boolean;
  /** Una línea que dice qué se hace en este nivel, no qué se "aprende". */
  hace: string;
}

export const NIVELES: readonly Nivel[] = [
  { id: 0, nombre: "Despegue", publico: "Primaria alta", edades: "9 a 12 años", requiereApi: false,
    hace: "Ordenas el sistema solar, sigues las fases de la Luna y explicas por qué hay estaciones." },
  { id: 1, nombre: "Órbita baja", publico: "Secundaria inicial", edades: "12 a 14 años", requiereApi: false,
    hace: "Mides distancias que no caben en la pizarra y lees tu primer gráfico de datos." },
  { id: 2, nombre: "Espacio profundo", publico: "Secundaria superior", edades: "15 a 17 años", requiereApi: true,
    hace: "Analizas clima espacial y defensa planetaria con las cifras que la NASA publicó esta semana." },
  { id: 3, nombre: "Estación", publico: "Universidad, primeros ciclos", edades: "17 años en adelante", requiereApi: true,
    hace: "Consultas la API directo y construyes tu propia visualización con retos abiertos." },
] as const;

export const nivelPorId = (id: number): Nivel | null =>
  NIVELES.find((n) => n.id === id) ?? null;

export type TipoPaso = "opcion" | "numero" | "orden" | "observacion";

export interface Paso {
  id: string;
  enunciado: string;
  tipo: TipoPaso;
  opciones?: string[];
  respuesta: string | number | string[];
  pista?: string;
  /** Obligatorio en niveles 2 y 3: de dónde sale la cifra del enunciado. */
  fuente: CodigoFuente;
}

export interface Concepto {
  id: string;
  titulo: string;
  explicacion: string;
  /** Aristas del mapa mental: ids de otros conceptos, del mismo tema o de otro. */
  conectaCon: string[];
}

export interface Tema {
  slug: string;
  nivel: NivelId;
  planeta: string;
  titulo: string;
  resumen: string;
  duracionMin: number;
  /** true = no toca ninguna API externa. Los niveles 0 y 1 son todos offline. */
  offline: boolean;
  conceptos: Concepto[];
  pasos: Paso[];
}

export interface Tarjeta {
  anverso: string;
  reverso: string;
}

export interface NodoMapa {
  id: string;
  titulo: string;
  explicacion: string;
  tema: string;
  aristas: string[];
}
