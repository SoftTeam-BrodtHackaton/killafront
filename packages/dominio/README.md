# @killalab/dominio

El hexágono. Aquí viven las reglas de KillaLab y nada más.

- `modelo/` — qué es una llamarada, un asteroide, un tema, un dato con fuente.
- `puertos/` — las interfaces que el dominio necesita del mundo (NASA, contenido,
  backend, caché, reloj). El dominio las declara; nadie aquí las implementa.
- `casos-uso/` — la política. Cada caso de uso recibe sus puertos por parámetro y
  devuelve una función. No importa `fetch`, ni `process.env`, ni React, ni Next.

**Regla dura: este paquete no tiene dependencias.** Ni de npm ni de otro paquete del
monorepo. Si algo de aquí necesita salir al mundo, es un puerto nuevo, no un import.

Las implementaciones están en `@killalab/adaptadores` y se enchufan en
`@killalab/composicion`.
