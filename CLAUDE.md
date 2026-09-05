# KillaLab — instrucciones del proyecto

## Regla 0 — al iniciar cualquier sesión, leer el vault ANTES de tocar código

La memoria del proyecto vive en el vault de Obsidian `E:\obsidian\killafrontOb`.
Antes de responder nada sustancial, leer en este orden:

1. `wiki/estado.md` — en qué punto está el proyecto y cuál es el siguiente paso
2. `wiki/mapa-codigo.md` — qué hay en cada carpeta del repo y por qué
3. `wiki/log.md` — las últimas entradas (`grep "^## \[" wiki/log.md | tail -5`)
4. `wiki/sintesis.md` — decisiones tomadas y su nivel de confianza

Luego contrastar contra el código real: si el vault dice algo que ya no es cierto,
corregir el vault en la misma sesión y anotarlo en el log. El vault describe el
estado; el código es la verdad.

## Regla 1 — al terminar un avance, escribirlo en el vault

Cada vez que se cierre un bloque de trabajo (una feature, una decisión de
arquitectura, un problema resuelto):

- Actualizar `wiki/estado.md` (qué se hizo, qué queda, cuál es el siguiente paso).
- Actualizar `wiki/mapa-codigo.md` si cambió la estructura de carpetas.
- Añadir decisiones nuevas a `wiki/sintesis.md` con `[alta]` / `[media]` / `[baja]`.
- Añadir entrada al final de `wiki/log.md`: `## [AAAA-MM-DD] avance | Título`.
- Crear páginas en `wiki/conceptos/` para mecanismos que valga la pena explicar.

No dejar el avance solo en el commit: el commit dice *qué* cambió, el vault dice
*por qué* y *qué sigue*.

## Regla 2 — git

GitFlow (`main` / `develop` / `feature/*`) y Conventional Commits en español.
Detalle en `docs/flujo-git.md`. Los commits van con la identidad local del usuario,
sin trailers de co-autoría ni menciones a herramientas de IA.

## Regla 3 — datos

Ninguna cifra científica se muestra sin su fuente, y ninguna fuente caída rompe la
pantalla: se degrada a caché o a fixture, siempre fechada y etiquetada. La política
vive en `packages/api`; la UI solo la muestra (`componentes/dato/`).

Para desarrollar sin llave ni internet, levantar `apps/fake-api` y apuntar
`KILLALAB_NASA_BASE` / `KILLALAB_JPL_BASE` a `http://localhost:4000`.

## Comandos

```bash
pnpm install
pnpm dev            # levanta fake-api (4000) y web (3000)
pnpm build
pnpm --filter @killalab/web exec tsc --noEmit
```
