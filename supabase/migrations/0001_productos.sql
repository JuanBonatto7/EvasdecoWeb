-- Esquema para Supabase (correr en SQL Editor).
-- El panel admin usa login por email/contraseña (Auth). Solo usuarios autenticados escriben;
-- cualquiera puede leer los productos publicados.

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  nombre      text not null,
  categoria   text not null,
  talle       text,
  estado      text not null,
  precio      integer not null check (precio >= 0),
  descripcion text not null default '',
  fotos       text[] not null default '{}',
  status      text not null default 'disponible' check (status in ('disponible', 'reservado', 'vendido')),
  destacado   boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "lectura publica" on public.products;
create policy "lectura publica" on public.products
  for select using (true);

drop policy if exists "admin escribe" on public.products;
create policy "admin escribe" on public.products
  for all to authenticated using (true) with check (true);

-- Bucket de fotos (público para lectura).
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

drop policy if exists "fotos publicas" on storage.objects;
create policy "fotos publicas" on storage.objects
  for select using (bucket_id = 'product-photos');

drop policy if exists "admin sube fotos" on storage.objects;
create policy "admin sube fotos" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-photos');

drop policy if exists "admin borra fotos" on storage.objects;
create policy "admin borra fotos" on storage.objects
  for delete to authenticated using (bucket_id = 'product-photos');
