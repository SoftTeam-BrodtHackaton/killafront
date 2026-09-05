import type { ReactNode } from "react";

export default function Tarjeta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-l border border-borde bg-elevado p-6 ${className}`}>{children}</div>;
}
