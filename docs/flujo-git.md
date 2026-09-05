# Flujo de git

## Una sola rama

`main`. Se trabaja y se commitea directo sobre ella.

Se abandonó GitFlow el 2026-09-05. Con un equipo pequeño y plazo de hackathon,
mantener `develop` más ramas `feature/*` significaba tres merges por cada cosa
terminada y ninguna de las ventajas que GitFlow existe para dar: no hay versiones
que sostener en paralelo ni releases que preparar con semanas de antelación.

Si el proyecto llega a tener usuarios reales en producción y haya que arreglar algo
sin arrastrar lo que esté a medias, esta decisión se revisa. Hasta entonces, una
rama.

## Mensajes

Conventional Commits en español.

```
feat: nueva funcionalidad
fix: corrección de un fallo
refactor: mismo comportamiento, otra forma
docs: documentación
chore: build, dependencias, configuración
test: pruebas
style: solo formato
```

Reglas del título:

- imperativo, menos de 72 caracteres, sin punto final,
- **sin scope entre paréntesis** y sin `/`,
- en palabras que entienda alguien que no programa: `fix: no permitir cobrar un
  ticket ya anulado` dice todo; `arreglar bug` no dice nada en seis meses.

El cuerpo va en **primera persona**, como lo escribiría quien lo hizo: "agregué",
"moví", "corregí". Solo se escribe cuerpo cuando hay un *porqué* que el diff no
puede mostrar: una regla de negocio, un compromiso, una restricción externa.

## Identidad

Los commits van con la identidad local configurada en git. **Sin trailers de
co-autoría y sin menciones a herramientas de IA.**

## El otro repo

`killalanding`, la portada pública, sigue exactamente estas mismas reglas.
