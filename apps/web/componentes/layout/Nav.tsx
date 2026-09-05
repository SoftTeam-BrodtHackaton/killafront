import Link from "next/link";
import ConmutadorTema from "./ConmutadorTema";

const enlaces = [
  { href: "/misiones", texto: "Misiones" },
  { href: "/comunidades", texto: "Comunidades" },
  { href: "/docentes", texto: "Docentes" },
] as const;

export default function Nav() {
  return (
    <header className="border-b border-borde">
      <nav className="contenedor flex items-center justify-between gap-6 py-4">
        <Link href="/" className="font-display text-xl font-bold text-indigo">
          KillaLab
        </Link>
        <ul className="flex items-center gap-6 text-[15px]">
          {enlaces.map((e) => (
            <li key={e.href}>
              <Link href={e.href} className="text-tinta-sec hover:text-tinta">{e.texto}</Link>
            </li>
          ))}
          <li><ConmutadorTema /></li>
        </ul>
      </nav>
    </header>
  );
}
