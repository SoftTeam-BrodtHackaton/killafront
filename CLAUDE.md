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

**Una sola rama: `main`.** Se trabaja y se commitea directo sobre ella. Se abandonó
GitFlow el 2026-09-05: con un equipo pequeño y plazo de hackathon, mantener
`develop` y ramas `feature/*` costaba más de lo que ordenaba.

Conventional Commits en español, mensaje en primera persona, sin scope entre
paréntesis. Los commits van con la identidad local del usuario, **sin trailers de
co-autoría ni menciones a herramientas de IA**.

El repo hermano `killalanding` (la portada pública) sigue la misma regla.

## Regla 3 — datos

Ninguna cifra científica se muestra sin su fuente, y ninguna fuente caída rompe la
pantalla: se degrada a caché o a respaldo, siempre fechada y etiquetada. La política
vive en `packages/dominio`; la UI solo la muestra (`componentes/dato/`).

Para desarrollar sin llave ni internet, levantar `apps/fake-api` y apuntar
`KILLALAB_NASA_BASE` / `KILLALAB_JPL_BASE` a `http://localhost:4000`. La fake API
sirve DONKI (FLR, CME, GST), NeoWs y JPL CAD con su forma real.

## Regla 4 — los dos repos

- `killafront` (este) — la **plataforma**: misiones, tarjetas, mapa mental, notas.
- `killalanding` — la **portada pública**, con el tablero de clima espacial.

Están separados a propósito: cambian por razones distintas y se despliegan solos.
El motivo completo está en `killalanding/docs/por-que-repo-aparte.md`. Los tokens de
diseño y las piezas de dato se duplican en los dos; si empiezan a divergir, hay que
revisar la decisión.

## Comandos

```bash
pnpm install
pnpm dev            # levanta fake-api (4000) y web (3000)
pnpm build
pnpm --filter @killalab/web exec tsc --noEmit
```
