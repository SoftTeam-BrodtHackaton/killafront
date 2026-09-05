# Formatos de estudio y podcast

Cómo un tema de `packages/content` se convierte en varias formas de estudiar lo
mismo: misión, tarjetas, mapa, ficha, quiz, explicación por niveles y podcast.

## Las dos reglas que mandan aquí

**1. El modelo reformatea, nunca inventa.** Todo lo que se genera sale de un
`Tema` que ya existe en `packages/content`. El modelo reescribe, resume, cambia
de registro o pasa a diálogo — no aporta un dato nuevo. Un hecho que no esté en
el JSON de origen no puede aparecer en el derivado. Es la Regla 3 del proyecto
aplicada a la IA: si una cifra no tiene fuente, no se muestra.

**2. Se genera antes, no durante.** El pipeline corre en la máquina de
desarrollo, un humano revisa la salida y el resultado se commitea como JSON y
audio versionados. La web **nunca** llama a un modelo en runtime. Esto:

- mantiene la promesa de los Niveles 0 y 1 sin internet;
- quita el riesgo de que la demo dependa de que Ollama esté levantado;
- hace el resultado reproducible y revisable en un diff;
- cuesta cero.

Consecuencia arquitectónica: el generador **no entra en el hexágono**. Es una
herramienta de taller que lee `@killalab/content` y escribe JSON. Para la web,
un derivado es contenido más, servido por el mismo `catalogoJson` de siempre.

## Qué necesita modelo y qué no

La mitad de los formatos son una función pura sobre el JSON. Usar un modelo ahí
sería caro, lento y no determinista, a cambio de nada.

| Formato | Cómo sale | Estado |
|---|---|---|
| Misión (pasos) | del campo `pasos` | ya existe |
| Mazo de tarjetas | `conceptos` → anverso/reverso | ya existe (`generarMazo`) |
| Mapa mental | `conectaCon` → aristas | ya existe (`construirMapaMental`) |
| Ficha de repaso (1 página) | `resumen` + `conceptos` | falta, **sin modelo** |
| Línea de tiempo / secuencia | orden de `conceptos` | falta, **sin modelo** |
| Quiz de repaso ampliado | modelo, a partir de `conceptos` | falta |
| Explicación en tres registros | modelo | falta |
| Guion de podcast | modelo | falta |
| Clase modelo para docentes | modelo | falta |
| Audio del podcast | TTS sobre el guion | falta |

Empezar por las dos filas "sin modelo": son media tarde de trabajo y no dependen
de nada externo.

## Los modelos locales

Ollama instalado con dos modelos, y cada uno tiene su trabajo:

| Modelo | Para qué | Por qué |
|---|---|---|
| `qwen2.5:7b` | quiz, guiones, cualquier salida en JSON estricto | sigue instrucciones y respeta esquemas mucho mejor |
| `gemma3:4b` | reescrituras cortas, títulos, variantes, resúmenes | el triple de rápido; para texto suelto alcanza |

Son modelos pequeños. Eso obliga a tres disciplinas, no negociables:

1. **Un tema por llamada.** Nunca "procesa los seis". La ventana se llena y la
   calidad cae en picado.
2. **`temperature` baja** (0.2–0.4) y el tema completo pegado en el prompt. El
   modelo no recuerda nada del proyecto: todo lo que necesita va en la llamada.
3. **Validar la salida con zod** antes de escribir el archivo. `zod` ya está en
   el repo. Si el JSON no valida, se reintenta una vez y si falla se descarta —
   no se "arregla a mano" en silencio.

```bash
ollama serve                     # http://localhost:11434
```

```
POST http://localhost:11434/api/generate
{ "model": "qwen2.5:7b", "prompt": "...", "format": "json", "stream": false,
  "options": { "temperature": 0.3 } }
```

`format: "json"` obliga al modelo a devolver JSON parseable. Es la diferencia
entre un pipeline que funciona y uno que pelea con markdown mal cerrado.

## El podcast

El formato que más pesa y el que más valor da: un tema escuchado mientras se va
al colegio.

### Guion

Dos voces, 3 a 5 minutos, unas 600 palabras. La estructura fija evita que el
modelo divague:

1. **Gancho** (15 s) — una pregunta que el oyente ya se hizo alguna vez.
2. **Desarrollo** — un bloque por concepto, en el orden de `conceptos`.
3. **Comprobación** — una pregunta del campo `pasos`, con su respuesta.
4. **Cierre** — qué mirar en el cielo esta semana, o qué misión abrir.

El guion se guarda como JSON, no como texto, para poder sintetizar cada turno
con su voz:

