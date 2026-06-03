-- ============================================================
-- ASTROCOPA — Schema SQL completo
-- Execute no SQL Editor do Supabase (supabase.com/dashboard)
-- ============================================================

-- Extensão para UUID
create extension if not exists "uuid-ossp";

-- ─── Tabela: campaigns ──────────────────────────────────────
create table if not exists public.campaigns (
  id          uuid        primary key default uuid_generate_v4(),
  title       text        not null default 'AstroCopa 2026',
  event_date  timestamptz not null default now() + interval '30 days',
  is_active   boolean     not null default true,
  -- Configurações do carrossel
  slide_interval_seconds integer not null default 10,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Tabela: media ──────────────────────────────────────────
create table if not exists public.media (
  id            uuid        primary key default uuid_generate_v4(),
  campaign_id   uuid        not null references public.campaigns(id) on delete cascade,
  image_url     text        not null,
  storage_path  text        not null,  -- caminho no bucket para facilitar deleção
  display_order integer     not null default 0,
  active        boolean     not null default true,
  created_at    timestamptz not null default now()
);

-- ─── Trigger: updated_at automático ─────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger campaigns_updated_at
  before update on public.campaigns
  for each row execute function public.handle_updated_at();

-- ─── Indexes ─────────────────────────────────────────────────
create index if not exists media_campaign_id_idx    on public.media(campaign_id);
create index if not exists media_display_order_idx  on public.media(campaign_id, display_order);
create index if not exists media_active_idx         on public.media(campaign_id, active);

-- ─── Seed: campanha padrão ───────────────────────────────────
insert into public.campaigns (title, event_date, is_active)
values ('AstroCopa 2026', '2026-07-15 00:00:00+00', true)
on conflict do nothing;
