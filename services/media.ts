import { createClient } from "@/lib/supabase/client";
import type { Media, UploadResult, FrameTemplate } from "@/types";
import { isValidImageType, MAX_FILE_SIZE } from "@/lib/utils";

const BUCKET = "astrocopa-media";

// ─── Buscar mídias de uma campanha ────────────────────────────────────────────

export async function getCampaignMedia(
  campaignId: string,
  onlyActive = false
): Promise<Media[]> {
  const supabase = createClient();
  let query = supabase
    .from("media")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("display_order", { ascending: true });

  if (onlyActive) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Erro ao buscar mídias:", error);
    return [];
  }
  return data ?? [];
}

// ─── Upload de imagem ─────────────────────────────────────────────────────────

export async function uploadMedia(
  file: File,
  campaignId: string,
  frameTemplate: FrameTemplate = "none",
  objectPosition: string = "center center"
): Promise<UploadResult> {
  // Validações
  if (!isValidImageType(file.type)) {
    return { success: false, error: "Formato inválido. Use JPG, PNG ou WEBP." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "Arquivo muito grande. Máximo: 20MB." };
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const storagePath = `${campaignId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Upload para o bucket
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  // URL pública
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  const imageUrl = urlData.publicUrl;

  // Buscar maior display_order atual
  const { data: lastMedia } = await supabase
    .from("media")
    .select("display_order")
    .eq("campaign_id", campaignId)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (lastMedia?.display_order ?? -1) + 1;

  // Inserir registro no banco
  const { error: dbError } = await supabase.from("media").insert({
    campaign_id: campaignId,
    image_url: imageUrl,
    storage_path: storagePath,
    display_order: nextOrder,
    active: true,
    frame_template: frameTemplate,
    object_position: objectPosition,
  });

  if (dbError) {
    // Tentar remover o arquivo já enviado
    await supabase.storage.from(BUCKET).remove([storagePath]);
    return { success: false, error: dbError.message };
  }

  return { success: true, url: imageUrl, path: storagePath };
}

// ─── Deletar mídia ────────────────────────────────────────────────────────────

export async function deleteMedia(
  mediaId: string,
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // Remove do storage primeiro
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (storageError) {
    console.warn("Aviso ao remover do storage:", storageError.message);
    // Continua para remover do banco mesmo assim
  }

  // Remove do banco
  const { error: dbError } = await supabase
    .from("media")
    .delete()
    .eq("id", mediaId);

  if (dbError) {
    return { success: false, error: dbError.message };
  }
  return { success: true };
}

// ─── Atualizar status ativo ───────────────────────────────────────────────────

export async function toggleMediaActive(
  mediaId: string,
  active: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("media")
    .update({ active })
    .eq("id", mediaId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Reordenar mídias ─────────────────────────────────────────────────────────

export async function reorderMedia(
  items: { id: string; display_order: number }[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // Atualiza cada item individualmente (Supabase não tem batch update por id fácil)
  const updates = items.map(({ id, display_order }) =>
    supabase.from("media").update({ display_order }).eq("id", id)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return { success: false, error: failed.error.message };
  }
  return { success: true };
}