```json
{
  "slug": "dia-y-noche",
  "duracionEstimadaSeg": 214,
  "turnos": [
    { "voz": "ana", "texto": "¿Por qué amanece?" },
    { "voz": "beto", "texto": "Porque la Tierra gira, no porque el Sol se mueva." }
  ],
  "generadoPor": "qwen2.5:7b",
  "revisadoPor": null,
  "revisadoEl": null
}
```

### Voz

La pregunta abierta del vault. Cuatro opciones, ordenadas por lo que conviene
hoy:

| Opción | Coste | Calidad en español | Riesgo |
|---|---|---|---|
| **Piper** (local) | 0 | buena, algo plana | ninguno: corre offline |
| Edge TTS | 0 | muy buena, neuronal | API no oficial, puede cortarse |
| ElevenLabs | de pago | excelente | llave, cuota, dependencia |
| OpenAI / Google TTS | de pago | muy buena | llave, cuota |

**Recomendación: Piper para el MVP.** Es coherente con todo lo demás del
proyecto — sin llave, sin coste, reproducible y funciona sin internet. Dos voces
españolas distintas bastan para que el diálogo se entienda. Si antes de la demo
sobra tiempo, se regenera con una voz de pago sin tocar el guion: son dos capas
separadas a propósito.

El audio final se guarda en `apps/web/public/podcast/<slug>.mp3` y se sirve como
archivo estático. Seis temas de 4 minutos son unos 12 MB — cabe en el repo sin
drama.

## Clase modelo y pieza de promoción

Dos cosas distintas que conviene no mezclar:

- **Clase modelo** — para el docente. 45 minutos: qué proyectar, qué preguntar,
  qué misión abrir, qué se lleva el alumno. Sale del mismo tema, con la sección
  de docentes como destino. Es material de uso.
- **Pieza de promoción** — para el jurado y para difundir. 90 segundos: qué
  problema resuelve KillaLab, qué lo hace distinto (el dato en vivo de la NASA
  con su fuente, y que funciona sin internet), y una llamada a la acción. Es
  material de venta.

Las dos se generan igual que el podcast, pero la de promoción **no sale de un
tema**: sale del posicionamiento del producto, y por eso se escribe a mano y el
modelo solo ayuda a pulirla. Un pitch inventado por un modelo suena a pitch
inventado por un modelo.

## Estructura propuesta

```
herramientas/estudio/
  generar.ts          # CLI: lee un tema, escribe sus derivados
  ollama.ts           # cliente del modelo local, con reintento y validación
  esquemas.ts         # zod de cada formato derivado
  prompts/
    podcast.md
    quiz.md
    registros.md
    clase.md
  voz/
    sintetizar.ts     # guion JSON → mp3 con Piper

packages/content/derivados/<slug>/
  ficha.json          # sin modelo
  quiz.json
  registros.json
  podcast.json        # el guion
  clase.json
```

```bash
pnpm estudio:generar dia-y-noche            # un tema, todos los formatos
pnpm estudio:generar dia-y-noche --solo podcast
pnpm estudio:voz dia-y-noche                # guion → mp3
pnpm estudio:generar --todos --revisar      # imprime diffs para revisar
```

## Etiquetado honesto

Cada derivado lleva `generadoPor`, `revisadoPor` y `revisadoEl`. La web muestra
"guion escrito con ayuda de un modelo, revisado por una persona el 5 de
septiembre" con el mismo componente que muestra la fuente de una cifra.

Es la misma promesa de siempre aplicada a un caso nuevo: un dato dice de dónde
salió, y un texto escrito por una máquina también lo dice. Un derivado con
`revisadoPor: null` **no se publica**: se puede generar y leer en local, pero no
llega a producción.

## Orden de trabajo

1. Ficha de repaso y línea de tiempo. Sin modelo, sin riesgo, valor inmediato.
2. Cliente de Ollama con validación zod y el prompt del podcast, sobre un solo
   tema (`dia-y-noche`) para calibrar el tono.
3. Los seis guiones, revisados a mano uno por uno.
4. Piper y el primer mp3. Escucharlo entero antes de generar los demás.
5. Quiz y explicación en tres registros.
6. Clase modelo. La pieza de promoción, aparte y escrita a mano.

## Si algún día hace falta en runtime

El Nivel 3 podría querer "genera tu propio quiz sobre esto". Ese día:
`PuertoRedactor` en el dominio, adaptador Ollama para desarrollo y adaptador de
un proveedor con llave para producción, enchufados en `composicion`. La forma ya
está resuelta; hoy no hace falta y por eso no se construye.
