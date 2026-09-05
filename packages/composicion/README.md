# @killalab/composicion

La raíz de composición del hexágono. El único archivo del repo que lee
`process.env` para decidir qué adaptador se enchufa a cada puerto.

```
apps/web  ──►  @killalab/composicion  ──►  @killalab/dominio (puertos)
                        │
                        └────────────►  @killalab/adaptadores (implementaciones)
```

Una pantalla que importe `@killalab/adaptadores` rompe el diseño: la flecha va en
un solo sentido.

## Qué se enchufa según el entorno

| Variable | Sin ella | Con ella |
|---|---|---|
| `KILLALAB_NASA_BASE` / `KILLALAB_JPL_BASE` | NASA y JPL reales | `apps/fake-api`, y todo dato sale etiquetado `simulado` |
| `KILLALAB_BACKEND_URL` | progreso en memoria y directorio vacío, ambos declarados `disponible: false` | backend propio de KillaLab por HTTP |
