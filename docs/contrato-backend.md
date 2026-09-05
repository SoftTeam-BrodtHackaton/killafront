# Contrato con el backend de KillaLab

El backend lo construye el equipo en un repo aparte. Este documento es lo que la
web espera de él: rutas, forma de los cuerpos y reglas de comportamiento.

Del lado de la web **solo cambia un archivo** cuando el servicio esté en pie:
`packages/adaptadores/src/plataforma/backend-killalab.ts`. Ninguna pantalla se
toca. Esa es la razón de ser de los puertos.

```
apps/web  →  @killalab/composicion  →  PuertoProgreso / PuertoDirectorio
                                              │
                        KILLALAB_BACKEND_URL ─┴─►  backend del equipo (HTTP)
                        sin esa variable      ─┴─►  dobles locales en memoria
```

Sin `KILLALAB_BACKEND_URL` la web arranca igual: los dobles de `sin-backend.ts`
cumplen los mismos puertos y se declaran `disponible: false`, así que la interfaz
dice en pantalla que el progreso no se conserva en vez de fingir que guardó algo.

## Reglas de la casa

Antes de las rutas, porque valen para todas:

1. **Fechas ISO 8601 en UTC**, siempre con zona (`2026-09-05T14:03:22.000Z`).
   Nunca fechas locales ni epoch.
2. **Nunca `null` donde el tipo dice lista.** Sin datos es `[]`, con 200. Un
   estudiante sin progreso no es un 404.
3. **Sin envoltorio.** El cuerpo es el recurso: `[...]` o `{...}`, no
   `{ "data": ... }`. El cliente hace `await r.json()` y castea directo; añadir
   una envoltura obliga a tocar el adaptador.
4. **Nombres de campo en español**, exactamente como el modelo del dominio
   (`packages/dominio/src/modelo/comunidad.ts`). `temaSlug`, no `topic_slug`.
5. **Timeout de 6 s en el cliente**, con `AbortController`. Todo lo que tarde más
   se ve como caída. Objetivo razonable: responder por debajo de 1 s.
6. **Idempotencia** en las escrituras de progreso: repetir el mismo paso no
   duplica ni suma dos veces.
7. **Errores con cuerpo legible**, aunque hoy el cliente solo mire el estado:

```json
{ "error": { "codigo": "estudiante_no_encontrado", "mensaje": "..." } }
```

### Trampa de la URL base

El cliente compone con `new URL(ruta, BASE)`. Como las rutas empiezan por `/`,
**cualquier prefijo de camino en la base se pierde**:

```
BASE = "https://api.killalab.dev/v1"  +  "/grupos"  →  https://api.killalab.dev/grupos
```

O el backend expone las rutas en la raíz del host, o hay que versionarlas por
cabecera o subdominio (`https://v1.api.killalab.dev`). Si el equipo prefiere
`/api/v1/...`, decidlo ahora y lo cambio en el adaptador: es una línea.

## v0 — lo que el cliente ya llama

Estas tres rutas son las que hoy están escritas en el adaptador. Con ellas hechas
la demo pasa de "progreso en memoria" a "progreso de verdad".

### `GET /salud`

Para saber si el servicio está en pie antes de cablearlo.

```json
{ "estado": "ok", "servicio": "killalab-backend", "hora": "2026-09-05T14:03:22.000Z" }
```

### `GET /progreso/{estudianteId}`

Todo el avance de un estudiante, un elemento por tema empezado. Devuelve `[]` si
no empezó ninguno.

```json
[
  {
    "temaSlug": "clima-espacial",
    "estado": "en-curso",
    "pasosResueltos": ["p1", "p2"],
    "actualizado": "2026-09-05T14:03:22.000Z"
  }
]
```

| Campo | Tipo | Notas |
|---|---|---|
| `temaSlug` | string | el `slug` del tema en `packages/content`; el backend no valida el catálogo |
| `estado` | `"sin-empezar"` \| `"en-curso"` \| `"resuelta"` | exactamente esos tres valores, en español y con guion |
| `pasosResueltos` | string[] | ids de paso, **sin repetidos** y en orden de resolución |
| `actualizado` | string | ISO 8601 UTC de la última escritura |

`estado` lo decide el backend: `"resuelta"` cuando `pasosResueltos` cubre todos
los pasos del tema. Si el backend no conoce el catálogo, que devuelva siempre
`"en-curso"` y lo cierre la web — pero entonces hay que decirlo, porque hoy la
web se fía del campo.

### `POST /progreso/{estudianteId}/pasos`

Registra un paso resuelto y devuelve **el progreso completo de ese tema ya
actualizado**, no un acuse de recibo.

```
POST /progreso/est_123/pasos
Content-Type: application/json

{ "temaSlug": "clima-espacial", "pasoId": "p3" }
```

```json
{
  "temaSlug": "clima-espacial",
  "estado": "en-curso",
  "pasosResueltos": ["p1", "p2", "p3"],
  "actualizado": "2026-09-05T14:07:10.000Z"
}
```

- Si el paso ya estaba, **200 con el mismo objeto**, no 409. El alumno puede
  reintentar y la red puede reenviar.
