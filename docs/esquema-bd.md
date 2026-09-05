# Esquema de base de datos — KillaLab (Supabase / Postgres)

Borrador para el MVP. `auth.users` lo gestiona Supabase Auth; el resto vive en el
esquema `public`.

```mermaid
erDiagram
    usuarios ||--o{ progreso_tema : registra
    usuarios ||--o{ notas : escribe
    usuarios ||--o{ bitacora_posts : publica
    usuarios }o--o| colegios : pertenece
    usuarios }o--o{ tripulacion_miembros : integra
    tripulaciones ||--o{ tripulacion_miembros : tiene
    colegios ||--o{ tripulaciones : agrupa
    temas ||--o{ misiones : contiene
    temas ||--o{ progreso_tema : medido_en
    misiones ||--o{ progreso_mision : medido_en
    usuarios ||--o{ progreso_mision : avanza
    usuarios ||--o{ badges_otorgados : obtiene
    badges ||--o{ badges_otorgados : instancia
    grupos_directorio ||--o{ eventos_grupo : anuncia

    usuarios {
        uuid id PK
        text nombre
        text rol "estudiante | docente | admin"
        int  nivel_actual
        uuid colegio_id FK
        timestamptz creado_en
    }
    colegios {
        uuid id PK
        text nombre
        text region
        text tipo "publico | privado"
    }
    tripulaciones {
        uuid id PK
        text nombre
        uuid colegio_id FK
        int  puntos
    }
    tripulacion_miembros {
        uuid tripulacion_id FK
        uuid usuario_id FK
        text rol_equipo
    }
    temas {
        uuid id PK
        int  nivel "0 | 1 | 2 | 3"
        text titulo
        text planeta
        bool requiere_api
    }
    misiones {
        uuid id PK
        uuid tema_id FK
        text titulo
        jsonb contenido "pasos, preguntas, fuentes"
        text estado "borrador | publicada"
        text generada_por "ia | manual"
    }
    progreso_tema {
        uuid usuario_id FK
        uuid tema_id FK
        text estado "no_iniciado | en_curso | completado"
        timestamptz actualizado_en
    }
    progreso_mision {
        uuid usuario_id FK
        uuid mision_id FK
        int  puntaje
        jsonb respuestas
        timestamptz completado_en
    }
    notas {
        uuid id PK
        uuid usuario_id FK
        uuid tema_id FK
        text contenido
        int  pos_x
        int  pos_y
    }
    bitacora_posts {
        uuid id PK
        uuid usuario_id FK
        text titulo
        text cuerpo
        timestamptz creado_en
    }
    badges {
        uuid id PK
        text nombre
        text criterio
        text tipo "planeta | racha | olimpiada"
    }
    badges_otorgados {
        uuid badge_id FK
        uuid usuario_id FK
        text codigo_verificacion
        text credly_id
        timestamptz otorgado_en
    }
    grupos_directorio {
        uuid id PK
        text nombre
        text institucion
        text area "astronomia | software | cloud | robotica | otro"
        text contacto
        text sitio_web
    }
    eventos_grupo {
        uuid id PK
        uuid grupo_id FK
        text titulo
        date fecha
        text enlace
    }
```

## Notas de implementación

- **RLS activado** en todas las tablas. El estudiante solo lee/escribe sus
  propias filas de `progreso_*` y `notas`; `temas`, `misiones` (publicadas),
  `grupos_directorio` y `eventos_grupo` son de lectura pública.
- `misiones.contenido` y `progreso_mision.respuestas` en `jsonb`, validados con
  Zod en el BFF antes de escribir.
- `grupos_directorio` arranca con 8–12 filas reales cargadas a mano (seed).
- Migraciones versionadas en `packages/db/migrations`.
