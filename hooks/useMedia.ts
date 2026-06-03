"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCampaignMedia } from "@/services/media";
import type { Media } from "@/types";

export function useMedia(campaignId: string | null | undefined, onlyActive = false) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = useCallback(async () => {
    if (!campaignId) {
      setMedia([]);
      setLoading(false);
      return;
    }
    const data = await getCampaignMedia(campaignId, onlyActive);
    setMedia(data);
    setLoading(false);
  }, [campaignId, onlyActive]);

  useEffect(() => {
    fetchMedia();

    if (!campaignId) return;

    // Realtime: escuta mudanças na tabela media
    const supabase = createClient();
    const channel = supabase
      .channel(`media-realtime-${campaignId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "media", filter: `campaign_id=eq.${campaignId}` },
        () => {
          fetchMedia();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId, fetchMedia]);

  return { media, loading, refetch: fetchMedia };
}
