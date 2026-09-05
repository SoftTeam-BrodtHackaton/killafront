import Link from "next/link";
import Glifo from "./Glifo";

/**
 * El lockup: glifo y nombre. El nombre va en la display a peso 800 con el
 * tracking cerrado, para que lea como una pieza sola y no como dos elementos
 * puestos uno al lado del otro.
 */
export default function Lockup({ tamano = 28 }: { tamano?: number }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 text-indigo">
      <Glifo tamano={tamano} />
      <span
        className="font-display font-extrabold leading-none tracking-[-0.04em]"
        style={{ fontSize: tamano * 0.78 }}
      >
        killalab
      </span>
    </Link>
  );
}
