"use client";
import { useEffect } from "react";

/** Registra el service worker solo en producción: en dev estorba al hot reload. */
export default function RegistroSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
