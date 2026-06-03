"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getActiveCampaign } from "@/services/campaigns";
import type { Campaign } from "@/types";

export function useCampaign() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCampaign = useCallback(async () => {
    const data = await getActiveCampaign();
    setCampaign(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCampaign();

    // Realtime: escuta mudanças na tabela campaigns
    const supabase = createClient();
    const channel = supabase
      .channel("campaigns-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "campaigns" },
        () => {
          fetchCampaign();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCampaign]);

  return { campaign, loading, refetch: fetchCampaign };
}
