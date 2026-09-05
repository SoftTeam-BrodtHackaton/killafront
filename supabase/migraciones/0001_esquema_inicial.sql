-- Esquema inicial de KillaLab. Ejecutar con: supabase db push

create table if not exists estacion (
  id uuid primary key default gen_random_uuid(),
  colegio text not null,
  region text not null
);

create table if not exists tripulacion (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  estacion_id uuid references estacion(id) on delete set null
);

create table if not exists progreso (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  tema_slug text not null,
  paso_id text not null,
  acierto boolean not null,
  intentos int not null default 1,
  fecha timestamptz not null default now(),
  unique (usuario_id, tema_slug, paso_id)
);

create table if not exists nota (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  texto text not null,
  x real not null default 0,
  y real not null default 0,
  color text not null default 'ambar'
);

-- Caché durable de la NASA: si la API cae en plena demo, la landing sigue mostrando dato fechado.
create table if not exists evento_cache (
  id uuid primary key default gen_random_uuid(),
  clave text unique not null,
  fuente text not null check (fuente in ('DONKI', 'NeoWs', 'JPL CAD')),
  payload jsonb not null,
  capturado timestamptz not null default now()
);

-- Directorio de grupos estudiantiles reales. Solo entradas verificadas se muestran.
create table if not exists grupo_estudiantil (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  institucion text not null,
  area text not null,
  ciudad text not null,
  contacto text not null,
  verificado boolean not null default false
);

alter table progreso enable row level security;
alter table nota enable row level security;

create policy "progreso propio" on progreso
  for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);

create policy "notas propias" on nota
  for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);

-- El directorio y la caché son de lectura pública.
alter table grupo_estudiantil enable row level security;
create policy "directorio publico" on grupo_estudiantil for select using (verificado);

alter table evento_cache enable row level security;
create policy "cache publica" on evento_cache for select using (true);
