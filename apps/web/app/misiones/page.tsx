import Link from "next/link";
import { NIVELES, temasPorNivel } from "@killalab/content";
import Badge from "@/componentes/ui/Badge";

/** Estático: los niveles 0 y 1 tienen que abrir sin red. */
export const dynamic = "force-static";

export const metadata = { title: "Misiones — KillaLab" };

export default function Misiones() {
  return (
    <div className="seccion">
      <div className="contenedor">
        <h1 className="t-h1 text-tinta">Misiones</h1>
        {NIVELES.map((n) => {
          const temas = temasPorNivel(n.id);
          return (
            <section key={n.id} className="mt-12">
              <h2 className="t-h3 text-indigo">
                Nivel {n.id} · {n.nombre}
              </h2>
              <p className="mt-1 text-[15px] text-tinta-sec">{n.publico}</p>
              {temas.length === 0 ? (
                <p className="font-dato mt-4 text-[13px] text-tinta-sec">
                  contenido en producción
                </p>
              ) : (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {temas.map((t) => (
                    <li key={t.slug} className="rounded-l border border-borde p-5">
                      <Link href={`/misiones/${t.nivel}/${t.slug}`} className="font-display text-lg font-semibold text-tinta hover:text-indigo">
                        {t.titulo}
                      </Link>
                      <p className="mt-2 text-[15px] text-tinta-sec">{t.resumen}</p>
                      <div className="mt-4 flex items-center gap-3">
                        <Badge>{t.duracionMin} min</Badge>
                        {t.offline ? <Badge>sin conexión</Badge> : <Badge tono="dato">datos NASA</Badge>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
