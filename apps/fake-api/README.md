# apps/fake-api

Servidor falso que imita **NASA DONKI**, **NeoWs** y **JPL CAD**. Cero dependencias.

Existe para que el equipo desarrolle sin llave de la NASA, sin gastar cuota y sin
internet — y sobre todo para poder **provocar fallos a voluntad** y comprobar que la
landing degrada bien en vez de romperse.

```bash
pnpm --filter @killalab/fake-api dev      # http://localhost:4000
```

Apunta el cliente real hacia aquí en `.env.local`:

```
KILLALAB_NASA_BASE=http://localhost:4000
KILLALAB_JPL_BASE=http://localhost:4000
```

`packages/api` no cambia: se prueba el mismo código de parseo que corre en producción.

## Rutas

| Ruta | Imita |
|---|---|
| `GET /DONKI/FLR` | llamaradas solares, 6 eventos ordenables por fecha |
| `GET /DONKI/CME` | eyecciones de masa coronal (vacío por ahora) |
| `GET /neo/rest/v1/feed?start_date=` | objetos cercanos del día |
| `GET /cad.api?limit=` | aproximaciones de asteroides |
| `GET /salud` | sonda de vida |

## Provocar fallos

```bash
curl "http://localhost:4000/DONKI/FLR?fallo=503"    # error de servidor
curl "http://localhost:4000/DONKI/FLR?fallo=429"    # cuota agotada
curl "http://localhost:4000/DONKI/FLR?fallo=vacio"  # 200 con cero eventos
curl "http://localhost:4000/DONKI/FLR?lento=8000"   # supera el timeout de 6 s
```

En los cuatro casos la landing debe seguir mostrando el recuadro con el último dato
conocido y su fecha. Si alguna vez se oculta o muestra un error, es un bug.

## Semilla

Los datos se generan con una semilla derivada de la fecha: son **estables durante todo
el día** (una demo se puede repetir) y **cambian mañana** (no se siente estático).
Todo evento simulado lleva `note` diciendo que no es real.
