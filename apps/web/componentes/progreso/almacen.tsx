"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PasosResueltos } from "@killalab/dominio";

/**
 * Dónde vive el avance del estudiante, hoy.
 *
 * En `localStorage`, no en un servidor. Es una decisión, no una carencia: una
 * misión resuelta en un aula sin internet estable no puede depender de que una
 * petición llegue. Lo que se estudia se guarda al instante y funciona sin red.
 *
 * El precio está declarado en pantalla: el avance vive en ese navegador y no
 * viaja a otro dispositivo. Cuando el backend del equipo esté en pie, este
 * proveedor sincroniza contra `killalab.progreso` y **ninguna pantalla cambia**,
 * porque todas leen de aquí y no de `localStorage` directamente.
 *
 * Todos los accesos van dentro de try/catch: en navegación privada, o con el
 * almacenamiento bloqueado, `localStorage` lanza. Eso no puede tumbar una clase.
 */

const CLAVE = "killa-progreso";
const CLAVE_NOMBRE = "killa-estudiante";

interface Almacen {
  /** null mientras no se ha leído del navegador: evita pintar 0 % y luego saltar. */
  resueltos: PasosResueltos | null;
  nombre: string;
  cargado: boolean;
  marcarPaso(temaSlug: string, pasoId: string): void;
  reiniciarTema(temaSlug: string): void;
  ponerNombre(nombre: string): void;
}

const Contexto = createContext<Almacen | null>(null);

function leerDelNavegador<T>(clave: string, porDefecto: T): T {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

export function ProveedorDeProgreso({ children }: { children: React.ReactNode }) {
  const [resueltos, setResueltos] = useState<PasosResueltos | null>(null);
  const [nombre, setNombre] = useState("");
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    setResueltos(leerDelNavegador<PasosResueltos>(CLAVE, {}));
    setNombre(leerDelNavegador<string>(CLAVE_NOMBRE, ""));
    setCargado(true);
  }, []);

  const guardar = useCallback((siguiente: PasosResueltos) => {
    setResueltos(siguiente);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(siguiente));
    } catch {
      // Sin almacenamiento el avance vale para esta sesión. Se sigue estudiando.
    }
  }, []);

  const marcarPaso = useCallback(
    (temaSlug: string, pasoId: string) => {
      setResueltos((previo) => {
        const base = previo ?? {};
        const delTema = base[temaSlug] ?? [];
        if (delTema.includes(pasoId)) return base;

        const siguiente = { ...base, [temaSlug]: [...delTema, pasoId] };
        try {
          localStorage.setItem(CLAVE, JSON.stringify(siguiente));
        } catch {
          // Igual que arriba: se pierde al cerrar, no antes.
        }
        return siguiente;
      });
    },
    [],
  );

  const reiniciarTema = useCallback(
    (temaSlug: string) => {
      const base = { ...(resueltos ?? {}) };
      delete base[temaSlug];
      guardar(base);
    },
    [resueltos, guardar],
  );

  const ponerNombre = useCallback((n: string) => {
    setNombre(n);
    try {
      localStorage.setItem(CLAVE_NOMBRE, JSON.stringify(n));
    } catch {
      // El nombre solo se usa para el certificado; sin él se pide otra vez.
    }
  }, []);

  const valor = useMemo<Almacen>(
    () => ({ resueltos, nombre, cargado, marcarPaso, reiniciarTema, ponerNombre }),
    [resueltos, nombre, cargado, marcarPaso, reiniciarTema, ponerNombre],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usarProgreso(): Almacen {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("usarProgreso necesita estar dentro de ProveedorDeProgreso");
  return ctx;
}
