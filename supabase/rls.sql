-- ============================================================
-- ASTROCOPA — Row Level Security (RLS) Policies
-- Execute APÓS o schema.sql
-- ============================================================

-- Habilitar RLS em todas as tabelas
alter table public.campaigns enable row level security;
alter table public.media      enable row level security;

-- ─── campaigns: leitura pública ──────────────────────────────
-- Qualquer um pode LER a campanha ativa (para a tela da TV)
create policy "campaigns_select_public"
  on public.campaigns
  for select
  using (true);

-- Apenas usuários autenticados podem INSERIR campanhas
create policy "campaigns_insert_auth"
  on public.campaigns
  for insert
  with check (auth.role() = 'authenticated');

-- Apenas usuários autenticados podem ATUALIZAR campanhas
create policy "campaigns_update_auth"
  on public.campaigns
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Apenas usuários autenticados podem DELETAR campanhas
create policy "campaigns_delete_auth"
  on public.campaigns
  for delete
  using (auth.role() = 'authenticated');

-- ─── media: leitura pública ───────────────────────────────────
-- Qualquer um pode LER mídias (para o carrossel da TV)
create policy "media_select_public"
  on public.media
  for select
  using (true);

-- Apenas usuários autenticados podem INSERIR mídias
create policy "media_insert_auth"
  on public.media
  for insert
  with check (auth.role() = 'authenticated');

-- Apenas usuários autenticados podem ATUALIZAR mídias
create policy "media_update_auth"
  on public.media
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Apenas usuários autenticados podem DELETAR mídias
create policy "media_delete_auth"
  on public.media
  for delete
  using (auth.role() = 'authenticated');

-- ─── Realtime: habilitar para as tabelas ─────────────────────
-- Execute no SQL Editor para ativar realtime
alter publication supabase_realtime add table public.campaigns;
alter publication supabase_realtime add table public.media;
