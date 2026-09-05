"use client";
import { useState } from "react";
import type { Curso } from "@killalab/dominio";
import { comoOpenBadge, emitirCertificado } from "@killalab/dominio";
import { Boton } from "@/componentes/ui/Boton";
import Glifo from "@/componentes/marca/Glifo";
import { usarProgreso } from "@/componentes/progreso/almacen";
import { fechaCorta } from "@/lib/formato";

/**
 * El certificado de un curso terminado.
 *
 * Sigue **Open Badges 3.0**, el estándar abierto del 1EdTech, que es una
 * Verifiable Credential del W3C. O sea: ya es criptográficamente verificable, sin
 * billeteras, sin gas y sin cadena de bloques. Es exactamente lo que un NFT
 * prometería, resuelto por un estándar que las universidades y LinkedIn ya leen.
 * Por eso no hay NFT aquí: añadiría fricción para menores de edad y riesgo con
 * socios públicos a cambio de una propiedad que ya tenemos.
 *
 * Lo que falta y se dice en pantalla: **la firma**. Firmar la credencial es
 * trabajo del emisor, y el emisor es el backend. Una firma que el navegador puede
 * generar no acredita nada. Hasta entonces el certificado es legible y
 * descargable, pero no probado, y mentir sobre eso sería peor que no tenerlo.
 */
export default function Certificado({
  curso,
  completado,
  porcentaje,
}: {
  curso: Curso;
  completado: boolean;
  porcentaje: number;
}) {
  const { nombre, ponerNombre } = usarProgreso();
  const [borrador, setBorrador] = useState("");

  if (!completado) {
    return (
      <div className="border-t border-borde pt-e3">
        <h2 className="t-subtitulo text-tinta-sec">Certificado</h2>
        <p className="t-cuerpo medida mt-e1 text-tinta-sec">
          Se emite al resolver los {curso.pasos} retos del curso. Llevas {porcentaje} %.
        </p>
      </div>
    );
  }

  if (!nombre) {
    return (
      <div className="border-t-2 border-ok pt-e3">
        <h2 className="t-subtitulo text-tinta">Terminaste el curso</h2>
        <p className="t-cuerpo medida mt-e1 text-tinta-sec">
          Pon tu nombre completo como quieres que aparezca en el certificado. Se guarda solo en
          este navegador.
        </p>
        <form
          className="mt-e3 flex flex-wrap items-end gap-e2"
          onSubmit={(e) => {
            e.preventDefault();
            if (borrador.trim()) ponerNombre(borrador.trim());
          }}
        >
          <div>
            <label htmlFor="nombre" className="t-anotacion block">
              Tu nombre
            </label>
            <input
              id="nombre"
              value={borrador}
              onChange={(e) => setBorrador(e.target.value)}
              autoComplete="name"
              className="t-cuerpo mt-1 w-64 border-b-2 border-borde bg-transparent px-1 py-1 text-tinta focus:border-indigo focus:outline-none"
            />
          </div>
          <Boton type="submit" variante="primario" disabled={borrador.trim() === ""}>
            Emitir mi certificado
          </Boton>
        </form>
      </div>
    );
  }

  const emitido = new Date().toISOString();
  const cert = emitirCertificado(curso, nombre, emitido);
  const urlVerificacion = `${typeof window !== "undefined" ? window.location.origin : ""}/verificar/${cert.codigo}`;
  const credencial = comoOpenBadge(cert, urlVerificacion);

  function descargar() {
    const blob = new Blob([JSON.stringify(credencial, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `killalab-${cert.cursoSlug}-${cert.codigo}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* El diploma. Es lo único centrado de toda la aplicación, y aquí sí
          corresponde: un certificado es un objeto simétrico por convención. */}
      <div className="rounded-m border-2 border-indigo p-e4 text-center sm:p-e5">
        <Glifo tamano={32} className="mx-auto text-indigo" />

        <p className="t-anotacion mt-e3">certifica que</p>
        <p className="t-titulo mt-e1 text-tinta">{cert.estudiante}</p>

        <p className="t-anotacion mt-e3">completó el curso</p>
        <p className="t-subtitulo mt-e1 text-indigo">
          {cert.cursoTitulo}, nivel {cert.nivel}
        </p>

        <p className="t-apoyo mx-auto mt-e2 max-w-[46ch] text-tinta-sec">
          {cert.lecciones} lecciones y {cert.duracionMin} minutos de trabajo, resolviendo todos sus
          retos.
        </p>

        <div className="mx-auto mt-e4 max-w-[46ch] border-t border-borde pt-e3">
          <p className="t-anotacion">código de verificación</p>
          <p className="t-cifra mt-1 text-turquesa-texto">{cert.codigo}</p>
          <p className="t-cifra-min mt-e2 text-tinta-sec">
            emitido el {fechaCorta(cert.emitido)} por KillaLab
          </p>
        </div>
      </div>

      <div className="mt-e3 flex flex-wrap gap-e3">
        <Boton variante="primario" onClick={descargar}>
          Descargar la credencial
        </Boton>
        <a
          href={`/verificar/${cert.codigo}`}
          className="t-apoyo border-b border-borde pb-1 font-bold text-tinta transition-colors hover:border-indigo"
        >
          Ver la página de verificación
        </a>
      </div>

      <div className="mt-e4 max-w-[62ch] border-l-2 border-ambar pl-e3">
        <p className="t-apoyo text-tinta">
          El archivo que descargas es una credencial <strong>Open Badges 3.0</strong>: el estándar
          abierto que leen Credly, LinkedIn y las universidades. Es una Verifiable Credential del
          W3C, así que es verificable sin billeteras ni cadena de bloques.
        </p>
        <p className="t-apoyo mt-e2 text-tinta-sec">
          Todavía va <strong>sin firma</strong>. Firmarla es trabajo del emisor y lo hará nuestro
          servidor cuando esté en pie; una firma generada en tu navegador no acreditaría nada.
          Preferimos decírtelo a que te enteres cuando alguien intente comprobarla.
        </p>
      </div>
    </div>
  );
}
