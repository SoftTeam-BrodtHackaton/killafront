# @killalab/adaptadores

Todo lo que toca el mundo exterior. Cada archivo implementa un puerto de
`@killalab/dominio` y no sabe nada de los demás.

| Carpeta | Puerto que implementa | Qué hay detrás |
|---|---|---|
| `nasa/` | `PuertoClimaEspacial`, `PuertoAsteroides`, `PuertoRespaldo` | DONKI, NeoWs, JPL CAD y las respuestas guardadas en `nasa/respaldos/` |
| `contenido/` | `PuertoCatalogo` | los JSON de `@killalab/content`, validados con zod al importar |
| `persistencia/` | `PuertoAlmacenTemporal` | caché en memoria del proceso |
| `plataforma/` | `PuertoProgreso`, `PuertoDirectorio` | el backend propio de KillaLab por HTTP, o un doble local mientras no exista |
| `sistema/` | `PuertoReloj` | `new Date()` |

Los adaptadores **lanzan** cuando la fuente falla. Qué hacer con esa falla lo
decide el caso de uso, no este paquete.

Ninguna app importa de aquí: se enchufan en `@killalab/composicion`.
