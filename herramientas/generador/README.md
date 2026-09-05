# @killalab/generador

El taller de contenido derivado. **No entra en el hexágono**: lee JSON de
`packages/content` y escribe JSON en `packages/content/src/derivados/`. Ni el
dominio ni la web lo conocen.

## Las dos reglas

**1. El modelo reformatea, nunca inventa.** Todo sale de un `Tema` que ya existe.
El modelo reescribe, resume o pasa a diálogo; no aporta un hecho nuevo. Es la
Regla 3 del proyecto aplicada al texto: si una cifra sin fuente no se muestra, un
párrafo que no salga del contenido versionado tampoco.

**2. Se genera antes, no durante.** El pipeline corre en tu máquina, tú revisas la
salida y el JSON se commitea. **La web nunca llama a un modelo en tiempo de
ejecución.** Por eso los niveles 0 y 1 siguen abriendo sin internet y la demo no
depende de que Ollama esté levantado.

## Uso

```bash
ollama serve                       # http://localhost:11434

cd herramientas/generador
node cli.mjs derivar               # fichas y secuencias: sin modelo, instantáneo
node cli.mjs quiz [slug]           # opción múltiple
node cli.mjs flashcards [slug]     # tarjetas de respuesta escrita
node cli.mjs guion [slug]          # guion de podcast a dos voces
node cli.mjs registros [slug]      # la misma idea en tres registros
node cli.mjs todo [slug]           # todo lo anterior
node cli.mjs indice                # reescribe packages/content/src/derivados.ts
```

Sin `slug` procesa los seis temas. **Un tema por llamada, siempre**: son modelos
pequeños y la ventana se llena.

## Qué necesita modelo y qué no

| Formato | Cómo sale |
|---|---|
| Ficha de repaso | `map()` sobre `resumen` + `conceptos` |
| Secuencia de conceptos | orden topológico sobre `conectaCon` |
| Quiz de opción múltiple | modelo |
| Tarjetas de respuesta escrita | modelo (genera pregunta, respuesta y las **claves** de corrección) |
| Guion de podcast | modelo |
| Tres registros | modelo |

Las dos primeras son funciones puras. Usar un modelo ahí sería más caro, más lento
y no determinista a cambio de nada.

## Los modelos

| Trabajo | Preferido | Respaldo |
|---|---|---|
| JSON estricto (quiz, flashcards, guiones) | `qwen2.5:7b` | `gemma3:4b` |
| Reescrituras cortas (registros) | `gemma3:4b` | `qwen2.5:7b` |

Cada trabajo es una **lista**, no un nombre: un 7B no entra en memoria en cualquier
máquina, y cuando Ollama devuelve error de carga el pipeline baja al siguiente en
vez de dejar al equipo sin generar nada. El modelo que acabó escribiendo queda
sellado en el archivo, así que se distingue en el diff.

La ventana es de 4096 tokens (`OLLAMA_NUM_CTX`). Con 8192 el 7B se quedaba sin
memoria; un tema ocupa menos de 1500, así que sobra.

## Validación

Todo pasa por zod (`esquemas.mjs`) antes de escribirse. Dos intentos y se
descarta: si el modelo no respeta el esquema dos veces, el problema es el prompt y
hay que verlo, no taparlo.

`olfatearInventos()` marca construcciones con las que un modelo suele colar datos
nuevos ("según los estudios", "la NASA afirma"). Es un **aviso para la revisión
humana**, no un bloqueo: detectar un hecho inventado automáticamente exigiría saber
la verdad.

## Revisión

Cada archivo lleva su sello:

```json
{ "generadoPor": "qwen2.5:7b", "generadoEl": "...", "revisadoPor": null, "revisadoEl": null }
```

`revisadoPor` en `null` significa que **nadie lo ha leído todavía**. Se puede
publicar así, pero se sabe cuál es. Al revisarlo, pon tu nombre y la fecha.
