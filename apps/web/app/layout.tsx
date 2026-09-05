import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Atkinson_Hyperlegible, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/componentes/layout/Nav";
import Pie from "@/componentes/layout/Pie";
import RegistroSW from "@/componentes/layout/RegistroSW";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--fuente-display", weight: ["600", "700", "800"] });
const cuerpo = Atkinson_Hyperlegible({ subsets: ["latin"], variable: "--fuente-cuerpo", weight: ["400", "700"] });
const dato = IBM_Plex_Mono({ subsets: ["latin"], variable: "--fuente-dato", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "KillaLab — ciencia espacial con datos reales de la NASA",
  description:
    "Plataforma educativa peruana. Cada cifra que ves viene de una API pública y muestra su fuente. Gratis para estudiantes.",
  manifest: "/manifest.webmanifest",
  openGraph: { locale: "es_PE", type: "website" },
};

export const viewport: Viewport = { themeColor: "#2D2A6E", width: "device-width", initialScale: 1 };

/* Evita el parpadeo de tema: corre antes de pintar, respeta prefers-color-scheme
   en la primera visita y la preferencia guardada después. */
const guionTema = `(function(){try{var t=localStorage.getItem("killa-tema");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"oscuro":"claro"}document.documentElement.setAttribute("data-tema",t)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: guionTema }} />
      </head>
      <body className={`${display.variable} ${cuerpo.variable} ${dato.variable}`}>
        <a href="#contenido" className="sr-only focus:not-sr-only">Saltar al contenido</a>
        <Nav />
        <main id="contenido">{children}</main>
        <Pie />
        <RegistroSW />
      </body>
    </html>
  );
}
