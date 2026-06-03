import { createClient } from "@/lib/supabase/client";
import type { Campaign } from "@/types";

// ─── Buscar campanha ativa ────────────────────────────────────────────────────

export async function getActiveCampaign(): Promise<Campaign | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Erro ao buscar campanha:", error);
    return null;
  }
  return data;
}

// ─── Buscar todas as campanhas ────────────────────────────────────────────────

export async function getAllCampaigns(): Promise<Campaign[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar campanhas:", error);
    return [];
  }
  return data ?? [];
}

// ─── Atualizar campanha ───────────────────────────────────────────────────────

export async function updateCampaign(
  id: string,
  updates: Partial<Pick<Campaign, "title" | "event_date" | "is_active" | "slide_interval_seconds" | "show_carousel" | "countdown_label" | "left_content_type" | "text_size" | "side_text_title" | "side_text_body">>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("campaigns")
    .update(updates)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
