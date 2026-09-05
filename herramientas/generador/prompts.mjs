/**
 * Los prompts.
 *
 * Todos comparten la misma instrucción de sistema, y no es decorativa: es la
 * Regla 3 del proyecto traducida a algo que un modelo pequeño pueda seguir. Se
 * repite en cada llamada porque el modelo no recuerda nada entre una y otra.
 */

export const SISTEMA = `Eres un editor de contenido educativo peruano para estudiantes de colegio.

REGLA ABSOLUTA: reformateas, nunca inventas. Todo lo que escribas tiene que salir
del JSON que te dan. No agregues datos, cifras, fechas, nombres propios ni hechos
que no estén ahí. Si algo no está en el JSON, no existe.

Escribe en español de Perú, claro y directo, sin adjetivos de relleno y sin
exclamaciones. Trata al estudiante como alguien inteligente que todavía no sabe
del tema. Responde SOLO con JSON válido, sin markdown y sin explicaciones.`;

const contexto = (tema) => `TEMA DE ORIGEN (esto es todo lo que sabes):
${JSON.stringify(tema, null, 2)}`;

export const promptQuiz = (tema) => `${contexto(tema)}

Escribe un banco de ${Math.min(Math.max(tema.conceptos.length * 3, 8), 12)} preguntas de opción múltiple sobre este tema.

Es un banco, no un examen: la aplicación elegirá unas pocas al azar cada vez que
alguien repase, así que las preguntas tienen que ser DISTINTAS entre sí. Nada de
reformular la misma idea con otras palabras.

Reglas:
- Cada pregunta sale de UN concepto del tema. Pon su id en el campo "concepto".
- Exactamente 4 opciones por pregunta. "correcta" es el índice de la buena, de 0 a 3.
- Los distractores tienen que ser plausibles pero claramente falsos según el tema.
  Nada de "todas las anteriores" ni "ninguna".
- "porque" explica en una o dos frases por qué la correcta es correcta, usando solo
  lo que dice el tema.
- Los ids de pregunta van "q1", "q2", ...

Devuelve exactamente:
{"slug":"${tema.slug}","preguntas":[{"id":"q1","enunciado":"...","opciones":["a","b","c","d"],"correcta":0,"porque":"...","concepto":"..."}]}`;

export const promptGuion = (tema) => `${contexto(tema)}

Escribe el guion de un podcast de 3 a 4 minutos (unas 550 palabras en total) sobre
este tema, para escuchar camino al colegio.

Dos voces que conversan: "ana" pregunta y empuja, "beto" explica. Se turnan.

Estructura obligatoria:
1. Gancho: ana hace una pregunta que cualquiera se ha hecho alguna vez.
2. Desarrollo: un bloque por cada concepto del tema, en el mismo orden.
3. Comprobación: ana lanza una de las preguntas del campo "pasos" y beto la responde.
4. Cierre: beto dice qué mirar en el cielo o qué hacer después.

Reglas:
- Lenguaje hablado, frases cortas. Es para el oído, no para leer.
- Nada de saludos de locutor, ni "bienvenidos a", ni nombres de programa.
- Cada turno es un texto corto, de una a cuatro frases.
- Entre 10 y 20 turnos.

Devuelve exactamente:
{"slug":"${tema.slug}","turnos":[{"voz":"ana","texto":"..."},{"voz":"beto","texto":"..."}]}`;

export const promptRegistros = (tema) => `${contexto(tema)}

Explica este mismo tema en tres registros distintos. El contenido es el mismo; lo
que cambia es a quién le hablas.

- "comoAUnNino": a alguien de 9 años. Frases cortas, comparaciones con cosas de su
  vida diaria. Unas 60 palabras.
- "comoAUnCompanero": a un compañero de tu edad que se perdió la clase. Directo,
  sin condescendencia. Unas 90 palabras.
- "comoEnUnLibro": como lo diría un libro de texto: preciso y ordenado, sin
  adornos. Unas 90 palabras.

Devuelve exactamente:
{"slug":"${tema.slug}","comoAUnNino":"...","comoAUnCompanero":"...","comoEnUnLibro":"..."}`;

export const promptFlashcards = (tema) => `${contexto(tema)}

Escribe un banco de ${Math.min(Math.max(tema.conceptos.length * 3, 8), 12)} tarjetas de memorización sobre este tema.

Es un banco: la aplicación elegirá unas pocas al azar en cada repaso, así que las
preguntas tienen que atacar ángulos DISTINTOS del tema, no la misma idea repetida.

Cada tarjeta es una pregunta ABIERTA que el estudiante responde escribiendo con sus
propias palabras. No son de opción múltiple y no se responden con sí o no.

Para cada tarjeta:
- "pregunta": abierta, concreta, de una sola idea. Empieza por qué, por qué, cómo o
  cuánto.
- "respuesta": la respuesta modelo, dos o tres frases, solo con lo que dice el tema.
- "claves": entre 2 y 5 ideas SUELTAS que cualquier respuesta correcta tiene que
  mencionar. Son palabras o expresiones cortas, no frases. Sirven para corregir
  automáticamente lo que escriba el estudiante, así que tienen que ser los términos
  que de verdad importan, no relleno.
- "concepto": el id del concepto del tema del que sale.

Ejemplo de buenas claves para "¿por qué hay día y noche?": ["la Tierra gira",
"sobre su eje", "24 horas"].

Los ids de tarjeta van "f1", "f2", ...

Devuelve exactamente:
{"slug":"${tema.slug}","tarjetas":[{"id":"f1","pregunta":"...","respuesta":"...","claves":["...","..."],"concepto":"..."}]}`;

export const promptNarracion = (tema) => `${contexto(tema)}

Explica este tema de corrido, como si se lo contaras en voz alta a alguien que va
camino al colegio con audífonos puestos.

Es UNA sola voz, no un diálogo. No hay presentador, no hay invitado, no hay
saludos ni despedidas de programa. Empiezas explicando y terminas cuando está
explicado.

Reglas:
- Entre 5 y 8 párrafos, unas 400 palabras en total.
- Frases cortas y habladas. Se va a oír, no a leer: nada de incisos largos entre
  comas ni de listas.
- Sigue el orden de los conceptos del tema, y explica cada uno antes de usarlo.
- Usa comparaciones con cosas de la vida diaria, pero solo si salen de lo que ya
  dice el tema. No inventes ejemplos con datos nuevos.
- Cierra recordando la idea principal en una frase.

"titulo" es cómo lo anunciarías en una frase corta.

Devuelve exactamente:
{"slug":"${tema.slug}","titulo":"...","parrafos":["...","..."]}`;
