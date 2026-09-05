# KillaLab

Plataforma educativa peruana que enseña ciencia espacial con datos reales de la NASA.
Cada cifra que ve el estudiante viene de una API pública y muestra su fuente.
Acceso gratuito y permanente para estudiantes; sin fines de lucro.

---

## Problema & Enfoque Lean

**Problema.** La ciencia espacial llega a las aulas peruanas como contenido enlatado,
traducido y desactualizado. El estudiante nunca ve un dato real ni sabe de dónde sale, y
quien sí se engancha no conoce las comunidades técnicas a las que podría acercarse.

**Usuario objetivo.**
- *Primario:* estudiantes de 9 a 20 años (primaria alta → primeros ciclos de universidad).
- *Comprador:* docente de ciencia y dirección de colegio (licencia institucional).

**MVP.**
1. Landing con **dato en vivo** desde NASA DONKI en el héroe, con fuente y hora visibles.
2. Cuatro niveles; los niveles 0 y 1 no dependen de ninguna API y funcionan sin conexión.
3. Formato **Misión** + **Tarjetas** generadas automáticamente desde el mismo JSON.
4. **Mapa mental** del planeta recorrido.
5. **Directorio de grupos estudiantiles** reales (8–12 entradas verificadas).

> El directorio se publica vacío hasta tener entradas reales con contacto verificado.
> Sembrarlo con nombres inventados sería lo contrario de lo que promete el producto.

**Hoja de ruta:** app nativa Expo, podcast semanal por TTS, video corto vertical,
badges Credly Open Badges 3.0, tabla de posiciones entre colegios.

**Métrica que importa:** colegios activos. No descargas ni registros.

---

## Stack Tecnológico & IA

Monorepo **Turborepo + pnpm**. Web primero, Expo después: la landing necesita SEO,
proyección en aula y un sistema tipográfico exigente, y React Native Web rinde mal ahí.

| Capa | Tecnología |
|---|---|
| Web (MVP) | Next.js 15 App Router · React 19 · TypeScript · Tailwind v4 · PWA instalable con offline para Nivel 0/1 |
| Nativo (hoja de ruta) | Expo SDK 54 + Expo Router, reutilizando `packages/` sin reescribir el núcleo |
| Tipografías | Bricolage Grotesque · Atkinson Hyperlegible · IBM Plex Mono |
| Arquitectura | Puertos y adaptadores (hexagonal): `dominio` sin dependencias, `adaptadores`, `composicion` |
| Backend | Route Handlers de Next.js como BFF + backend propio del equipo (repo aparte) |
| Contenido | JSON versionado en el repo, validado con zod al importar |
| APIs externas | NASA **DONKI**, **NeoWs**, **JPL CAD** |
| IA | Claude en pipeline offline: genera misiones y tarjetas desde el JSON del tema |
| Deploy | Vercel |

**Dos reglas de datos que el código obliga a cumplir:**
- Ninguna cifra se muestra sin su fuente. `EtiquetaFuente` recibe `fuente` como prop
  requerida, así que el tipo hace imposible olvidarla.
- Si una fuente falla, se sirve el último dato conocido **con su fecha**. El módulo no
  se oculta y jamás se inventa un valor. La cadena `vivo → caché → respaldo` es política
  de dominio, no un `try/catch` del cliente HTTP: vive en
  `packages/dominio/src/casos-uso/observar-clima-espacial.ts` y se puede probar sin red.

Detalle completo en [`docs/arquitectura.md`](docs/arquitectura.md).

---

## Setup Local

```bash
git clone https://github.com/<org>/killalab.git
cd killalab
pnpm install
cp .env.example .env.local     # NASA_API_KEY basta con DEMO_KEY para desarrollo
pnpm dev                       # http://localhost:3000
```

Sin claves ni internet, la app arranca igual: `pnpm dev` levanta también
`apps/fake-api` en el puerto 4000, y todo dato que venga de ahí sale etiquetado en
pantalla como simulado. Si además se apaga la fake API, el héroe cae a los respaldos
fechados de `packages/adaptadores/src/nasa/respaldos/`.

Otros comandos: `pnpm build`, `pnpm typecheck`, `pnpm lint` (Turborepo los propaga a todos
los paquetes).

---

## Estructura

```
apps/web              Next.js 15 — landing y plataforma (MVP)
apps/fake-api         Imita DONKI/NeoWs/CAD para desarrollar sin llave ni internet
apps/native           Expo — hoja de ruta
packages/dominio      Modelo, puertos y casos de uso. Cero dependencias
packages/adaptadores  NASA, catálogo JSON, caché, reloj, backend HTTP
packages/composicion  Raíz de composición: cablea puertos con adaptadores
packages/tokens       Sistema de diseño: color, tipografía, retícula
packages/content      Temas de Nivel 0 y 1 en JSON crudo
docs/                 Arquitectura, arquitectura de frontend, flujo de git
```

---

## Integrantes & Roles

| Nombre completo | GitHub | Rol |
|---|---|---|
| — | @— | Líder de producto / frontend |
| — | @— | Backend e integración de APIs NASA |
| — | @— | Datos e IA (pipeline de contenido) |
| — | @— | Diseño y contenido pedagógico |

---

## Contribuir

GitFlow y Conventional Commits. Detalle en [docs/flujo-git.md](docs/flujo-git.md).

## Sobre alianzas

KillaLab trabaja junto a comunidades estudiantiles de tecnología del Perú, entre ellas
capítulos y ramas estudiantiles IEEE, para acercar a más estudiantes a la ciencia y la
ingeniería. No es un proyecto oficial ni avalado por ninguna de esas instituciones; los
logos y certificados de terceros solo se usarán con convenio escrito.
