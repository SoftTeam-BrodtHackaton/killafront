import Link from "next/link";
import Lockup from "@/componentes/marca/Lockup";
import ConmutadorTema from "./ConmutadorTema";

const enlaces = [
  { href: "/misiones", texto: "Misiones" },
  { href: "/comunidades", texto: "Comunidades" },
  { href: "/docentes", texto: "Docentes" },
] as const;

/**
 * La cabecera es la primera línea de la hoja: la marca a la izquierda, la
 * navegación pegada al canto derecho, y una regla índigo de dos píxeles debajo
 * que ata la página a la retícula.
 */
export default function Nav() {
  return (
    <header className="border-b-2 border-indigo">
      {/* En móvil la fila se parte: la marca arriba y la navegación debajo, repartida.
          Antes se apretaba en una sola línea y desbordaba a scroll horizontal. */}
      <nav className="hoja flex flex-wrap items-center justify-between gap-y-e2 py-e2">
        <Lockup />

        <ul className="flex w-full items-center justify-between gap-e2 sm:w-auto sm:justify-end sm:gap-e3">
          {enlaces.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                className="t-apoyo border-b border-transparent pb-0.5 text-tinta-sec transition-colors hover:border-indigo hover:text-tinta"
              >
                {e.texto}
              </Link>
            </li>
          ))}
          <li className="sm:ml-e1">
            <ConmutadorTema />
          </li>
        </ul>
      </nav>
    </header>
  );
}
