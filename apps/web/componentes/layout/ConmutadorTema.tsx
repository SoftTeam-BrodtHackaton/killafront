"use client";
import { useEffect, useState } from "react";

type Tema = "claro" | "oscuro";

export default function ConmutadorTema() {
  const [tema, setTema] = useState<Tema>("claro");

  useEffect(() => {
    const actual = (document.documentElement.getAttribute("data-tema") as Tema) ?? "claro";
    setTema(actual);
  }, []);

  function alternar() {
    const siguiente: Tema = tema === "claro" ? "oscuro" : "claro";
    document.documentElement.setAttribute("data-tema", siguiente);
    try { localStorage.setItem("killa-tema", siguiente); } catch {}
    setTema(siguiente);
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={`Cambiar a modo ${tema === "claro" ? "oscuro" : "claro"}`}
      className="rounded-m border border-borde px-3 py-2 text-tinta-sec hover:text-tinta"
    >
      {tema === "claro" ? "☾" : "☀"}
    </button>
  );
}