- Si el estudiante no existía, crearlo. La web no tiene una ruta de alta.
- 201 también vale; el cliente solo mira que sea 2xx.

### `GET /grupos`

El directorio de grupos estudiantiles. Es la función de más valor social del
producto, y hoy la pantalla está vacía a propósito porque no hay entradas reales.

```json
[
  {
    "id": "g_ieee_unsa",
    "nombre": "Rama Estudiantil IEEE UNSA",
    "institucion": "Universidad Nacional de San Agustín",
    "ciudad": "Arequipa",
    "area": "Ingeniería aeroespacial",
    "contacto": "ieee@unsa.edu.pe",
    "proximoEvento": "2026-10-12T18:00:00.000Z",
    "nombreEvento": "Taller de defensa planetaria"
  }
]
```

- `proximoEvento` y `nombreEvento` son `null` cuando no hay nada abierto
  anunciado. Van juntos: o los dos con valor, o los dos `null`.
- `contacto` es texto que se publica: correo o URL, nunca un teléfono personal.
- **El modelo no tiene campo de logo, y es deliberado.** Ningún logo de terceros
  se publica sin autorización escrita de uso de marca. Si el backend añade
  `logoUrl`, la web lo ignorará.
- Solo entran grupos **reales con contacto verificado**. Sembrar el directorio
  con nombres inventados contradice la promesa del producto entero.

## v1 — lo que hace falta decidir

Nada de esto está escrito en el cliente todavía. Son las promesas que ya hacen
las pantallas y que hoy no tienen backend detrás.

### Identidad (bloquea todo lo demás)

`estudianteId` aparece en las dos rutas de progreso y **nadie lo emite todavía**.
Hay que cerrar:

- ¿Cuentas con correo y contraseña, enlace mágico, o código de aula que reparte
  el docente? Con menores de edad, un código de aula evita pedir correos.
- ¿El token va en `Authorization: Bearer ...`? ¿Lo guarda el servidor de Next en
  cookie httpOnly, o viaja al navegador?
- Hoy **todas las llamadas salen del servidor de Next**, no del navegador: no hay
  problema de CORS. En cuanto entre `apps/native` (Expo) sí lo habrá, así que
  conviene definir el CORS desde ahora.

Propuesta mínima para no bloquear la demo: `POST /sesiones` con un código de
aula, que devuelve `{ estudianteId, token, expira }`.

### Badges y certificados

La pantalla de perfil ya promete "badges y certificados de trayectoria, con su
código de verificación público". La decisión tomada es **Open Badges 3.0, sin
NFT**: ya es verificable y la cripto añade fricción y riesgo con socios públicos
y con menores.

- `GET /perfil/{estudianteId}` → nombre visible, badges, certificados.
- `GET /verificar/{codigo}` → **pública, sin token**. Es la que hace que un
  certificado valga algo: cualquiera pega el código y ve qué se logró y cuándo.

### Alta en el directorio

La pantalla de comunidades ofrece sumarse, pero no hay dónde. `POST /grupos`
con moderación: entra como `pendiente` y no aparece en `GET /grupos` hasta que
alguien lo verifica. Ese paso de verificación humana es el producto.

### Notas

Hoy el mural vive en `localStorage` y se pierde al cambiar de dispositivo. Si se
sincroniza: `GET`/`PUT /notas/{estudianteId}`, con el cuerpo completo del mural y
resolución "gana el último". No merece más complejidad.

### Aulas y docentes

La pantalla de docentes es informativa. Si el backend va a soportar aulas, hace
falta un puerto nuevo (`PuertoAulas`) y, con él, la lista de estudiantes de un
docente y el avance agregado del aula. **No para el hackathon.**

## Cómo lo conectamos

```bash
# apps/web/.env.local
KILLALAB_BACKEND_URL=http://localhost:8000
```

Con esa variable puesta, `composicion` cambia solo: `hayBackend()` pasa a `true`,
entran `progresoHttp()` y `directorioHttp()`, y `estadoDeLaPlataforma()` empieza
a reportar `progresoPersistente: true`. La UI deja de mostrar el aviso de "sin
cuenta" sin que nadie edite una pantalla.

Para verificar el contrato antes de cablear nada:

```bash
curl localhost:8000/salud
curl localhost:8000/progreso/est_123
curl -X POST localhost:8000/progreso/est_123/pasos \
  -H "content-type: application/json" \
  -d '{"temaSlug":"clima-espacial","pasoId":"p3"}'
curl localhost:8000/grupos
```

Si esas cuatro responden con la forma de arriba, la web funciona. No hace falta
nada más.

## Preguntas abiertas para el equipo

1. ¿Las rutas van en la raíz del host o bajo un prefijo tipo `/api/v1`?
2. ¿Quién emite `estudianteId` y cómo se autentica: correo, enlace mágico o
   código de aula?
3. ¿El backend conoce el catálogo de temas, o `estado` lo calcula la web?
4. ¿Hay alta y moderación de grupos, o el directorio se carga a mano por ahora?
5. ¿Para cuándo hay un `/salud` en pie, aunque el resto devuelva vacío? Con eso
   ya podemos cablear y probar la degradación de verdad.
