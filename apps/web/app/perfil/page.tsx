import Link from "next/link";
import { estadoDeLaPlataforma } from "@killalab/composicion";
import Registro from "@/componentes/layout/Registro";

export const metadata = { title: "Tu perfil" };

/**
 * El perfil depende del backend del equipo. Mientras no esté conectado, la
 * pantalla dice exactamente qué falta en vez de enseñar un panel de mentira con
 * cifras en cero: un progreso inventado es una cifra sin fuente, y eso es lo
 * único que este producto no hace.
 */
export default function PaginaPerfil() {
  const { progresoPersistente } = estadoDeLaPlataforma();

  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">tu expediente</p>
        <div>
          <h1 className="t-masthead text-tinta">Tu perfil</h1>
          <p className="t-cuerpo medida mt-e3 text-tinta-sec">
            Tus misiones resueltas, tus badges y tus certificados de trayectoria, con su código de
            verificación público.
          </p>
        </div>
      </section>

      <Registro anotacion={progresoPersistente ? "conectado" : "sin cuenta"}>
        <div className="max-w-[52ch] border-l-2 border-ambar pl-e3">
          <h2 className="t-titulo text-tinta">Todavía no hay cuentas</h2>
          <p className="t-cuerpo mt-e2 text-tinta">
            El avance de una misión se guarda mientras la tienes abierta, pero aún no se conserva
            entre sesiones: eso llega cuando esté conectado el servicio de cuentas y progreso.
          </p>
          <p className="t-cuerpo mt-e2 text-tinta-sec">
            Mientras tanto puedes resolver cualquier misión y usar el mural de notas, que sí se
            guarda en este navegador.
          </p>
          <p className="mt-e3 flex flex-wrap gap-e3">
            <Link
              href="/misiones"
              className="t-apoyo border-b-2 border-ambar pb-0.5 font-bold text-tinta"
            >
              Ir a las misiones
            </Link>
            <Link
              href="/notas"
              className="t-apoyo border-b border-borde pb-0.5 text-tinta hover:border-indigo"
            >
              Abrir mis notas
            </Link>
          </p>
        </div>
      </Registro>
    </div>
  );
}
