"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Ficha, Tema } from "@killalab/dominio";
import { Boton } from "@/componentes/ui/Boton";

/**
 * Escuchar la lección.
 *
 * La voz la pone el navegador (`speechSynthesis`), no un servicio: sin llave, sin
 * coste, sin cuota y sin internet una vez cargada la página. Para un aula peruana
 * con datos móviles caros, esa es la diferencia entre que se use y que no.
 *
 * El guion no lo escribe un modelo en tiempo real: se arma con un `map()` sobre la
 * ficha, que a su vez sale del tema. Sigue valiendo la regla del proyecto — el
 * texto que se escucha no contiene nada que no esté en el contenido versionado.
 *
 * Se guarda por dónde ibas: volver y retomar en el turno 7 es la diferencia entre
 * un reproductor que se usa dos veces y uno que acompaña el camino al colegio.
 */

interface Turno {
  voz: "ana" | "beto";
  texto: string;
}

/** El guion, derivado de la ficha. Estructura fija: gancho, desarrollo, comprobación, cierre. */
function armarGuion(ficha: Ficha, tema: Tema): Turno[] {
  const turnos: Turno[] = [
    { voz: "ana", texto: `${ficha.titulo}.` },
    { voz: "beto", texto: ficha.idea },
  ];

  for (const p of ficha.puntos) {
    turnos.push({ voz: "ana", texto: `${p.titulo}.` });
    turnos.push({ voz: "beto", texto: p.explicacion });
  }

  for (const c of ficha.comprueba) {
    turnos.push({ voz: "ana", texto: c.pregunta });
    turnos.push({ voz: "beto", texto: `${c.respuesta}.` });
  }

  turnos.push({
    voz: "ana",
    texto: `Eso es ${tema.planeta}. Cuando quieras, abre la lección y resuelve el reto.`,
  });

  return turnos;
}

const claveDe = (slug: string) => `killa-podcast-${slug}`;

export default function Podcast({ ficha, tema }: { ficha: Ficha; tema: Tema }) {
  const guion = armarGuion(ficha, tema);
  const [turno, setTurno] = useState(0);
  const [sonando, setSonando] = useState(false);
  const [haySintesis, setHaySintesis] = useState(true);
  const turnoRef = useRef(0);

  // Retomar donde se quedó.
  useEffect(() => {
    setHaySintesis(typeof window !== "undefined" && "speechSynthesis" in window);
    try {
      const guardado = Number(localStorage.getItem(claveDe(tema.slug)) ?? 0);
      if (Number.isFinite(guardado) && guardado > 0 && guardado < guion.length) {
        setTurno(guardado);
        turnoRef.current = guardado;
      }
    } catch {
      // Sin almacenamiento se empieza desde el principio. No es grave.
    }
    // Cortar la voz al salir: nada peor que una página que sigue hablando sola.
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // El navegador no soporta síntesis; no había nada que cortar.
      }
    };
  }, [tema.slug, guion.length]);

  const recordar = useCallback(
    (i: number) => {
      try {
        localStorage.setItem(claveDe(tema.slug), String(i));
      } catch {
        // Igual que arriba: se pierde al cerrar, no antes.
      }
    },
    [tema.slug],
  );

  const decir = useCallback(
    (desde: number) => {
      const sintesis = window.speechSynthesis;
      if (!sintesis) return;

      sintesis.cancel();
      turnoRef.current = desde;

      const siguiente = (i: number) => {
        const t = guion[i];
        if (!t) {
          setSonando(false);
          setTurno(0);
          recordar(0);
          return;
        }

        const u = new SpeechSynthesisUtterance(t.texto);
        u.lang = "es-PE";
        // Dos voces distinguibles sin depender de que el sistema tenga voces en
        // español: se separan por tono y velocidad, no por nombre de voz.
        u.pitch = t.voz === "ana" ? 1.15 : 0.9;
        u.rate = t.voz === "ana" ? 1.02 : 0.96;

        u.onstart = () => {
          setTurno(i);
          recordar(i);
        };
        u.onend = () => {
          if (turnoRef.current !== i) return; // se pausó o se saltó
          turnoRef.current = i + 1;
          siguiente(i + 1);
        };
        u.onerror = () => setSonando(false);

        sintesis.speak(u);
      };

      setSonando(true);
      siguiente(desde);
    },
    [guion, recordar],
  );

  function pausar() {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // Sin síntesis no hay nada que pausar.
    }
    turnoRef.current = -1;
    setSonando(false);
  }

  const minutos = Math.max(1, Math.round(guion.reduce((n, t) => n + t.texto.length, 0) / 850));

  if (!haySintesis) {
    return (
      <div className="max-w-[56ch] border-l-2 border-ambar pl-e3">
        <h3 className="t-subtitulo text-tinta">Tu navegador no puede leer en voz alta</h3>
        <p className="t-cuerpo mt-e1 text-tinta-sec">
          Abajo está el mismo guion escrito. Lo puedes leer, o abrir esta página en Chrome o Edge,
          que sí traen voz.
        </p>
        <ol className="mt-e3">
          {guion.map((t, i) => (
            <li key={i} className="border-t border-borde py-e2">
              <span className="t-anotacion">{t.voz}</span>
              <p className="t-cuerpo mt-0.5 text-tinta">{t.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="max-w-[56ch]">
      <div className="flex flex-wrap items-center gap-e3 border-t-2 border-indigo pt-e3">
        <Boton variante="primario" onClick={() => (sonando ? pausar() : decir(turno))}>
          {sonando ? "Pausar" : turno > 0 ? "Continuar donde lo dejaste" : "Escuchar la lección"}
        </Boton>

        {turno > 0 && !sonando ? (
          <Boton
            variante="sobrio"
            onClick={() => {
              setTurno(0);
              recordar(0);
              decir(0);
            }}
          >
            Empezar de nuevo
          </Boton>
        ) : null}

        <p className="t-cifra-min text-tinta-sec">
          {minutos} min, turno {turno + 1} de {guion.length}
        </p>
      </div>

      {/* El guion completo, resaltando por dónde va. Sirve para seguir con la
          vista, para quien no oye bien, y para leerlo si prefiere leer. */}
      <ol className="mt-e4">
        {guion.map((t, i) => {
          const actual = i === turno && sonando;
          return (
            <li
              key={i}
              className={`border-l-2 py-e2 pl-e3 transition-colors ${
                actual ? "border-turquesa" : "border-transparent"
              }`}
            >
              <span className="t-anotacion">{t.voz}</span>
              <p className={`t-cuerpo mt-0.5 ${actual ? "text-tinta" : "text-tinta-sec"}`}>
                {t.texto}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
