# APIs externas

Qué fuentes científicas consume KillaLab, con qué parámetros, qué devuelven de
verdad y dónde se traduce cada una al modelo del dominio.

Regla que manda sobre todo lo demás: **ninguna cifra se muestra sin su fuente, y
ninguna fuente caída rompe la pantalla**. Por eso los adaptadores de aquí solo
saben pedir y traducir; qué hacer cuando la fuente falla lo decide
`dominio/casos-uso/`, no el cliente HTTP. Ver `docs/arquitectura.md`.

## Resumen

| Fuente | Para qué | Llave | Dónde se usa | Estado |
|---|---|---|---|---|
| NASA DONKI `/FLR` | última llamarada solar | sí | portada (`LecturaSolar`), Nivel 2 | en uso |
| JPL CAD `/cad.api` | próximas aproximaciones | no | `/api/eventos?tipo=asteroides`, Nivel 2 | en uso |
| NASA NeoWs `/feed` | asteroides de hoy con diámetro | sí | `cercanosDeHoy()` | implementado, sin pantalla |
| NASA DONKI `/CME` | eyecciones de masa coronal | sí | — | candidata (la fake API ya la sirve) |
| NASA DONKI `/GST` | tormentas geomagnéticas (Kp) | sí | — | candidata (la fake API ya la sirve) |
| NASA APOD | imagen del día | sí | — | candidata, decorativa |
| NASA EONET | eventos naturales vistos desde órbita | no | — | candidata, Nivel 3 |

Los Niveles 0 y 1 **no tocan ninguna API**: su contenido es JSON versionado en
`packages/content`. Es una decisión de coste y de riesgo de demo, no solo
pedagógica: un aula sin internet sigue funcionando.

## Llaves y límites

```bash
NASA_API_KEY=...            # api.nasa.gov, gratis, correo y listo
KILLALAB_NASA_BASE=...      # opcional: apunta la NASA a la fake API
KILLALAB_JPL_BASE=...       # opcional: apunta el JPL a la fake API
```

- Sin `NASA_API_KEY` el cliente usa `DEMO_KEY`, limitada a **30 peticiones por
  hora y 50 por día, por IP**. Sirve para probar; en demo se agota sola.
- Con llave propia el límite sube a **1 000 peticiones por hora**. La cabecera
  `X-RateLimit-Remaining` de la respuesta dice cuánto queda.
- El **JPL no pide llave** y no publica un límite duro, pero pide uso razonable:
  cachear y no golpear en bucle.
- La llave **nunca llega al navegador**: el cliente pide a `/api/eventos`, que es
  un BFF en el servidor de Next (`apps/web/app/api/eventos/route.ts`). Esa ruta
  cachea 15 minutos (`s-maxage=900`) y revalida hasta 24 h.

## NASA DONKI — llamaradas solares

```
GET https://api.nasa.gov/DONKI/FLR?startDate=2026-08-29&endDate=2026-09-05&api_key=...
```

Devuelve un **array plano** de eventos, ordenado del más viejo al más nuevo (por
eso el caso de uso se queda con el último, no con el primero).

```json
[{
  "flrID": "2026-09-03T04:12:00-FLR-001",
  "beginTime": "2026-09-03T04:12Z",
  "peakTime": "2026-09-03T04:31Z",
  "classType": "M5.4",
  "activeRegionNum": 14116,
  "link": "https://webtools.ccmc.gsfc.nasa.gov/DONKI/view/FLR/..."
}]
```

Rarezas que ya están contempladas en `adaptadores/src/nasa/clima-espacial.ts`:

- `classType` **puede faltar**: la NASA a veces registra el evento sin
  clasificarlo. Se guarda `null` y la UI lo dice. No se inventa.
- Las marcas de tiempo vienen **sin segundos** y con `Z`
  (`"2026-09-03T04:12Z"`). `new Date()` las parsea bien; no reformatear a mano.
- Una semana tranquila devuelve `[]`. Array vacío **no es un error**: es una
  respuesta válida que el caso de uso degrada a caché o a respaldo.
- El rango cómodo es de unos 30 días. La portada pide 7.

`classType` es lo que alimenta la escala A→X de la portada
(`modelo/clima-espacial.ts`, `posicionEnEscala`). Es logarítmica: cada letra vale
diez veces la anterior, y con cinco letras hay cuatro tramos.

## JPL CAD — aproximaciones cercanas

```
GET https://ssd-api.jpl.nasa.gov/cad.api?dist-max=0.05&date-min=now&sort=date&limit=8
```

Es la fuente más incómoda de las tres, y la más fiable:

```json
{
  "signature": { "source": "NASA/JPL SBDB Close Approach Data API", "version": "1.5" },
  "count": "8",
  "fields": ["des", "orbit_id", "jd", "cd", "dist", "dist_min", "dist_max", "v_rel", "v_inf", "t_sigma_f", "h"],
  "data": [["2026 QF3", "7", "2461289.5", "2026-Sep-08 14:22", "0.0132", "...", "...", "8.71", "..."]]
}
```

