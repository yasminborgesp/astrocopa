-- ============================================================
-- ASTROCOPA — Storage Policies
-- Execute APÓS criar o bucket "astrocopa-media" manualmente
-- no painel: Storage > New Bucket > astrocopa-media (Public)
-- ============================================================

-- ─── Política: leitura pública ────────────────────────────────
-- Qualquer um pode VER as imagens (necessário para a TV)
create policy "storage_select_public"
  on storage.objects
  for select
  using (bucket_id = 'astrocopa-media');

-- ─── Política: upload apenas autenticados ─────────────────────
create policy "storage_insert_auth"
  on storage.objects
  for insert
  with check (
    bucket_id = 'astrocopa-media'
    and auth.role() = 'authenticated'
  );

-- ─── Política: update apenas autenticados ─────────────────────
create policy "storage_update_auth"
  on storage.objects
  for update
  using (
    bucket_id = 'astrocopa-media'
    and auth.role() = 'authenticated'
  );

-- ─── Política: delete apenas autenticados ─────────────────────
create policy "storage_delete_auth"
  on storage.objects
  for delete
  using (
    bucket_id = 'astrocopa-media'
    and auth.role() = 'authenticated'
  );
