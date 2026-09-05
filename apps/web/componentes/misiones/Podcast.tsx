"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Narracion } from "@killalab/dominio";
import { Boton } from "@/componentes/ui/Boton";

/**
 * Escuchar la teoría.
 *
 * Una sola voz que explica de corrido, como quien te cuenta el tema camino al
 * colegio. No es un diálogo entre dos locutores: el texto lo escribió el taller
 * como narración seguida, así que aquí no hay turnos ni nombres.
 *
 * **Sobre la voz.** La pone el navegador (`speechSynthesis`): sin llave, sin coste
 * y sin internet una vez cargada la página. Se elige la mejor voz española
 * disponible —las de Google y las "natural" de Microsoft suenan bastante mejor que
 * la que sale por defecto— y se baja un poco la velocidad, que es lo que más
 * ayuda a que no suene a robot. Es el techo honesto sin un servicio de pago: para
 * voz de verdad, el plan es generar los audios antes con Piper y servirlos.
 *
 * Se lee párrafo a párrafo y no de un tirón porque los navegadores cortan los
 * textos largos, y además así se puede resaltar por dónde va y retomarlo.
 */

const claveDe = (slug: string) => `killa-escucha-${slug}`;

/** Voces que suenan claramente mejor, por orden de preferencia. */
const PREFERIDAS = [/google/i, /natural/i, /neural/i, /helena|sabina|laura|paulina|jorge/i];

function mejorVozEspanola(voces: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const espanolas = voces.filter((v) => v.lang.toLowerCase().startsWith("es"));
  if (espanolas.length === 0) return null;

  // Latinoamericanas primero: el contenido está escrito en español de Perú.
  const latinas = espanolas.filter((v) => !/es-es/i.test(v.lang));
  const candidatas = latinas.length > 0 ? latinas : espanolas;

  for (const patron of PREFERIDAS) {
    const encontrada = candidatas.find((v) => patron.test(v.name));
    if (encontrada) return encontrada;
  }
  return candidatas[0] ?? null;
}

export default function Podcast({ narracion }: { narracion: Narracion }) {
  const parrafos = narracion.parrafos;
  const [indice, setIndice] = useState(0);
  const [sonando, setSonando] = useState(false);
  const [voz, setVoz] = useState<SpeechSynthesisVoice | null>(null);
  const [haySintesis, setHaySintesis] = useState(true);
  const actual = useRef(0);

  useEffect(() => {
    const sintesis = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    setHaySintesis(Boolean(sintesis));
    if (!sintesis) return;

    // Las voces llegan de forma asíncrona en casi todos los navegadores.
    const cargar = () => setVoz(mejorVozEspanola(sintesis.getVoices()));
    cargar();
    sintesis.addEventListener("voiceschanged", cargar);

    try {
      const guardado = Number(localStorage.getItem(claveDe(narracion.slug)) ?? 0);
      if (Number.isFinite(guardado) && guardado > 0 && guardado < parrafos.length) {
        setIndice(guardado);
      }
    } catch {
      // Sin almacenamiento se empieza desde el principio.
    }

    return () => {
      sintesis.removeEventListener("voiceschanged", cargar);
      sintesis.cancel(); // nada peor que una página que sigue hablando sola
    };
  }, [narracion.slug, parrafos.length]);

  const recordar = useCallback(
    (i: number) => {
      try {
        localStorage.setItem(claveDe(narracion.slug), String(i));
      } catch {
        // Se pierde al cerrar, no antes.
      }
    },
    [narracion.slug],
  );

  const leer = useCallback(
    (desde: number) => {
      const sintesis = window.speechSynthesis;
      if (!sintesis) return;
      sintesis.cancel();

      const siguiente = (i: number) => {
        const texto = parrafos[i];
        if (!texto) {
          setSonando(false);
          setIndice(0);
          recordar(0);
          return;
        }

        const u = new SpeechSynthesisUtterance(texto);
        u.lang = voz?.lang ?? "es-PE";
        if (voz) u.voice = voz;
        // Más lento y con el tono apenas por debajo del neutro: es lo que más
        // distingue una lectura tranquila de la cantinela por defecto.
        u.rate = 0.92;
        u.pitch = 0.98;

        u.onstart = () => {
          setIndice(i);
          recordar(i);
        };
        u.onend = () => {
          if (actual.current !== i) return; // se pausó o se saltó
          actual.current = i + 1;
          siguiente(i + 1);
        };
        u.onerror = () => setSonando(false);

        sintesis.speak(u);
      };

      actual.current = desde;
      setSonando(true);
      siguiente(desde);
    },
    [parrafos, recordar, voz],
  );

  function pausar() {
    window.speechSynthesis?.cancel();
    actual.current = -1;
    setSonando(false);
  }

  const minutos = useMemo(
    () => Math.max(1, Math.round(parrafos.join(" ").length / 900)),
    [parrafos],
  );

  return (
    <div className="max-w-[62ch]">
      <h3 className="t-subtitulo text-tinta">{narracion.titulo}</h3>

      <div className="mt-e3 flex flex-wrap items-center gap-e3 border-t-2 border-indigo pt-e3">
        {haySintesis ? (
          <>
            <Boton variante="primario" onClick={() => (sonando ? pausar() : leer(indice))}>
              {sonando ? "Pausar" : indice > 0 ? "Continuar donde lo dejaste" : "Escuchar la explicación"}
            </Boton>

            {indice > 0 && !sonando ? (
              <Boton
                variante="sobrio"
                onClick={() => {
                  setIndice(0);
                  recordar(0);
                  leer(0);
                }}
              >
                Desde el principio
              </Boton>
            ) : null}
          </>
        ) : null}

        <p className="t-cifra-min text-tinta-sec">
          {minutos} min de escucha
          {voz ? `, voz ${voz.name.replace(/microsoft |google /i, "")}` : ""}
        </p>
      </div>

      {!haySintesis ? (
        <p className="t-apoyo mt-e3 border-l-2 border-ambar pl-e3 text-tinta">
          Tu navegador no puede leer en voz alta, pero el texto está completo aquí abajo. En Chrome
          o Edge sí funciona la lectura.
        </p>
      ) : null}

      {/* El texto completo, resaltando por dónde va la voz. Sirve para seguir con
          la vista, para quien no oye bien y para quien prefiere leer. */}
      <div className="mt-e4">
        {parrafos.map((p, i) => {
          const leyendo = i === indice && sonando;
          return (
            <p
              key={i}
              className={`t-cuerpo border-l-2 py-e2 pl-e3 transition-colors ${
                leyendo ? "border-turquesa text-tinta" : "border-transparent text-tinta-sec"
              }`}
            >
              {p}
            </p>
          );
        })}
      </div>
    </div>
  );
}
