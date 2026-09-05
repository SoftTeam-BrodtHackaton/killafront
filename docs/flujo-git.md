# Flujo de trabajo con Git

## Ramas — GitFlow

| Rama | Para qué | Se mergea a |
|---|---|---|
| `main` | producción. Solo recibe releases y hotfixes. Cada merge lleva tag. | — |
| `develop` | integración. Es la rama por defecto del día a día. | `main` vía `release/*` |
| `feature/<ambito>-<descripcion>` | una funcionalidad | `develop` |
| `release/<version>` | estabilización previa a publicar | `main` y `develop` |
| `hotfix/<descripcion>` | arreglo urgente en producción | `main` y `develop` |

```bash
git switch develop
git switch -c feature/misiones-evaluacion-pasos
# ... trabajo ...
git switch develop && git merge --no-ff feature/misiones-evaluacion-pasos
```

## Mensajes — Conventional Commits

```
<tipo>(<ámbito>): <descripción en imperativo, minúscula, sin punto final>
```

Tipos en uso: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.

Ámbitos de este repo: `web`, `native`, `tokens`, `api`, `db`, `content`, `docs`, `repo`.

```
feat(web): añadir recuadro de dato en vivo desde DONKI
fix(api): degradar a fixture cuando DONKI agota la cuota
docs(repo): documentar arquitectura de frontend
chore(repo): configurar turborepo y workspaces de pnpm
```

Un cambio que rompe compatibilidad lleva `!` antes de los dos puntos y explica el
motivo en el cuerpo: `feat(api)!: cambiar la forma de Dato<T>`.