- **Todo son strings**, incluso `count`. Convertir siempre con `Number()`.
- No hay objetos: hay `fields` (nombres de columna) y `data` (matriz). Nunca
  indexar por posición fija — el orden de `fields` puede cambiar entre versiones.
  El adaptador resuelve el índice por nombre: `r.fields.indexOf("dist")`.
- `dist` viene en **unidades astronómicas**, no en km. De ahí la multiplicación
  por `UNIDAD_ASTRONOMICA_KM`. Un error aquí son siete órdenes de magnitud.
- `cd` es texto legible en inglés (`"2026-Sep-08 14:22"`), no ISO 8601. Hoy se
  muestra tal cual; si alguna vez hay que ordenar por fecha, usar `jd` (día
  juliano) o parsearlo explícitamente.
- **CAD no da diámetro.** Por eso `diametroMinM` y `diametroMaxM` quedan `null` y
  existe además el adaptador de NeoWs.
- `dist-max=0.05` AU ≈ 7,5 millones de km ≈ 19 distancias lunares. Bajarlo a
  `0.01` deja la lista casi siempre vacía.

## NASA NeoWs — asteroides del día

```
GET https://api.nasa.gov/neo/rest/v1/feed?start_date=2026-09-05&end_date=2026-09-05&api_key=...
```

- El rango máximo son **7 días**; más devuelve 400.
- La respuesta agrupa por fecha: `near_earth_objects["2026-09-05"]` es un array.
  Si no hubo nada ese día, **la clave no existe** (no es `[]`). Por eso el
  adaptador usa `?.[hoy] ?? []`.
- `miss_distance.kilometers` y `relative_velocity.kilometers_per_second` son
  strings. `estimated_diameter.meters` sí trae números.
- Aporta lo que CAD no tiene: el diámetro estimado. Cuesta una llamada más, así
  que solo se usa donde el tamaño importa de verdad.

## Cómo se degrada cuando algo falla

Cadena de tres escalones, en `dominio/casos-uso/observar-clima-espacial.ts`:

```
vivo  →  cache  →  respaldo
```

1. **vivo** — la fuente respondió. Se guarda en el almacén temporal.
2. **cache** — la fuente falló pero hay una lectura anterior. Se muestra fechada,
   con el aviso de que no es de ahora. Un dato viejo bien fechado vale más que
   una pantalla rota.
3. **respaldo** — JSON versionado en `adaptadores/src/nasa/respaldos/`. Garantiza
   que la demo nunca enseñe un hueco.

Hay una cuarta procedencia, **simulado**: cuando `KILLALAB_NASA_BASE` o
`KILLALAB_JPL_BASE` apuntan a la fake API. La UI está obligada a decirlo; no es
un modo silencioso.

> Pendiente conocido: los respaldos de `adaptadores/src/nasa/respaldos/` son
> inventados. Antes de la demo hay que sustituirlos por respuestas reales
> guardadas de DONKI y CAD. Un `curl` a la ruta y pegar el JSON basta.

## Desarrollar sin llave y sin internet

```bash
pnpm dev     # fake-api en :4000, web en :3000
```

`apps/fake-api` imita las rutas con la **forma exacta** de cada fuente (strings
incluidos), sembrada por día para que los datos sean estables dentro de una
jornada. Provoca fallos a mano para probar la degradación:

```bash
curl "localhost:4000/DONKI/FLR?fallo=vacio"     # array vacío
curl "localhost:4000/cad.api?fallo=vacio"       # count 0
curl "localhost:4000/salud"
```

Que dev y producción recorran el **mismo código de parseo** es el objetivo: un
fallo de forma aparece en dev, no delante del jurado.

## Añadir una fuente nueva

Seis pasos, siempre en este orden. Si uno se salta, el hexágono se rompe:

1. **Modelo** — `packages/dominio/src/modelo/`: el tipo del dato, sin campos que
   la fuente no dé.
2. **Puerto** — `packages/dominio/src/puertos/fuentes-cientificas.ts`: la
   interfaz que el dominio necesita, redactada sin mencionar HTTP.
3. **Adaptador** — `packages/adaptadores/src/nasa/`: pedir y traducir. Lanza
   `ErrorFuente` si falla; no decide nada.
4. **Caso de uso** — `packages/dominio/src/casos-uso/`: la política, incluida la
   degradación.
5. **Composición** — `packages/composicion/src/index.ts`: enchufar. Es el único
   sitio del repo que lee `process.env`.
6. **Fake API + respaldo** — una ruta en `apps/fake-api` y un JSON en
   `respaldos/`, para que la fuente nueva también sobreviva sin red.

`apps/web` no se entera de nada de esto: importa `@killalab/composicion` y
`@killalab/dominio`, nunca `@killalab/adaptadores`.
