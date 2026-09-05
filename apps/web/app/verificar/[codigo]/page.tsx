import Link from "next/link";
import Glifo from "@/componentes/marca/Glifo";
import { EMISOR } from "@killalab/dominio";

export const metadata = { title: "Verificar un certificado" };

/**
 * La página pública de verificación de un certificado.
 *
 * Aquí no se puede mentir. Sin backend no hay registro de certificados emitidos,
 * así que esta página **no puede confirmar** que el código sea auténtico, y lo
 * dice con todas sus letras en vez de enseñar un tranquilizador "verificado".
 *
 * Un verificador que aprueba cualquier cosa es peor que no tener verificador:
 * entrena a la gente a confiar en un sello que no significa nada.
 */
export default async function Verificar({ params }: { params: Promise<{ codigo: string }> }) {
  const codigo = decodeURIComponent((await params).codigo).toUpperCase();

  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">verificación</p>

        <div className="max-w-[62ch]">
          <Glifo tamano={28} className="text-indigo" />
          <h1 className="t-titulo mt-e2 text-tinta">Verificación de certificado</h1>

          <div className="mt-e4 border-t-2 border-indigo pt-e3">
            <p className="t-anotacion">código consultado</p>
            <p className="t-lectura mt-1 text-turquesa-texto">{codigo}</p>
          </div>

          <div className="mt-e4 border-l-2 border-ambar pl-e3">
            <h2 className="t-subtitulo text-tinta">Todavía no podemos confirmarlo</h2>
            <p className="t-cuerpo mt-e2 text-tinta">
              El registro público de certificados vive en nuestro servidor, y ese servicio aún no
              está en pie. Hasta que lo esté, esta página no puede decir si un código es auténtico.
            </p>
            <p className="t-cuerpo mt-e2 text-tinta-sec">
              Preferimos decirlo así de claro. Un verificador que aprueba cualquier código es peor
              que no tener ninguno: enseña a confiar en un sello que no significa nada.
            </p>
          </div>

          <div className="mt-e4">
            <h2 className="t-subtitulo text-tinta">Mientras tanto</h2>
            <p className="t-cuerpo mt-e2 text-tinta-sec">
              El certificado se descarga como credencial <strong>Open Badges 3.0</strong>, un
              estándar abierto del 1EdTech que cualquier verificador externo sabe leer. El archivo
              lleva dentro el curso, el emisor y la fecha, y se puede inspeccionar sin pedirnos
              permiso.
            </p>
            <dl className="mt-e3">
              <div className="border-t border-borde py-e2">
                <dt className="t-anotacion">Emisor</dt>
                <dd className="t-cuerpo mt-0.5 text-tinta">{EMISOR.nombre}</dd>
              </div>
              <div className="border-t border-borde py-e2">
                <dt className="t-anotacion">Estándar</dt>
                <dd className="t-cuerpo mt-0.5 text-tinta">
                  Open Badges 3.0, sobre Verifiable Credentials del W3C
                </dd>
              </div>
              <div className="border-t border-borde py-e2">
                <dt className="t-anotacion">Firma</dt>
                <dd className="t-cuerpo mt-0.5 text-warn">
                  <span aria-hidden="true">○ </span>
                  pendiente: la pone el emisor cuando el servicio esté activo
                </dd>
              </div>
            </dl>
          </div>

          <p className="mt-e5">
            <Link href="/" className="t-apoyo border-b border-borde pb-1 font-bold text-tinta hover:border-indigo">
              Ir al panel
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
