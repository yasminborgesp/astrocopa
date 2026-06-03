// ─── Database Types ───────────────────────────────────────────────────────────

export type LeftContentType = "countdown" | "text" | "none"; // o que aparece no lado esquerdo
export type TextSize = "sm" | "md" | "lg";

export interface Campaign {
  id: string;
  title: string;
  event_date: string;
  is_active: boolean;
  slide_interval_seconds: number;
  show_carousel: boolean;             // lado direito: mostra carrossel ou não
  countdown_label: string;            // texto acima do número (ex: "FALTAM")
  left_content_type: LeftContentType; // lado esquerdo: countdown ou texto
  text_size: TextSize;                // tamanho do texto quando left = "text"
  side_text_title: string | null;     // título do bloco de texto
  side_text_body: string | null;      // corpo do bloco de texto
  // legado (mantido para não quebrar)
  show_countdown: boolean;
  side_content_type: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  campaign_id: string;
  image_url: string;
  storage_path: string;
  display_order: number;
  active: boolean;
  frame_template: FrameTemplate;
  object_position: string;   // ex: "center center", "40% 25%"
  created_at: string;
}

export type FrameTemplate = "none" | "astrocopa" | "campanha" | "destaque" | "clean";

// ─── Supabase Database type (para tipagem do cliente) ─────────────────────────

export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: Campaign;
        Insert: Omit<Campaign, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Campaign, "id" | "created_at" | "updated_at">>;
      };
      media: {
        Row: Media;
        Insert: Omit<Media, "id" | "created_at">;
        Update: Partial<Omit<Media, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}
