# apps/native — hoja de ruta, no MVP

App nativa iOS/Android con **Expo SDK 54 + Expo Router**. No entra en el hackathon:
la web mobile-first instalable como PWA ya cubre el requisito de "web y móvil".

Cuando se cree, no se reescribe el núcleo. Se consume del monorepo:

| Package | Se reutiliza tal cual | Ajuste necesario |
|---|---|---|
| `@killalab/tokens` | sí — `colores`, `radios` en TS | usar el export TS, no el CSS |
| `@killalab/api` | sí — fetchers y política de caché | ninguno, es fetch puro |
| `@killalab/content` | sí — JSON de Nivel 0/1 y validación zod | ninguno |
| `@killalab/db` | parcial | adaptador de sesión propio (SecureStore en vez de cookies) |
| `apps/web/componentes` | **no** | la UI se reescribe nativa; React Native Web rinde mal con este sistema tipográfico |

Arranque previsto:

```bash
pnpm create expo-app apps/native --template
# añadir a package.json: "@killalab/tokens": "workspace:*", etc.
```
