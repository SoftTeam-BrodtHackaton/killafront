# Arquitectura — KillaLab

Detalle de frontend en [arquitectura-frontend.md](./arquitectura-frontend.md).

## Módulos y comunicación

```mermaid
flowchart TB
  subgraph CL["Cliente — navegador / proyector de aula"]
    LP["Landing publica<br/>hero con dato en vivo"]
    MI["Misiones<br/>niveles 0-3"]
    FM["Formatos<br/>tarjetas · mapa · notas"]
    DIR["Directorio de<br/>grupos estudiantiles"]
  end

  subgraph BFF["apps/web — Route Handlers"]
    RE["/api/eventos<br/>normaliza y cachea"]
    RP["/api/progreso<br/>autenticado"]
  end

  subgraph PK["packages/"]
    AP["api<br/>fetchers + degradacion"]
    CT["content<br/>Nivel 0/1 offline"]
    DBP["db<br/>clientes Supabase"]
    TK["tokens"]
  end

  subgraph SB["Supabase"]
    PG[("Postgres + RLS")]
    AU["Auth"]
  end

  subgraph EXT["Fuentes externas"]
    DONKI["NASA DONKI"]
    NEO["NASA NeoWs"]
    CAD["JPL CAD"]
  end

  LP --> RE
  MI --> CT
  MI --> RP
  FM --> RP
  DIR --> DBP

  RE --> AP
  AP --> DONKI & NEO & CAD
  AP -->|"fixtures de respaldo"| FX["fixtures/*.json"]
  RE -->|"cachea"| PG
  RP --> DBP --> PG
  RP --> AU
  LP --> TK
```

## Flujo crítico: el dato en vivo del héroe

Es la promesa del producto, así que su ruta de fallo está definida antes que la feliz.

```mermaid
sequenceDiagram
  participant U as Visitante
  participant N as Next.js (SSR)
  participant C as Cache
  participant D as NASA DONKI

  U->>N: GET /
  N->>C: ultima llamarada (TTL 15 min)
  alt cache fresco
    C-->>N: dato · procedencia "vivo"
  else cache vencido
    N->>D: GET /DONKI/FLR
    alt DONKI responde
      D-->>N: evento real
      N->>C: guarda
    else DONKI falla o agota cuota
      C-->>N: ultimo conocido · procedencia "cache"
      Note over N: si no hay nada en cache,<br/>usa fixtures · procedencia "respaldo"
    end
  end
  N-->>U: HTML con cifra en mono + "fuente: NASA DONKI" + estado fechado
```

El módulo nunca se oculta ni muestra un placeholder vacío: o hay dato fresco, o hay dato
viejo fechado. Los niveles 0 y 1 no tocan este flujo en absoluto.

## Esquema de base de datos

SQL ejecutable en [`supabase/migraciones/0001_esquema_inicial.sql`](../supabase/migraciones/0001_esquema_inicial.sql).

```mermaid
erDiagram
  USUARIO ||--o{ PROGRESO : registra
  USUARIO ||--o{ NOTA : escribe
  USUARIO }o--o{ TRIPULACION : integra
  TRIPULACION }o--|| ESTACION : pertenece
  TEMA ||--o{ PROGRESO : evalua
  EVENTO_CACHE }o--|| FUENTE : proviene

  USUARIO { uuid id text rol timestamptz creado }
  ESTACION { uuid id text colegio text region }
  TRIPULACION { uuid id text nombre uuid estacion_id }
  TEMA { text slug int nivel text titulo bool offline }
  PROGRESO { uuid id uuid usuario_id text tema_slug text paso_id bool acierto int intentos }
  NOTA { uuid id uuid usuario_id text texto real x real y }
  EVENTO_CACHE { uuid id text clave text fuente jsonb payload timestamptz capturado }
  GRUPO_ESTUDIANTIL { uuid id text nombre text institucion text area text contacto bool verificado }
  FUENTE { text codigo text nombre text url }
```

Los temas viven como JSON versionado en `packages/content`, no en Postgres: así el
Nivel 0 se sirve estático y funciona sin conexión. Postgres solo guarda lo que es del
usuario (progreso, notas) y lo compartido (directorio, caché).

## Despliegue

```mermaid
flowchart LR
  GH["GitHub<br/>develop → main"] --> VC["Vercel<br/>preview por PR"]
  VC --> EDGE["SSR + ISR"]
  EDGE --> SBX["Supabase"]
  EDGE --> NASA["APIs NASA / JPL"]
  FX["packages/api/src/fixtures<br/>respaldo de demo"] --> VC
```
