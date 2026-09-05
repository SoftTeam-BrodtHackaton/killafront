/** Espejo tipado del esquema de Supabase. Se regenera con:
 *  pnpm dlx supabase gen types typescript --project-id <id> > src/tipos.ts */

export interface Usuario { id: string; rol: "estudiante" | "docente" | "admin"; creado: string }
export interface Estacion { id: string; colegio: string; region: string }
export interface Tripulacion { id: string; nombre: string; estacion_id: string }
export interface Progreso {
  id: string; usuario_id: string; tema_slug: string; paso_id: string;
  acierto: boolean; intentos: number; fecha: string;
}
export interface Nota { id: string; usuario_id: string; texto: string; x: number; y: number; color: string }
export interface EventoCache {
  id: string; clave: string; fuente: "DONKI" | "NeoWs" | "JPL CAD";
  payload: unknown; capturado: string;
}
export interface GrupoEstudiantil {
  id: string; nombre: string; institucion: string; area: string;
  contacto: string; ciudad: string; verificado: boolean;
}
